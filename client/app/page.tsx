import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold text-pin-red">Pinterest Clone</h1>
      <p className="text-pin-text-secondary">Theme is working!</p>
      <button className="bg-pin-red text-white px-6 py-3 rounded-pin-full hover:bg-pin-red-hover">
        Save Pin
      </button>
    </div>
  );
}
