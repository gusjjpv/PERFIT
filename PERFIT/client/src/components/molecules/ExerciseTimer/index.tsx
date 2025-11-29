import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaPlay, FaPause, FaForward } from "react-icons/fa";
import { theme } from "../../../styles/theme";

const pulse = keyframes`
  from { transform: scale(1); }
  50% { transform: scale(1.01); }
  to { transform: scale(1); }
`;

const Card = styled.div`
  display:flex;
  gap:14px;
  align-items:center;
  padding:10px;
  margin-top:12px;
  border-radius:10px;
  background: linear-gradient(180deg,#ffffff,#fbfdff);
  box-shadow: 0 6px 18px rgba(2,8,20,0.04);
  animation: ${pulse} 3000ms ease-in-out infinite;
`;

const Info = styled.div`
  flex:1;
`;

const Title = styled.div`
  font-weight:700;
  color:#0b2540;
`;

const Small = styled.div`
  font-size: 0.85rem;
  color:#445;
  margin-top:6px;
`;

const Controls = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
`;

const Btn = styled.button<{ primary?: boolean }>`
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
  background: ${(p) => (p.primary ? "#0b66b2" : "#eef2f6")};
  color: ${(p) => (p.primary ? "#fff" : "#0b2540")};
  cursor: pointer;
  display:flex;
  gap:8px;
  align-items:center;
`;

export interface Exercise {
  id?: number;
  nome?: string;
  titulo?: string;
  descricao?: string;

  series?: number;
  series_count?: number;

  repeticoes?: number | string;

  tempo_execucao?: number;
  tempo_descanso?: number;

  observacoes?: string;
}


export default function ExerciseTimer({ ex }: { ex: Exercise }) {
  const label =
    ex.nome ?? ex.titulo ?? ex.descricao ?? "Exercício";

  const execTimeDefault = ex.tempo_execucao ?? 30;
  const descansoDefault = ex.tempo_descanso ?? 30;

  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [execElapsed, setExecElapsed] = useState(0);
  const [restRemaining, setRestRemaining] = useState(descansoDefault);

  const execRef = useRef<number | null>(null);
  const restRef = useRef<number | null>(null);

  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  const beep = () => {
    try {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 200);
    } catch {}
  };

  // execução
  useEffect(() => {
    if (!isRunning) {
      if (execRef.current) {
        clearInterval(execRef.current);
        execRef.current = null;
      }
      return;
    }

    execRef.current = window.setInterval(() => {
      setExecElapsed((e) => e + 1);
    }, 1000);

    return () => {
      if (execRef.current) {
        clearInterval(execRef.current);
        execRef.current = null;
      }
    };
  }, [isRunning]);

  // troca automática para descanso
  useEffect(() => {
    if (execElapsed >= execTimeDefault && execTimeDefault > 0) {
      setIsRunning(false);
      setExecElapsed(0);
      setRestRemaining(descansoDefault);
      setIsResting(true);
      beep();
    }
  }, [execElapsed, execTimeDefault, descansoDefault]);

  // descanso
  useEffect(() => {
    if (!isResting) {
      if (restRef.current) {
        clearInterval(restRef.current);
        restRef.current = null;
      }
      return;
    }

    restRef.current = window.setInterval(() => {
      setRestRemaining((t) => {
        if (t <= 1) {
          clearInterval(restRef.current!);
          restRef.current = null;
          setIsResting(false);
          beep();
          return descansoDefault;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (restRef.current) {
        clearInterval(restRef.current);
        restRef.current = null;
      }
    };
  }, [isResting, descansoDefault]);

  const handleStart = () => {
    setIsRunning(true);
    setIsResting(false);
    setExecElapsed(0);
  };

  const handlePause = () => setIsRunning(false);

  const handleSkipRest = () => {
    setIsResting(false);
    setRestRemaining(descansoDefault);
  };

  const progress =
    execTimeDefault > 0
      ? Math.min(execElapsed / execTimeDefault, 1)
      : 0;

  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Card>
      <div
        style={{
          width: 68,
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="68" height="68">
          <g transform="translate(34,34)">
            <circle r={radius} fill="transparent" stroke="#eef5fb" strokeWidth="8" />
            <circle
              r={radius}
              fill="transparent"
              stroke="#0b66b2"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90)"
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fontSize="11"
              fill="#0b2540"
              style={{ fontWeight: 700 }}
            >
              {isResting ? `${restRemaining}s` : `${execElapsed}s`}
            </text>
          </g>
        </svg>
      </div>

      <Info>
        <Title>{label}</Title>
        <Small>
          Séries: {ex.series ?? ex.series_count ?? "—"} • Repetições:{" "}
          {ex.repeticoes ?? "—"}
        </Small>
        {ex.observacoes && <Small style={{ marginTop: 6 }}>{ex.observacoes}</Small>}
      </Info>

      <Controls>
        {!isResting ? (
          <>
            {!isRunning ? (
              <Btn style={{color: theme.colors.primary.blue}} onClick={handleStart}>
                <FaPlay /> Iniciar
              </Btn>
            ) : (
              <Btn onClick={handlePause}>
                <FaPause /> Parar
              </Btn>
            )}
            <div style={{ fontSize: 12, color: "#556" }}>{execTimeDefault}s alvo</div>
          </>
        ) : (
          <>
            <Btn onClick={handleSkipRest}>
              <FaForward /> Pular
            </Btn>
            <div style={{ fontSize: 12, color: "#556" }}>Descanso</div>
          </>
        )}
      </Controls>
    </Card>
  );
}
