'use client'

import React, { useEffect, useState } from 'react';
import { TrendingUp, Laptop, Calendar, BarChart3 } from 'lucide-react';
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

// Icon mapping based on index or you can add icon field in API
const icons = [
  <TrendingUp size={40} strokeWidth={1.5} />,
  <Laptop size={40} strokeWidth={1.5} />,
  <Calendar size={40} strokeWidth={1.5} />,
  <BarChart3 size={40} strokeWidth={1.5} />,
];

export default function OurTopServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await fetchData("our-services");
        console.log("Services API Response:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <main className="bg-[#04413D]/10 font-sans">
        <section className="relative h-[40vh] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          <Loading />
        </section>
      </main>
    );
  }

  if (!services.length) {
    return null;
  }

  return (
    <main className="bg-white font-sans">
      <section className="relative h-[40vh] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/path-to-your-office-image.jpg')" }}
        />
        <div className="absolute inset-0 bg-[#04413D]/70 mix-blend-multiply" />

        <div className="relative z-10 max-w-4xl mb-6">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-2">
            Our Services
          </h1>
          <p className="text-white text-md font-light max-w-2xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-6 pb-20">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {services.map((service, index) => (
      <div key={service.id} className="flex flex-col items-center text-center group">
        {/* Icon Circle - positioned to overlap between sections */}
        <div className="relative -mt-16 mb-6">
          <div className={`
            bg-[#04413D] 
            w-28 h-28 
            rounded-full 
            flex items-center justify-center 
            text-white 
            border-b-4 border-[#FDC653] 
            shadow-xl 
            z-20
            relative
            group-hover:shadow-xl group-hover:shadow-[#FDC653]/50 
            group-hover:scale-110 
            duration-500 ease-in-out transition-all
          `}>
            {icons[index % icons.length]}
          </div>
          
          <div className="absolute inset-0 rounded-full border-2 border-[#FDC653]/0 group-hover:border-[#FDC653]/30 transition-all duration-500 scale-105 group-hover:scale-110"></div>
        </div>

        <h3 className="text-[#04413D] font-bold text-xl uppercase tracking-wider pt-2">
          {service.title}
        </h3>
        
        <div
          className="text-sm md:text-base text-gray-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: service.description }}
        />
      </div>
    ))}
  </div>
</section>
    </main>
  );
}