"use client";

import { useRouter } from "next/navigation";

const sections = [
  { name: "Core Strength", slug: "CoreStrength" },
  { name: "Services & Offerings", slug: "servicesAndOfferings" },
  { name: "Testimonials", slug: "testimonials" },
  { name: "Partners", slug: "partners" },
  { name: "FAQ", slug: "faq" },
  { name: "Our Features", slug: "ourFeatures" },
  { name: "Our Team", slug: "ourTeam" },
  { name: "Countries", slug: "countries" },
  { name: "Become Partner", slug: "becomeAPartner" },
];

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#04413D]">
            Top Sections CMS
          </h1>
          <p className="text-gray-500 mt-2">
            Manage homepage content professionally
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s) => (
            <div
              key={s.slug}
              onClick={() => router.push(`/admin/topsection/${s.slug}`)}
              className="group cursor-pointer p-6 rounded-2xl bg-white border border-gray-200 
              hover:border-[#04413D] hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-[#04413D] group-hover:underline">
                {s.name}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Configure section content
              </p>

              <div className="mt-6 flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  Click to manage
                </span>

                <div className="w-8 h-8 flex items-center justify-center rounded-full 
                bg-[#04413D]/10 text-[#04413D] group-hover:bg-[#04413D] group-hover:text-white transition">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}