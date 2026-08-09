"use client"

import { createContext, useContext, useState } from "react";

type RegisterModalContextType = {
    showRegisterModal: boolean;
    openRegisterModal: () => void;
    closeRegisterModal: () => void;
}

const RegisterModalContext = createContext<RegisterModalContextType | undefined>(undefined);

export function RegisterModalProvider({ children }: { children: React.ReactNode}) {
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    return (
        <RegisterModalContext.Provider value={{
            showRegisterModal,
            openRegisterModal: () => setShowRegisterModal(true),
            closeRegisterModal: () => setShowRegisterModal(false),
        }}>
            {children}
        </RegisterModalContext.Provider>
    )
}

export function useRegisterModal() {
  const context = useContext(RegisterModalContext);
  if (!context) throw new Error("useRegisterModal must be used within RegisterModalProvider");
  return context;
}
