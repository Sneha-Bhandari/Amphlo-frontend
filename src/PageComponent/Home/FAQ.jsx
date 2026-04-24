"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const hoverTimeoutRef = useRef(null);
  const [faqsection, setFaqSection] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [faqResponse, topSectionResponse] = await Promise.all([
          fetchData("faq"),
          fetchData("top-section/faq")
        ]);
        
        console.log("FAQ API Response:", faqResponse);
        console.log("Top Section Response:", topSectionResponse);
        
        // Set FAQ data
        if (Array.isArray(faqResponse) && faqResponse.length > 0) {
          setFaqs(faqResponse);
          setOpenIndex(0);
        } else {
          setFaqs([]);
        }
        
        // Since we're fetching directly with path, the response should be the single object
        // No need for .find() because we're getting the specific item directly
        setFaqSection(topSectionResponse || null);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setFaqs([]);
        setFaqSection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleMouseEnter = (index) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 100);
  };

  if (loading) {
    return (
      <div className="bg-linear-to-b from-[#04413D]/50 to-white min-h-full flex flex-col items-center py-16 px-6">
        <Loading/>
      </div>
    );
  }

  // Check if faqsection exists
  // Check if faqsection exists

  if (!faqsection || faqs.length === 0) {
    return null;
  }

  return (
    <div className="bg-linear-to-b from-[#04413D]/30 to-white min-h-full flex flex-col items-center py-16 px-6">
      
      <div className="text-center mb-10 navtext">
        <h1 className="text-4xl font-bold text-[#04413D]">
          {faqsection.title}
        </h1>
        {faqsection.description && (
          <div 
            className="text-gray-700 mt-3"
            dangerouslySetInnerHTML={{ __html: faqsection.description }}
          />
        )}
      </div>

      <div className="w-full max-w-2xl space-y-4 navtext">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const isHovered = hoveredIndex === index;
          const showAnswer = isOpen || isHovered;

          return (
            <div
              key={faq.id || index}
              className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden transition-all duration-300 hover:shadow-md"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex justify-between items-center w-full px-6 py-4 text-left font-medium transition-all duration-300
                ${showAnswer
                  ? "bg-[#04413D] text-white shadow-lg" 
                  : "text-gray-800 hover:bg-[#04413D]/70 hover:text-white"
                }`}
                onClick={() => setOpenIndex(showAnswer ? null : index)}
              >
                <span className="pr-4 text-sm md:text-base">{faq.title}</span>

                <motion.div
                  animate={{ rotate: showAnswer ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <IoMdArrowDropdown
                    className={`text-2xl md:text-3xl transition-colors duration-300 ${
                      showAnswer ? "text-white" : "text-[#0B0C28] group-hover:text-white"
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence mode="wait">
                {showAnswer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: "auto", 
                      opacity: 1,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: { duration: 0.2, ease: "easeIn" }
                    }}
                  >
                    <div className="px-6 pb-5 text-gray-700 border-t border-gray-200 pt-4 prose prose-sm max-w-none bg-white">
                      <div dangerouslySetInnerHTML={{ __html: faq.description }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <h1 className="mt-8 text-sm font-medium">Still have questions? <a href="/enquiry" className="text-[#04413D] hover:underline">Contact Us</a> for more information</h1>
    </div>
  );
}