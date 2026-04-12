"use client";

import React, { useState } from "react";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import Pagination from "@/Global/Pagination";

export default function FaqTable({ faqs, onView, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = faqs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(faqs.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); 
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-linear-to-r from-gray-200 to-gray-100">
            <tr className="text-center">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.N.</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Question</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Answer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-[#04413D]/10">
            {currentItems.length > 0 ? (
              currentItems.map((faq, index) => {
                const serialNumber = indexOfFirstItem + index + 1;
                
                return (
                  <tr 
                    key={faq.id} 
                    className="hover:bg-linear-to-r hover:from-[#04413D]/20 hover:to-transparent transition-all duration-500 group cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{serialNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {faq.title?.length > 80 ? `${faq.title.substring(0, 80)}...` : faq.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
  <div className="text-sm text-gray-600">
    {faq.description?.replace(/<[^>]*>/g, '').length > 100 
      ? `${faq.description?.replace(/<[^>]*>/g, '').substring(0, 100)}...` 
      : faq.description?.replace(/<[^>]*>/g, '')}
  </div>
</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onView(faq)}
                          className="text-green-600 hover:text-green-700 transition-colors duration-200 transform hover:scale-110"
                          title="View"
                        >
                          <MdVisibility size={20} />
                        </button>
                        <button
                          onClick={() => onEdit(faq)}
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-200 transform hover:scale-110"
                          title="Edit"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => onDelete(faq)}
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
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-[#04413D] text-lg">No FAQs found</div>
                    <p className="text-[#04413D]/60 text-sm">Start by adding your first FAQ</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {faqs.length > 0 && (
        <div className="px-6 py-4">
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