"use client";

import React, { useState, useEffect, useCallback } from "react";
import { fetchData, deleteData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import AddCountry from "../../../../PageComponent/cms/Countries/AddCountry";
import EditCountry from "../../../../PageComponent/cms/Countries/EditCountry";
import DeleteCountry from "../../../../PageComponent/cms/Countries/DeleteCountry";
import ViewCountry from "../../../../PageComponent/cms/Countries/ViewCountry";
import CountryTable from "../../../../PageComponent/cms/Countries/CountryTable";
import { Toaster } from "react-hot-toast";

export default function CountriesCMS() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  /* ---------------- FETCH ---------------- */
  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchData("countries");

      if (Array.isArray(data)) {
        setCountries(data);
      } else {
        setCountries(data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  /* ---------------- DELETE ---------------- */
  const handleDeleteCountry = async (countryId) => {
    await deleteData(`countries/${countryId}`);
    await fetchCountries();
  };

  const handleView = (country) => {
    setSelectedCountry(country);
    setIsViewModalOpen(true);
  };

  const handleEdit = (country) => {
    setSelectedCountry(country);
    setIsEditModalOpen(true);
  };

  const handleDelete = (country) => {
    setSelectedCountry(country);
    setIsDeleteModalOpen(true);
  };

  /* ---------------- FILTER ---------------- */
  const uniqueCategories = [
    ...new Set(countries.flatMap((c) => c.categories || [])),
  ];

  const filteredCountries = countries.filter((country) => {
    const matchesSearch =
      country.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      (country.categories || []).includes(filterCategory);

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-6">
        <Toaster />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#04413D]">
              Countries Management
            </h1>
            <p className="text-gray-500">
              Manage countries, states, universities
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#04413D] text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            + Add Country
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">

          <input
            className="border px-4 py-2 rounded-lg w-full md:w-1/2"
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded-lg"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="text-right text-sm text-gray-500 mb-3">
          Total: {filteredCountries.length}
        </div>

        {/* TABLE (NOW CLEAN) */}
        <CountryTable
          countries={filteredCountries}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* MODALS */}
      <AddCountry
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchCountries}
      />

      <ViewCountry
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        country={selectedCountry}
      />

      <EditCountry
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        country={selectedCountry}
        onSuccess={fetchCountries}
      />

      <DeleteCountry
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        country={selectedCountry}
        onDelete={handleDeleteCountry}
      />
    </>
  );
}