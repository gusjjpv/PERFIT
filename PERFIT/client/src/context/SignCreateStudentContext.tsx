import { createContext } from "react";

interface LoadingContextConfig {
    signStudent: boolean,
    setSignStudent: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValues : LoadingContextConfig = {
    signStudent: false,
    setSignStudent: () => {}
}

export const SignCreateStudentContext = createContext(defaultValues)