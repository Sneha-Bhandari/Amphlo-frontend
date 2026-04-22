"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
};

const TestimonialCard = ({ review }) => {
  const validRating = Math.min(5, Math.max(0, Number(review.rating) || 0));

  return (
    <div className="relative w-full  sm:w-[60vh] md:w-[50vh] lg:w-[60vh] gap-8  mx-auto sm:mx-2 md:mx-3 lg:mx-4 md:mb-4 md:mt-6 mt-24 group navtext sm:shrink-0  flex md:flex bg-[#04413D]/10 flex-col  ">
      <div className=" rounded-lg p-3 sm:p-4 pt-17 sm:pt-20 lg:pt-22 shadow-lg border-l-2 border-t-2 border-[#04413D] h-[30vh] sm:h-[30vh] md:h-[35vh] lg:h-[30vh] w-full ">
        <p className="text-gray-800 text-sm sm:text-xs md:text-sm line-clamp-4 italic">
          "{review.description}"
        </p>
        
      </div>

      <div className="absolute -top-6 left-0 sm:-top-8 md:-top-10 flex items-center w-[90%]">
        <div className="bg-[#04413D] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-tr-[20px] sm:rounded-tr-[30px] shadow-md flex flex-col w-[70vw] sm:w-[40vh] md:w-[40vh] relative ">
          <h3 className="font-bold text-sm sm:text-xs md:text-base lg:text-lg tracking-wide leading-tight uppercase">
            {review.clientName}
          </h3>
          <p className="text-xs sm:text-[10px] md:text-sm opacity-90">
            {review.jobTitle}
          </p>
          <p className="text-xs sm:text-[10px] md:text-sm opacity-75">
            {review.companyName}
          </p>

          <div className="flex mt-1">
            {[...Array(validRating)].map((_, i) => (
              <span key={`full-${i}`} className="text-[#FDC653] text-xs sm:text-[10px] md:text-sm">
                ★
              </span>
            ))}
            {[...Array(5 - validRating)].map((_, i) => (
              <span key={`empty-${i}`} className="text-gray-400 text-xs sm:text-[10px] md:text-sm">
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="absolute -right-12 sm:-right-8 md:-right-12 -top-4 sm:-top-8 md:-top-1">
          <div className="relative w-20 h-20 sm:size-22 md:size-24 rounded-full border-2 sm:border-2 md:border-4 border-[#FDC653] shadow-lg overflow-hidden bg-[#04413D]/20">
            {review.imageUrl ? (
              <Image
                src={review.imageUrl}
                alt={review.clientName}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">No Image</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const [isPaused, setIsPaused] = useState(false);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const getTestimonialsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchData("testimonial");

        if (Array.isArray(data)) {
          setTestimonialsData(data);
        } else if (data && typeof data === "object") {
          setTestimonialsData([data]);
        } else {
          setTestimonialsData([]);
        }
      } catch (error) {
        console.error("Error fetching testimonials data:", error);
        setError("Failed to load testimonials. Please try again later.");
        setTestimonialsData([]);
      } finally {
        setLoading(false);
      }
    };

    getTestimonialsData();
  }, []);

  const transformReviews = () => {
    if (testimonialsData.length > 0) {
      return testimonialsData.map((item, index) => {
        let rating = Number(item.rating);
        if (isNaN(rating)) rating = 0;

        return {
          id: item.id || index,
          clientName: item.clientName || "Anonymous",
          jobTitle: item.jobTitle || "",
          companyName: item.companyName || "",
          rating: Math.min(5, Math.max(0, Math.round(rating))),
          description: stripHtml(item.description),
          imageUrl: item.imageid?.imageUrl || null,
        };
      });
    }
    return [];
  };

  const reviews = transformReviews();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#04413D] text-white rounded-lg hover:bg-[#04413D]/90 text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#04413D]/20 min-h-[60vh] py-12 sm:py-16 md:py-18 overflow-hidden w-full navtext">
      <div className="max-w-7xl mx-auto px-4 mb-8 sm:mb-10 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold text-[#04413D] mb-2 sm:mb-4">
          What Our Client Says
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          We collaborate with industry leaders to provide the best experiences.
        </p>
      </div>

      {reviews.length > 0 ? (
        <>
          {/* Mobile Layout - Column (visible on small screens) */}
          <div className="block sm:hidden">
            <div className="flex flex-col items-center justify-center px-4">
              {reviews.map((review, index) => (
                <div key={`mobile-${review.id}-${index}`} className="w-full">
                  <TestimonialCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Layout - Marquee (hidden on small screens) */}
          <div className="hidden sm:block w-full h-full pt-7">
            <div
              ref={marqueeRef}
              className="flex marquee-content"
              style={{
                animation: `marquee ${Math.max(20, reviews.length * 2)}s linear infinite`,
                animationPlayState: isPaused ? "paused" : "running",
                width: "fit-content",
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {[...reviews, ...reviews, ...reviews].map((review, index) => (
                <div key={`${review.id}-${index}`}>
                  <TestimonialCard review={review} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No testimonials available at the moment.
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        .marquee-content {
          will-change: transform;
          display: flex;
        }

        @media (max-width: 640px) {
          .marquee-content {
            animation-duration: ${Math.max(15, reviews.length)}s !important;
          }
        }
      `}</style>
    </section>
  );
}