"use client";

import React from "react";
import { MdClose } from "react-icons/md";

export default function ViewPartner({ isOpen, onClose, partner }) {
  if (!isOpen || !partner) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Partner Details</h2>
            <p className="text-gray-600 text-sm mt-1">View partner logo</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-gray-100 border-4 border-[#04413D] shadow-lg">
              {partner.imageid?.imageUrl ? (
                <img
                  src={partner.imageid.imageUrl}
                  alt="Partner logo"
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
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