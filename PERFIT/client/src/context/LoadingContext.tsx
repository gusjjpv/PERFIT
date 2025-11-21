import { createContext } from "react";

interface LoadingContextConfig {
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValues : LoadingContextConfig = {
    loading: true,
    setLoading: () => {}
}

export const LoadingContext = createContext(defaultValues)