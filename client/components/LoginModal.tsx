"use client"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";



export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = ""
    }

  })

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let hasError = false;

    if (!email.trim()) {
      setEmailError("You missed a bit! Don't forget to add your email address.");
      hasError = true;
    }
    else if (!emailRegex.test(email)) {
      setEmailError("That doesn't look like an email address.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("You missed a bit! Don't forget to add your password.");
      hasError = true;
    }

    if (hasError) return;
  }

  try {
    setIsLoading(true);
    await login(email, password);
  } catch (err: any) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};

return (
  <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center" onClick={onClose}>
    <form className="flex fixed flex-row gap-4 h-148 w-200 bg-white rounded-3xl py-6 px-7 overflow-hidden"
      onSubmit={handleSubmit}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      <div className="flex flex-col gap-4 w-1/2">
        <div className="flex items-center justify-center w-17 h-17 bg-[#f6f6f3] rounded-2xl">
          <img className="w-9 h-9" src="/pinterest-logo.png" alt="Pinterest" />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="flex flex-col font-bold text-[28px] tracking-tight">
          <h1> Welcome to Pinterest </h1>
        </div>
        <div className="flex font-medium -mt-4.5 text-base tracking-tight">
          <h2> Log in to discover more ideas just for you </h2>
        </div>
        <input
          className="flex mt-2.5 font-semibold text-[14px] rounded-xl h-16 border border-gray-400 p-2.5 "
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex -mt-2 font-semibold text-[14px] rounded-xl h-16 border border-gray-400 p-2.5 focus-within:border-[#0060cc] focus-within:border-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="grow py-3 outline-none"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm font-semibold ml-2">
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="flex py-4 mt-4 items-center justify-center px-3.5 text-[15px] bg-pin-red hover:bg-pin-red-hover hover:cursor-pointer text-white font-semibold rounded-2xl"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        <div className="flex flex-row gap-1 mt-5 font-medium">
          <h3> New to Pinterest? </h3>
          <h3 className="flex underline hover:cursor-pointer"> Join for free </h3>
        </div>
        <div className="flex flex-row text-[12px] gap-2 text-black font-weight:250 underline">
          <a href="/help" target="_blank" rel="noopener noreferrer">
            <p>
              Terms of Service
            </p>
          </a>
          <a href="/help" target="_blank" rel="noopener noreferrer">
            <p>
              Privacy Policy
            </p>
          </a>
        </div>

      </div>
      <div className="flex flex-col items-center justify-center w-1/2 bg-gray-100">
        <p>Scan to log in</p>
      </div>
    </form>

  </div>
)
};