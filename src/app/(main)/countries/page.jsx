"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { LayoutGrid, List, Search, MapPin, GraduationCap } from 'lucide-react'
import { fetchData } from "@/lib/frontendApi";

const allCategories = ['All', 'Most Popular', 'Top Ranked']
export default function CountriesPage() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    const getCountries = async () => {
      try {
        const res = await fetchData('/countries')

        const formatted = res?.data?.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description?.replace(/<[^>]+>/g, ""),
          image: item.imageid?.imageUrl || '/consult.jpg',
          states: item.stateCount,
          categories: ['Most Popular'],
          universities: item.universityCount
        }))

        setCountries(formatted || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getCountries()
  }, [])

  const filteredCountries = countries.filter(country => {
    const matchesSearch =
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' ||
      country.categories.includes(selectedCategory)

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading countries...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#04413D]/10 py-28">
      <div className="container mx-auto px-4 w-11/12 navtext">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#04413D]">Countries We Serve</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore top study destinations worldwide. From Ivy Leagues to innovative tech hubs, find the perfect place for your academic journey.
          </p>
        </div>

        <div className="p-6 rounded-2xl shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">

            <div className="relative w-full lg:max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#95ceca] focus:outline-none focus:ring-2 focus:ring-[#04413D]/20 focus:border-[#04413D] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${selectedCategory === category
                        ? 'bg-[#FDC653]/20 text-[#04413D] shadow-sm'
                        : 'text-gray-500 hover:text-[#04413D]'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="h-10 w-[1vh] bg-gray-200 hidden md:block" />

              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#04413D] shadow-sm' : 'text-gray-400'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#04413D] shadow-sm' : 'text-gray-400'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between px-2">
          <span className="text-gray-500 font-medium">
            Showing {filteredCountries.length} results
          </span>
        </div>

        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            : "flex flex-col gap-6"
        }>
          {filteredCountries.map((country) => (
            <Link
              href={`/countries/${country.id}`}
              key={country.id}
              className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#04413D]/30 ${viewMode === 'list' ? 'flex flex-col md:flex-row min-h-[40vh]' : 'flex flex-col'
                }`}
            >
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'h-56 md:h-auto md:w-[35vh] shrink-0' : 'h-56 w-full'
                }`}>
                <Image
                  src={country.image}
                  alt={country.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#04413D]/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-2xl font-bold text-white drop-shadow-md">
                    {country.name}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2 top-4 left-4 absolute">
                  {country.categories.map((cat, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FDC653]/30 text-white font-bold">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between ">
                <div>
                  <p className={`text-gray-600 leading-relaxed mb-4 ${viewMode === 'list' ? 'line-clamp-3 text-base' : 'line-clamp-2 text-sm'}`}>
                    {country.description}
                  </p>

                  <div className="mb-4 flex gap-8 items-center">
                    <div className="flex items-center gap-2 ">
                      <GraduationCap size={14} className="text-[#04413D]" />
                      <span className="text-xs font-semibold text-gray-500">TOP UNIVERSITIES</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {country.universities}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 gap-1.5">
                    <MapPin size={14} className="text-[#04413D]" />
                    <span className="text-xs font-semibold">{country.states} Major Regions</span>
                  </div>
                  <span className="text-[#04413D] text-sm font-bold group-hover:translate-x-1 transition-transform">
                    Explore Destinations →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-xl font-medium">No countries match your selection.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All') }}
              className="mt-4 text-[#04413D] font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}