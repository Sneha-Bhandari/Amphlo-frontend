'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import UniversityRegisterForm from '@/auth/UniversityRegisterForm'
import PartnerRegisterForm from '@/auth/PartnerRegisterForm'
import LoadingSpinner from '@/ui/LoadingSpinner'

function RegisterContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-[#04413D] mb-2 text-center">
            {type === 'university' ? 'University Registration' : 'Partner Registration'}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Create your account to get started
          </p>

          {type === 'university' ? (
            <UniversityRegisterForm />
          ) : (
            <PartnerRegisterForm/>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterContent />
    </Suspense>
  )
}