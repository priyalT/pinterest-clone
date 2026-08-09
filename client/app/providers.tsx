"use client";
import { AuthProvider } from "@/context/AuthContext";
import { LoginModalProvider } from "@/context/LoginModalContext";
import { RegisterModalProvider } from "@/context/RegisterModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return ( 
  <AuthProvider> 
    <LoginModalProvider>
      <RegisterModalProvider>
      {children}
      </RegisterModalProvider>
    </LoginModalProvider>
  </AuthProvider>
  );
}
