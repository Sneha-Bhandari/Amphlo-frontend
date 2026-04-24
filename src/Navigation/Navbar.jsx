'use client'

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import logo from "../../public/headerlogo.png"
import { fetchData } from "@/lib/frontendApi"

export default function Navbar() {
const pathname = usePathname()

const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
const [loginDropdownOpen, setLoginDropdownOpen] = useState(false)
const [countriesDropdownOpen, setCountriesDropdownOpen] = useState(false)
const [countries, setCountries] = useState([])

const navitem = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Countries", path: "/countries" },
    { name: "Partner With Us", path: "/partnerwithus" },
    { name: "Book an Appointment", path: "/enquiry" },
]

useEffect(() => {
    const loadCountries = async () => {
     try {
        const res = await fetchData("/countries/")
        setCountries(res.data || [])
     } catch (err) {
        console.error("Failed to load countries", err)
     }
    }

    loadCountries()
}, [])

const handlePartnerLogin = () => {
  window.open('https://crm.amphlo.com', '_blank')
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

const isActiveCountry = (id) => {
    return pathname === `/countries/${id}`
}

const isCountriesActive = () => {
    return pathname === '/countries' || pathname.startsWith('/countries/')
}

const isActiveNavItem = (itemPath) => {
    if (itemPath === '/countries/') {
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
             className="h-12 w-20 object-cover cursor-pointer hover:opacity-80 transition-opacity duration-500"
             priority
            />
         </Link>
        </div>

       <div className="flex mx-auto justify-end w-full gap-5">
       <div className="hidden md:flex items-center  gap-6 text-md tracking-wide font-medium">
         {navitem.map((val) => {
            if (val.name === "Countries") {
             return (
                <div key={val.name} className="relative">
                 <button
                    onClick={() => {
                     setCountriesDropdownOpen(!countriesDropdownOpen)
                     setLoginDropdownOpen(false)
                    }}
                    className={`hover:text-[#06665f] transition-all duration-500 ease-in-out flex items-center gap-1 ${
                        isCountriesActive() ? 'text-[#06665f] font-semibold' : ''
                    }`}
                 >
                    Countries
                    <svg
                     className={`w-4 h-4 transition-all duration-500 ease-in-out ${countriesDropdownOpen ? 'rotate-180' : ''}`}
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                    >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                 </button>

                 <div 
                    className={`absolute flex flex-col bg-white shadow-lg rounded-md mt-2 w-56 text-sm z-50 max-h-96 overflow-y-auto transition-all duration-500 ease-in-out origin-top ${
                        countriesDropdownOpen 
                        ? 'opacity-100 scale-y-100 visible' 
                        : 'opacity-0 scale-y-0 invisible'
                    }`}
                 >
                    <div className="py-2">
                        <Link
                         href="/countries"
                         className={`px-4 py-2 hover:bg-gray-100 block font-semibold transition-all duration-300 ${
                             pathname === '/countries/' ? 'bg-gray-50 text-[#04413D]' : 'text-[#04413D]'
                         } border-b border-gray-200`}
                         onClick={closeAllDropdowns}
                        >
                         All Countries
                        </Link>

                        {countries.length === 0 ? (
                         <div className="px-4 py-2 text-gray-400">Loading...</div>
                        ) : (
                         countries.map((country, index) => (
                            <Link
                             key={country.id}
                             href={`/countries/${country.id}`}
                             className={`px-4 py-2 hover:bg-gray-100 block transition-all duration-300 ${
                                 isActiveCountry(country.id) ? 'bg-gray-50 text-[#04413D] font-medium' : ''
                             }`}
                             onClick={closeAllDropdowns}
                             style={{
                                 animation: countriesDropdownOpen ? `slideDown 0.3s ease-in-out ${index * 0.03}s both` : 'none'
                             }}
                            >
                             {country.name}
                            </Link>
                         ))
                        )}
                    </div>
                 </div>
                </div>
             )
            }

            return (
             <Link
                key={val.name}
                href={val.path}
                className={`hover:text-[#06665f] transition-all duration-500 ease-in-out ${
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
             className="cursor-pointer hover:text-[#06665f] transition-all duration-500 ease-in-out flex items-center gap-1"
            >
             Login
             <svg
                className={`w-4 h-4 transition-all duration-500 ease-in-out ${loginDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
             >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
             </svg>
            </button>

            <div 
             className={`absolute flex flex-col bg-white/95 backdrop-blur-sm shadow-lg rounded-md mt-6 w-40 text-sm z-50 -right-8 overflow-hidden transition-all duration-500 ease-in-out origin-top ${
                 loginDropdownOpen 
                 ? 'opacity-100 scale-y-100 visible' 
                 : 'opacity-0 scale-y-0 invisible'
             }`}
            >
             <Link
                 href="/university"
                 className="px-4 py-3 hover:bg-gray-100 transition-all duration-300"
                 onClick={closeAllDropdowns}
                 style={{
                     animation: loginDropdownOpen ? `slideDown 0.3s ease-in-out 0.05s both` : 'none'
                 }}
                >
                 For Universities
                </Link>
                <button
                 onClick={() => {
                    closeAllDropdowns()
                    handlePartnerLogin()
                 }}
                 className="px-4 py-3 hover:bg-gray-100 transition-all duration-300 text-left w-full"
                 style={{
                     animation: loginDropdownOpen ? `slideDown 0.3s ease-in-out 0.1s both` : 'none'
                 }}
                >
                 For Partners
                </button>
            </div>
         </div>
        </div>
       </div>

        <div className="md:hidden flex items-center">
         <button
            onClick={() => {
             setMobileMenuOpen(!mobileMenuOpen)
             closeAllDropdowns()
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-500"
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

     <div 
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
     >
        <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500 ${
                mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`} 
            onClick={() => setMobileMenuOpen(false)}
        ></div>

        <div 
            className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl flex flex-col p-6 overflow-y-auto transition-all duration-500 ease-in-out transform ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="flex flex-col gap-4">
             {navitem.map((val) => (
                <Link
                 key={val.name}
                 href={val.path}
                 className={`text-lg font-semibold border-b border-gray-100 pb-2 hover:text-[#06665f] transition-all duration-300 ${
                     isActiveNavItem(val.path) ? 'text-[#06665f]' : ''
                 }`}
                 onClick={() => setMobileMenuOpen(false)}
                >
                 {val.name}
                </Link>
             ))}

             <div className="border-b border-gray-100 pb-2">
                <div className="text-lg font-semibold text-gray-600 mb-2">Login As</div>
                <div className="flex flex-col gap-2">
                 <Link
                    href="/university"
                    className="text-sm py-2 px-3 rounded hover:bg-gray-100 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                 >
                    For Universities
                 </Link>
                 <button
                    onClick={() => {
                     setMobileMenuOpen(false)
                     handlePartnerLogin()
                    }}
                    className="text-sm py-2 px-3 rounded hover:bg-gray-100 transition-all duration-300 text-left"
                 >
                    For Partners
                 </button>
                </div>
             </div>

             <div className="border-b border-gray-100 pb-2">
                <div className="text-lg font-semibold text-gray-600 mb-2">Popular Countries</div>

                <div className="grid grid-cols-2 gap-2">
                 {countries.slice(0, 8).map((country) => (
                    <Link
                     key={country.id}
                     href={`/countries/${country.id}`}
                     className="text-sm py-1 px-2 rounded hover:bg-gray-100 transition-all duration-300"
                     onClick={() => setMobileMenuOpen(false)}
                    >
                     {country.name}
                    </Link>
                 ))}
                </div>

                <Link
                 href="/countries"
                 className="text-sm text-[#04413D] font-medium mt-2 inline-block hover:underline transition-all duration-300"
                 onClick={() => setMobileMenuOpen(false)}
                >
                 View All Countries →
                </Link>
             </div>
            </div>
        </div>
     </div>

     <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .origin-top {
          transform-origin: top center;
        }
     `}</style>
    </header>
)
}