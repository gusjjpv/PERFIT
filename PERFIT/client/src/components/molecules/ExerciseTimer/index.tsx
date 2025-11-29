import React from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  from { transform: scale(1); }
  50% { transform: scale(1.01); }
  to { transform: scale(1); }
`;

const Card = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 12px;
  margin-top: 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, #ffffff, #fbfdff);
  box-shadow: 0 6px 18px rgba(2,8,20,0.04);
  animation: ${pulse} 3000ms ease-in-out infinite;
`;

const Info = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 700;
  color: #0b2540;
  font-size: 1rem;
`;

const Small = styled.div`
  font-size: 0.85rem;
  color: #445;
  margin-top: 6px;
`;

export interface Exercise {
  id?: number;
  nome?: string;
  titulo?: string;
  descricao?: string;

  series?: number;
  series_count?: number;

  repeticoes?: number | string;
  observacoes?: string;
}

export default function ExerciseItem({ ex }: { ex: Exercise }) {
  const label = ex.nome ?? ex.titulo ?? ex.descricao ?? "Exercício";

  return (
    <Card>
      <Info>
        <Title>{label}</Title>

        <Small>
          Séries: {ex.series ?? ex.series_count ?? "—"} • Repetições:{" "}
          {ex.repeticoes ?? "—"}
        </Small>

        {ex.observacoes && (
          <Small style={{ marginTop: 6 }}>{ex.observacoes}</Small>
        )}
      </Info>
    </Card>
  );
}
