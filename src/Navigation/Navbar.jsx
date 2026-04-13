'use client'

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import logo from "../../public/headerlogo.png"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false)
  const [countriesDropdownOpen, setCountriesDropdownOpen] = useState(false)

  const countries = [
    { name: "United States", path: "/countries/usa", id: "usa" },
    { name: "United Kingdom", path: "/countries/uk", id: "uk" },
    { name: "Canada", path: "/countries/canada", id: "canada" },
    { name: "Australia", path: "/countries/australia", id: "australia" },
    { name: "India", path: "/countries/india", id: "india" },
    { name: "Germany", path: "/countries/germany", id: "germany" },
    { name: "France", path: "/countries/france", id: "france" },
    { name: "Japan", path: "/countries/japan", id: "japan" },
    { name: "Brazil", path: "/countries/brazil", id: "brazil" },
    { name: "New Zealand", path: "/countries/new-zealand", id: "new-zealand" },
    { name: "UAE", path: "/countries/uae", id: "uae" },
  ]

  const navitem = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Countries", path: "/countries" },
    { name: "Partner With Us", path: "/partnerwithus" },
    { name: "Book an Appointment", path: "/enquiry" },
  ]

  // Handle Partner Login - Direct redirect to external CRM
  const handlePartnerLogin = () => {
    // Replace with your actual CRM URL
    // If it's an email link, use mailto:
    window.location.href = 'https://crm.amphlo.com' // or 'mailto:crm@amphlo.com'
  }

  useEffect(() => {
    closeAllDropdowns()
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const closeAllDropdowns = () => {
    setLoginDropdownOpen(false)
    setCountriesDropdownOpen(false)
  }

  const isActiveCountry = (countryPath) => {
    return pathname === countryPath
  }

  const isCountriesActive = () => {
    return pathname === '/countries' || pathname.startsWith('/countries/')
  }

  const isActiveNavItem = (itemPath) => {
    if (itemPath === '/countries') {
      return isCountriesActive()
    }
    return pathname === itemPath
  }

  return (
    <header className="w-full bg-white text-[#04413D] shadow-md fixed top-0 z-50">
      <nav className="w-11/12 mx-auto flex items-center justify-between py-3">

        <div className="flex items-center">
          <Link href="/">
            <Image 
              src={logo} 
              alt="logo" 
              className="h-12 w-20 object-cover cursor-pointer hover:opacity-80 transition-opacity" 
              priority
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-md tracking-wide font-medium">

          {navitem.map((val) => {
            if (val.name === "Countries") {
              return (
                <div key={val.name} className="relative">
                  <button
                    onClick={() => {
                      setCountriesDropdownOpen(!countriesDropdownOpen)
                      setLoginDropdownOpen(false)
                    }}
                    className={`hover:text-[#06665f] transition flex items-center gap-1 ${
                      isCountriesActive() ? 'text-[#06665f] font-semibold' : ''
                    }`}
                  >
                    Countries
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        countriesDropdownOpen ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {countriesDropdownOpen && (
                    <div className="absolute flex flex-col bg-white shadow-lg rounded-md mt-2 w-56 text-sm z-50 max-h-96 overflow-y-auto">
                      <div className="py-2">
                        <Link
                          href="/countries"
                          className={`px-4 py-2 hover:bg-gray-100 block font-semibold ${
                            pathname === '/countries' ? 'bg-gray-50 text-[#04413D]' : 'text-[#04413D]'
                          } border-b border-gray-200`}
                          onClick={closeAllDropdowns}
                        >
                          All Countries
                        </Link>
                        {countries.map((country) => (
                          <Link
                            key={country.id}
                            href={country.path}
                            className={`px-4 py-2 hover:bg-gray-100 block transition-colors ${
                              isActiveCountry(country.path) ? 'bg-gray-50 text-[#04413D] font-medium' : ''
                            }`}
                            onClick={closeAllDropdowns}
                          >
                            {country.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={val.name}
                href={val.path}
                className={`hover:text-[#06665f] transition ${
                  isActiveNavItem(val.path) ? 'text-[#06665f] font-semibold' : ''
                }`}
              >
                {val.name}
              </Link>
            )
          })}

        </div>

        <div className="hidden md:flex items-center gap-6 font-medium">

          <div className="relative z-50">
            <button
              onClick={() => {
                setLoginDropdownOpen(!loginDropdownOpen)
                setCountriesDropdownOpen(false)
              }}
              className="cursor-pointer hover:text-[#06665f] transition flex items-center gap-1"
            >
              Login
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${
                  loginDropdownOpen ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {loginDropdownOpen && (
              <div className="absolute flex flex-col bg-white/80 shadow-lg rounded-md mt-6 w-40 text-sm z-50 -right-8 py-3">
                <Link
  href="/university" 
  className="px-4 py-2 hover:bg-gray-100 transition"
  onClick={closeAllDropdowns}
>
  For Universities
</Link>
                <button
                  onClick={() => {
                    closeAllDropdowns()
                    handlePartnerLogin()
                  }}
                  className="px-4 py-2 hover:bg-gray-100 transition text-left w-full"
                >
                  For Partners
                </button>
              </div>
            )}
          </div>

        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
              closeAllDropdowns()
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {navitem.map((val) => (
                <Link
                  key={val.name}
                  href={val.path}
                  className={`text-lg font-semibold border-b border-gray-100 pb-2 hover:text-[#06665f] transition ${
                    isActiveNavItem(val.path) ? 'text-[#06665f]' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {val.name}
                </Link>
              ))}

              <div className="border-b border-gray-100 pb-2">
                <div className="text-lg font-semibold text-gray-600 mb-2">Popular Countries</div>
                <div className="grid grid-cols-2 gap-2">
                  {countries.slice(0, 8).map((country) => (
                    <Link
                      key={country.id}
                      href={country.path}
                      className={`text-sm py-1 px-2 rounded hover:bg-gray-100 transition ${
                        isActiveCountry(country.path) ? 'bg-gray-100 text-[#04413D] font-medium' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {country.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/countries"
                  className="text-sm text-[#04413D] font-medium mt-2 inline-block hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View All Countries →
                </Link>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/login"  
                  className="text-center border border-[#04413D] text-[#04413D] px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}