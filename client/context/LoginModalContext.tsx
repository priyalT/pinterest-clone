"use client"

import { createContext, useContext, useState } from "react";

type LoginModalContextType = {
    showLoginModal: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: React.ReactNode}) {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <LoginModalContext.Provider value={{
            showLoginModal,
            openLoginModal: () => setShowLoginModal(true),
            closeLoginModal: () => setShowLoginModal(false),
        }}>
            {children}
        </LoginModalContext.Provider>
    )
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) throw new Error("useLoginModal must be used within LoginModalProvider");
  return context;
}
