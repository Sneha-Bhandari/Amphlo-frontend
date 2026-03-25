"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { fetchData } from "@/lib/page";

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
        } else {
          setFaqs([
            {
              title: "What programs does the university offer?",
              description: "Our university offers a wide range of undergraduate, graduate, and professional programs across disciplines such as business, engineering, technology, health sciences, and the humanities.",
            },
            {
              title: "How can I apply for admission?",
              description: "You can apply online through our admissions portal. Simply complete the application form, upload the required documents, and submit the application before the deadline.",
            },
            {
              title: "Are scholarships or financial aid available?",
              description: "Yes, we offer a variety of scholarships and financial aid options based on academic performance, financial need, and special achievements.",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
        setFaqs([
          {
            title: "What ?",
            description: "Our university offers a wide range of undergraduate, graduate, and professional programs across disciplines such as business, engineering, technology, health sciences, and the humanities.",
          },
          {
            title: "How can I?",
            description: "You can apply online through our admissions portal. Simply complete the application form, upload the required documents, and submit the application before the deadline.",
          },
          {
            title: "Are scholarships or ?",
            description: "Yes, we offer a variety of scholarships and financial aid options based on academic performance, financial need, and special achievements.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    getFaqs();
  }, []);

  if (loading) {
    return (
      <div className="bg-linear-to-b from-[#04413D]/50 to-white min-h-full flex flex-col items-center py-16 px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#04413D]">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-700 mt-3">
            Loading FAQs...
          </p>
        </div>
      </div>
    );
  }

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
                {faq.title || faq.question || "Question"}

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
                    <div className="px-6 pb-4 text-black border-t border-gray-400 pt-3">
                      {faq.description || faq.answer || "No description available"}
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