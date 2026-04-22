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

  return (
    <section className="relative w-full h-fit py-5 flex items-center justify-center  overflow-hidden bg-white">
      <div className="relative z-10 w-11/12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center gap-10 backdrop-blur-sm rounded-3xl p-8 md:p-12"
        >
          <div className="w-full lg:w-1/2 relative h-[60vh] md:h-[50vh]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                // priority
                unoptimized
                className="object-cover rounded-2xl shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-white/20 rounded-2xl"><p class="text-white/70">Image failed to load</p></div>';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/20 rounded-2xl">
                <p className="text-[#04413D]">No Image Available</p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-[#04413D] mb-6">
              {title}
            </h2>
            
            <div className="text-[#04413D]/70 leading-relaxed">
              <div 
               
                dangerouslySetInnerHTML={{ __html: (description) }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .about-business-description {
          color: #e5e7eb;
          line-height: 1.75;
        }
        .about-business-description p {
          margin-bottom: 1rem;
        }
        .about-business-description ul, 
        .about-business-description ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .about-business-description li {
          margin-bottom: 0.25rem;
        }
        .about-business-description strong {
          color: white;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}