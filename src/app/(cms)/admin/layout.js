import Navbar from '@/PageComponent/cms/Navbar'
import Sidebar from '@/PageComponent/cms/Sidebar'
import React from 'react'

function layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      <div className=" text-white shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        
        <Navbar />

        <main className="flex-1 overflow-y-auto p-12 pl-12 ">
          {children}
        </main>

      </div>

    </div>
  )
}

export default layout