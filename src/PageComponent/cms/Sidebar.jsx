"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  HelpCircle
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
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
        { name: "Banner", path: "/admin/banner", icon: Image },
        { name: "About Us", path: "/admin/about", icon: Building2 },
        { name: "Vision & Mission", path: "/admin/vision-mission", icon: Globe },
        { name: "Services & Offerings", path: "/admin/service-offerings", icon: Handshake },
      ],
    },
    {
      name: "Partners",
      path: "/admin/partners",
      icon: Handshake,
      color: "text-orange-500",
    },
    {
      name: "Universities",
      path: "/admin/universities",
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
      name: "Analytics",
      path: "/admin/analytics",
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
      name: "Settings",
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
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
  <div className="flex items-center gap-3">
    <div className="relative w-12 h-12  rounded-lg flex items-center justify-center overflow-hidden">
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
      <h2 className="text-xl font-bold text-[#04413D]">Amphlo CMS</h2>
      <p className="text-xs text-gray-500">B2B Consultant</p>
    </div>
  </div>
</div>
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              {item.dropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.dropdownName)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50 group ${
                      openDropdowns[item.dropdownName] ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-gray-700 font-medium">{item.name}</span>
                    </div>
                    {openDropdowns[item.dropdownName] ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {openDropdowns[item.dropdownName] && (
                    <ul className="ml-9 mt-2 space-y-1">
                      {item.items.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              isActive(subItem.path)
                                ? "bg-[#04413D] text-white"
                                : "text-gray-600 hover:bg-gray-50 hover:text-[#04413D]"
                            }`}
                          >
                            <subItem.icon className="w-4 h-4" />
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-[#04413D] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#04413D]"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive(item.path) ? "text-white" : item.color
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-1 h-8 bg-[#FDC653] rounded-full" />
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Link
            href="/admin/help"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Help & Support</span>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('cms_token');
              window.location.href = '/cms-login';
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#04413D] text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 w-72 h-full z-40 animate-slide-in">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}