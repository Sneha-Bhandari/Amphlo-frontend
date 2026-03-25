"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchData } from "@/lib/page";
import Loading from "@/Global/Loading";

export default function AboutOurBusiness() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const getAboutData = async () => {
      try {
        setLoading(true);
        const data = await fetchData("about-business");
        setAboutData(data[0] || null);
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

  const title = aboutData?.title || "About Our Business";
  const description = aboutData?.description || 
    `Construction is a general term meaning the art and science to form objects, systems, or organizations, and comes from Latin constructio and Old French construction. It represents the collaborative effort of architects, engineers, and builders to bring visions into reality. Our process focuses on quality craftsmanship, adhering to safety standards, and using modern technology for sustainable and efficient building. We manage everything from the foundational structure to the final aesthetic details, ensuring every 'dream' is structurally sound and beautifully executed.`;
  
  const imageUrl = aboutData?.imageid?.imageUrl || "";

  return (
    <main className="h-full md:py-24 bg-[#04413D]/10 flex items-center justify-center p-6 overflow-hidden">
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14 navtext">
        
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full md:w-1/2 flex items-center justify-center h-[55vh]"
        >
          <div className="relative w-full h-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="About Our Business"
                fill
                priority
                className="rounded-2xl w-full h-full object-cover shadow-xl"
              />
            ) : (
              <div className="bg-gray-200 w-full h-full rounded-4xl flex items-center justify-center shadow-xl">
                <p className="text-gray-600">Image Not Found</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex flex-col"
        >
          <h1 className="text-4xl lg:text-5xl font-black text-[#04413D] leading-tight mb-6">
            {title}
          </h1>

          <div className="text-justify">
            <p className={`text-md text-gray-600 mb-6 transition-all duration-500 ease-in-out ${!isExpanded ? "line-clamp-5" : ""}`}>
              {description}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-[#FDC653] hover:bg-[#FDC653]/80 text-black font-bold py-3 px-10 rounded-xl w-fit transition-all shadow-lg cursor-pointer"
          >
            {isExpanded ? "Show Less" : "Learn More"}
          </motion.button>
        </motion.div>
      </section>
    </main>
  );
}