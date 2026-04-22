"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLocationArrow } from "react-icons/fa";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function OurFeatures() {
  const [featuresData, setFeaturesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const getFeaturesData = async () => {
      try {
        setLoading(true);
        const data = await fetchData("our-features");
        console.log("Features API Response:", data);
        
        if (data && Array.isArray(data) && data.length > 0) {
          setFeaturesData(data);
        } else {
          setFeaturesData([]);
        }
      } catch (error) {
        console.error("Error fetching features data:", error);
        setFeaturesData([]);
      } finally {
        setLoading(false);
      }
    };

    getFeaturesData();
  }, []);

  const transformFeatures = () => {
    if (featuresData && Array.isArray(featuresData) && featuresData.length > 0) {
      return featuresData.map((item, idx) => ({
        id: item.id || idx, 
        title: item.title || "Untitled Feature",
        points: item.points && Array.isArray(item.points) ? item.points : []
      }));
    }
    return [];
  };

  const allFeatures = transformFeatures();

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, allFeatures.length));
  };

  const showLess = () => {
    setVisibleCount(5);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (!allFeatures.length) {
    return null;
  }

  return (
    <section className="md:py-16 py-6 h-full overflow-hidden w-full flex flex-col mx-auto bg-[#04413D]/20 navtext">
      <div className="text-center mb-24">
        <h1 className="text-5xl font-bold text-[#04413D] tracking-tight">
          Our Features
        </h1>
        <p className="text-gray-700 mt-3">
          Focus on clarity, accessibility, and professional translation to enhance engagement and comprehension
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-wrap justify-center gap-y-12">
          <AnimatePresence mode='popLayout'>
            {allFeatures.slice(0, visibleCount).map((feature, index) => (
              <motion.div
                key={feature.id || index} 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, delay: (index % 5) * 0.1 }}
                className={`
                  relative w-64 h-64 rounded-full flex flex-col items-center justify-center text-center p-5 
                  shadow-xl transition-transform hover:z-10 hover:bg-[#04413D] hover:scale-110 ease-in-out duration-500
                  -mx-4 sm:-mx-8 cursor-pointer
                  ${index % 2 === 0 
                    ? 'bg-[#04413D]/70 text-white mt-0' 
                    : 'bg-[#04413D]/70 text-white mt-12 sm:mt-20'
                  }
                `}
              >
                <h3 className="font-bold text-md mb-3 leading-tight uppercase px-1">
                  {feature.title}
                </h3>

                <ul className="space-y-2 text-start">
                  {feature.points.map((point, pIdx) => (
                    <li key={pIdx} className="text-[10px] sm:text-sm opacity-90 font-medium flex items-center gap-3">
                      <span className='text-xs text-[#FDC653]'> <FaLocationArrow /></span> {point}
                    </li>
                  ))}
                </ul>

                <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {allFeatures.length > 5 && (
          <div className="flex justify-center mt-20">
            {visibleCount < allFeatures.length ? (
              <button 
                onClick={showMore}
                className='bg-[#04413D]/70 text-[#FDC653] px-3 py-2 rounded-2xl text-md font-medium cursor-pointer hover:bg-[#04413D]/50 transition-all duration-500 ease-in-out hover:scale-105 shadow-md'
              >
                View More
              </button>
            ) : (
              <button 
                onClick={showLess}
                className='borxder-2 border-[#04413D] text-[#04413D] p-2 rounded-2xl text-md font-medium cursor-pointer hover:bg-[#04413D] hover:text-white transition-all duration-500 ease-in-out hover:scale-105 shadow-md'
              >
                View Less
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}