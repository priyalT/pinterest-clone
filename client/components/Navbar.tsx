"use client"
import React from "react";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

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
        <div className="flex py-1.5 px-3.5 text-black font-semibold"><Link href="/">Explore</Link></div>
        <div className="flex grow gap-2 items-center bg-pin-bg-secondary rounded-lg px-4 py-3 text-black font-semibold">
            <FiSearch className="h-5 w-5 text-pin-text-secondary" />
            <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="flex grow outline-none bg-transparent" 
            type="text" 
            placeholder="Search"  /> 
        </div>
        <div className="flex py-1.5 px-3.5 text-black font-semibold"><Link href="/about">About</Link></div>
        <div className="flex py-1.5 px-3.5 text-black font-semibold"><Link href="/businesses">Businesses</Link></div>
        <div className="flex py-1.5 px-3.5 text-black font-semibold"><Link href="/create">Create</Link></div>
        <div className="flex py-1.5 px-3.5 text-black font-semibold"><Link href="/news">News</Link></div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Link href="/login">
        <button className="flex py-3 px-3.5 bg-pin-red hover:bg-pin-red-hover  text-white font-semibold rounded-xl">Log in</button>
        </Link>
        <Link href="/register">
        <button className="flex py-3 px-3.5 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-xl">Sign up</button>
        </Link>
      </div>

    </nav>
  );
};

export default Navbar;