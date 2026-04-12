"use client";

import { useRouter } from "next/navigation";
import { Menu, Bell, Search, User, Settings,  } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6 flex items-center justify-end sticky top-0 z-30">
    

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 bg-transparent outline-none text-sm w-64"
          />
        </div>

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#04413D] to-[#06665f] flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">
              Admin User
            </span>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <hr className="my-1" />
                
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}