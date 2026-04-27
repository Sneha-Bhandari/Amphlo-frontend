"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  List,
  Search,
  MapPin,
  GraduationCap,
  Globe,
} from "lucide-react";
import { fetchData } from "@/lib/frontendApi";

export default function CountriesPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [availableCategories, setAvailableCategories] = useState(["All"]);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const res = await fetchData("/countries/");

        // Get the actual data from response
        const countriesData = res?.data || (Array.isArray(res) ? res : []);

        // Format countries with actual category from API
        const formatted = countriesData.map((item) => {
          // Get category from API response or set to null
          const category = item.category || null;

          return {
            id: item.id,
            name: item.name,
            description:
              item.description?.replace(/<[^>]+>/g, "").substring(0, 200) +
              "...",
            image: item.imageid?.imageUrl || "/consult.jpg",
            states: item.stateCount || 0,
            category: category,
            universities: item.universityCount || 0,
          };
        });

        setCountries(formatted);

        // Extract unique categories from actual data (filter out nulls)
        const uniqueCategories = [
          "All",
          ...new Set(
            formatted.map((c) => c.category).filter((cat) => cat && cat !== "")
          ),
        ];
        setAvailableCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    getCountries();
  }, []);

  // Filter countries based on search and category
  const filteredCountries = countries.filter((country) => {
    const matchesSearch =
      country.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || country.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#04413D]/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04413D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04413D]/10 py-28">
      <div className="container mx-auto px-4 w-11/12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#04413D]">
            Countries We Serve
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore top study destinations worldwide. From Ivy Leagues to
            innovative tech hubs, find the perfect place for your academic
            journey.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="rounded-2xl shadow-sm p-6 mb-4 bg-white">
          <div className="flex  mx-auto  gap-6 items-center  ">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-xl">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search countries by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#04413D]/20 focus:border-[#04413D] transition-all"
              />
            </div>
            <div className="flex  gap-4 w-full lg:w-auto">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 p-1 rounded-xl">
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      selectedCategory === category
                        ? "bg-[#04413D] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            {/* View Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-[#04413D] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-[#04413D] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between px-2">
          <span className="text-gray-600 font-medium">
            Found{" "}
            <span className="text-[#04413D] font-bold">
              {filteredCountries.length}
            </span>{" "}
            countries
          </span>
        </div>

        {/* Countries Grid/List View */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              : "flex flex-col gap-6"
          }
        >
          {filteredCountries.map((country) => (
            <Link
              href={`/countries/${country.id}`}
              key={country.id}
              className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#04413D]/30 ${
                viewMode === "list"
                  ? "flex flex-col md:flex-row"
                  : "flex flex-col"
              }`}
            >
              {/* Image Section */}
              <div
                className={`relative overflow-hidden ${
                  viewMode === "list"
                    ? "h-56 md:h-auto md:w-[35vh] shrink-0"
                    : "h-56 w-full"
                }`}
              >
                <Image
                  src={country.image}
                  alt={country.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#04413D]/80 via-transparent to-transparent opacity-60" />

                {/* Country Name Overlay */}
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-2xl font-bold text-white drop-shadow-md">
                    {country.name}
                  </h2>
                </div>

                {/* Category Badge */}
                {country.category && (
                  <div className="absolute top-4 left-4">
                    <span className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FDC653]/50 text-[#04413D] font-bold">
                      {country.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <p
                    className={`text-gray-600 leading-relaxed mb-4 ${
                      viewMode === "list"
                        ? "line-clamp-3 text-base"
                        : "line-clamp-2 text-sm"
                    }`}
                  >
                    {country.description ||
                      "Discover amazing educational opportunities in this country."}
                  </p>

                  {/* Stats Section */}
                  <div className="mb-4 flex flex-wrap gap-6 items-center">
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-[#04413D]" />
                      <span className="text-xs font-semibold text-gray-500">
                        {country.states} States/Regions
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-[#04413D]" />
                      <span className="text-xs font-semibold text-gray-500">
                        {country.universities}+ Universities
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 gap-1.5">
                    <MapPin size={14} className="text-[#04413D]" />
                    <span className="text-xs font-semibold">
                      Study Destination
                    </span>
                  </div>
                  <span className="text-[#04413D] text-sm font-bold group-hover:translate-x-1 transition-transform">
                    Explore Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results State */}
        {filteredCountries.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-xl font-medium">
              No countries match your selection.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-6 py-2 bg-[#04413D] text-white rounded-lg hover:opacity-90 transition-all"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
