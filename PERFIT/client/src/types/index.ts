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

export interface RecordWorkoutProps {
  id: number;
  aluno: number;
  nome: string;
  observacoes: string;
  ativa: boolean;
  //data_inicio: string;
  data_fim: string;
  //treinos: Treino[];
}