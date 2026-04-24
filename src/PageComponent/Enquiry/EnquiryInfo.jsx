"use client";

import { useEffect, useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa6";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function EnquiryInfo() {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const data = await fetchData("contact/");
        console.log("Contact API Response:", data);
        
        if (data && data.length > 0) {
          setContactData(data[0]);
        } else if (data && !Array.isArray(data)) {
          setContactData(data);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-16  flex justify-center">
        <Loading />
      </div>
    );
  }

  if (!contactData) {
    return null;
  }

  const contactInfo = [
    {
      title: "Our Amphlo team is here to help",
      type: "Email",
      value: contactData.email,
      icon: <MdOutlineEmail />
    },
    {
      title: "Our Amphlo team is here to help",
      type: "Contact No",
      value: contactData.phoneNo,
      icon: <FaPhoneAlt />
    },
    {
      title: "Our Amphlo team is here to help",
      type: "Location",
      value: contactData.address,
      icon: <FaLocationArrow />
    },
  ];

  return (
    <div className="w-full py-4 mt-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {contactInfo.map((val, i) => (
          <div
            key={i}
            className="group flex flex-col items-center text-center text-[#04413D] p-6 rounded-xl shadow-[#04413D]/20 hover:shadow-lg hover:transition-shadow gap-2 cursor-pointer mb-12"
          >
            <div className="text-xl bg-[#04413D] text-white rounded-full p-2.5 group-hover:bg-[#FDC653] transition-colors duration-500 ease-in-out">
              {val.icon}
            </div>
            <h3 className="text-xl md:text-2xl font-bold">{val.type}</h3>
            <p className="text-gray-500 text-sm">{val.title}</p>
            <p className="text-sm md:text-base font-semibold">{val.value}</p>
          </div>
        ))}
      </div>
     
    </div>
  );
}

     