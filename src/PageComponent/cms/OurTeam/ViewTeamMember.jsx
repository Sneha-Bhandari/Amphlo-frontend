"use client";

import React from "react";
import { MdClose, MdEmail, MdPhone } from "react-icons/md";

export default function ViewTeamMember({ isOpen, onClose, teamMember }) {
  if (!isOpen || !teamMember) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Team Member Details</h2>
            <p className="text-gray-600 text-sm mt-1">View team member information</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-100 border-4 border-[#04413D] shadow-lg">
                {teamMember.imageid?.imageUrl ? (
                  <img
                    src={teamMember.imageid.imageUrl}
                    alt={teamMember.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-2/3 space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Full Name</h3>
                <p className="text-lg font-medium text-gray-900">{teamMember.name}</p>
              </div>

              <div className="border-b pb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Position</h3>
                <p className="text-gray-800">{teamMember.position}</p>
              </div>

              <div className="border-b pb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Contact Information</h3>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MdEmail className="text-[#04413D]" size={18} />
                    <a href={`mailto:${teamMember.email}`} className="hover:text-[#04413D] transition-colors">
                      {teamMember.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MdPhone className="text-[#04413D]" size={18} />
                    <a href={`tel:${teamMember.phone}`} className="hover:text-[#04413D] transition-colors">
                      {teamMember.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

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