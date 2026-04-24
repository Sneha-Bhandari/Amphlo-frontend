"use client";

import { useRouter } from "next/navigation";

const sections = [
  {
    name: "Partner",
    slug: "partner",
    description: "Manage partner offerings",
  },
  {
    name: "University",
    slug: "university",
    description: "Manage university offerings",
  },
];

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-[#04413D] mb-8">
          Service Offerings
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((s) => (
            <div
              key={s.slug}
              onClick={() => router.push(`/admin/service-offerings/${s.slug}`)}
              className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-[#04413D]">
                {s.name}
              </h2>
              <p className="text-gray-500 mt-2">{s.description}</p>

              <div className="mt-4 text-yellow-600 font-medium">
                Manage →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}