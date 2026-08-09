"use client"
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useLoginModal } from "@/context/LoginModalContext";
import { useRegisterModal } from "@/context/RegisterModalContext";
import RegisterModal from "@/components/RegisterModal";
import PinCard from "@/components/PinCard";
import { dummyPins } from "@/lib/dummyData";



export default function Home() {
  const { user } = useAuth();
  const { showLoginModal, closeLoginModal } = useLoginModal();
  const { showRegisterModal, closeRegisterModal } = useRegisterModal();
  const [dismissed, setDismissed] = useState(false);

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <PinCard pin={dummyPins[0]}/>
      {!user && showLoginModal && <LoginModal onClose={closeLoginModal} />}
      {!user && showRegisterModal && <RegisterModal onClose={closeRegisterModal} />}
    </div>
  );
}