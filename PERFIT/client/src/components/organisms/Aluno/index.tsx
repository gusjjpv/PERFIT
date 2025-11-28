import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { UserContext } from "../../../context/UserContext";
import Footer from "../Footer";
import { cleanLocalStorage, getAccessTokenInLocalStorage } from "../../../storage/LocalStorage";
import { FaChevronLeft } from "react-icons/fa";
import WorkoutCard from "../../molecules/WorkoutCard";
import WorkoutDetail from "../../molecules/WorkoutDetail";

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
  display:flex;
  align-items:center;
  flex-direction: column;
  gap:12px;
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
` 

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
  const [workoutRecord, setWorkoutRecord] = useState<any | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWorkouts = async () => {
      setLoading(true);
      setError(null);
      const accessToken = getAccessTokenInLocalStorage();

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
        setWorkoutRecord(Array.isArray(data) && data.length > 0 ? data[0] : null);
        console.log("Ficha: ", workoutRecord)
      } catch (err) {
        console.error(err);
        setError("Falha de conexão com o sistema.");
      } finally {
        setLoading(false);
      }
    };

    getWorkouts();
  }, []);

  //cleanLocalStorage()

  return (
    <>
      <PageWrap>
        <CardShell>
          <Header>
              <Title>Olá {user?.first_name ?? "Aluno(a)"}</Title>
            <ContainerNav onClick={() => setSelectedWorkout(null)}>
              {selectedWorkout && (
                <NavBack  aria-label="Voltar">
                  <FaChevronLeft />
                </NavBack>
              )}
              
              <Subtitle>Seus treinos</Subtitle>
              
            </ContainerNav>
          </Header>

          {loading && <p>Carregando treinos...</p>}
          {error && <p style={{ color: "crimson" }}>{error}</p>}

          {!loading && !error && !workoutRecord && <p>Você ainda não possui ficha atribuída.</p>}

          {!loading && workoutRecord && !selectedWorkout && (
            <>
              {workoutRecord.treinos?.length ? (
                workoutRecord.treinos.map((t: any) => (
                  <WorkoutCard
                    key={t.id}
                    treino={t}
                    onClick={() => setSelectedWorkout(t)}
                  />
                ))
              ) : (
                <p>Não há treinos nessa ficha.</p>
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
