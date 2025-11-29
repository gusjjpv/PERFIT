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

const CardShell = styled.div<{ expanded?: boolean }>`
  width: 110%;
  max-width: 480px;
  background: rgba(255,255,255,0.98);
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(6, 20, 46, 0.35);
  padding: 28px 22px;
  margin-top: 36px;
  animation: ${appear} 300ms ease;
  min-height: ${({ expanded }) => (expanded ? "calc(100vh - 64px)" : "auto")};

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


export default function Aluno() {
  const { user } = useContext(UserContext);

  // todos os treinos de todas as fichas do aluno
  const [allTreinos, setAllTreinos] = useState<Workout[]>([]);
  const [treinosPorDia, setTreinosPorDia] = useState<Record<string, Workout[]>>({});
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

        const records: RecordWorkoutProps[] = Array.isArray(data)
          ? data.filter((f: RecordWorkoutProps) => Number(f.aluno) === Number(user.user_id))
          : [];

        // junta treinos de todas as fichas do aluno
        const treinos = records.flatMap((rec) => rec.treinos ?? []);
        setAllTreinos(treinos);
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
    // agrupa por dia
    const grupos: Record<string, Workout[]> = {};
    allTreinos.forEach((t) => {
      const dia = t.dia_semana ?? "—";
      if (!grupos[dia]) grupos[dia] = [];
      grupos[dia].push(t);
    });

    const order = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
    const ordered: Record<string, Workout[]> = {};
    order.forEach((d) => {
      if (grupos[d]) ordered[d] = grupos[d];
    });

    Object.keys(grupos)
      .filter((d) => !order.includes(d))
      .forEach((d) => (ordered[d] = grupos[d]));

    setTreinosPorDia(ordered);
  }, [allTreinos]);

  useEffect(() => {
    console.log("treinosPorDia:", treinosPorDia);
  }, [treinosPorDia]);

  return (
    <>
      <PageWrap>
        <CardShell expanded={!!selectedWorkout}>
          <Header>
            <Title>Olá {user?.first_name ?? "Aluno(a)"}</Title>

            <ContainerNav onClick={() => { setSelectedWorkout(null); }}>
              {selectedWorkout && (
                <NavBack aria-label="Voltar" onClick={() => { setSelectedWorkout(null); }}>
                  <FaChevronLeft />
                </NavBack>
              )}
              <Subtitle>Seus treinos da semana</Subtitle>
            </ContainerNav>
          </Header>

          {loading && <p>Carregando treinos...</p>}
          {error && <p style={{ color: "crimson" }}>{error}</p>}

          {!loading && !error && allTreinos.length === 0 && (
            <p>Você ainda não possui treinos cadastrados.</p>
          )}

          {selectedWorkout ? (
            <WorkoutDetail treino={selectedWorkout} />
          ) : (
            <div>
              {Object.keys(treinosPorDia).length === 0 ? null : Object.keys(treinosPorDia).map((dia) => (
                <div key={dia} style={{ marginTop: "16px" }}>
                  <h3 style={{ margin: "8px 0" }}>{dia}</h3>

                  {treinosPorDia[dia].map((treino) => (
                    <WorkoutCard
                      key={treino.id}
                      treino={treino}
                      onClick={() => setSelectedWorkout(treino)}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardShell>
      </PageWrap>

      <Footer />
    </>
  );
}
