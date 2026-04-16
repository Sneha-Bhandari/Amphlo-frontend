"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function OurPartner() {
  const [partnersData, setPartnersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPartnersData = async () => {
      try {
        setLoading(true);
        const data = await fetchData("partners");
        console.log("Fetched partner data:", data);
        
        if (Array.isArray(data)) {
          setPartnersData(data);
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
          setPartnersData([data]);
        } else {
          setPartnersData([]);
        }
      } catch (error) {
        console.error("Error fetching partners data:", error);
        setPartnersData([]);
      } finally {
        setLoading(false);
      }
    };

    getPartnersData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!partnersData || partnersData.length === 0) {
    return null;
  }

  const partners = partnersData
    .map((item, index) => ({
      id: item.id || index,
      name: `Partner ${index + 1}`,
      logo: item.imageid?.imageUrl,
      imageUrl: item.imageid?.imageUrl,
    }))
    .filter((partner) => partner.logo); 

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center navtext tracking-tight">
        <h2 className="text-5xl font-bold text-[#04413D] mb-4">
          Amphlo's Eminent <span className="text-[#FDC653]">University Tie-Ups</span>
        </h2>
        <p className="text-gray-600">Powering B2B success across global markets.</p>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex gap-16 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...partners, ...partners].map((partner, index) => {
            const image=partner.imageUrl.split('/')
            console.log(image,"here")
          const newurl=`${process.env.NEXT_PUBLIC_API_URL}/${image[3]}/${image[4]}`
           return <div
              key={`${partner.id}-${index}`}
              className="shrink-0 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-40 h-30">
                <Image
                  src={newurl}
                  alt={partner.name}
                  fill
                  unoptimized
                  // priority
                  className="object-contain"
                />
              </div>
            </div>
})}
        </motion.div>
      </div>
    </section>
  );
}