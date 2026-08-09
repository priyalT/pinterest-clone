"use client"
import React from "react";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLoginModal } from "@/context/LoginModalContext";
import { useRegisterModal } from "@/context/RegisterModalContext";



const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const { user, logout } = useAuth();
    const { openLoginModal } = useLoginModal();
    const { openRegisterModal } = useRegisterModal();


    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            router.push(`/search?q=${searchQuery}`);
        }};
      
  return (
    <nav className="flex items-center justify-between p-4 h-20 bg-white">
      <Link href="/" className="flex justify-start items-center gap-1 me-4 text-pin-red shrink-0">
        <img className="flex w-6 h-6" src="/pinterest-logo.png" alt="Pinterest" />
        <h2 className="font-extrabold">Pinterest</h2>
      </Link>

      <div className="flex grow gap-3 items-center">
        <div className="flex py-1.5 px-3.5 text-black font-semibold text-[15px]"><Link href="/">Explore</Link></div>

        <div className="flex w-153.75 gap-2 items-center bg-[#e5e6e1] rounded-xl px-4 py-3 text-black font-semibold hover:bg-[#DADBD2]">
            <FiSearch className="h-5 w-5 text-pin-text-secondary" />
            <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="flex grow outline-none bg-transparent text-[15px]" 
            type="text" 
            placeholder="Search for easy dinners, fashion, etc."  /> 
        </div>
        
        <div className="flex py-1.5 pr-2.5 pl-2.5 text-black font-semibold text-[15px] hover:bg-gray-50"><Link href="/about">About</Link></div>
        <div className="flex py-1.5 px-2.5 text-black font-semibold text-[15px] hover:bg-gray-50"><Link href="/businesses">Businesses</Link></div>
        <div className="flex py-1.5 px-2.5 text-black font-semibold text-[15px] hover:bg-gray-50"><Link href="/create">Create</Link></div>
        <div className="flex py-1.5 px-2.5 text-black font-semibold text-[15px] hover:bg-gray-50"><Link href="/news">News</Link></div>
      </div>
      <div className="flex items-center gap-2 pl-6 shrink-0">
      {!user ? (
        <>
        <button onClick={openLoginModal} className="flex py-3 px-3.5 text-[15px] bg-pin-red hover:bg-pin-red-hover hover:cursor-pointer text-white font-semibold rounded-2xl"> Log in </button>
        <button onClick={openRegisterModal} className="flex py-3 px-3.5 text-[15px] bg-[#e5e6e1] hover:bg-[#DADBD2] hover:cursor-pointer text-black font-semibold rounded-2xl"> Sign up </button>
        </>
      ) : (
        <button onClick={logout} className="flex py-3 px-3.5 text-[15px] bg-pin-red hover:bg-pin-red-hover hover:cursor-pointer text-white font-semibold rounded-2xl">Log out</button>
      )}
      </div>
    </nav>
  );
};

export default Navbar;