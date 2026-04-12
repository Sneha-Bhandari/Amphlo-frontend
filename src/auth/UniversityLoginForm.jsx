'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

export default function UniversityLoginForm() {
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email is invalid')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log('University Login:', values)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.success('Login successful! Redirecting to dashboard...')
        router.push('/dashboard')
      } catch (error) {
        console.error('Login error:', error)
        toast.error('Login failed. Please check your credentials.')
        setSubmitting(false)
      }
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          University Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] transition ${
            formik.touched.email && formik.errors.email 
              ? 'border-red-500' 
              : 'border-gray-300'
          }`}
          placeholder="admin@university.edu"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] transition ${
            formik.touched.password && formik.errors.password 
              ? 'border-red-500' 
              : 'border-gray-300'
          }`}
          placeholder="Enter your password"
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formik.values.rememberMe}
            onChange={formik.handleChange}
            className="w-4 h-4 text-[#04413D] border-gray-300 rounded focus:ring-[#04413D] cursor-pointer"
          />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <Link 
          href="/forgot-password" 
          className="text-sm text-[#04413D] hover:text-[#06665f] transition"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full bg-[#04413D] text-white py-3 rounded-lg hover:bg-[#06665f] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        {formik.isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Logging in...
          </span>
        ) : (
          'Login'
        )}
      </button>

      {/* <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            href="/register?type=university" 
            className="text-[#04413D] font-medium hover:underline transition"
          >
            Register as University
          </Link>
        </p>
      </div> */}
    </form>
  )
}