import Navbar from '@/PageComponent/cms/Navbar'
import Sidebar from '@/PageComponent/cms/Sidebar'
import React from 'react'

function layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        
        <Navbar />

        <main className="flex-1 overflow-y-auto p-16 pl-24 ">
          {children}
        </main>

      </div>

    </div>
  )
}

export default layout