'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

export default function UniversityRegisterForm() {
  const router = useRouter()

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 
    'India', 'Germany', 'France', 'Japan', 'Brazil', 'New Zealand', 'UAE'
  ]

  const formik = useFormik({
    initialValues: {
      universityName: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      city: '',
      website: '',
      contactPerson: '',
      phoneNumber: '',
      agreeToTerms: false
    },
    validationSchema: Yup.object({
      universityName: Yup.string()
        .required('University name is required')
        .min(2, 'University name must be at least 2 characters')
        .max(100, 'University name must be less than 100 characters'),
      
      email: Yup.string()
        .required('Email is required')
        .email('Email is invalid'),
      
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
      
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password'), null], 'Passwords do not match'),
      
      country: Yup.string()
        .required('Country is required')
        .notOneOf([''], 'Please select a country'),
      
      city: Yup.string()
        .required('City is required')
        .min(2, 'City must be at least 2 characters'),
      
      contactPerson: Yup.string()
        .required('Contact person name is required')
        .min(2, 'Contact person name must be at least 2 characters')
        .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters'),
      
      phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^[\d\s\+\-\(\)]{10,}$/, 'Please enter a valid phone number'),
      
      website: Yup.string()
        .url('Please enter a valid URL'),
      
      agreeToTerms: Yup.boolean()
        .oneOf([true], 'You must agree to the terms and conditions')
        .required('You must agree to the terms and conditions')
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        console.log('University Registration:', values)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.success('Registration successful! Please login to continue.')
        resetForm()
        router.push('/login?type=university&registered=true')
      } catch (error) {
        console.error('Registration error:', error)
        toast.error('Registration failed. Please try again.')
        setSubmitting(false)
      }
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          University Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="universityName"
          value={formik.values.universityName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] transition ${
            formik.touched.universityName && formik.errors.universityName 
              ? 'border-red-500' 
              : 'border-gray-300'
          }`}
          placeholder="Enter university name"
        />
        {formik.touched.universityName && formik.errors.universityName && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.universityName}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] transition ${
              formik.touched.country && formik.errors.country 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {formik.touched.country && formik.errors.country && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.country}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] transition ${
              formik.touched.city && formik.errors.city 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="Enter city"
          />
          {formik.touched.city && formik.errors.city && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.city}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
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
          placeholder="university@example.edu"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Create password"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] transition ${
              formik.touched.confirmPassword && formik.errors.confirmPassword 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="Confirm password"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactPerson"
            value={formik.values.contactPerson}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] transition ${
              formik.touched.contactPerson && formik.errors.contactPerson 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="Full name"
          />
          {formik.touched.contactPerson && formik.errors.contactPerson && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.contactPerson}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] transition ${
              formik.touched.phoneNumber && formik.errors.phoneNumber 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="+1 234 567 8900"
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website (Optional)
        </label>
        <input
          type="url"
          name="website"
          value={formik.values.website}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] transition ${
            formik.touched.website && formik.errors.website 
              ? 'border-red-500' 
              : 'border-gray-300'
          }`}
          placeholder="https://university.edu"
        />
        {formik.touched.website && formik.errors.website && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.website}</p>
        )}
      </div>

      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formik.values.agreeToTerms}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-4 h-4 text-[#04413D] border-gray-300 rounded focus:ring-[#04413D] cursor-pointer"
          />
          <label className="ml-2 text-sm text-gray-600 cursor-pointer">
            I agree to the Terms of Service and Privacy Policy <span className="text-red-500">*</span>
          </label>
        </div>
        {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.agreeToTerms}</p>
        )}
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
            Creating account...
          </span>
        ) : (
          'Register'
        )}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            href="/login?type=university" 
            className="text-[#04413D] font-medium hover:underline transition"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  )
}