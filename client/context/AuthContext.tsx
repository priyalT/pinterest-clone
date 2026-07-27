"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";


type User = {
  useremail: string;
  userid: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- INITIAL LOAD (useEffect) ---
  // When the app first loads, check if they are already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const payloadBase64 = storedToken.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        setUser(decoded.user); 
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const token = response.data.jwtData; 
    localStorage.setItem("token", token);
    try{
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        setToken(token);
        setUser(decoded.user);
    } catch (error) {
        console.error("Invalid token:", error);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    const token = response.data.jwtData;
    localStorage.setItem("token", token);
    
    try{
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        setToken(token);
        setUser(decoded.user);
    } catch (error) {
        console.error("Invalid token:", error);
    }
  };
  const logout = () => {
    try {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    } catch (error) {
        console.error("Logout failed", error)
    }
  };

  if (isLoading) return <div>Loading...</div>; 
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
