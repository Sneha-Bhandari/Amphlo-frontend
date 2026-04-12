// app/login/page.jsx
'use client'

import UniversityLoginForm from '@/auth/UniversityLoginForm'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {type === 'university' ? 'University Login' : 'Login'}
            </h1>
            <p className="text-gray-600 mt-2">
              {type === 'university' 
                ? 'Access your university dashboard' 
                : 'Please select login type from dropdown'}
            </p>
          </div>
          
          {type === 'university' ? (
            <UniversityLoginForm />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Please select login type from the dropdown menu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}