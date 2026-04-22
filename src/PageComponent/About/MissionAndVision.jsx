"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function MissionAndVision() {
  const [missionVision, setMissionVision] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const getMissionVision = async () => {
      try {
        const data = await fetchData("vision-mission");
        console.log("Mission Vision Data:", data);
        setMissionVision(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching mission and vision data:", error);
        setLoading(false);
      }
    };

    getMissionVision();
  }, []);

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!missionVision.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#04413D] text-xl">No mission and vision data available</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-16 overflow-hidden w-full bg-gray-100 flex mx-auto h-full navtext">
     

      <motion.div
        className="max-w-6xl mx-auto px-6 space-y-32 w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
         <div className="text-center flex flex-col md:mb-16 mb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#04413D] tracking-tight mb-4">
            Our Vision and Mission 
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Passionate. Proactive. Expert.
          </p>
        </div>
        {missionVision.map((item, index) => {
          const imageUrl = item.imageid?.imageUrl || "";
          const hasError = imageErrors[item.id];
          
          return (
            <div
              key={item.id}
              className={`flex flex-col items-center gap-12 lg:gap-20 w-full mx-auto ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              <motion.div className="flex-1 relative group w-full" variants={itemVariants}>
                <div 
                  className={`absolute -inset-4 bg-[#04413D]/10 rounded-3xl transition-transform group-hover:rotate-1 ${
                    index % 2 === 0 ? "lg:rotate-3" : "lg:-rotate-3"
                  } hidden lg:block`} 
                />
                <div className="relative h-[40vh] lg:h-[50vh] w-full bg-[#04413D]/10 rounded-2xl overflow-hidden shadow-2xl">
                  {imageUrl && !hasError ? (
                    <img 
                      src={imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(item.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#04413D]/5 to-[#04413D]/20">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto text-[#04413D]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-[#04413D]/60 mt-2">No Image Available</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div className="flex-1 space-y-6 w-full" variants={itemVariants}>
                <div className="inline-block px-4 py-1 rounded-full bg-[#FDC653]/20 text-[#04413D] text-sm font-bold uppercase tracking-widest">
                  {item.title}
                </div>
                <h2 className="text-2xl lg:text-4xl font-bold text-[#04413D] leading-tight">
                  {item.subTitle}
                </h2>
                
                <div 
                  className="text-md text-slate-600 leading-relaxed text-justify prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.description }} 
                />
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}