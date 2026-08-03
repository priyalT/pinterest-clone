"use client"
import React from "react";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";


const Footer = () => {

  return (
    <footer className="flex justify-between items-start bg-black pt-8 pb-8 pl-0 pr-8">
        <div className="flex flex-col items-start">
        <Link href="/">
            <img
            className="w-50 block"
            src="/pinterest-footer.png"
            alt="Pinterest"
            />
        </Link>
        <p className="mt-2 text-xs text-white">
            © 2026 Pinterest Clone
        </p>
        </div>
      <div className="flex items-center gap-1 shrink-0">
        <Link href="/login">
        <button className="flex py-3 px-3.5 bg-pin-red hover:bg-pin-red-hover  text-white font-semibold rounded-xl">Log in</button>
        </Link>
        <Link href="/register">
        <button className="flex py-3 px-3.5 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-xl">Sign up</button>
        </Link>
      </div>

    </footer>
  );
};

export default Footer;