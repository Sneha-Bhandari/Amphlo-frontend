"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/(cms)/admin/contexts/AuthContext";
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
  Bell,
  HelpCircle,
} from "lucide-react";

export default function Sidebar({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    document.cookie.split(";").forEach(function(cookie) {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=; expires=" + new Date().toUTCString() + "; path=/");
    });

    localStorage.removeItem("cms_auth");
    localStorage.removeItem("cms_token");
    sessionStorage.clear();

    const cookiesToClear = ['connect.sid', 'token', 'auth_token', 'session'];
    cookiesToClear.forEach(cookieName => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    });

    
    window.location.href = "/cms-login";
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
        // { name: "Our Core Strength", path: "/admin/corestrength", icon: Shield },
        { name: "Banner", path: "/admin/banner", icon: Image },
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
        { name: "CRM", path: "/admin/crm", icon: Shield, color: "text-red-500"},
        { name: "Connected Countries", path: "/admin/connectedcountries", icon: Image },
        { name: "Get In Touch", path: "/admin/getintouch", icon: Image },
        { name: "Why Partner With Us", path: "/admin/whypartnerwithus", icon: Image },
        { name: "Our Features", path: "/admin/features", icon: Shield },

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
      icon: Handshake,
      color: "text-blue-500",
    },
    {
      name: "Countries",
      path: "/admin/countries",
      icon: GraduationCap,
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
      name: "FAQ",
      path: "/admin/faq",
      icon: BarChart3,
      color: "text-cyan-500",
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
      color: "text-pink-500",
    },
    {
      name: "Images",
      path: "/admin/settings",
      icon: Settings,
      color: "text-gray-500",
    },
  ];

  const isActive = (path) => {
    if (!path) return false;
    return pathname === path || pathname?.startsWith(path + "/");
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white shadow-xl">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/headerlogo.png"
              alt="logo"
              width={100}
              height={100}
              className="object-cover"
              priority
            />
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
                    className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 hover:bg-gray-50 group ${openDropdowns[item.dropdownName] ? "bg-gray-50" : ""
                      }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                      <span className="text-sm sm:text-base text-gray-700 font-medium">{item.name}</span>
                    </div>
                    {openDropdowns[item.dropdownName] ? (
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    )}
                  </button>
                  {openDropdowns[item.dropdownName] && (
                    <ul className="ml-6 sm:ml-9 mt-1 sm:mt-2 space-y-1">
                      {item.items.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.path}
                            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm ${isActive(subItem.path)
                                ? "bg-[#04413D] text-white"
                                : "text-gray-600 hover:bg-gray-50 hover:text-[#04413D]"
                              }`}
                          >
                            <subItem.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">{subItem.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                      ? "bg-[#04413D] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#04413D]"
                    }`}
                >
                  <item.icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive(item.path) ? "text-white" : item.color
                      }`}
                  />
                  <span className="text-sm sm:text-base font-medium truncate">{item.name}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-0.5 sm:w-1 h-6 sm:h-8 bg-[#FDC653] rounded-full" />
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 sm:p-4 border-t border-gray-200">
        {/* User Info Section */}
        {user && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-medium text-gray-700 truncate">{user.email || "Admin"}</p>
          </div>
        )}
        
        <div className="space-y-1 sm:space-y-2">
          <Link
            href="/admin/help"
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium truncate">Help & Support</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 text-sm sm:text-base cursor-pointer"
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
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="hidden lg:block w-64 xl:w-72 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 w-64 sm:w-72 h-full z-40 animate-slide-in shadow-2xl">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}