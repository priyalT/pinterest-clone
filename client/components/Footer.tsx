"use client"
import React from "react";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});


const Footer = () => {
    const router = useRouter();
    const scrollToTop = () => {
        router.push("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };


  return (
    <footer className="flex justify-between items-start bg-black px-37.5 py-27.5">

        <div className="flex flex-col items-start gap-34 -mt-2">
        <span onClick={scrollToTop} className="cursor-pointer">
        <h2 className={`${pacifico.className} text-4xl text-white`}>
        Pinterest
        </h2>  
        </span>     
        <p className="mt-2 text-xs text-white">
            © 2026 Pinterest Clone
        </p>
        </div>

        <div className="flex gap-24 text-[15px] pr-10 -mt-2">

        <div className="flex flex-col gap-4 items-start">
            <p className="text-white font-bold">
                Get the app
            </p>
            <a href="https://apps.apple.com/us/app/pinterest/id429047995" target="_blank" rel="noopener noreferrer">
            <p className="text-white font-medium hover:underline">
                iOS
            </p>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.pinterest&pli=1" target="_blank" rel="noopener noreferrer">
            <p className="text-white font-medium hover:underline">
                Android
            </p>
            </a>
        </div>

        <div className="flex flex-col items-start gap-4">
            <p className="text-white font-bold">
                Quick links
            </p>
            <a href="/" target="_blank" rel="noopener noreferrer">
            <p className="text-white font-medium hover:underline">
                Explore
            </p>
            </a>
            <a href="/shop" target="_blank" rel="noopener noreferrer">
            <p className="text-white font-medium hover:underline">
                Shop
            </p>
            </a>
            <a href="/help" target="_blank" rel="noopener noreferrer">
            <p className="text-white font-medium hover:underline">
                Help Centre
            </p>
            </a>
        </div>

        <div className="flex flex-col items-start gap-4">
            <p className="text-white font-bold">
                Policies
            </p>
            <a href="/help" target="_blank" rel="noopener noreferrer">
            <p className="text-white font-medium hover:underline">
                Terms of Service
            </p>
            </a>
            <a href="/help" target="_blank" rel="noopener noreferrer">
            <p className="text-white font-medium hover:underline">
                Privacy Policy
            </p>
            </a>
            <a href="/help" target="_blank" rel="noopener noreferrer">
            <p className="text-white font-medium hover:underline">
                Non-user notice
            </p>
            </a>
        </div>

    </div>

    </footer>
  );
};

export default Footer;