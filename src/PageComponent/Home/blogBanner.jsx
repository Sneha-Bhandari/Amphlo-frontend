"use client";

import Image from "next/image";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function BlogBanner() {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlogData = async () => {
      try {
        const data = await fetchData("banner");
        const blogBanner = data.find(item => item.path === "blogs");
        setBlogData(blogBanner || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog banner data:", error);
        setLoading(false);
      }
    };

    getBlogData();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-gray-100">
        <p className="text-[#04413D] text-xl">No blog banner data available</p>
      </div>
    );
  }

  const imageUrl = blogData.imageid?.imageUrl || "";

  return (
    <div className="h-[70vh] relative">
      {imageUrl ? (
        <Image
          className="h-full w-full object-cover"
          src={imageUrl}
          alt={blogData.title || "Blog banner"}
          fill
          priority
          unoptimized
        />
      ) : (
        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-600">Image Not Found</p>
        </div>
      )}
      <div className="absolute bg-[#04413D]/20 inset-0"></div>
      <div className="absolute flex flex-col mx-auto top-1/2 left-12 inset-0 gap-2 text-white navtext">
        <h1 className="text-5xl font-semibold tracking-tight">
          {blogData.title || "Blog Page"}
        </h1>
        <p className="text-xl">{blogData.subTitle || "Welcome to our blog"}</p>
      </div>
      <div className="absolute bottom-0 w-full h-8 flex gap-2 items-center justify-start bg-[#04413D]/50 text-white px-14 py-1">
        <h1 className="text-xl"><IoArrowBackCircleSharp /></h1>
        <button className="text-white font-medium hover:underline hover:underline-offset-2 cursor-pointer">
          <Link href="/"> Home </Link>
        </button>
        <h1>/</h1>
        <h1 className="font-medium text-white underline underline-offset-3">
          {blogData.path === "blogs" ? "Blogs" : blogData.title || "Blogs"}
        </h1>
      </div>
    </div>
  );
}