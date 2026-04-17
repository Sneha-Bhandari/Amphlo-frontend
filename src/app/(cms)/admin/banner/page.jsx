"use client";

import { useRouter } from "next/navigation";
import { Image, UserPlus, CalendarDays } from "lucide-react";

export default function Page() {
  const router = useRouter();

  const sections = [
    {
      name: "About Us",
      slug: "aboutus",
      description: "Manage banner for About page",
      icon: Image,
    },
    {
      name: "Partner With Us",
      slug: "partnerWithUs",
      description: "Manage partner section banners",
      icon: UserPlus,
    },
    {
      name: "Book Appointment",
      slug: "bookAnAppointment",
      description: "Manage booking page banners",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#04413D]">
            Banner Section
          </h1>
          <p className="text-gray-500 mt-2">
            Manage and upload banner images for different sections of your website
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((s) => {
            const Icon = s.icon;

            return (
              <div
                key={s.slug}
                onClick={() => router.push(`/admin/banner/${s.slug}`)}
                className="cursor-pointer group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-[#04413D] group-hover:text-white transition">
                  <Icon size={22} />
                </div>

                {/* Text */}
                <h2 className="text-lg font-semibold text-[#04413D] mt-4">
                  {s.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {s.description}
                </p>

                {/* Action hint */}
                <div className="mt-5 text-sm font-medium text-green-600 group-hover:text-[#04413D] transition">
                  Manage banners →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}