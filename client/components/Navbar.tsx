import React from "react";
import { FiSearch } from "react-icons/fi";


const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 h-20 bg-white">
      <div className="flex justify-start items-center gap-1 me-4 text-red-600 shrink-0">
        <img className="flex w-6 h-6" src="/pinterest-logo.png" alt="Pinterest" />
        <h2 className="font-extrabold">Pinterest</h2>
      </div>

      <div className="flex grow gap-3">
        <div className="flex py-1.5 px-3.5 text-black font-semibold"><a href="/">Explore</a></div>
        <div className="flex grow gap-2 items-center bg-pin-bg-secondary rounded-lg px-4 text-black font-semibold">
            <FiSearch className="h-5 w-5 text-pin-text-secondary" />
            <input 
            className="flex grow outline-none bg-transparent" 
            type="text" 
            placeholder="Search"  /> 
        </div>
        <div className="flex py-1.5 px-3.5 text-black font-semibold"><a href="/about">About</a></div>
        <div className="flex py-1.5 px-3.5 text-black font-semibold"><a href="/businesses">Businesses</a></div>
        <div className="flex py-1.5 px-3.5 text-black font-semibold"><a href="/create">Create</a></div>
        <div className="flex py-1.5 px-3.5 text-black font-semibold"><a href="/news">News</a></div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button className="flex py-1.5 px-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl">Log in</button>
        <button className="flex py-1.5 px-3.5 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-xl">Sign up</button>
      </div>

    </nav>
  );
};

export default Navbar;