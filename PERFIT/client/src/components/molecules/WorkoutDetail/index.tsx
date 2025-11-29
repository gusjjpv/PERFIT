import React from "react";
import styled from "styled-components";
import ExerciseTimer from "../ExerciseTimer"

const Wrap = styled.div`
  margin-top: 8px;
`;

const SectionTitle = styled.h4`
  margin: 8px 0 12px 0;
  color: #0b2540;
`;

export default function WorkoutDetail({ treino }: { treino: any }) {
  return (
    <Wrap>
      <SectionTitle>{treino.titulo ?? treino.nome}</SectionTitle>
      <p style={{ color: "#334", marginTop: 0 }}>{treino.descricao}</p>

      {treino.exercicios && treino.exercicios.length > 0 ? (
        treino.exercicios.map((ex: any) => (
          <ExerciseTimer key={ex.id ?? ex.ordem ?? Math.random()} ex={ex} />
        ))
      ) : (
        <p style={{ marginTop: 12 }}>Nenhum exercício cadastrado para este treino.</p>
      )}
    </Wrap>
  );
}
