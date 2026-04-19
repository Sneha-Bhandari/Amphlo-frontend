"use client";

import React from "react";
import { MdClose } from "react-icons/md";

export default function ViewEnquiry({ isOpen, onClose, enquiry }) {
  if (!isOpen || !enquiry) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#04413D]">Enquiry Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Name</label>
              <p className="text-lg font-medium text-gray-900">{enquiry.name}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
              <p className="text-lg font-medium text-gray-900">{enquiry.email}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
              <p className="text-lg font-medium text-gray-900">{enquiry.phone}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
              <p className="text-lg font-medium text-gray-900">
                {new Date(enquiry.date).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{enquiry.message}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 bg-[#04413D] text-white py-2 rounded-lg hover:bg-[#04413D]/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}