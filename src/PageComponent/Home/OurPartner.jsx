"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import partnerlogo from "../../../public/partner.png";

const defaultPartners = [
  { id: 1, name: "TechCorp", logo: partnerlogo },
  { id: 2, name: "GlobalSol", logo: partnerlogo },
  { id: 3, name: "InnovateX", logo: partnerlogo },
  { id: 4, name: "Streamline", logo: partnerlogo },
  { id: 5, name: "DataFlow", logo: partnerlogo },
  { id: 6, name: "CloudScale", logo: partnerlogo },
];

export default function OurPartner() {
  const [partnersData, setPartnersData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPartnersData = async () => {
      try {
        setLoading(true);
        const data = await fetchData("partners");
        setPartnersData(data);
      } catch (error) {
        console.error("Error fetching partners data:", error);
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

  // Transform API data to match the component's expected format
  const transformPartners = () => {
    if (partnersData && Array.isArray(partnersData) && partnersData.length > 0) {
      return partnersData.map((item, index) => ({
        id: item.id || index,
        name: `Partner ${index + 1}`,
        logo: item.imageid?.imageUrl || partnerlogo,
        imageUrl: item.imageid?.imageUrl
      }));
    }
    return defaultPartners;
  };

  const partners = transformPartners();

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
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="shrink-0 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-40 h-30">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}