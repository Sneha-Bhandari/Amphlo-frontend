"use client";

import { useEffect, useState } from "react";
import { fetchData, deleteData } from "@/lib/frontendApi";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { MdDelete, MdEdit } from "react-icons/md";

export default function UniversityPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const loadUniversities = async () => {
    try {
      setLoading(true);
      const res = await fetchData("universities");
      setUniversities(res?.data || res || []);
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

      setUniversities((prev) =>
        prev.filter((u) => u.id !== deleteId)
      );

      toast.success("University deleted successfully");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete university");
    } finally {
      setDeleting(false);
    }
  };

  // pagination
  const totalPages = Math.ceil(universities.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = universities.slice(
    startIndex,
    startIndex + pageSize
  );

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 p-8">

      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">

        <div>
          <h1 className="text-4xl font-bold text-[#04413D]">
            Universities
          </h1>
          <p className="text-base text-gray-600 mt-1">
            Manage all universities in your system
          </p>
        </div>

        <Link
          href="/admin/universities/add"
          className="bg-[#04413D] hover:bg-[#03332f] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium transition"
        >
          + Add University
        </Link>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        <div className="px-6 py-5 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            University Directory
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-base">

            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-5 text-left">University</th>
                <th className="p-5 text-left">Location</th>
                <th className="p-5 text-left">Ranking</th>
                <th className="p-5 text-left">Program</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500 text-lg">
                    Loading universities...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400 text-lg">
                    No universities found
                  </td>
                </tr>
              ) : (
                paginatedData.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-5 font-semibold text-gray-900">
                      {u.universityName}
                    </td>

                    <td className="p-5 text-gray-700">
                      {u.location}
                    </td>

                    <td className="p-5">
                      <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        Rank {u.ranking}
                      </span>
                    </td>

                    <td className="p-5 text-gray-700">
                      {u.program}
                    </td>

                    <td className="p-5">
                      <div className="flex justify-end gap-3">

                        <Link
                          href={`/admin/universities/edit/${u.id}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-sm font-medium"
                        >
                          <MdEdit size={18} />
                          Edit
                        </Link>

                        <button
                          onClick={() => confirmDelete(u.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 text-sm font-medium"
                        >
                          <MdDelete size={18} />
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        {!loading && universities.length > pageSize && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">

            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">

              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-white border disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === i + 1
                      ? "bg-[#04413D] text-white"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-white border disabled:opacity-50"
              >
                Next
              </button>

            </div>

          </div>
        )}

      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-2xl">

            <h2 className="text-xl font-bold text-gray-800">
              Delete University
            </h2>

            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this university? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}