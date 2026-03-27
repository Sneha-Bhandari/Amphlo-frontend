"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="bg-white-900 w-full border-b px-6 py-4 flex items-center justify-between">
      
      {/* Left side */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back, Admin 
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
            A
          </div>
          <span className="text-sm font-medium text-gray-700">
            Admin
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}