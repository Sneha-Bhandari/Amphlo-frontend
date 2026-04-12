"use client";
import { IoMdMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram, AiFillTikTok } from "react-icons/ai";
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
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "For Universities", path: "/universities" },
    { name: "For Partners", path: "/partners" },
    { name: "Our Journey", path: "/journey" },
    { name: "Our Clients", path: "/clients" },
    { name: "Terms and Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
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
    { name: "info@amphlo.com", path: "mailto:info@amphlo.com" },
    { name: "+977 9745432207", path: "tel:+9779745432207" },
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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

              {countries.map((country) => (
                <p
                  key={country}
                  className="text-sm pb-3 cursor-pointer hover:underline hover:text-gray-300"
                >
                  {country}
                </p>
              ))}
            </div>

            <div>
              <h2 className="font-semibold text-xl mb-4">Contact</h2>

              {contact.map((item) => (
                <div key={item.name} className="text-sm pb-3">
                  <a href={item.path} className="hover:underline">
                    {item.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-500 w-11/12 mx-auto flex navtext ">
        <div className="w-full mx-auto py-6 flex flex-col md:flex-row justify-between text-gray-300 text-sm gap-4">
          <h1 className="text-center md:text-left">
            © 2026 Amphlo B2B Consultant. All rights reserved.
          </h1>

          <div>
            Powered by: <span className="font-semibold">ARIBT</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <IoMdMail />
              <span>info@amphlo.com</span>
            </div>

            <div className="flex items-center gap-2">
              <IoCall />
              <span>+977 9745432207</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
