"use client";

import { AuthProvider } from '@/app/(cms)/admin/contexts/AuthContext';
import Navbar from '@/PageComponent/cms/Navbar';
import Sidebar from '@/PageComponent/cms/Sidebar';
import React from 'react';
import { usePathname } from 'next/navigation';

function Layout({ children }) {
  const pathname = usePathname();
  
  // Don't show sidebar/navbar on login page
  const isLoginPage = pathname === '/cms-login';
  
  if (isLoginPage) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <div className="text-white shrink-0">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-12 pl-12">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default Layout;