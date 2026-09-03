"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  GraduationCap,
  Handshake,
  FileText,
  Mail,
  ChevronDown,
  ChevronRight,
  Star,
  Globe,
  BarChart3,
  Shield,
  HelpCircle,
  Users,
  Award,
  BookOpen,
  MapPin,
} from "lucide-react";
import { postData } from "@/lib/frontendApi";

export default function Sidebar({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [logoError, setLogoError] = useState(false);

  // Function to find which dropdown contains the current path
  const findDropdownByPath = (path) => {
    for (const item of navItems) {
      if (item.dropdown && item.items) {
        const found = item.items.find(subItem => subItem.path === path);
        if (found) {
          return item.dropdownName;
        }
      }
    }
    return null;
  };

  // Auto-open dropdown if current route is inside a dropdown
  useEffect(() => {
    const dropdownToOpen = findDropdownByPath(pathname);
    if (dropdownToOpen && openDropdown !== dropdownToOpen) {
      setOpenDropdown(dropdownToOpen);
    }
  }, [pathname]);

  // Close mobile menu when route changes (page is clicked)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleLogout = async () => {
    await logout();

    try {
      await postData("auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("cms_auth");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    sessionStorage.clear();

    window.location.href = "/cms-login";
  };

  // Function to handle link click - closes mobile menu
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      color: "text-blue-500",
    },
    {
      name: "Content Management",
      icon: FileText,
      color: "text-purple-500",
      dropdown: true,
      dropdownName: "content",
      items: [
        { name: "Hero Section", path: "/admin/hero", icon: Star },
        { name: "Banner", path: "/admin/banner", icon: FileText },
        { name: "Services & Offerings", path: "/admin/service-offerings", icon: Handshake },
        { name: "About Us", path: "/admin/about", icon: Building2 },
        { name: "Top Section", path: "/admin/topsection", icon: Building2 },
        { name: "Vision & Mission", path: "/admin/vision-mission", icon: Globe },
      ],
    },
    {
      name: "Pages",
      icon: FileText,
      color: "text-teal-500",
      dropdown: true,
      dropdownName: "contentpage",
      items: [
        { name: "Our Core Strength", path: "/admin/corestrength", icon: Shield },
        { name: "CRM", path: "/admin/crm", icon: Users },
        { name: "Connected Countries", path: "/admin/connectedcountries", icon: Globe },
        { name: "Get In Touch", path: "/admin/getintouch", icon: Mail },
        { name: "Why Partner With Us", path: "/admin/whypartnerwithus", icon: Handshake },
        { name: "Our Features", path: "/admin/features", icon: Award },
      ],
    },
    {
      name: "Partners",
      path: "/admin/partners",
      icon: Handshake,
      color: "text-orange-500",
    },
    {
      name: "Our Teams",
      path: "/admin/ourteam",
      icon: Users,
      color: "text-blue-500",
    },
    {
      name: "Our Blogs",
      path: "/admin/blogs",
      icon: Users,
      color: "text-purple-500",
    },
    {
      name: "Countries",
      path: "/admin/countries",
      icon: Globe,
      color: "text-indigo-500",
    },
    {
      name: "Testimonials",
      path: "/admin/testimonial",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      name: "Enquiry",
      path: "/admin/enquiry",
      icon: Mail,
      color: "text-red-500",
    },
    {
      name: "University",
      icon: GraduationCap,
      color: "text-green-500",
      dropdown: true,
      dropdownName: "Add-University",
      items: [
        { name: "University Page", path: "/admin/university", icon: BookOpen },
        { name: "Add University", path: "/admin/universities", icon: GraduationCap },
      ]
    },
    {
      name: "FAQ",
      path: "/admin/faq",
      icon: HelpCircle,
      color: "text-cyan-500",
    },
    {
      name: "Messages",
      icon: Mail,
      color: "text-yellow-500",
      dropdown: true,
      dropdownName: "messagepage",
      items: [
        { name: "Book An Appointment", path: "/admin/bookmessage", icon: BookOpen },
        { name: "Partner With Us", path: "/admin/partnermessage", icon: Handshake },
      ],
    },
  ];

  const isActive = (path) => {
    if (!path) return false;
    return pathname === path || pathname?.startsWith(path + "/");
  };

  // Check if any child of dropdown is active
  const isDropdownActive = (items) => {
    return items?.some(item => isActive(item.path));
  };

  const dropdownVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.2 } }
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white shadow-xl sidebar-content">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100">
            {!logoError ? (
              <Image
                src="/headerlogo.png"
                alt="Amphlo CMS Logo"
                width={100}
                height={100}
                className="object-cover"
                onError={() => setLogoError(true)}
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#04413D] text-white font-bold text-xl">
                A
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#04413D]">Amphlo CMS</h2>
            <p className="text-xs text-gray-500 hidden sm:block">B2B Consultant</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 sm:py-6 px-2 sm:px-4">
        <ul className="space-y-1 sm:space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              {item.dropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.dropdownName)}
                    className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors duration-200 hover:bg-gray-50 ${
                      openDropdown === item.dropdownName || (openDropdown === null && isDropdownActive(item.items))
                        ? "bg-gray-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                      <span className="text-sm sm:text-base text-gray-700 font-medium">{item.name}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openDropdown === item.dropdownName ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {(openDropdown === item.dropdownName) && (
                      <motion.ul
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="ml-6 sm:ml-9 mt-1 sm:mt-2 space-y-1 overflow-hidden"
                      >
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.path}
                              onClick={handleLinkClick}
                              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm ${
                                isActive(subItem.path)
                                  ? "bg-[#04413D] text-white"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-[#04413D]"
                              }`}
                            >
                              <subItem.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="truncate">{subItem.name}</span>
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href={item.path} onClick={handleLinkClick}>
                  <div
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors duration-200 ${
                      isActive(item.path)
                        ? "bg-[#04413D] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#04413D]"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isActive(item.path) ? "text-white" : item.color
                      }`}
                    />
                    <span className="text-sm sm:text-base font-medium truncate">{item.name}</span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="space-y-1 sm:space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm sm:text-base cursor-pointer"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium truncate">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#04413D] text-white rounded-lg shadow-lg cursor-pointer"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="hidden lg:block w-64 xl:w-72 h-screen sticky top-24">
        <SidebarContent />
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            <motion.div
              className="lg:hidden fixed top-0 left-0 w-64 sm:w-72 h-full z-40 shadow-2xl"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .sidebar-content::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb {
          background: #04413D;
          border-radius: 10px;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: #0a5c56;
        }
      `}</style>
    </>
  );
}