import { createContext } from "react";

interface ModalContextConfig {
    isModal: boolean,
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValues : ModalContextConfig = {
    isModal: false,
    setIsModal: () => {}
}

export const ModalContext = createContext(defaultValues)