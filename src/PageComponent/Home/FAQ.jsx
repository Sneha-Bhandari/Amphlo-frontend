"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFaqs = async () => {
      try {
        const data = await fetchData("faq");
        console.log("FAQ API Response:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
          // Open first FAQ by default
          setOpenIndex(0);
        } else {
          setFaqs([]);
        }
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    getFaqs();
  }, []);

  if (loading) {
    return (
      <div className="bg-linear-to-b from-[#04413D]/50 to-white min-h-full flex flex-col items-center py-16 px-6">
        <Loading/>
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return null;
  }

  // Function to strip HTML tags for plain text display if needed
  const stripHtmlTags = (html) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  return (
    <div className="bg-linear-to-b from-[#04413D]/30 to-white min-h-full flex flex-col items-center py-16 px-6">
      
      <div className="text-center mb-10 navtext">
        <h1 className="text-4xl font-bold text-[#04413D]">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-700 mt-3">
          Find answers to common questions about our university
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.id || index}
              className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden"
            >
              <button
                className={`flex justify-between items-center w-full px-6 py-4 text-left font-medium transition-colors
                ${isOpen 
                  ? "bg-[#04413D] text-white" 
                  : "text-gray-800 hover:bg-[#04413D]/70 hover:text-white"
                }`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="pr-4">{faq.title}</span>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <IoMdArrowDropdown
                    className={`text-2xl ${
                      isOpen ? "text-white" : "text-[#0B0C28]"
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 text-gray-700 border-t border-gray-200 pt-3 prose prose-sm max-w-none">
                      {/* Render HTML content safely */}
                      <div dangerouslySetInnerHTML={{ __html: faq.description }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}