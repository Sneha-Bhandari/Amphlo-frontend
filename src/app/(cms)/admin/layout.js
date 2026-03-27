import Navbar from '@/PageComponent/cms/Navbar'
import Sidebar from '@/PageComponent/cms/Sidebar'
import React from 'react'

function layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      {/* Right side */}
      <div className="flex flex-col flex-1">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-6 overflow-y-auto flex-1">
          {children}
        </main>

      </div>
    </div>
  )
}

export default layout