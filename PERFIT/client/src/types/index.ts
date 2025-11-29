export interface TokenUser {
    refresh: string,
    access: string,
    user_id: number,
    username: string,
    first_name: string,
    role: string,
    detail: string
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
}

export interface ProfessorData {
    user: User;
    cref: string;
}

export interface StudentData {
    user: User;
    professor: ProfessorData;
}

export interface HomePersonalProps {
    students: StudentData[] | null;
}

export type Week = "SEG" | "TER" | "QUA" | "QUI" | "SEX" | "SAB" | "DOM"

export interface Exercises {
    descanso: string,
    id: number,
    nome: string,
    observacao: string,
    repeticoes: string,
    series: number
}

export interface Workout {
    descricao: string,
    dia_semana: Week,
    id: number,
    titulo: string,
    exercicios: Exercises[],
    ordem: number
}

export interface RecordWorkoutProps {
  id: number,
  aluno: number,
  nome: string,
  observacoes: string,
  ativa: boolean,
  data_inicio: string,
  data_fim: string,
  treinos: Workout[];
}