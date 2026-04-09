"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function CrmContent() {
  const [crmData, setCrmData] = useState(null);

  useEffect(() => {
    const getCrmData = async () => {
      try {
        const data = await fetchData("crm");
        console.log("CRM API Response:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setCrmData(data[0]);
        } else if (data && !Array.isArray(data)) {
          setCrmData(data);
        }
      } catch (error) {
        console.error("Error fetching CRM data:", error);
      }
    };

    getCrmData();
  }, []);

  if (!crmData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const features = crmData.features || [];
  const title = crmData.title;
  const subTitle = crmData.subTitle;
  const description = crmData.description;
  const sideImageUrl = crmData.imageid?.imageUrl || null;
  const backgroundImageUrl = crmData.backgroundImageId?.imageUrl || null;

  console.log("Side image URL:", sideImageUrl);
  console.log("Background image URL:", backgroundImageUrl);
  console.log("Full CRM Data:", crmData);

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center py-16 overflow-hidden">

      {backgroundImageUrl ? (
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src={backgroundImageUrl}
            alt="Background"
            fill
            priority
            className="object-cover"
            onError={(e) => {
              console.error("Background image failed to load:", backgroundImageUrl);
              e.currentTarget.style.display = "none";
            }}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gray-800" />
      )}
      
      <div className="absolute inset-0 bg-[#04413D]/70 -z-10" />

      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        <motion.div 
          className="relative w-full h-[50vh] md:h-[70vh] flex items-center justify-center"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {sideImageUrl ? (
            <Image
              src={sideImageUrl}
              alt="CRM Software Interface"
              fill
              className="object-contain w-full h-full"
              priority
              onError={(e) => {
                console.error("Side image failed to load:", sideImageUrl);
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700/50 rounded-2xl">
              <p className="text-white/50">Image Not Found</p>
            </div>
          )}
        </motion.div>

        <motion.div 
          className="flex flex-col gap-6 text-center md:text-left navtext"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#FDC653] font-semibold tracking-wider uppercase text-xs md:text-sm">
            {title}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {subTitle}
          </h2>
          
          <div 
            className="text-gray-200 leading-relaxed text-sm md:text-md prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {features.length > 0 && (
            <ul className="space-y-3 flex flex-col items-center md:items-start">
              {features.map((item, idx) => (
                <motion.li 
                  key={idx} 
                  className="flex items-center gap-3 text-white font-medium text-sm md:text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <span className="w-2 h-2 bg-white rounded-full flex flex-col"></span>
                  {item}
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}