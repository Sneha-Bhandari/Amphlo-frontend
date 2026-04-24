"use client";

import React, { useEffect, useState } from "react";
import {
  MdVisibility,
  MdEdit,
  MdDelete,
  MdLocationOn,
  MdSchool,
} from "react-icons/md";
import Pagination from "@/Global/Pagination";
import toast from "react-hot-toast";
import { fetchData } from "@/lib/frontendApi";

export default function CountryTable({ onView, onEdit, onDelete }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadCountries = async () => {
    setLoading(true);
    try {
      const res = await fetchData("countries/");
      setCountries(res?.data || []);
    } catch {
      toast.error("Failed to load countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = countries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(countries.length / itemsPerPage);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading countries...
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          Countries List
        </h2>

        <div className="text-sm text-gray-500">
          Total: {countries.length}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 text-left">#</th>
              <th className="px-5 py-3 text-left">Country</th>
              <th className="px-5 py-3 text-left">Stats</th>
              <th className="px-5 py-3 text-left">Description</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {currentItems.map((c, i) => (
              <tr
                key={c.id}
                className="hover:bg-gray-50 transition"
              >

                {/* INDEX */}
                <td className="px-5 py-4 text-sm text-gray-500">
                  {indexOfFirstItem + i + 1}
                </td>

                {/* COUNTRY */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {c.imageid?.imageUrl ? (
                      <img
                        src={c.imageid.imageUrl}
                        className="w-10 h-10 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        No
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">Country</p>
                    </div>
                  </div>
                </td>

                {/* STATS */}
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-2">

                    <span className="flex items-center gap-2 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full w-fit">
                      <MdLocationOn />
                      {c.stateCount || 0} States
                    </span>

                    <span className="flex items-center gap-2 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full w-fit">
                      <MdSchool />
                      {c.universityCount || 0} Universities
                    </span>

                  </div>
                </td>

                {/* DESCRIPTION */}
                <td className="px-5 py-4 text-sm text-gray-600 max-w-xs">
                  <p className="line-clamp-2">
                    {c.description || "No description available"}
                  </p>
                </td>

                {/* ACTIONS */}
                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onView(c)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                    >
                      <MdVisibility />
                    </button>

                    <button
                      onClick={() => onEdit(c)}
                      className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition"
                    >
                      <MdEdit />
                    </button>

                    <button
                      onClick={() => onDelete(c)}
                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition"
                    >
                      <MdDelete />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      {countries.length > itemsPerPage && (
        <div className="p-4 border-t bg-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(v) => {
              setItemsPerPage(v);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}