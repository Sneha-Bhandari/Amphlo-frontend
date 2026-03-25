"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/page";
import background from "../../../public/footer-bg.png";

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
        } else {
          setTouchData(data);
        }
      } catch (error) {
        console.error("Error fetching get in touch data:", error);
      } finally {
        setLoading(false);
      }
    };

    getTouchData();
  }, []);

  const title = touchData?.title || "Get In Touch With Us";
  const description = touchData?.description || "If you have any business-related questions, or concerns, please send us a message and a member of our team will get in touch with you.";
  
  const imageUrl = touchData?.imageid?.imageUrl || null;

  console.log("Image URL:", imageUrl);
  console.log("Full Data:", touchData);

  if (loading) {
    return (
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="text-[#04413D]">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden bg-white navtext">
     
      {imageUrl && !imageError ? (
        <Image
          src={imageUrl}
          alt="Global Reach"
          fill
          priority
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
        <h2 className="text-4xl md:text-5xl font-bold text-[#04413D]">
          {title} <span className="text-white"></span>
        </h2>
        <p className="text-[#245e5a] w-11/12">{description}</p>
        
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