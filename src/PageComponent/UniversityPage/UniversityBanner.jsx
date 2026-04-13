// components/UniversityBanner.jsx
import Link from "next/link";

export default function UniversityBanner() {
  return (
    <div className="relative md:h-[60vh] h-[90vh] md:top-18 top-4 w-full bg-[#04413D]/30 flex items-center justify-center overflow-hidden">
     
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Welcome to <span className="text-[#04413D]/70">University</span>
        </h1>
        
        <p className="text-md md:text-xl text-gray-100 mb-10 font-light leading-relaxed">
          Empowering minds, shaping futures. Join us in your journey towards 
          excellence and innovation.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className=" cursor-pointer w-full sm:w-auto px-10 py-4 bg-[#04413D] hover:bg-[#04413D]/60 text-white font-bold rounded-md transition-colors shadow-lg">
            Apply Now
          </button>
          
          <button className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-[#04413D] transition-all">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}