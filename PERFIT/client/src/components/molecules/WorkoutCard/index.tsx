import React from "react";
import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";

const Card = styled.div`
  display:flex;
  align-items:center;
  gap:14px;
  padding:14px;
  border-radius:10px;
  background: linear-gradient(180deg, #ffffff, #fbfbfb);
  margin-bottom:12px;
  box-shadow: 0 6px 14px rgba(2,18,35,0.06);
  cursor:pointer;
  transition: transform .12s ease, box-shadow .12s ease;
  &:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(2,18,35,0.08); }
`;

const Meta = styled.div`
  font-size: 0.9rem;
  color: #222;
`;

const Title = styled.div`
  font-weight: 700;
  color: #0b2540;
`;

export default function WorkoutCard({ treino, onClick }: { treino: any; onClick?: () => void; }) {
  return (
    <Card onClick={onClick}>
      <div style={{ width:48, height:48, borderRadius:10, background:"#eef6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <FaCalendarAlt style={{ color:"#0b66b2" }} />
      </div>
      <Meta>
        <Title>{treino.titulo ?? treino.nome ?? "Treino"}</Title>
        <div style={{ fontSize:12, marginTop:6 }}>
          Dia: <strong>{treino.dia_semana ?? "—"}</strong>
        </div>
        {treino.descricao && <div style={{ fontSize:12, color:"#556" }}>{treino.descricao}</div>}
      </Meta>
    </Card>
  );
}
