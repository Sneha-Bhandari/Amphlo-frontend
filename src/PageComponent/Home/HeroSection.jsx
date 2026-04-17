"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function HeroSection() {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    const getHeroData = async () => {
      try {
        const data = await fetchData("hero-section");
        setHeroData(data[0]); 
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };

    getHeroData();
  }, []);

  if (!heroData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading/>
      </div>
    );
  }

  const imageurl = heroData.imageid?.imageUrl || ""




  return (
    <section className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden">

      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {heroData?.imageid?.imageUrl ? (
          <Image
            src={imageurl}
            alt="Hero background"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
            <p className="text-gray-600">Image Not Found</p>
          </div>
        )}
      </motion.div>

      <div className="absolute inset-0 bg-[#04413D]/70" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-6xl top-16"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          {heroData.title || "Empowering Education Consultants Worldwide"}
        </h1>

        <p className="mt-6 text-sm md:text-lg text-gray-200 max-w-3xl mx-auto">
          {heroData.subTitle ||
            "Amphlo helps partner consultancies place students in leading universities across the globe with seamless support."}
        </p>

        <div className="mt-10 flex gap-4 justify-center items-center">
          <button className="px-8 py-3 border-2 border-[#4b7e7c] hover:bg-[#58a59f] hover:border-[#58a59f] rounded-lg font-medium transition-all duration-500 shadow-lg hover:scale-105 cursor-pointer">
            Get Started
          </button>

          <button className="px-8 py-3 border-2 border-[#2d5150] hover:bg-white hover:text-black rounded-lg font-medium transition-all duration-500 shadow-lg hover:scale-105 cursor-pointer">
            Learn More
          </button>
        </div>
      </motion.div>

    </section>
  );
}