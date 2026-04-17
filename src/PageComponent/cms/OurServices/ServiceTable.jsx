"use client";

import React, { useState } from "react";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import Pagination from "@/Global/Pagination";

export default function ServiceTable({ services, onView, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

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
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.N.</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-[#04413D]/10">
            {currentItems.length > 0 ? (
              currentItems.map((service, index) => {
                const serialNumber = indexOfFirstItem + index + 1;
                
                return (
                  <tr key={service.id} className="hover:bg-linear-to-r hover:from-[#04413D]/20 hover:to-transparent transition-all duration-500 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{serialNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{service.title}</div>
                    </td>
                    <td className="px-6 py-4">
                    <div
  className="text-sm md:text-base text-gray-600 leading-relaxed "
  dangerouslySetInnerHTML={{ __html: service.description }}
/>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button onClick={() => onView(service)} className="text-green-600 hover:text-green-700 transition-colors duration-200 transform hover:scale-110" title="View">
                          <MdVisibility size={20} />
                        </button>
                        <button onClick={() => onEdit(service)} className="text-blue-600 hover:text-blue-700 transition-colors duration-200 transform hover:scale-110" title="Edit">
                          <MdEdit size={20} />
                        </button>
                        <button onClick={() => onDelete(service)} className="text-red-600 hover:text-red-700 transition-colors duration-200 transform hover:scale-110" title="Delete">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div className="text-[#04413D] text-lg">No services found</div>
                    <p className="text-[#04413D]/60 text-sm">Start by adding your first service</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {services.length > 0 && (
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