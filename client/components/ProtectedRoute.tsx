"use client";

import { useAuth } from "@/context/AuthContext";
import { useLoginModal } from "@/context/LoginModalContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    const { openLoginModal } = useLoginModal();

    useEffect(() => {
        if (!user) {
            router.push("/");
            openLoginModal();
        }
    }, [user, router, openLoginModal]);

    if (!user) {
        return null;
    }

    return <>{children}</>
}