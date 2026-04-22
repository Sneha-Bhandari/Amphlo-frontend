"use client";
import { IoMdMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram, AiFillTikTok } from "react-icons/ai";
import { FaLocationArrow } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import logo from "../../public/footerlogo.png";
import Image from "next/image";

export default function Footer() {
  const socialIcons = [
    { icon: <FaFacebook />, url: "https://facebook.com" },
    { icon: <AiFillInstagram />, url: "https://instagram.com" },
    { icon: <FaLinkedin />, url: "https://linkedin.com/in/" },
    { icon: <AiFillTikTok />, url: "https://tiktok.com" },
  ];

  const usefulLinks = [
    { name: "Our Features", path: "/about" },
    { name: "Our Servives", path: "/about" },
    { name: "For Universities", path: "/university" },
    { name: "Partners", path: "/" },
    { name: "Book an Appointment", path: "/enquiry" },
    { name: "Become a Partner", path: "/partnerwithus" },
  ];

  const countries = [
    "United States",
    "United Kingdom",
    "Australia",
    "Canada",
    "Germany",
    "France",
    "Japan",
    "Netherlands",
  ];

  const contact = [
    {
      name: "info@amphlo.com",
      icon: <IoMdMail />,
      path: "mailto:info@amphlo.com",
    },
    { name: "+977 9745432207", icon: <IoCall />, path: "tel:+9779745432207" },
    {
      name: "Shantikunja, Tilottama",
      icon: <FaLocationArrow />,
      path: "/enquiry",
    },
  ];

  return (
    <footer className="w-full bg-[#04413D] text-white">
      <div className="max-w-11/12 mx-auto py-14 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6">
          <Image className="h-20 w-40 object-contain" src={logo} alt="logo" />

          <p className="text-sm md:text-base leading-relaxed max-w-md navtext">
            Explore the unparalleled advantages of AMPHLO, designed to
            streamline your abroad study processes with precision and
            flexibility.
          </p>

          <div className="flex gap-4 text-xl">
            {socialIcons.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="p-2 bg-white text-[#04413D] rounded-full hover:bg-gray-200 transition"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-10 navtext">
          <div>
            <h2 className="text-3xl font-semibold mb-4 ">
              Subscribe to Newsletter
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 border-b border-gray-400 pb-3">
              <input
                type="email"
                placeholder="Your email"
                className="bg-transparent outline-none text-sm flex-1"
              />

              <button className="bg-[#FDC653] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[#f6d07e] cursor-pointer transition">
                Subscribe
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3  gap-1">
            <div>
              <h2 className="font-semibold text-xl mb-4">Useful Links</h2>

              {usefulLinks.map((item) => (
                <div
                  key={item.name}
                  className="text-sm pb-3 hover:underline hover:text-gray-300"
                >
                  <Link href={item.path}>{item.name}</Link>
                </div>
              ))}
            </div>

            <div>
              <h2 className="font-semibold text-xl mb-4">Countries</h2>

              {countries.slice(0, 6).map((country) => (
                <p
                  key={country}
                  className="text-sm pb-3 cursor-pointer hover:underline hover:text-gray-300"
                >
                  {country}
                </p>
              ))}

              {countries.length > 6 && (
                <Link
                  href="/countries"
                  className="text-sm font-medium hover:underline hover:text-gray-300 flex items-center gap-1 mt-1"
                >
                  Show more
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              )}
            </div>

            <div className="w-full flex flex-col ">
              <h2 className="font-semibold text-xl mb-4">Contact</h2>

              {contact.map((item) => (
                <div
                  key={item.name}
                  className="text-sm pb-3 flex gap-2 mt-1 text-center mx-auto w-full"
                >
                  <h1 className="mt-1"> {item.icon} </h1>
                  <a href={item.path} className="hover:underline">
                    {item.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-500 w-11/12 mx-auto flex navtext justify-between  ">
        <div className="w-full mx-auto py-6 flex flex-col md:flex-row justify-start text-gray-300 text-sm gap-2">
          <h1 className="text-center md:text-left">
            © 2026 Amphlo B2B Consultant. All rights reserved.
          </h1>

          <div>
            Powered by: <span className="font-semibold">ARIBT</span>
          </div>
        </div>
        <div className=" w-full flex flex-col sm:flex-row gap-4 mx-auto justify-end text-sm text-gray-300">
          <div className="flex items-center gap-2">Terms and Conditions</div>

          <div className="flex items-center gap-2">Privacy Policy</div>
        </div>
      </div>
    </footer>
  );
}
