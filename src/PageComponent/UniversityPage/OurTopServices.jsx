import React from 'react';
import { TrendingUp, Laptop, Calendar, BarChart3 } from 'lucide-react';

const services = [
  {
    title: "Service Name",
    description: "Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy",
    icon: <TrendingUp size={40} strokeWidth={1.5} />,
    bgColor: "bg-[#04413D]" // Teal
  },
  {
    title: "Service Name",
    description: "Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy",
    icon: <Laptop size={40} strokeWidth={1.5} />,
    bgColor: "bg-[#04413D]" // Dark Slate
  },
  {
    title: "Service Name",
    description: "Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy ",
    icon: <Calendar size={40} strokeWidth={1.5} />,
    bgColor: "bg-[#04413D]"
  },
  {
    title: "Service Name",
    description: "Dolor sit amet, consectetuer adipiscing elit, sed diam nonummy ",
    icon: <BarChart3 size={40} strokeWidth={1.5} />,
    bgColor: "bg-[#04413D]"
  }
];

export default function OurTopServices() {
  return (
    <main className=" bg-[#04413D]/10 font-sans ">
      <section className="relative h-[40vh] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/path-to-your-office-image.jpg')" }}
        />
        <div className="absolute inset-0 bg-[#04413D]/70 mix-blend-multiply" />

        <div className="relative z-10 max-w-4xl mb-6 ">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-2 ">
            Our Services
          </h1>
          <p className="text-white text-md font-light max-w-2xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4 -mt-16">
          {services.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center cursor-pointer group">
              <div className={`
                ${item.bgColor} 
                w-38 h-38 
                rounded-full 
                flex items-center justify-center 
                text-white 
                border-b border-[#FDC653] 
                shadow-xl 
                mb-6
                z-20
                group-hover:shadow-xl group-hover:shadow-[#FDC653]/50 group-hover:scale-105 duration-500 ease-in-out transition-all
              `}>
                {item.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-[#04413D] font-bold text-xl mb-2 uppercase tracking-wider">
                {item.title}
              </h3>
              <p className="text-gray-400 text-[15px] leading-relaxed px-4 ">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}