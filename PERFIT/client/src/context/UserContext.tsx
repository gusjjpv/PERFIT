import { createContext } from "react";
import type { TokenUser } from "../types";

interface UserContextConfig {
    user: TokenUser | null,
    setUser: React.Dispatch<React.SetStateAction<TokenUser | null>>
}

const defaultValues : UserContextConfig = {
    user: null,
    setUser: () => {}
}

export const UserContext = createContext(defaultValues)