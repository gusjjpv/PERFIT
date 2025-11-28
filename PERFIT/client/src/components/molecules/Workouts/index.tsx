import { useContext, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Button from '../../atoms/Button';
import { getAccessTokenInLocalStorage } from '../../../storage/LocalStorage';
import type { StudentData } from '../../../types';
import { error, success } from '../../../utils/toastfy';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { OverlayContext } from '../../../context/OverlayContext';

export interface ExercicioSchema {
  id: number;
  nome: string;
  series: number;
  repeticoes: number;
  descanso: string;
  observacao: string | null;
}

export interface TreinoDetalheSchema {
  id: number;
  ordem: number;
  titulo: string;
  descricao: string;
  dia_semana: "SEG" | "TER" | "QUA" | "QUI" | "SEX" | "SAB" | "DOM";
  exercicios: ExercicioSchema[];
}

export interface FichaTreinoSchema {
  id: number;
  aluno: number;
  nome: string;
  data_inicio: string;
  data_fim: string;
  ativa: boolean;
  observacoes: string;
  treinos: TreinoDetalheSchema[];
}

interface WorkoutProps {
  isModalWorkout: boolean;
  setIsModalWorkout: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreateWorkoutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWorkoutIdToEdit: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const slideUp = keyframes`
  from { transform: translate(-50%, 100vh); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translate(-50%, 0); opacity: 1; }
  to { transform: translate(-50%, 100vh); opacity: 0; }
`;

interface StyleProps {
  $isModal: boolean;
  $offAnimation: boolean;
}

const Container = styled.div<StyleProps>`
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0%);
  min-width: 95%;
  height: 85%;
  background-image: linear-gradient(292deg, #ffffff, #e1e1e1);
  border: 1px solid #0000003d;
  border-radius: 5px;
  padding: 1rem;
  z-index: 20;
  overflow-y: auto;

  h2 {
    margin-bottom: 1rem;
  }

  ${({ $isModal, $offAnimation }) =>
    $offAnimation
      ? css`animation: ${slideDown} 0.3s ease-in forwards;`
      : $isModal
      ? css`animation: ${slideUp} 0.3s ease-out forwards;`
      : ""}
`;

const ContainerCloseModalBtn = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const StudentList = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;
`;

const StudentItem = styled.div`
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const WorkoutListItem = styled.div`
  padding: 0.7rem 1rem;
  margin-top: 6px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
  }
`;

const WorkoutDetails = styled.div`
  margin-top: 0.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border-left: 3px solid #1e90ff;
`;


export default function Workouts({ 
    isModalWorkout, 
    setIsModalWorkout,
    setIsCreateWorkoutModalOpen, 
    setWorkoutIdToEdit 
}: WorkoutProps) {
  const [offAnimation, setOffAnimation] = useState(false);

  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [studentWorkouts, setStudentWorkouts] = useState<FichaTreinoSchema[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const [isWorkoutLoading, setIsWorkoutLoading] = useState(false);

  const [expandedWorkoutId, setExpandedWorkoutId] = useState<number | null>(null);

  const { setIsOverlay } = useContext(OverlayContext)

  const closeModal = () => {
    setOffAnimation(true)
    setIsOverlay(false)
  }

  useEffect(() => {
    if (!offAnimation) return;
    const timer = setTimeout(() => {
      setIsModalWorkout(false);
      setOffAnimation(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [offAnimation, setIsModalWorkout]);

  useEffect(() => {
    const loadStudents = async () => {
      const token = getAccessTokenInLocalStorage();
      if (!token) return error("Token não encontrado.");

      try {
        const res = await fetch("https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setStudents(await res.json());
        } else error("Erro ao carregar alunos.");
      } catch {
        error("Erro de conexão.");
      }

      setIsLoading(false);
    };

    loadStudents();
  }, []);

  const getStudentWorkouts = async (alunoId: number) => {
    const token = getAccessTokenInLocalStorage();
    if (!token) return;

    if (alunoId === selectedStudentId) {
      setSelectedStudentId(null);
      setStudentWorkouts([]);
      setExpandedWorkoutId(null);
      return;
    }

    setIsWorkoutLoading(true);
    setExpandedWorkoutId(null);

    try {
      const res = await fetch(
        `https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/fichasTreino/`,{ 
          headers: { 
            Authorization: `Bearer ${token}` 
          }}
      );

      if (!res.ok) return error("Erro ao carregar treinos.");

      let data: FichaTreinoSchema[] = await res.json();

      if (!Array.isArray(data)) data = [data];

      // filtrar fichas apenas do aluno clicado
      const filtered = data.filter((f) => f.aluno === alunoId);

      setStudentWorkouts(filtered);
      setSelectedStudentId(alunoId);
    } catch {
      error("Erro de conexão.");
    }

    setIsWorkoutLoading(false);
  };


  const deleteWorkout = async (id: number, nome: string) => {
    if (!confirm(`Excluir a ficha "${nome}"?`)) return;

    const token = getAccessTokenInLocalStorage();
    if (!token) return;

    try {
      const response = await fetch(
        `https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/fichasTreino/${id}/`, { 
          method: "DELETE", 
          headers: { Authorization: `Bearer ${token}` 
        }}
      )

      if (response.ok) {
        success("Treino excluído.");
        setStudentWorkouts((prev) => prev.filter((w) => w.id !== id))
      } else error("Erro ao excluir.")
    } catch {
      error("Erro interno.")
    }
  }

  const enableFullEdit = (w: FichaTreinoSchema) => {
    // 1. Define o ID da ficha a ser editada no estado do componente pai
    setWorkoutIdToEdit(w.id);
    
    // 2. Abre o modal CreateWorkout
    setIsCreateWorkoutModalOpen(true);

    // 3. Fecha o modal de visualização/lista
    closeModal(); 
  };

  return (
    <Container $isModal={isModalWorkout} $offAnimation={offAnimation}>
      <h2>Fichas</h2>

      <ContainerCloseModalBtn>
        <Button onClick={closeModal}>X</Button>
      </ContainerCloseModalBtn>

      {isLoading ? (
        <p>Carregando alunos...</p>
      ) : (
        <StudentList>
          {students.map((st) => {
            const alunoId = st.user.id;
            const nome = st.user.first_name || st.user.username;

            return (
              <div key={alunoId}>
                <StudentItem onClick={() => getStudentWorkouts(alunoId)}>
                  {nome}
                  <small>
                    {selectedStudentId === alunoId
                      ? `${studentWorkouts.length} fichas`
                      : "..."}
                  </small>
                </StudentItem>

                {selectedStudentId === alunoId && (
                  <div style={{ marginLeft: "1rem" }}>
                    {isWorkoutLoading ? (
                      <p>Carregando treinos...</p>
                    ) : studentWorkouts.length === 0 ? (
                      <p style={{ color: "red" }}>Nenhuma ficha encontrada.</p>
                    ) : (
                      studentWorkouts.map((w) => (
                        <div key={w.id}>
                          <WorkoutListItem
                            onClick={() =>
                              setExpandedWorkoutId((prev) =>
                                prev === w.id ? null : w.id
                              )
                            }
                          >
                            <b>{w.nome}</b> — Validade: {w.data_fim}
                          </WorkoutListItem>

                          
                          {expandedWorkoutId === w.id && (
                              <WorkoutDetails>
                                <p>
                                  <b>Status:</b> {w.ativa ? "Ativo" : "Inativo"}
                                </p>
                                <p>
                                  <b>Observações gerais:</b>{" "}
                                  {w.observacoes || "Nenhuma"}
                                </p>

                                <h3 style={{ marginTop: "1rem" }}>Treinos:</h3>

                                {w.treinos.map((t) => (
                                  <div
                                    key={t.id}
                                    style={{
                                      marginBottom: "1rem",
                                      padding: "0.4rem",
                                    }}
                                  >
                                    <h4>
                                      {t.titulo}{" "}
                                      <small>({t.dia_semana})</small>
                                    </h4>
                                    <p>{t.descricao}</p>
                                    <p>
                                      <b>Ordem:</b> {t.ordem}
                                    </p>

                                    <h5>Exercícios:</h5>
                                    {t.exercicios.length === 0 && (
                                      <p style={{ color: "gray" }}>
                                        Nenhum exercício.
                                      </p>
                                    )}

                                    {t.exercicios.map((ex) => (
                                      <div
                                        key={ex.id}
                                        style={{
                                          padding: "0.7rem",
                                          background: "#fff",
                                          border: "1px solid #ddd",
                                          borderRadius: "5px",
                                          marginBottom: "6px",
                                        }}
                                      >
                                        <p>
                                          <b>Nome:</b> {ex.nome}
                                        </p>
                                        <p>
                                          <b>Séries:</b> {ex.series}
                                        </p>
                                        <p>
                                          <b>Repetições:</b> {ex.repeticoes}
                                        </p>
                                        <p>
                                          <b>Descanso:</b> {ex.descanso}
                                        </p>
                                        <p>
                                          <b>Obs:</b>{" "}
                                          {ex.observacao || "Nenhuma"}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ))}

                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    marginTop: "1rem",
                                  }}
                                >
                                  
                                  <Button onClick={() => enableFullEdit(w)}>
                                    <FaEdit />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      deleteWorkout(w.id, w.nome)
                                    }
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </WorkoutDetails>
                            )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </StudentList>
      )}
    </Container>
  );
}