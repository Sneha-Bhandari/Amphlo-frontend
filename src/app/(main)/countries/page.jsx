"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { LayoutGrid, List, Search, MapPin, GraduationCap } from 'lucide-react'

const countries = [
  { 
    id: 'usa', 
    name: 'United States', 
    description: 'The United States offers diverse educational opportunities with over 4,000 universities and colleges. Known for academic excellence, research opportunities, and cultural diversity.',
    image: '/consult.jpg',
    states: ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia'],
    categories: ['Most Popular'],
    universities: [
      { name: 'Harvard University', location: 'Massachusetts', ranking: 'Ivy League' },
      { name: 'Stanford University', location: 'California', ranking: 'Top 10' },
      { name: 'MIT', location: 'Massachusetts', ranking: 'Ivy League' }
    ]
  },
  { 
    id: 'uk', 
    name: 'United Kingdom', 
    description: 'The UK is home to some of the world\'s oldest and most prestigious universities, including Oxford and Cambridge. Offers quality education with a rich cultural experience.',
    image: '/consult.jpg',
    states: ['England', 'Scotland', 'Wales', 'Northern Ireland', 'London', 'Manchester', 'Birmingham', 'Liverpool'],
    categories: ['Top Ranked'],
    universities: [
      { name: 'University of Oxford', location: 'England', ranking: 'Russell Group' },
      { name: 'University of Cambridge', location: 'England', ranking: 'Russell Group' },
      { name: 'Imperial College London', location: 'London', ranking: 'Russell Group' }
    ]
  },
  { 
    id: 'canada', 
    name: 'Canada', 
    description: 'Canada is known for its high-quality education, multicultural society, and stunning natural landscapes. Offers excellent post-study work opportunities.',
    image: '/consult.jpg',
    states: ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick'],
    categories: ['Most Popular'],
    universities: [
      { name: 'University of Toronto', location: 'Ontario', ranking: 'U15' },
      { name: 'University of British Columbia', location: 'British Columbia', ranking: 'U15' },
      { name: 'McGill University', location: 'Quebec', ranking: 'U15' }
    ]
  },
  { 
    id: 'australia', 
    name: 'Australia', 
    description: 'Australia offers world-class education with a relaxed lifestyle and beautiful beaches. Known for research excellence and innovative teaching methods.',
    image: '/consult.jpg',
    states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Canberra', 'Northern Territory'],
    categories: ['Top Ranked'],
    universities: [
      { name: 'University of Melbourne', location: 'Victoria', ranking: 'Group of Eight' },
      { name: 'University of Sydney', location: 'New South Wales', ranking: 'Group of Eight' },
      { name: 'Australian National University', location: 'Canberra', ranking: 'Group of Eight' }
    ]
  },
  { 
    id: 'germany', 
    name: 'Germany', 
    description: 'Germany is renowned for its engineering and technical education, with low or no tuition fees at public universities. Strong focus on research.',
    image: '/consult.jpg',
    states: ['Bavaria', 'Baden-Württemberg', 'North Rhine-Westphalia', 'Berlin', 'Hamburg', 'Hesse', 'Saxony', 'Lower Saxony'],
    categories: ['Most Popular'],
    universities: [
      { name: 'Technical University of Munich', location: 'Bavaria', ranking: 'TU9' },
      { name: 'Ludwig Maximilian University', location: 'Bavaria', ranking: 'U15' },
      { name: 'Heidelberg University', location: 'Baden-Württemberg', ranking: 'U15' }
    ]
  },
  { 
    id: 'france', 
    name: 'France', 
    description: 'France offers excellence in arts, fashion, business, and engineering. Known for prestigious Grandes Écoles and rich cultural experiences.',
    image: '/consult.jpg',
    states: ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France', 'Provence', 'Brittany', 'Normandy'],
    categories: ['Top Ranked'],
    universities: [
      { name: 'Sorbonne University', location: 'Île-de-France', ranking: 'Grande École' },
      { name: 'École Polytechnique', location: 'Île-de-France', ranking: 'Grande École' },
      { name: 'HEC Paris', location: 'Île-de-France', ranking: 'Grande École' }
    ]
  },
  { 
    id: 'japan', 
    name: 'Japan', 
    description: 'Japan combines cutting-edge technology with deep cultural traditions. Offers world-class education in engineering, robotics, and business.',
    image: '/consult.jpg',
    states: ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Fukuoka', 'Aichi', 'Hiroshima', 'Okinawa'],
    categories: ['Most Popular'],
    universities: [
      { name: 'University of Tokyo', location: 'Tokyo', ranking: 'National Seven' },
      { name: 'Kyoto University', location: 'Kyoto', ranking: 'National Seven' },
      { name: 'Osaka University', location: 'Osaka', ranking: 'National Seven' }
    ]
  },
  { 
    id: 'new-zealand', 
    name: 'New Zealand', 
    description: 'New Zealand offers high-quality education in a safe, picturesque environment. Known for research-intensive universities.',
    image: '/consult.jpg',
    states: ['Auckland', 'Wellington', 'Canterbury', 'Waikato', 'Otago', 'Bay of Plenty', 'Northland', 'Southland'],
    categories: ['Top Ranked'],
    universities: [
      { name: 'University of Auckland', location: 'Auckland', ranking: 'Group of Eight' },
      { name: 'University of Otago', location: 'Otago', ranking: 'Group of Eight' },
      { name: 'University of Canterbury', location: 'Canterbury', ranking: 'Group of Eight' }
    ]
  },
  { 
    id: 'uae', 
    name: 'United Arab Emirates', 
    description: 'The UAE is a rapidly growing education hub with world-class facilities and international branch campuses. Offers unique opportunities.',
    image: '/consult.jpg',
    states: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'],
    categories: ['Most Popular'],
    universities: [
      { name: 'NYU Abu Dhabi', location: 'Abu Dhabi', ranking: 'Top International' },
      { name: 'UAE University', location: 'Al Ain', ranking: 'National' },
      { name: 'American University of Sharjah', location: 'Sharjah', ranking: 'Top Regional' }
    ]
  },
  { 
    id: 'india', 
    name: 'India', 
    description: 'India combines ancient educational traditions with modern institutions like IITs and IIMs. Offers affordable education and diverse cultures.',
    image: '/consult.jpg',
    states: ['Maharashtra', 'Uttar Pradesh', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Rajasthan', 'West Bengal', 'Delhi'],
    categories: ['Top Ranked'],
    universities: [
      { name: 'IIT Bombay', location: 'Maharashtra', ranking: 'IIT' },
      { name: 'IIT Delhi', location: 'Delhi', ranking: 'IIT' },
      { name: 'IIM Ahmedabad', location: 'Gujarat', ranking: 'IIM' }
    ]
  },
  { 
    id: 'brazil', 
    name: 'Brazil', 
    description: 'Brazil offers vibrant cultural experiences alongside growing educational opportunities. Known for research in environmental sciences.',
    image: '/consult.jpg',
    states: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Rio Grande do Sul', 'Paraná', 'Pernambuco', 'Amazonas'],
    categories: ['Most Popular', 'Top Ranked'],
    universities: [
      { name: 'University of São Paulo', location: 'São Paulo', ranking: 'Top Brazilian' },
      { name: 'University of Campinas', location: 'São Paulo', ranking: 'Top Brazilian' },
      { name: 'Federal University of Rio de Janeiro', location: 'Rio de Janeiro', ranking: 'Federal' }
    ]
  },
]

const allCategories = ['All', 'Most Popular', 'Top Ranked', ...new Set(countries.flatMap(country => country.categories).filter(cat => cat !== 'Most Popular' && cat !== 'Top Ranked'))]

export default function CountriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid')

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          country.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || country.categories.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      selectedCategory === category
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
              className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#04413D]/30 ${
                viewMode === 'list' ? 'flex flex-col md:flex-row min-h-[40vh]' : 'flex flex-col'
              }`}
            >
              <div className={`relative overflow-hidden ${
                viewMode === 'list' ? 'h-56 md:h-auto md:w-[35vh] shrink-0' : 'h-56 w-full'
              }`}>
                <Image
                  src={country.image}
                  alt={country.name}
                  fill
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
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap size={14} className="text-[#04413D]" />
                      <span className="text-xs font-semibold text-gray-500">TOP UNIVERSITIES</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {country.universities.slice(0, 3).map((uni, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-[#FDC653]/20 rounded-md text-gray-600">
                          {uni.name}
                        </span>
                      ))}
                      {country.universities.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-[#04413D]/10 rounded-md text-[#04413D] font-medium">
                          +{country.universities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 gap-1.5">
                    <MapPin size={14} className="text-[#04413D]" />
                    <span className="text-xs font-semibold">{country.states.length} Major Regions</span>
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
              onClick={() => {setSearchTerm(''); setSelectedCategory('All')}}
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