"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import { CiLocationArrow1 } from "react-icons/ci";

export default function ServicesAndOffering() {
  const [offerings, setOfferings] = useState([]);
  const [activeTab, setActiveTab] = useState("partner");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOfferings = async () => {
      try {
        const data = await fetchData("service-offerings");
        setOfferings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service offerings:", error);
        setLoading(false);
      }
    };

    getOfferings();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!offerings.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#04413D] text-xl">No service offerings available</p>
      </div>
    );
  }

  const currentOffering = offerings.find(offering => offering.path === activeTab);

  if (!currentOffering) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#04413D] text-xl">Offering not found</p>
      </div>
    );
  }

  const imageUrl = currentOffering.imageid?.imageUrl || "";

  return (
    <div className="min-h-screen bg-white flex items-start justify-center py-12 mx-auto w-full">
      <div className="w-11/12 md:w-10/12 mx-auto flex flex-col md:items-center gap-3 navtext">
        
        <h1 className="text-5xl font-semibold text-[#04413D] text-center">
          Amphlo <span className='text-[#FDC653]'>Services & Offerings</span>
        </h1>
        
        <p className="text-center text-sm text-gray-600 max-w-2xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt deserunt 
          dolores quam repellat, molestias, officiis pariatur.
        </p>

        <div className="flex gap-5 mt-3 w-full justify-center">
          {offerings.map((offering) => (
            <button 
              key={offering.id}
              onClick={() => setActiveTab(offering.path)}
              className={`rounded-4xl py-2 px-6 text-xl font-medium cursor-pointer transition-all border-2 capitalize ${
                activeTab === offering.path 
                ? 'bg-[#04413D] text-white border-[#04413D]' 
                : 'bg-white border-[#FDC653] text-[#04413D]'
              }`}
            >
              For {offering.path}
            </button>
          ))}
        </div>

        <div className="mt-8 w-full bg-[#04413D]/10 px-8 py-12 shadow-xl rounded-bl-4xl rounded-tr-4xl">
          <div 
            key={currentOffering.id}
            className={`flex flex-col lg:flex-row ${activeTab === 'university' ? 'lg:flex-row-reverse' : ''} items-center gap-10`}
          >
            <div className="w-full lg:w-1/2 relative h-[40vh] md:h-[50vh]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={currentOffering.title}
                  fill
                  // priority
                  unoptimized
                  className="object-cover rounded-2xl shadow-lg"
                />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-2xl">
                  <p className="text-gray-600">Image Not Found</p>
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2 text-left">
              <h2 className="text-4xl font-bold text-[#04413D] mb-4">{currentOffering.title}</h2>
              <p className="text-gray-600 leading-relaxed text-md text-justify">
                {currentOffering.description}
              </p>
              <ul className="mt-6 space-y-3 text-[#04413D] font-medium">
                {currentOffering.features.map((feature, index) => (
                  <li className='flex items-center gap-3' key={index}>
                    <CiLocationArrow1 /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}