"use client";

import Image from "next/image";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function EnquiryBanner() {
  const [enquiryData, setEnquiryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEnquiryData = async () => {
      try {
        const data = await fetchData("banner");
        const enquiryBanner = data.find(item => item.path === "bookAnAppointment");
        setEnquiryData(enquiryBanner || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching enquiry banner data:", error);
        setLoading(false);
      }
    };

    getEnquiryData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!enquiryData) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-gray-100">
        <p className="text-[#04413D] text-xl">No enquiry banner data available</p>
      </div>
    );
  }

  const imageUrl = enquiryData.imageid?.imageUrl || "";

  return (
    <div className="h-[70vh] relative ">
      {imageUrl ? (
        <Image
          className="h-full w-full object-cover"
          src={imageUrl}
          alt={enquiryData.title || "Enquiry banner"}
          fill
          // priority
          unoptimized
        />
      ) : (
        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-600">Image Not Found</p>
        </div>
      )}
      <div className="absolute bg-[#04413D]/20 inset-0"></div>
      <div className="absolute flex flex-col mx-auto top-1/2 left-12 inset-0 gap-2 text-white navtext">
        <h1 className="text-5xl font-semibold tracking-tight">
          {enquiryData.title || "Enquiry Page"}
        </h1>
        <p className="text-xl">{enquiryData.subTitle || "This is a enquiry page"}</p>
      </div>
      <div className="absolute bottom-0 w-full h-8 flex gap-2 items-center justify-start bg-[#04413D]/50 text-white px-14 py-1">
        <h1 className="text-xl"><IoArrowBackCircleSharp /></h1>
        <button className="text-white font-medium hover:underline hover:underline-offset-2 cursor-pointer">
          <Link href="/"> Home </Link>
        </button>
        <h1>/</h1>
        <h1 className="font-medium text-white underline underline-offset-3">
          {enquiryData.path === "bookAnAppointment" ? "Book Appointment" : enquiryData.title || "Enquiry"}
        </h1>
      </div>
    </div>
  );
}