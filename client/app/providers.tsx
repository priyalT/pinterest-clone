"use client";
import { AuthProvider } from "@/context/AuthContext";
import { LoginModalProvider } from "@/context/LoginModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return ( 
  <AuthProvider> 
    <LoginModalProvider>
      {children}
    </LoginModalProvider>
  </AuthProvider>
  );
}
