"use client";

import { useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-300 px-6 py-7 flex justify-end sticky top-0 z-30">
      <div className="flex items-center gap-4">

        <div className="hidden md:flex items-center bg-gray-50 border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 bg-transparent outline-none text-sm w-64"
          />
        </div>

        <button
          onClick={() => {
            
            router.push("/admin/bookmessage"); 
          }}
          className="relative p-2"
        >
          <Bell className="w-5 h-5 text-gray-600" />

         
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
       
        </button>

        <button
          onClick={() => window.open("http://localhost:3000/", "_blank")}
          className="px-4 py-2 bg-[#04413D] text-white rounded-lg"
        >
          Visit Site
        </button>
      </div>
    </div>
  );
}