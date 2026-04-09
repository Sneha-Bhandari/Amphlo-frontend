"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function AboutBusiness() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAboutData = async () => {
      try {
        const data = await fetchData("about-business");
        console.log("About Business API Response:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setAboutData(data[0]);
        } else if (data && !Array.isArray(data)) {
          setAboutData(data);
        }
      } catch (error) {
        console.error("Error fetching about business data:", error);
      } finally {
        setLoading(false);
      }
    };

    getAboutData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#04413D] text-xl">No data available</p>
      </div>
    );
  }

  const title = aboutData.title;
  const description = aboutData.description;
  const imageUrl = aboutData.imageid?.imageUrl || null;

  const cleanDescription = description?.replace(/^<p>(.*)<\/p>$/, '$1') || description;

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-8 overflow-hidden bg-linear-to-br from-[#04413D]/20 to-[#0a5c56]">
      <div className="relative z-10 w-11/12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center gap-10 backdrop-blur-sm rounded-3xl p-8 md:p-12"
        >
          <div className="w-full lg:w-1/2 relative h-[60vh] md:h-[60vh]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                priority
                className="object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/20 rounded-2xl">
                <p className="text-white/70">No Image Available</p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {title}
            </h2>
            
            <div className="text-gray-200 leading-relaxed text-md">
              {/* Show complete description from CMS */}
              <div 
                className="whitespace-normal"
                dangerouslySetInnerHTML={{ __html: cleanDescription }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}