// PageComponent/cms/Countries/CountryTable.js
"use client";

import React, { useState } from "react";
import { MdVisibility, MdEdit, MdDelete, MdLocationOn, MdSchool } from "react-icons/md";
import Pagination from "@/Global/Pagination";

const stripHtmlTags = (html) => {
  if (!html) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export default function CountryTable({ countries = [], onView, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);

  const countriesArray = Array.isArray(countries) ? countries : [];
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = countriesArray.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(countriesArray.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (countriesArray.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden">
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="flex flex-col items-center justify-center gap-3">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-[#04413D] text-lg">No countries found</div>
            <p className="text-[#04413D]/60 text-sm">Start by adding your first country</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-linear-to-r from-gray-200 to-gray-100">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">S.N.</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">Image</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Country Name</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categories</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">States</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Universities</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-[#04413D]/10">
            {currentItems.map((country, index) => {
              const serialNumber = indexOfFirstItem + index + 1;
              const imageUrl = country?.imageid?.imageUrl || null;
              const plainDescription = stripHtmlTags(country?.description || "");
              const statesList = country?.states || [];
              const universitiesList = country?.universities || [];
              const isExpanded = expandedRow === country?.id;
              
              return (
                <React.Fragment key={country?.id || index}>
                  <tr 
                    className="hover:bg-linear-to-r hover:from-[#04413D]/20 hover:to-transparent transition-all duration-500 group cursor-pointer"
                    onClick={() => toggleExpandRow(country?.id)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{serialNumber}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 shadow-sm">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={country?.name || "Country"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{country?.name || "N/A"}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {country?.id}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(country?.categories || []).slice(0, 2).map((cat, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-[#FDC653]/20 rounded-md text-gray-600">
                            {cat}
                          </span>
                        ))}
                        {(country?.categories || []).length > 2 && (
                          <span className="text-xs px-2 py-1 bg-gray-200 rounded-md text-gray-600">
                            +{country.categories.length - 2}
                          </span>
                        )}
                        {(country?.categories || []).length === 0 && (
                          <span className="text-xs text-gray-400">No categories</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <MdLocationOn className="text-blue-500 text-sm" />
                          <span className="text-xs font-medium text-gray-600">
                            {statesList.length} State{statesList.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {statesList.slice(0, 2).map((state, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                              {state.name || state}
                            </span>
                          ))}
                          {statesList.length > 2 && (
                            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                              +{statesList.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <MdSchool className="text-green-500 text-sm" />
                          <span className="text-xs font-medium text-gray-600">
                            {universitiesList.length} Universit{universitiesList.length !== 1 ? 'ies' : 'y'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {universitiesList.slice(0, 2).map((uni, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full truncate max-w-[20vh]">
                              {uni.universityName || uni.name}
                            </span>
                          ))}
                          {universitiesList.length > 2 && (
                            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                              +{universitiesList.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        {plainDescription.length > 100 ? (
                          <>
                            {plainDescription.substring(0, 100)}...
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandRow(country?.id);
                              }}
                              className="text-blue-500 hover:text-blue-700 text-xs ml-1"
                            >
                              {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                          </>
                        ) : (
                          plainDescription || "No description"
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView && onView(country);
                          }}
                          className="text-green-600 hover:text-green-700 transition-colors duration-200 transform hover:scale-110 p-1"
                          title="View Details"
                        >
                          <MdVisibility size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit(country);
                          }}
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-200 transform hover:scale-110 p-1"
                          title="Edit Country"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete && onDelete(country);
                          }}
                          className="text-red-600 hover:text-red-700 transition-colors duration-200 transform hover:scale-110 p-1"
                          title="Delete Country"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row for detailed view */}
                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan="8" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* States Details */}
                          <div className="border rounded-lg p-4 bg-white">
                            <h4 className="font-semibold text-[#04413D] mb-3 flex items-center gap-2">
                              <MdLocationOn className="text-blue-500" />
                              States ({statesList.length})
                            </h4>
                            {statesList.length > 0 ? (
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {statesList.map((state, idx) => (
                                  <div key={idx} className="border-b pb-2 last:border-0">
                                    <div className="font-medium text-gray-800">{state.name || state}</div>
                                    {state.universities && state.universities.length > 0 && (
                                      <div className="mt-1 pl-4">
                                        <p className="text-xs text-gray-500">Universities in this state:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {state.universities.map((uni, uniIdx) => (
                                            <span key={uniIdx} className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                              {uni.universityName || uni.name}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">No states added</p>
                            )}
                          </div>
                          
                          {/* Universities Details */}
                          <div className="border rounded-lg p-4 bg-white">
                            <h4 className="font-semibold text-[#04413D] mb-3 flex items-center gap-2">
                              <MdSchool className="text-green-500" />
                              Universities ({universitiesList.length})
                            </h4>
                            {universitiesList.length > 0 ? (
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {universitiesList.map((uni, idx) => (
                                  <div key={idx} className="border-b pb-2 last:border-0">
                                    {uni.title && (
                                      <span className="text-xs text-[#04413D] bg-[#04413D]/10 px-2 py-0.5 rounded inline-block mb-1">
                                        {uni.title}
                                      </span>
                                    )}
                                    <div className="font-medium text-gray-800">{uni.universityName || uni.name}</div>
                                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                                      <div>📍 {uni.location}</div>
                                      <div>⭐ {uni.ranking}</div>
                                      <div>📚 {uni.program}</div>
                                      {uni.established && <div>📅 Established: {uni.established}</div>}
                                      {uni.students && <div>👨‍🎓 Students: {uni.students}</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">No universities added</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {countriesArray.length > itemsPerPage && (
        <div className="mt-4">
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