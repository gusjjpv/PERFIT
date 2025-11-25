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