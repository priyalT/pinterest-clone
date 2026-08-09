"use client"

// work on Save functionality - 10 August 2026

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Pin } from "@/lib/dummyData";
import Image from 'next/image';
import { FaRegHeart, FaHeart } from "react-icons/fa6";




export default function PinCard({ pin }: { pin : Pin }){
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const [isLiked, setIsLiked] = useState(pin.isLiked);
    const [isSaved, setIsSaved] = useState(pin.isSaved);


return (
    <div className="flex flex-col w-75 rounded-2xl break-inside-avoid">
        <div className="relative group">
        <Image
            src = {pin.imageUrl}
            alt = {pin.title}
            width = {300}
            height = {300}
            className="w-full h-auto object-cover rounded-3xl" 
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer">
        <button 
        onClick={() => setIsSaved(!isSaved)}
        className="flex py-3 px-4 ml-55 mt-3 text-[15px] bg-[#e60024] hover:cursor-pointer text-white font-semibold rounded-2xl">
            {isSaved ? (
                <p> Saved </p>
            ) : (
                <p> Save </p>
            )}
        </button>
        <button
        onClick={() => setIsLiked(!isLiked)}
        className="flex absolute bottom-3 right-3  w-8 h-8 bg-white/70 hover:bg-white rounded-full transition-colors hover:cursor-pointer items-center justify-center">
            {isLiked ? (
                <FaHeart className="text-pin-red text-lg" />
            ) : (
                <FaRegHeart className="text-black text-lg" />
            )}
        </button>

        </div>
        </div>
        <p className="flex ml-2 mt-2 font-medium text-left">{pin.title}</p>
    </div>
)

    

}