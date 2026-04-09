"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MdVisibility, MdEdit, MdDelete, MdEmail, MdPhone } from "react-icons/md";
import Pagination from "@/Global/Pagination";

export default function TeamMemberTable({ teamMembers, onView, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = teamMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(teamMembers.length / itemsPerPage);

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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-[#04413D]/10">
            {currentItems.length > 0 ? (
              currentItems.map((member, index) => {
                const imageUrl = member.imageid?.imageUrl || null;
                
                return (
                  <tr 
                    key={member.id} 
                    className="hover:bg-linear-to-r hover:from-[#04413D]/20 hover:to-transparent transition-all duration-500 group cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 shadow-sm">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={member.name}
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
                      <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{member.position}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MdEmail size={14} className="text-gray-400" />
                        <span className="truncate max-w-[20vh]">{member.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MdPhone size={14} className="text-gray-400" />
                        <span>{member.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onView(member)}
                          className="text-green-600 hover:text-green-700 transition-colors duration-200 transform hover:scale-110"
                          title="View"
                        >
                          <MdVisibility size={20} />
                        </button>
                        <button
                          onClick={() => onEdit(member)}
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-200 transform hover:scale-110"
                          title="Edit"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => onDelete(member)}
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
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div className="text-[#04413D] text-lg">No team members found</div>
                    <p className="text-[#04413D]/60 text-sm">Start by adding your first team member</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {teamMembers.length > 0 && (
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