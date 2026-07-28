"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
        setError("Email is required");
        return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
        }

        if (!password) {
        setError("Password is required");
        return;
        }

        try {
            setIsLoading(true);
            await login(email, password);
            router.push("/"); 
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "320px",
      }}
    >
      <h1>Login</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  </div>
);
}