"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/page";

export default function CrmContent() {
  const [crmData, setCrmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({
    background: false,
    side: false
  });

  useEffect(() => {
    const getCrmData = async () => {
      try {
        const data = await fetchData("crm");
        console.log("CRM API Response:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setCrmData(data[0]);
        } else {
          setCrmData(data);
        }
      } catch (error) {
        console.error("Error fetching CRM data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCrmData();
  }, []);

  const features = crmData?.features || [
    "Automated Lead Tracking",
    "Integrated Communication Tools",
    "Advanced Analytics Dashboard",
  ];

  const title = crmData?.title || "Customer Relationship Management default";
  const subTitle = crmData?.subTitle || "Streamline Your Business With Our CRM";
  const description = crmData?.description || "Our CRM platform is designed to unify your communication, track leads, and foster long-term customer loyalty. Centralize your data and empower your team to make informed decisions faster.";

  const sideImageUrl = crmData?.imageid?.imageUrl || null;
  const backgroundImageUrl = crmData?.backgroundImageId?.imageUrl || null;

  console.log("Side image URL:", sideImageUrl);
  console.log("Background image URL:", backgroundImageUrl);
  console.log("Full CRM Data:", crmData);

  if (loading) {
    return (
      <section className="relative w-full min-h-[60vh] flex items-center justify-center py-16">
        <div className="text-white">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center py-16 overflow-hidden">

      {backgroundImageUrl && !imageErrors.background ? (
        <Image
          src={backgroundImageUrl}
          alt="Background"
          fill
          priority
          className="object-cover absolute inset-0 -z-20"
          onError={() => {
            console.error("Background image failed to load:", backgroundImageUrl);
            setImageErrors(prev => ({ ...prev, background: true }));
          }}
        />
      ) : (
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          priority
          className="object-cover absolute inset-0 -z-20"
        />
      )}
      
      <div className="absolute inset-0 bg-[#04413D]/70 -z-10" />

      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        <div className="relative w-full h-[50vh] md:h-[70vh] flex items-center justify-center">
          {sideImageUrl && !imageErrors.side ? (
            <Image
              src={sideImageUrl}
              alt="CRM Software Interface"
              fill
              className="object-contain w-full h-full"
              priority
              onError={() => {
                console.error("Side image failed to load:", sideImageUrl);
                setImageErrors(prev => ({ ...prev, side: true }));
              }}
            />
          ) : (
            <Image
              src="/sss.png"
              alt="CRM Software Interface"
              fill
              className="object-contain w-full h-full"
              priority
            />
          )}
        </div>

        <div className="flex flex-col gap-6 text-center md:text-left navtext">
          <span className="text-[#FDC653] font-semibold tracking-wider uppercase text-xs md:text-sm">
            {title}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {subTitle}
          </h2>
          <p className="text-gray-200 leading-relaxed text-sm md:text-md">
            {description}
          </p>

          <ul className="space-y-3 flex flex-col items-center md:items-start">
            {features.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-white font-medium text-sm md:text-lg">
                <span className="w-2 h-2 bg-white rounded-full flex flex-col"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}