"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function OurCoreStrength() {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const [coreStrengthData, setCoreStrengthData] = useState(null);
  const [topSectionData, setTopSectionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [coreStrengthResponse, topSectionResponse] = await Promise.all([
          fetchData("core-strengths"),
          fetchData(`top-section/CoreStrength`) 
        ]);
        
        console.log("Core Strength Response:", coreStrengthResponse);
        console.log("Top Section Response:", topSectionResponse);
        
        if (Array.isArray(coreStrengthResponse) && coreStrengthResponse.length > 0) {
          setCoreStrengthData(coreStrengthResponse[0]);
        } else if (coreStrengthResponse && typeof coreStrengthResponse === 'object') {
          setCoreStrengthData(coreStrengthResponse);
        } else {
          setCoreStrengthData(null);
        }
        setTopSectionData(topSectionResponse || null);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setCoreStrengthData(null);
        setTopSectionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!coreStrengthData || !coreStrengthData.stats || coreStrengthData.stats.length === 0) {
    return null;
  }

  if (!topSectionData) {
    return null;
  }

  const transformStats = () => {
    if (coreStrengthData?.stats && Array.isArray(coreStrengthData.stats)) {
      return coreStrengthData.stats.map(stat => {
        const numericValue = parseInt(stat.count);
        return {
          label: stat.label,
          value: isNaN(numericValue) ? 0 : numericValue,
          suffix: stat.count.includes('+') ? '+' : ''
        };
      });
    }
    return [];
  };

  const stats = transformStats();
  const imageUrl = coreStrengthData?.imageid?.imageUrl || "";

  if (stats.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="w-full py-16 bg-white overflow-hidden">
      <div className="max-w-11/12 mx-auto ">
        {/* Title and Description */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#04413D] mb-4">
            {topSectionData.title}
          </h2>
          <div 
            className="text-gray-600 max-w-2xl"
            dangerouslySetInnerHTML={{ __html: topSectionData.description }} 
          />
        </div>

        {/* Left: Stats Grid | Right: Image */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl p-6 shadow-lg shadow-[#f2e7cd] cursor-pointer hover:scale-105 transition-all ease-in-out duration-500 bg-white"
              >
                <div className="text-2xl sm:text-3xl font-bold text-[#04413D]">
                  {inView && (
                    <CountUp
                      key={inView}
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      suffix={stat.suffix}
                      separator=","
                    />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
            className="relative h-[40vh] md:h-[60vh] w-full rounded-xl overflow-hidden shadow-lg shadow-[#04413D]/40"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={"Core strength illustration"}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                <p className="text-gray-600">Image Not Found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}