"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function BlogList() {
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearch, setTempSearch] = useState(""); // For input value

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await fetchData("blogsection");
        // Handle both array and object responses
        if (Array.isArray(data)) {
          setAllBlogs(data);
        } else if (data && typeof data === 'object') {
          setAllBlogs([data]);
        } else {
          setAllBlogs([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Get unique categories from blogs
  const categories = ["All", ...new Set(allBlogs.map(blog => blog.category).filter(Boolean))];

  // Filter blogs based on category and search
  const filteredBlogs = allBlogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.postedby?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setTempSearch("");
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get("search") || "";
    setSearchQuery(search);
  };

  // Handle search input change (real-time search)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTempSearch(value);
    setSearchQuery(value); // Update search query in real-time
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setTempSearch("");
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setTempSearch("");
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-11/12 mx-auto py-16">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#04413D] text-white rounded-lg hover:bg-[#03312e] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (allBlogs.length === 0) {
    return (
      <section className="w-11/12 mx-auto py-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No blogs available</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="w-11/12 mx-auto py-8">
          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#04413D]/10 text-[#04413D] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#04413D]/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#04413D]" />
              Latest Articles
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-800"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              College Blogs
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
              Explore inspiring stories, campus activities, academic insights, and
              achievements from our students and faculty.
            </p>
          </div>

          {/* Filter Row */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Categories */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#04413D] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-[#04413D] hover:text-white"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-72">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  name="search"
                  placeholder="Search blogs..."
                  value={tempSearch}
                  onChange={handleSearchChange}
                  className="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-11 pr-10 text-sm focus:border-[#04413D] focus:ring-2 focus:ring-[#04413D]/20 outline-none transition"
                />

                <svg
                  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-5.2-5.2M10.8 18a7.2 7.2 0 100-14.4 7.2 7.2 0 000 14.4z"
                  />
                </svg>

                {tempSearch && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                {!tempSearch && (
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#04413D] hover:text-[#03312e]"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-5.2-5.2M10.8 18a7.2 7.2 0 100-14.4 7.2 7.2 0 000 14.4z"
                      />
                    </svg>
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-sm text-gray-500">
            Showing <span className="font-semibold">{filteredBlogs.length}</span>{" "}
            blog{filteredBlogs.length !== 1 && "s"}
            {selectedCategory !== "All" && (
              <> in <span className="font-medium text-[#04413D]">{selectedCategory}</span></>
            )}
            {searchQuery && (
              <> matching "<span className="font-medium text-[#04413D]">{searchQuery}</span>"
              <button 
                onClick={clearSearch}
                className="ml-2 text-red-500 hover:text-red-700 text-xs underline"
              >
                Clear
              </button>
              </>
            )}
            {(selectedCategory !== "All" || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="ml-4 text-[#04413D] hover:text-[#03312e] text-xs font-medium underline"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="w-11/12 mx-auto py-12 px-4">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No blogs match your filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-6 py-2 bg-[#04413D] text-white rounded-full hover:bg-[#03312e] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 w-full bg-gray-200 overflow-hidden">
                  {blog.imageid?.imageUrl ? (
                    <Image
                      src={blog.imageid.imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {blog.category && (
                    <button
                      onClick={() => handleCategoryFilter(blog.category)}
                      className="absolute top-3 right-3 bg-[#04413D] text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#03312e] transition-colors cursor-pointer"
                    >
                      {blog.category}
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-gray-600">{blog.postedby || "Admin"}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {blog.date || new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#04413D] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1"
                 dangerouslySetInnerHTML={{__html: blog.description || ""}} />

                  <Link
                    href={`/blog/${blog.id}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-[#04413D] hover:text-[#03312e] transition-colors self-start"
                  >
                    Read More
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}