"use client";

import React from "react";
import { MdClose } from "react-icons/md";

export default function ViewFaq({ isOpen, onClose, faq }) {
  if (!isOpen || !faq) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">FAQ Details</h2>
            <p className="text-gray-600 text-sm mt-1">View frequently asked question details</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Question</h3>
              <p className="text-lg font-medium text-gray-900">{faq.title}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Answer</h3>
              <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: faq.description }} />
              </div>
            </div> 
          </div>

          <div className="flex gap-3 pt-6 mt-6 ">
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