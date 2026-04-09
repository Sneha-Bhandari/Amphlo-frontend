"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import Pagination from "@/Global/Pagination";

const RatingStars = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
};

const stripHtmlTags = (html) => {
  if (!html) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export default function TestimonialTable({ testimonials, onView, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = testimonials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); 
  };

  return (
    <div className=" rounded-lg  overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300  ">
          <thead className="bg-linear-to-r from-gray-200 to-gray-100">
            <tr className="text-center">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-[#04413D]/10 ">
            {currentItems.length > 0 ? (
              currentItems.map((testimonial, index) => {
                const imageUrl = testimonial.imageid?.imageUrl || null;
                const plainDescription = stripHtmlTags(testimonial.description);
                
                return (
                  <tr 
                    key={testimonial.id} 
                    className="hover:bg-linear-to-r hover:from-[#04413D]/20 hover:to-transparent transition-all duration-500 group cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 shadow-sm">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={testimonial.clientName}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{testimonial.clientName}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{testimonial.jobTitle}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{testimonial.companyName || "-"}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <RatingStars rating={testimonial.rating} />
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {plainDescription || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onView(testimonial)}
                          className="text-green-600 hover:text-green-700 transition-colors duration-200 transform hover:scale-110"
                          title="View"
                        >
                          <MdVisibility size={20} />
                        </button>
                        <button
                          onClick={() => onEdit(testimonial)}
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-200 transform hover:scale-110"
                          title="Edit"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => onDelete(testimonial)}
                          className="text-red-600 hover:text-red-700 transition-colors duration-200 transform hover:scale-110"
                          title="Delete"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-[#04413D] text-lg">No testimonials found</div>
                    <p className="text-[#04413D]/60 text-sm">Start by adding your first testimonial</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {testimonials.length > 0 && (
        <div className="px-6 py-4 ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            showItemsPerPage={true}
          />
        </div>
      )}
    </div>
  );
}