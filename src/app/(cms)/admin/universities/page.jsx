"use client";

import { useEffect, useState } from "react";
import { fetchData, deleteData } from "@/lib/frontendApi";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { MdDelete, MdEdit, MdVisibility, MdSchool, MdLocationOn, MdTrendingUp } from "react-icons/md";
import Pagination from "@/Global/Pagination";

export default function UniversityPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      const res = await fetchData("universities");
      setUniversities(res?.data || res || []);
    } catch (error) {
      console.error("Error fetching universities:", error);
      toast.error("Failed to load universities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);

    try {
      await deleteData(`universities/${deleteId}`);
      await loadUniversities(); // Refresh the list
      toast.success("University deleted successfully");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete university");
    } finally {
      setDeleting(false);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = universities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(universities.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen w-full p-6 bg-linear-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      
      <div className="w-full mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#04413D]">Universities Management</h1>
            <p className="text-gray-600 mt-1">Manage all universities in your system</p>
          </div>
          <Link
            href="/admin/universities/add"
            className="bg-[#04413D] text-white px-4 py-2 cursor-pointer transition-colors duration-500 rounded-lg hover:bg-[#04413D]/80 ease-in-out hover:scale-103 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add University
          </Link>
        </div>

        {/* University Table */}
        <div className="rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-linear-to-r from-gray-200 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.N.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">University</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ranking</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Programs</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Established</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-[#04413D]/10">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="w-16 h-16 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <div className="text-[#04413D] text-lg">Loading universities...</div>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <MdSchool className="w-16 h-16 text-gray-400" />
                        <div className="text-[#04413D] text-lg">No universities found</div>
                        <p className="text-[#04413D]/60 text-sm">Start by adding your first university</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((university, index) => {
                    const serialNumber = indexOfFirstItem + index + 1;
                    
                    return (
                      <tr 
                        key={university.id} 
                        className="hover:bg-linear-to-r hover:from-[#04413D]/20 hover:to-transparent transition-all duration-500 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{serialNumber}</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{university.universityName}</div>
                            <div className="text-xs text-gray-500">University</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MdLocationOn size={14} className="text-[#04413D]" />
                            <span className="text-sm text-gray-600">{university.location || "N/A"}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap min-w-12">
                          {university.ranking ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              <MdTrendingUp size={12} />
                              Rank {university.ranking}
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              Not Ranked
                            </span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {university.program || "N/A"}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {university.students || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {university.established || "N/A"}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex justify-center gap-3">
                            
                            <Link
                              href={`/admin/universities/edit/${university.id}`}
                              className="text-blue-600 hover:text-blue-700 transition-colors duration-200 transform hover:scale-110"
                              title="Edit University"
                            >
                              <MdEdit size={20} />
                            </Link>
                            <button
                              onClick={() => confirmDelete(university.id)}
                              className="text-red-600 hover:text-red-700 transition-colors duration-200 transform hover:scale-110"
                              title="Delete University"
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && universities.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPage={true}
            />
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <MdDelete className="text-red-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Delete University</h2>
              </div>
              
              <p className="text-gray-600 mt-2">
                Are you sure you want to delete this university? This action cannot be undone and will remove all associated data.
              </p>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}