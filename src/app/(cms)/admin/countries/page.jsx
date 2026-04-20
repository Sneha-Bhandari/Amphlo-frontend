// app/cms/countries/page.js
"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await fetchData("countries");
      if (Array.isArray(data)) {
        setCountries(data);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        setCountries([data]);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCountry = async (countryId) => {
    try {
      await deleteData(`countries/${countryId}`);
      await fetchCountries();
      return true;
    } catch (error) {
      console.error("Error deleting country:", error);
      throw error;
    }
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

  // Get unique categories for filter
  const uniqueCategories = [...new Set(countries.flatMap(c => c.categories || []))];

  // Filter countries based on search and category
  const filteredCountries = countries.filter(country => {
    const matchesSearch = 
      country.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || (country.categories || []).includes(filterCategory);
    
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
      <div className="min-h-screen w-full p-6">
        <Toaster position="top-right" />
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#04413D]">Countries Management</h1>
              <p className="text-gray-600 mt-1">Manage countries, states, and universities</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#04413D] text-white px-4 py-2 cursor-pointer transition-colors duration-500 rounded-lg hover:bg-[#04413D]/80 ease-in-out hover:scale-103 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Country
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by country name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {uniqueCategories.length > 0 && (
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 flex justify-end mb-5">
            Total: {filteredCountries.length} countr{filteredCountries.length !== 1 ? 'ies' : 'y'}
          </div>

          <CountryTable 
            countries={filteredCountries}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <AddCountry 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchCountries}
      />

<ViewCountry 
  isOpen={isViewModalOpen}
  onClose={() => setIsViewModalOpen(false)}
  country={selectedCountry}
  onSuccess={fetchCountries}  // Add this line
/>

      <EditCountry 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchCountries}
        country={selectedCountry}
      />

      <DeleteCountry 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={fetchCountries}
        country={selectedCountry}
        onDelete={handleDeleteCountry}
      />
    </>
  );
}