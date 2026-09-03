"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark, Heart } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id;
  
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        
        // Fetch single blog using the ID from API
        const data = await fetchData(`blogsection/${id}`);
        console.log("Fetched single blog:", data);
        
        if (data) {
          setBlog(data);
        } else {
          setError("Blog not found");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog. Please try again later.");
        setLoading(false);
      }
    };

    // Also fetch all blogs for related posts
    const fetchAllBlogs = async () => {
      try {
        const data = await fetchData("blogsection");
        let blogsArray = [];
        if (Array.isArray(data)) {
          blogsArray = data;
        } else if (data && typeof data === 'object') {
          blogsArray = [data];
        }
        setAllBlogs(blogsArray);
      } catch (err) {
        console.error("Error fetching all blogs:", err);
      }
    };

    if (id) {
      fetchBlog();
      fetchAllBlogs();
    }
  }, [id]);

  // Get related blogs
  const relatedBlogs = allBlogs
    .filter((b) => String(b.id) !== String(blog?.id))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="w-11/12 mx-auto py-16">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-500">{error || "Blog not found"}</p>
          <Link 
            href="/blog"
            className="mt-4 inline-block px-4 py-2 bg-[#04413D] text-white rounded-lg hover:bg-[#03312e] transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative min-h-[70vh] w-full overflow-hidden">
        {blog.imageid?.imageUrl ? (
          <Image
            src={blog.imageid.imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#04413D]/80 to-black/30" />
        <div className="absolute inset-0 flex items-end justify-center pb-16">
          <div className="w-11/12 mx-auto text-white">
            {blog.category && (
              <div className="inline-block bg-[#04413D]/90 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                {blog.category}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {blog.postedby || "Admin"}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {blog.date || new Date().toLocaleDateString()}
              </span>
              {blog.time && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {blog.time}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="w-11/12 mx-auto py-4 px-4 text-sm text-gray-500 bg-white">
        <div className="mb-6 flex gap-1 items-center">
          <ArrowLeft className="text-[#04413D] w-4 h-4" />
          <Link href="/blog" className="text-[#04413D] text-sm underline underline-offset-2 hover:text-[#03312e]">
            Back to blogs
          </Link>
        </div>
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-[#04413D]">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/blog" className="hover:text-[#04413D]">Blogs</Link>
          </li>
          <li>/</li>
          <li className="text-[#04413D] font-medium truncate">
            {blog.title}
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <section className="w-11/12 mx-auto py-8 px-4">
        <article className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Posted by</p>
              <p className="font-semibold text-gray-800">{blog.postedby || "Admin"}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-[#04413D]/10 transition-colors hover:text-[#04413D]">
                <Bookmark className="w-5 h-5 text-gray-500 hover:text-[#04413D]" />
              </button>
              <button className="p-2 rounded-full hover:bg-[#04413D]/10 transition-colors hover:text-[#04413D]">
                <Heart className="w-5 h-5 text-gray-500 hover:text-[#04413D]" />
              </button>
              <button className="p-2 rounded-full hover:bg-[#04413D]/10 transition-colors hover:text-[#04413D]">
                <Share2 className="w-5 h-5 text-gray-500 hover:text-[#04413D]" />
              </button>
            </div>
          </div>

          {/* Description as HTML content */}
          <div 
            className="text-gray-700 leading-relaxed text-base"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </article>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                    {rel.imageid?.imageUrl ? (
                      <Image
                        src={rel.imageid.imageUrl}
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {rel.category && (
                      <p className="text-xs text-[#04413D] font-semibold mb-1">{rel.category}</p>
                    )}
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#04413D] transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-2">{rel.date || new Date().toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}