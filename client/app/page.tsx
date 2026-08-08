"use client"
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useLoginModal } from "@/context/LoginModalContext";


export default function Home() {
  const { user } = useAuth();
  const { showLoginModal, closeLoginModal } = useLoginModal();
  const [dismissed, setDismissed] = useState(false);

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold text-pin-red">Pinterest Clone</h1>
      <p className="text-pin-text-secondary">Theme is working!</p>
      <button className="bg-pin-red text-white px-6 py-3 rounded-pin-full hover:bg-pin-red-hover">
        Save Pin
      </button>
      {!user && showLoginModal && <LoginModal onClose={closeLoginModal} />}
    </div>
  );
}