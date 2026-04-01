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

  useEffect(() => {
    const getMissionVision = async () => {
      try {
        const data = await fetchData("vision-mission");
        setMissionVision(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching mission and vision data:", error);
        setLoading(false);
      }
    };

    getMissionVision();
  }, []);

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
    <section className="py-24 overflow-hidden w-full bg-gray-100 flex mx-auto h-full navtext">
      <motion.div
        className="max-w-7xl mx-auto px-6 space-y-32"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {missionVision.map((item, index) => {
          const imageUrl = item.imageid?.imageUrl || "";
          
          return (
            <div
              key={item.id}
              className={`flex flex-col items-center gap-12 lg:gap-20 w-11/12 mx-auto ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <motion.div className="flex-1 relative group w-full" variants={itemVariants}>
                <div 
                  className={`absolute -inset-4 bg-[#04413D]/10 rounded-3xl transition-transform group-hover:rotate-1 ${
                    index % 2 === 0 ? "rotate-3" : "-rotate-3"
                  }`} 
                />
                <div className="relative h-[50vh] w-full bg-[#04413D]/20 rounded-2xl overflow-hidden shadow-2xl cursor-pointer">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={item.title} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <p className="text-gray-600">Image Not Found</p>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div className="flex-1 space-y-6" variants={itemVariants}>
                <div className="inline-block px-4 py-1 rounded-full bg-[#FDC653]/30 text-[#04413D] text-sm font-bold uppercase tracking-widest">
                  {item.title}
                </div>
                <h2 className="text-2xl lg:text-4xl font-bold text-[#04413D] leading-tight">
                  {item.subTitle}
                </h2>
                <p className="text-md text-slate-600 leading-relaxed text-justify">
                  {item.description}
                </p>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}