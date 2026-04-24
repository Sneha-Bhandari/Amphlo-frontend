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
  const [sandoSectionData, setSandoSectionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [offeringsData, topSectionData] = await Promise.all([
          fetchData("service-offerings"),
          fetchData("top-section/servicesAndOfferings") 
        ]);
        
        console.log("Offerings Response:", offeringsData);
        console.log("Top Section Response:", topSectionData);
        
        if (Array.isArray(offeringsData) && offeringsData.length > 0) {
          setOfferings(offeringsData);
          if (offeringsData[0]?.path) {
            setActiveTab(offeringsData[0].path);
          }
        } else {
          setOfferings([]);
        }
        
        setSandoSectionData(topSectionData || null);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setOfferings([]);
        setSandoSectionData(null);
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

  if (!sandoSectionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#04413D] text-xl">Section data not found</p>
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
        
        <div className=" text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#04413D] mb-2">
            {sandoSectionData.title}
          </h1>
          <div 
            className="text-gray-600 w-11/13 text-center flex mx-auto"
            dangerouslySetInnerHTML={{ __html: sandoSectionData.description }} 
          />
        </div>

        <div className="flex gap-5 mt-3 w-full justify-center flex-wrap navtext">
          {offerings.map((offering) => (
            <button 
              key={offering.id}
              onClick={() => setActiveTab(offering.path)}
              className={`rounded-full py-2 px-6 text-md font-medium cursor-pointer transition-all border-2 capitalize ${
                activeTab === offering.path 
                ? 'bg-[#04413D] text-white border-[#04413D]' 
                : 'bg-white border-[#FDC653] text-[#04413D] hover:bg-[#04413D]/5'
              }`}
            >
              For {offering.path}
            </button>
          ))}
        </div>

        <div className="mt-8 w-full bg-[#04413D]/10 px-8 py-12 shadow-xl rounded-bl-4xl rounded-tr-4xl navtext">
          <div 
            key={currentOffering.id}
            className={`flex flex-col lg:flex-row ${
              activeTab === 'university' ? 'lg:flex-row-reverse' : ''
            } items-center gap-10`}
          >
            <div className="w-full lg:w-1/2 relative h-[40vh] md:h-[50vh]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={currentOffering.title || currentOffering.path}
                  fill
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
              <h2 className="text-4xl font-bold text-[#04413D] mb-4">
                {currentOffering.title}
              </h2>
              <div 
                className="text-gray-600 leading-relaxed text-md text-justify" 
                dangerouslySetInnerHTML={{ __html: currentOffering.description }} 
              />
              
              {currentOffering.features && currentOffering.features.length > 0 && (
                <ul className="mt-6 space-y-3 text-[#04413D] font-medium">
                  {currentOffering.features.map((feature, index) => (
                    <li className='flex items-center gap-3' key={index}>
                      <CiLocationArrow1 className="text-[#FDC653]" /> 
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}