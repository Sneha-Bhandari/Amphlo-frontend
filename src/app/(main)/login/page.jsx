'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import UniversityLoginForm from '@/auth/UniversityLoginForm'
import PartnerLoginForm from '@/auth/PartnerLoginForm'
import LoadingSpinner from '@/ui/LoadingSpinner'

function LoginContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-[#04413D] mb-2 text-center">
            {type === 'university' ? 'University Login' : 'Partner Login'}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Welcome back! Please enter your credentials
          </p>

          {type === 'university' ? (
            <UniversityLoginForm />
          ) : (
            <PartnerLoginForm />
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginContent />
    </Suspense>
  )
}