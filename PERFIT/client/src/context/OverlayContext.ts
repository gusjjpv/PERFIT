import { createContext } from "react";

interface ModalContextConfig {
    isOverlay: boolean,
    setIsOverlay: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValues : ModalContextConfig = {
    isOverlay: false,
    setIsOverlay: () => {}
}

export const OverlayContext = createContext(defaultValues)