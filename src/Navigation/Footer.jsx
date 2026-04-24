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
import { useState, useEffect } from "react";
import { fetchData } from "@/lib/frontendApi";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const socialIcons = [
    { icon: <FaFacebook />, url: "https://facebook.com" },
    { icon: <AiFillInstagram />, url: "https://instagram.com" },
    { icon: <FaLinkedin />, url: "https://linkedin.com/in/" },
    { icon: <AiFillTikTok />, url: "https://tiktok.com" },
  ];

  const usefulLinks = [
    { name: "Our Features", path: "/about" },
    { name: "Our Services", path: "/services" },
    { name: "For Universities", path: "/university" },
    { name: "Partners", path: "/partners" },
    { name: "Book an Appointment", path: "/enquiry" },
    { name: "Become a Partner", path: "/partnerwithus" },
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

  // Handle subscribe button click
  const handleSubscribe = () => {
    if (email.trim()) {
      // You can store the email in localStorage or state if needed
      localStorage.setItem("subscriberEmail", email);
    }
    router.push("/enquiry");
  };

  // ✅ Fetch countries from API
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetchData("/countries/");
        setCountries(res.data || []);
      } catch (err) {
        console.error("Failed to load countries", err);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  return (
    <footer className="w-full bg-[#04413D] text-white">
      <div className="max-w-11/12 mx-auto py-14 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Section */}
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
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white text-[#04413D] rounded-full hover:bg-gray-200 transition-all duration-500 hover:scale-105"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-10 navtext">
          {/* Newsletter Section */}
          <div>
            <h2 className="text-3xl font-semibold mb-4">
              Subscribe to Newsletter
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 border-b border-gray-400 pb-3">
            <input
  type="email"
  placeholder="Your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="bg-transparent outline-none text-sm flex-1"
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  }}
/>

              <button 
                onClick={handleSubscribe}
                className="bg-[#FDC653] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[#f6d07e] cursor-pointer transition-all duration-500"
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-1">
            {/* Useful Links */}
            <div>
              <h2 className="font-semibold text-xl mb-4">Useful Links</h2>

              {usefulLinks.map((item) => (
                <div
                  key={item.name}
                  className="text-sm pb-3 hover:underline hover:text-gray-300 transition-all duration-300"
                >
                  <Link href={item.path}>{item.name}</Link>
                </div>
              ))}
            </div>

            {/* Countries - Dynamic from API */}
            <div>
              <h2 className="font-semibold text-xl mb-4">Countries</h2>

              {loading ? (
                <div className="text-sm pb-3 text-gray-300">Loading...</div>
              ) : (
                <>
                  {countries.slice(0, 6).map((country) => (
                    <Link
                      key={country.id}
                      href={`/countries/${country.id}`}
                      className="text-sm pb-3 hover:underline hover:text-gray-300 transition-all duration-300 block"
                    >
                      {country.name}
                    </Link>
                  ))}

                  {countries.length > 6 && (
                    <Link
                      href="/countries"
                      className="text-sm font-medium hover:underline hover:text-gray-300 flex items-center gap-1 mt-1 transition-all duration-300 group"
                    >
                      Show more
                      <svg
                        className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
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
                </>
              )}
            </div>

            {/* Contact */}
            <div className="w-full flex flex-col">
              <h2 className="font-semibold text-xl mb-4">Contact</h2>

              {contact.map((item) => (
                <div
                  key={item.name}
                  className="text-sm pb-3 flex gap-2 mt-1 text-center mx-auto w-full"
                >
                  <h1 className="mt-1">{item.icon}</h1>
                  <a href={item.path} className="hover:underline transition-all duration-300">
                    {item.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-500 w-11/12 mx-auto flex flex-col md:flex-row justify-between items-center py-6 gap-4">
        <div className="text-gray-300 text-sm text-center md:text-left">
          <h1>© 2026 Amphlo B2B Consultant. All rights reserved.</h1>
        </div>

        <div className="text-gray-300 text-sm">
          Powered by: <span className="font-semibold">ARIBT</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-300">
          <Link href="/terms" className="hover:underline transition-all duration-300">
            Terms and Conditions
          </Link>

          <Link href="/privacy" className="hover:underline transition-all duration-300">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}