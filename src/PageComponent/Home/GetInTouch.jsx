"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import background from "../../../public/footer-bg.png";
import Loading from "@/Global/Loading";

export default function GetInTouch() {
  const [touchData, setTouchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const getTouchData = async () => {
      try {
        const data = await fetchData("get-in-touch");
        console.log("Get In Touch API Response:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setTouchData(data[0]);
        } else if (data && typeof data === 'object') {
          setTouchData(data);
        } else {
          setTouchData(null);
        }
      } catch (error) {
        console.error("Error fetching get in touch data:", error);
        setTouchData(null);
      } finally {
        setLoading(false);
      }
    };

    getTouchData();
  }, []);

  // No default values - only show if data exists
  const title = touchData?.title;
  const description = touchData?.description;
  const imageUrl = touchData?.imageid?.imageUrl;

  console.log("Image URL:", imageUrl);
  console.log("Full Data:", touchData);

  if (loading) {
    return (
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="text-[#04413D]">Loading...</div>
      </section>
    );
  }

  // Don't render section if no data exists
  if (!touchData || (!title && !description && !imageUrl)) {
    return (
    <Loading/>
    )
  }

  return (
    <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden bg-white navtext">
     
      {imageUrl && !imageError ? (
        <Image
          src={imageUrl}
          alt="Global Reach"
          fill
          // priority
          unoptimized
          className="object-cover"
          onError={() => {
            console.error("Image failed to load:", imageUrl);
            setImageError(true);
          }}
        />
      ) : (
        <Image
          src={background}
          alt="Global Reach"
          fill
          priority
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-[#04413D]/30" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 gap-6 navtext">
        {title && (
          <h2 className="text-4xl md:text-5xl font-bold text-[#04413D]">
            {title}
          </h2>
        )}
        
        {description && (
          // <p className="text-[#245e5a] w-11/12">{description}</p>
          <p className="text-[#245e5a] w-11/12" dangerouslySetInnerHTML={{ __html: description }} />

        )}
        
        <Link 
          href="/enquiry"
          className="px-6 py-3 border-white border text-[#04413D] hover:border-[#7c9c9a] rounded-xl hover:bg-[#065c57] hover:text-white transition-all duration-500 shadow-xl hover:scale-105 active:scale-95"
        >
          CONNECT WITH US
        </Link>
      </div>
    </section>
  );
}