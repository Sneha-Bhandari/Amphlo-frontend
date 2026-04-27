import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchData } from "@/lib/frontendApi";
import {
  MapPin,
  Award,
  BookOpen,
  Users,
  Calendar,
  Globe,
  School,
  Building2,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

async function CountryPage({ params }) {
  const { id } = await params;
  let country = null;

  try {
    const res = await fetchData(`/countries/${id}/details`);
    country = res?.data || res;
    console.log("Country details:", country);
  } catch (err) {
    console.error("Error fetching country:", err);
  }

  if (!country) {
    notFound();
  }

  const getCategoryStyle = (category) => {
    const styles = {
      "Most Popular": "bg-orange-100 text-orange-700 border border-orange-200",
      "Top Ranked": "bg-purple-100 text-purple-700 border border-purple-200",
      "Emerging": "bg-emerald-100 text-emerald-700 border border-emerald-200",
      "Budget Friendly": "bg-blue-100 text-blue-700 border border-blue-200",
      "Study Abroad": "bg-pink-100 text-pink-700 border border-pink-200",
    };
    return styles[category] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6]">

      <div className="border-b border-gray-100 sticky top-0 z-30 backdrop-blur-sm bg-white/90">
        <div className="container mx-auto px-6 w-11/12 py-3 flex items-center gap-3">
          <Link
            href="/countries"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#04413D] hover:text-[#04413D]/70 transition-colors"
          >
            <ArrowLeft size={16} />
            Countries
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-sm text-gray-500 truncate">{country.name}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative h-[60vh] min-h-[70vh] overflow-hidden">
        <Image
          src={country.imageid?.imageUrl || "/consult.jpg"}
          alt={country.name}
          fill
          className="object-cover"
          unoptimized
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[#04413D]/30 " />

        <div className="relative h-full container mx-auto px-2 w-11/12 flex flex-col justify-end pb-12">
          {country.category && (
            <span className={`inline-flex self-start mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getCategoryStyle(country.category)}`}>
              {country.category}
            </span>
          )}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-none tracking-tight">
            {country.name}
          </h1>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 ">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium">
              <Globe size={15} className="text-[#FDC653]" />
              <span>{country.stateCount || 0} States / Regions</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium">
              <School size={15} className="text-[#FDC653]" />
              <span>{country.universityCount || 0} Universities</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container  px-2 w-11/12 py-14 space-y-10  mx-auto">

        {/* ── About ── */}
        <section className="bg-[#04413D]/10 rounded-2xl  shadow-sm  overflow-hidden ">
          <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100">
            <span className="w-1 h-5 rounded-full bg-[#FDC653]" />
            <h2 className="text-xl font-bold text-[#04413D]">About {country.name}</h2>
          </div>
          <div
            className="px-8 py-7 prose prose-p:text-gray-600 prose-p:leading-relaxed prose-headings:text-[#04413D] max-w-none"
            dangerouslySetInnerHTML={{ __html: country.description }}
          />
        </section>

        {/* ── States ── */}
        {country.states && country.states.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100">
              <span className="w-1 h-5 rounded-full bg-[#FDC653]" />
              <h2 className="text-xl font-bold text-[#04413D]">
                States &amp; Regions
              </h2>
              <span className="ml-auto text-xs font-semibold bg-[#04413D]/8 text-[#04413D] px-3 py-1 rounded-full">
                {country.states.length}
              </span>
            </div>

            <div className="px-8 py-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {country.states.map((state) => (
                <div
                  key={state.id}
                  className="group flex items-center gap-3 bg-[#f4f7f6] hover:bg-[#04413D]/8 border border-transparent hover:border-[#04413D]/15 rounded-xl px-4 py-3 transition-all duration-200 cursor-default"
                >
                  {state.imageid?.imageUrl ? (
                    <Image
                      src={state.imageid.imageUrl}
                      alt={state.name}
                      width={28}
                      height={28}
                      unoptimized
                      className="rounded-full object-cover w-7 h-7 shrink-0 ring-2 ring-white"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#04413D]/10 flex items-center justify-center shrink-0">
                      <Building2 size={14} className="text-[#04413D]" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#04413D] truncate transition-colors">
                    {state.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Universities ── */}
        {country.states && country.states.some((s) => s.universities?.length > 0) && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100">
              <span className="w-1 h-5 rounded-full bg-[#FDC653]" />
              <h2 className="text-xl font-bold text-[#04413D]">
                Top Universities in {country.name}
              </h2>
            </div>

            <div className="divide-y divide-gray-50">
              {country.states.map((state) =>
                state.universities?.map((uni) => (
                  <div
                    key={uni.id}
                    className="group flex items-start gap-5 px-8 py-6 hover:bg-[#f4f7f6] transition-colors duration-150"
                  >
                    {/* Logo */}
                    {uni.imageid?.imageUrl ? (
                      <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                        <Image
                          src={uni.imageid.imageUrl}
                          alt={uni.universityName}
                          width={64}
                          height={64}
                          unoptimized
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="shrink-0 w-16 h-16 rounded-xl bg-[#04413D]/8 flex items-center justify-center border border-[#04413D]/10">
                        <School size={24} className="text-[#04413D]" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#04413D] transition-colors">
                        {uni.universityName}
                      </h3>

                      <div className="flex flex-wrap gap-x-5 gap-y-2">
                        <MetaStat icon={<MapPin size={13} />} label={uni.location} />
                        <MetaStat icon={<Award size={13} />} label={uni.ranking} />
                        <MetaStat icon={<BookOpen size={13} />} label={`${uni.program} Programs`} />
                        <MetaStat icon={<Users size={13} />} label={`${uni.students} Students`} />
                        <MetaStat icon={<Calendar size={13} />} label={`Est. ${uni.established}`} />
                      </div>
                    </div>

                    {/* Accent bar */}
                    <div className="hidden md:block self-stretch w-0.5 rounded-full bg-[#FDC653]/0 group-hover:bg-[#FDC653] transition-all duration-300 shrink-0" />
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* Small helper kept local — no behaviour change, just DRY */
function MetaStat({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500">
      <span className="text-[#04413D]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

export default CountryPage;
