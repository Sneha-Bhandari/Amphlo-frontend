"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function OurPartner() {
  const [partnersData, setPartnersData] = useState([]);
  const [partnerSectionData, setPartnerSectionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
                const [partnersResponse, topSectionResponse] = await Promise.all([
          fetchData("partners"), 
          fetchData("top-section/partners") 
        ]);
        
        console.log("Partners response:", partnersResponse);
        console.log("Top section response:", topSectionResponse);
        
        if (Array.isArray(partnersResponse)) {
          setPartnersData(partnersResponse);
        } else if (partnersResponse && typeof partnersResponse === 'object') {
          setPartnersData([partnersResponse]);
        } else {
          setPartnersData([]);
        }
        setPartnerSectionData(topSectionResponse || null);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setPartnersData([]);
        setPartnerSectionData(null);
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

  if (!partnerSectionData) {
    return null;
  }

  const partners = partnersData
    .filter((item) => item.imageid?.imageUrl)
    .map((item, index) => ({
      id: item.id || index,
      name: item.title || `Partner ${index + 1}`,
      logo: item.imageid?.imageUrl,
      imageUrl: item.imageid?.imageUrl,
    }));

  if (partners.length === 0) {
    return null;
  }

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
    return `${process.env.NEXT_PUBLIC_API_URL}/${imageUrl}`;
  };

  return (
    <section className="py-20 bg-[#04413D]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center navtext tracking-tight">
        <h2 className="md:text-5xl text-4xl font-bold text-[#04413D] mb-2">
          {partnerSectionData.title}
        </h2>
        {partnerSectionData.description && (
          <div 
            className="text-gray-600 max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: partnerSectionData.description }}
          />
        )}
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex gap-15 mt-6 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...partners, ...partners].map((partner, index) => {
            if (!partner.imageUrl) return null;
            
            const fullImageUrl = getFullImageUrl(partner.imageUrl);
            
            return (
              <div
                key={`${partner.id}-${index}`}
                className="shrink-0 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-40 h-30">
                  <Image
                    src={fullImageUrl}
                    alt={partner.name}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}