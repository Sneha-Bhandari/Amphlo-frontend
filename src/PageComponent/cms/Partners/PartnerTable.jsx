"use client";

import React, { useState } from "react";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import Pagination from "@/Global/Pagination";

export default function PartnerTable({ partners, onView, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = partners.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(partners.length / itemsPerPage);

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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-[#04413D]/10">
            {currentItems.length > 0 ? (
              currentItems.map((partner, index) => {
                const serialNumber = indexOfFirstItem + index + 1;
                const imageUrl = partner.imageid?.imageUrl || null;
                
                return (
                  <tr 
                    key={partner.id} 
                    className="hover:bg-linear-to-r hover:from-[#04413D]/20 hover:to-transparent transition-all duration-500 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{serialNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 shadow-sm">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`Partner ${serialNumber}`}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onView(partner)}
                          className="text-green-600 hover:text-green-700 transition-colors duration-200 transform hover:scale-110"
                          title="View"
                        >
                          <MdVisibility size={20} />
                        </button>
                        <button
                          onClick={() => onEdit(partner)}
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-200 transform hover:scale-110"
                          title="Edit"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => onDelete(partner)}
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
                <td colSpan="3" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div className="text-[#04413D] text-lg">No partners found</div>
                    <p className="text-[#04413D]/60 text-sm">Start by adding your first partner</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {partners.length > 0 && (
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