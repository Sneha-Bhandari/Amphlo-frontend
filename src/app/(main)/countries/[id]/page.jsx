import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import flag from "../../../../../public/england.png";
import { fetchData } from "@/lib/frontendApi";
import { MapPin, Award, BookOpen, Users, Calendar } from "lucide-react";


async function CountryPage({ params }) {
  const { id } = await params;

  let country = null;

  try {
    const res = await fetchData(`/countries/${id}/details`);
    country = res;
  } catch (err) {
    console.error(err);
  }

  if (!country) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#04413D]/10 py-28">
      <div className="container mx-auto px-4 w-11/12 navtext">

        {/* BACK BUTTON (UNCHANGED) */}
        <Link
          href="/countries"
          className="inline-flex items-center gap-2 text-[#04413D] font-semibold mb-8 hover:gap-3 transition-all group bg-[#FDC653] px-5 py-2 rounded-full shadow-sm"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Countries
        </Link>

        {/* HERO IMAGE */}
        <div className="relative rounded-3xl overflow-hidden mb-12 h-[50vh]">
          <Image
            src={country.imageid?.imageUrl || "/consult.jpg"}
            alt={country.name}
            fill
            className="object-cover"
            unoptimized
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#04413D]/90 via-[#04413D]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              {country.name}
            </h1>
            <p
              className="text-md md:text-lg max-w-4xl tracking-tight opacity-90"
              dangerouslySetInnerHTML={{ __html: country.description }}
            />
          </div>
        </div>

        {/* STATES */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#04413D] mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#FDC653] rounded-full"></span>
              States & Regions ({country.stateCount})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {country.states?.map((state) => (
                <div
                  key={state.id}
                  className="group bg-linear-to-r flex items-center gap-3 from-[#04413D]/5 to-[#06756d]/5 rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <Image
                    src={state.imageid?.imageUrl || flag}
                    alt="flag"
                    width={20}
                    height={14}
                  unoptimized
                    className="rounded-sm object-cover shadow-md"
                  />
                  <span className="text-md font-medium text-gray-700 truncate">
                    {state.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* UNIVERSITIES */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#04413D] mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#FDC653] rounded-full"></span>
              Top Universities in {country.name}
            </h2>

            <div className="space-y-4">
              {country.states?.flatMap((state) =>
                state.universities?.map((uni) => (
                  <div
                    key={uni.id}
                    className="bg-linear-to-r  from-[#FDC653]/20 to-white hover:from-[#04413D]/5 hover:to-[#FDC653]/10 rounded-xl p-5 transition-all duration-300 border border-gray-100 hover:border-[#04413D]/30 hover:shadow-md"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {uni.universityName}
                    </h3>

                    <div className="flex flex-wrap gap-6 text-sm text-gray-600">

                      <div className="flex items-center gap-3">
                        <MapPin size={14} className="text-[#04413D]" />
                        <span>{uni.location}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Award size={14} className="text-[#04413D]" />
                        <span>{uni.ranking}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <BookOpen size={14} className="text-[#04413D]" />
                        <span>{uni.program} Programs</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users size={14} className="text-[#04413D]" />
                        <span>{uni.students} Students</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar size={14} className="text-[#04413D]" />
                        <span className="bg-[#04413D]/50 text-white rounded-2xl px-2 py-1">
                          {uni.established}
                        </span>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CountryPage;