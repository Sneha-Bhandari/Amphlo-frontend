'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function UniversityBanner() {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversityBanner = async () => {
      try {
        setLoading(true);
        const data = await fetchData("university-banner");
        console.log("University Banner API Response:", data);
        
        if (data && data.length > 0) {
          setBannerData(data[0]);
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
          setBannerData(data);
        } else {
          setBannerData(null);
        }
      } catch (error) {
        console.error("Error fetching university banner:", error);
        setBannerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityBanner();
  }, []);

  if (loading) {
    return (
      <div className="relative md:h-[60vh] h-[90vh] md:top-18 top-4 w-full bg-[#04413D]/30 flex items-center justify-center overflow-hidden">
        <Loading />
      </div>
    );
  }

  // Don't render if no data exists
  if (!bannerData || (!bannerData.title && !bannerData.description)) {
    return null;
  }

  return (
    <div className="relative md:h-[60vh] h-[90vh] md:top-18 top-4 w-full bg-[#04413D]/30 flex items-center justify-center overflow-hidden">
     
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          {bannerData.title}
        </h1>
        
        <div 
          className="text-md md:text-xl text-gray-100 mb-10 font-light leading-relaxed"
          dangerouslySetInnerHTML={{ __html: bannerData.description }}
        />
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/apply"
            className="cursor-pointer w-full sm:w-auto px-10 py-4 bg-[#04413D] hover:bg-[#04413D]/60 text-white font-bold rounded-md transition-colors shadow-lg text-center"
          >
            Apply Now
          </Link>
          
          <Link 
            href="/about"
            className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-[#04413D] transition-all text-center"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}