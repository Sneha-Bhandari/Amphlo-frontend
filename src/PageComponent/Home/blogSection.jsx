"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchData("blogsection");
        // Handle both array and object responses
        let blogArray = [];
        if (Array.isArray(data)) {
          blogArray = data;
        } else if (data && typeof data === 'object') {
          blogArray = [data];
        }
        // Get only first 3 blogs for home page
        const limitedBlogs = blogArray.slice(0, 3);
        setBlogs(limitedBlogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <section className=" mx-auto py-16 bg-gray-100">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#04413D]/10 text-[#04413D] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#04413D]/20 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#04413D]" />
          Latest Articles
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Our Blogs
        </h2>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
          Explore inspiring stories, campus activities, academic insights, and
          achievements from our students and faculty.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-11/12 mx-auto">
        {blogs.map((blog) => (
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
                <div className="absolute top-3 right-3 bg-[#04413D] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {blog.category}
                </div>
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
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 flex-1"
               dangerouslySetInnerHTML={{__html: blog.description || ""}} />

              <Link
                href="/blog"
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

      {/* View All Blogs Button */}
      {blogs.length >= 3 && (
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#04413D] text-white rounded-full hover:bg-[#03312e] transition-colors font-medium"
          >
            View All Blogs
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}