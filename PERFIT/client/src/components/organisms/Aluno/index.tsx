import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { UserContext } from "../../../context/UserContext";
import Footer from "../Footer";
import { getAccessTokenInLocalStorage } from "../../../storage/LocalStorage";
import { FaChevronLeft } from "react-icons/fa";
import WorkoutCard from "../../molecules/WorkoutCard";
import WorkoutDetail from "../../molecules/WorkoutDetail";
import type { RecordWorkoutProps, Workout } from "../../../types";

const appear = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrap = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #111;
`;

const CardShell = styled.div`
  width: 95%;
  max-width: 480px;
  background: rgba(255,255,255,0.98);
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(6, 20, 46, 0.35);
  padding: 28px 22px;
  margin-top: 36px;
  animation: ${appear} 300ms ease;

  @media (min-width: 768px) {
    width: 70%;
    max-width: 620px;
    padding: 36px 28px;
    margin-top: 48px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  margin: 0;
  text-align: center;
  font-size: 1.35rem;
  color: #0b2540;
`;

const ContainerNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: .5rem;
`;

const Subtitle = styled.p`
  margin-bottom: 1rem;
  color: #334;
  font-weight: 600;
  font-size: 1.1rem;
`;

const NavBack = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #0b2540;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

/* Small helper to render a compact record card (you can style it later) */
const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
`;

const RecordItem = styled.div`
  padding: 10px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e6e6e6;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function Aluno() {
  const { user } = useContext(UserContext);

  const [workoutRecords, setWorkoutRecords] = useState<RecordWorkoutProps[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RecordWorkoutProps | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("USER no Aluno:", user);
  }, [user]);

  useEffect(() => {
    if (!user?.user_id) {
      return;
    }

    const getWorkouts = async () => {
      setLoading(true);
      setError(null);

      const accessToken = getAccessTokenInLocalStorage();
      if (!accessToken) {
        setError("Token de acesso ausente.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/fichasTreino/",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!res.ok) {
          setError("Erro ao carregar treinos.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        /* console.log("API fichas recebidas:", data); */

        const allRecords: RecordWorkoutProps[] = Array.isArray(data)
          ? data.filter((f: RecordWorkoutProps) => Number(f.aluno) === Number(user.user_id))
          : [];

        //console.log("Fichas filtradas para o usuário:", allRecords);
        setWorkoutRecords(allRecords);
      } catch (err) {
        console.error("Erro ao buscar fichas:", err);
        setError("Falha de conexão com o sistema.");
      } finally {
        setLoading(false);
      }
    };

    getWorkouts();
  }, [user?.user_id]);

  useEffect(() => {
    console.log("workoutRecords atualizados:", workoutRecords);
  }, [workoutRecords]);

  return (
    <>
      <PageWrap>
        <CardShell>
          <Header>
            <Title>Olá {user?.first_name ?? "Aluno(a)"}</Title>

            <ContainerNav onClick={() => { setSelectedWorkout(null); setSelectedRecord(null); }}>
              {(selectedRecord || selectedWorkout) && (
                <NavBack aria-label="Voltar" onClick={() => { setSelectedWorkout(null); setSelectedRecord(null); }}>
                  <FaChevronLeft />
                </NavBack>
              )}
              <Subtitle>Suas fichas de treino</Subtitle>
            </ContainerNav>
          </Header>

          {loading && <p>Carregando treinos...</p>}
          {error && <p style={{ color: "crimson" }}>{error}</p>}

          {!loading && !error && workoutRecords.length === 0 && (
            <p>Você ainda não possui ficha atribuída.</p>
          )}

          {!selectedRecord && !selectedWorkout && workoutRecords.length > 0 && (
            <RecordList>
              {workoutRecords.map((rec) => (
                <RecordItem key={rec.id} onClick={() => { setSelectedRecord(rec); setSelectedWorkout(null); }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{rec.nome}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      Validade: {rec.data_inicio} → {rec.data_fim} • {rec.treinos?.length ?? 0} treinos
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    {rec.ativa ? "Ativa" : "Inativa"}
                  </div>
                </RecordItem>
              ))}
            </RecordList>
          )}

          {selectedRecord && !selectedWorkout && (
            <>
              {selectedRecord.treinos && selectedRecord.treinos.length > 0 ? (
                selectedRecord.treinos.map((t) => (
                  <WorkoutCard key={t.id} treino={t} onClick={() => setSelectedWorkout(t)} />
                ))
              ) : (
                <p>Não há treinos nesta ficha.</p>
              )}
            </>
          )}

          {selectedWorkout && (
            <WorkoutDetail treino={selectedWorkout} />
          )}
        </CardShell>
      </PageWrap>

      <Footer />
    </>
  );
}
