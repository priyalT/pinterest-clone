import { createContext, useEffect, useState } from "react";
"use client";

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
    const storedToken = localStorage.getItem("token"); // Or whatever key you use
    if (storedToken) {
      setToken(storedToken);
      // Decode the JWT to get the user data back
      // Hint: The payload is the middle part of the token (storedToken.split('.')[1])
      // Use atob() to decode base64, then JSON.parse() it.
      try {
        const payloadBase64 = storedToken.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        // Look at your backend: data = { user: { useremail, userid } }
        setUser(decoded.user); 
      } catch (error) {
        // If decoding fails (tampered token), clear it out
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);
  // --- ACTIONS ---
  const login = async (email: string, password: string) => {
    // 1. Make POST request to /api/auth/login
    // const response = await api.post('/auth/login', { email, password });
    
    // 2. Extract JWT from response (your backend sends it as 'jwtData')
    // const token = response.data.jwtData;
    
    // 3. Save to localStorage
    // localStorage.setItem("token", token);
    
    // 4. Update React state (setToken, setUser by decoding the token)
  };
  const register = async (username: string, email: string, password: string) => {
    // Exact same flow as login, but POST to /api/auth/register
  };
  const logout = () => {
    // 1. Remove token from localStorage
    // 2. setToken(null)
    // 3. setUser(null)
  };
  // --- RENDER ---
  // Don't render children until we've checked localStorage (prevents flashing)
  if (isLoading) return <div>Loading...</div>; 
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
