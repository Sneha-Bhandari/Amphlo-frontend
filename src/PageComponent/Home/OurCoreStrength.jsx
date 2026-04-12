"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useTopSection } from "@/hooks/useTopSection";

export default function OurCoreStrength() {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const [coreStrengthData, setCoreStrengthData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch top section data for "Our Core Strength" page
  const { data: topSectionData, loading: topSectionLoading } = useTopSection("core-strengths");

  useEffect(() => {
    const getCoreStrengthData = async () => {
      try {
        setLoading(true);
        const data = await fetchData("core-strengths");
        setCoreStrengthData(data[0] || null);
      } catch (error) {
        console.error("Error fetching core strengths data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCoreStrengthData();
  }, []);

  if (loading || topSectionLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!coreStrengthData || !coreStrengthData.stats || coreStrengthData.stats.length === 0) {
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

  // Use top section data for title and description, fallback to defaults if not available
  const pageTitle = topSectionData?.title || "Our Core Strengths";
  const pageDescription = topSectionData?.description || "Client relationship management, strategic consulting, and B2B growth solutions.";

  if (stats.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="w-full py-16 bg-white overflow-hidden">
      <div className="w-11/12 mx-auto grid md:grid-cols-2 gap-16 items-center navtext">
        <div className="flex flex-col gap-4">
          {/* Dynamic Title from Top Section CMS */}
          <h2 className="text-5xl font-bold text-[#04413D]">
            {pageTitle}
          </h2>
          
          {/* Dynamic Description from Top Section CMS */}
          {pageDescription && (
            <div className="text-gray-500 mb-4">
              <div dangerouslySetInnerHTML={{ __html: pageDescription }} />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl p-6 shadow-md shadow-[#e4c88a] cursor-pointer hover:scale-105 transition-all ease-in-out duration-500"
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
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
          className="relative w-full h-[60vh] rounded-xl overflow-hidden shadow-lg shadow-[#04413D]/40"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={pageTitle}
              fill
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
    </section>
  );
}