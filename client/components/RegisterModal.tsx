"use client"
import { useAuth } from "@/context/AuthContext";
import { useLoginModal } from "@/context/LoginModalContext";
import { useRegisterModal } from "@/context/RegisterModalContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { LiaSkullCrossbonesSolid } from "react-icons/lia";
import { RxCross2 } from "react-icons/rx";


export default function RegisterModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const router = useRouter();
  const { openLoginModal } = useLoginModal();
  const { closeRegisterModal } = useRegisterModal();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = ""
    }
}, [])

  const handleEmailChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!value.trim()) {
      setEmailError("You missed a bit! Don't forget to add your email address.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        setEmailError("That doesn't look like an email address.");
      } else {
        setEmailError("");
      }

    }
  }

  const handleUsernameChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (!value.trim()) {
      setUsernameError("You missed a bit! Don't forget to add your username.")
    } else {
      const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
      if (!usernameRegex.test(value.trim())) {
        setUsernameError("That is not a valid username.")
      } else {
        setUsernameError("")
      }
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setUsernameError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

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

    if (!username.trim()) {
      setUsernameError("You missed a bit! Don't forget to add your username.");
      hasError = true;
    }
    else if (!usernameRegex.test(username)) {
      setUsernameError("That is not a valid username");
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      await register(username, email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

return (
  <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center" onClick={onClose}>
    <form className="flex fixed flex-row h-160 w-100 bg-white rounded-3xl overflow-hidden"
      onSubmit={handleSubmit}
      onClick={(e) => {
        e.stopPropagation();
      }}>
        <div className="flex flex-col gap-4 p-6">
          <div className="absolute top-4 right-6 p-2 rounded-full cursor-pointer" onClick={onClose}>
            <RxCross2 size={35}/>
          </div>

          <div className="flex items-center justify-center w-17 h-17 bg-[#f6f6f3] rounded-2xl">
            <img className="w-9 h-9" src="/pinterest-logo.png" alt="Pinterest" />
          </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="flex flex-col font-bold text-[28px] tracking-tight">
          <h1> Welcome to Pinterest </h1>
        </div>

        <div className="flex font-medium -mt-4.5 text-left tracking-tight">
          <h2> Join Pinterest for free to discover more ideas </h2>
        </div>

        <div className="flex flex-col -mt-1"> 
        <input
          className={`flex font-semibold text-[14px] rounded-xl h-16 p-2.5 outline-none ${
      emailError ? "border-[1.5px] border-[#dd0e0e]" : "border border-gray-400 focus:border-[#0060cc] focus:border-[1.5px]"
     }`}
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={handleEmailChange}
         />

        {emailError && (
          <div className="flex items-center justify-start gap-2 mt-1.5 text-[#dd0e0e] text-[12px] font-medium">
          <LiaSkullCrossbonesSolid size={25}/>
          <p>{emailError}</p>
          </div>
        )}
        </div>

        <div className="flex flex-col mt-1">
          <div className={`flex items-center rounded-xl h-16 px-2.5 ${
            passwordError ? "border-[1.5px] border-[#dd0e0e]" : "-mt-3 border border-gray-400 focus-within:border-[#0060cc] focus-within:border-[1.5px]"
          }`}> 
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="grow py-3 outline-none font-semibold text-[14px]"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover: cursor-pointer text-sm font-semibold ml-2">
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {passwordError && (
            <div className="flex items-center justify-start gap-2 mt-1.5 text-[#dd0e0e] text-[12px] font-medium">
              <LiaSkullCrossbonesSolid size={25}/>
              <p>{passwordError}</p>
            </div>
          )}
          <p className=" text-[12px] ml-2 mt-2">Use 8 or more letters, numbers and symbols</p>
        </div>

        <div className="flex flex-col -mt-2"> 
        <input
          className={`flex font-semibold text-[14px] rounded-xl h-16 p-2.5 outline-none ${
      usernameError ? "border-[1.5px] border-[#dd0e0e]" : "border border-gray-400 focus:border-[#0060cc] focus:border-[1.5px]"
     }`}
          type="username"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
         />

        {usernameError && (
          <div className="flex items-center justify-start gap-2 mt-1.5 text-[#dd0e0e] text-[12px] font-medium">
          <LiaSkullCrossbonesSolid size={25}/>
          <p>{usernameError}</p>
          </div>
        )}
          <p className=" text-[12px] ml-2 mt-2">Username must be 3-20 characters, start with a letter, and contain only letters, numbers, or underscores.</p>
        </div>
        

        <button
          type="submit"
          disabled={isLoading}
          className={`flex py-4 -mt-2 items-center justify-center px-3.5 text-[15px] bg-pin-red hover:bg-pin-red-hover hover:cursor-pointer text-white font-semibold rounded-2xl ${
            isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-pin-red-hover hover:cursor-pointer"
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : "Continue"}
        </button>

        <div className="flex flex-row gap-1 mt-3 font-medium">
          <h3> Already have an account? </h3>
          <h3 onClick={() => { openLoginModal(); closeRegisterModal()}} className="flex underline hover:cursor-pointer"> Login </h3>
        </div>

        <div className="flex flex-row text-[12px] gap-2 text-black font-light">
            <p>
              By continuing, you agree to Pinterest's{" "}<a href="/help" className="underline">Terms of Service</a>{" "}and acknowledge that you've read our{" "}<a href="/help" className="underline">Privacy Policy</a>{" "}.
            </p>
        </div>
    </div>
    </form>
  </div>
  );
}