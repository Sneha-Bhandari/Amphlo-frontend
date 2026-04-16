"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function ConnectedCountries() {
  const [countriesData, setCountriesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCountriesData = async () => {
      try {
        setLoading(true);
        const data = await fetchData("connected-countries");
        setCountriesData(data[0] || null);
      } catch (error) {
        console.error("Error fetching countries data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCountriesData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const title = countriesData?.title || "Countries We Are Connected With";
  const description =
    countriesData?.description ||
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt deserunt dolores quam repellat, molestias, officiis pariatur. Amet consectetur adipisicing elit.";
  const imageUrl = countriesData?.imageid?.imageUrl || "";

  return (
    <div className="min-h-screen w-full bg-[#04413D]/10 py-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 px-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 flex flex-col items-start gap-6 text-left navtext"
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-[#04413D] leading-tight">
            {title}
          </h1>

          <div
            className="text-sm md:text-base text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-[#04413D]/10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#04413D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#04413D]"></span>
            </span>
            <p className="text-xs font-medium text-[#04413D]">
              Global Presence Active
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full lg:w-2/3 h-[50vh] lg:h-[80vh] relative"
        >
          <div className="w-full h-full rounded-3xl overflow-hidden p-4">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={"Map of connected countries"}
                fill
                className="object-contain rounded-3xl"
                // priority
                unoptimized
              />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-3xl">
                <p className="text-gray-600">Image Not Found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
