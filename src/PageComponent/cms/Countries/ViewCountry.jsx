"use client";

import React from "react";
import { MdClose } from "react-icons/md";

export default function ViewCountry({ isOpen, onClose, country }) {
  if (!isOpen || !country) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Country Details</h2>
            <p className="text-gray-600 text-sm mt-1">View country information</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-gray-100 border-4 border-[#04413D] shadow-lg">
                {country.imageid?.imageUrl ? (
                  <img
                    src={country.imageid.imageUrl}
                    alt={country.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-2/3 space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Country Name</h3>
                <p className="text-lg font-medium text-gray-900">{country.name}</p>
              </div>

              {(country.categories || []).length > 0 && (
                <div className="border-b pb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {country.categories.map((cat, i) => (
                      <span key={i} className="text-sm px-3 py-1 bg-[#FDC653]/20 rounded-full text-gray-700">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                  <div dangerouslySetInnerHTML={{ __html: country.description }} />
                </div>
              </div>
            </div>
          </div>

          {/* States Section */}
          {(country.states || []).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#04413D] mb-3">States & Regions</h3>
              <div className="flex flex-wrap gap-2">
                {country.states.map((state, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm">
                    {state.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Universities Section */}
          {(country.universities || []).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#04413D] mb-3">Universities</h3>
              <div className="space-y-3">
                {country.universities.map((uni, i) => (
                  <div key={i} className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-bold text-gray-800">{uni.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 text-sm">
                      <p><span className="text-gray-500">Location:</span> {uni.location}</p>
                      <p><span className="text-gray-500">Ranking:</span> {uni.ranking}</p>
                      {uni.programs && <p><span className="text-gray-500">Programs:</span> {uni.programs}+</p>}
                      {uni.established && <p><span className="text-gray-500">Established:</span> {uni.established}</p>}
                      {uni.students && <p><span className="text-gray-500">Students:</span> {uni.students.toLocaleString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-6 mt-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 bg-[#04413D] text-white py-2 rounded-lg hover:bg-[#04413D]/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}