"use client";

import React, { useState, useEffect } from "react";
import { fetchData, deleteData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import AddFeature from "@/PageComponent/cms/Features/AddFeature";
import EditFeature from "@/PageComponent/cms/Features/EditFeature";
import DeleteFeature from "@/PageComponent/cms/Features/DeleteFeature";
import ViewFeature from "@/PageComponent/cms/Features/ViewFeature";
import FeaturesTable from "@/PageComponent/cms/Features/FeaturesTable";
import { Toaster } from "react-hot-toast";

export default function FeaturesCMS() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const data = await fetchData("our-features");
      console.log("Fetched features:", data);
      
      if (Array.isArray(data)) {
        setFeatures(data);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        setFeatures([data]);
      } else {
        setFeatures([]);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeature = async (featureId) => {
    try {
      await deleteData(`our-features/${featureId}`);
      await fetchFeatures(); // Refresh the list
      return true;
    } catch (error) {
      console.error("Error deleting feature:", error);
      throw error;
    }
  };

  const handleView = (feature) => {
    setSelectedFeature(feature);
    setIsViewModalOpen(true);
  };

  const handleEdit = (feature) => {
    setSelectedFeature(feature);
    setIsEditModalOpen(true);
  };

  const handleDelete = (feature) => {
    setSelectedFeature(feature);
    setIsDeleteModalOpen(true);
  };

  const filteredFeatures = features.filter(feature => {
    return feature.title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredFeatures.length / itemsPerPage);
  const paginatedFeatures = filteredFeatures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-[#04413D]">Features Management</h1>
              <p className="text-gray-600 mt-1">Manage features with title and points</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#04413D] text-white px-4 py-2 cursor-pointer transition-colors duration-500 rounded-lg hover:bg-[#04413D]/80 ease-in-out hover:scale-103 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Feature
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search by title..."
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
          </div>

          <FeaturesTable 
            features={paginatedFeatures}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <AddFeature 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchFeatures}
      />

      <ViewFeature 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        feature={selectedFeature}
      />

      <EditFeature 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchFeatures}
        feature={selectedFeature}
      />

      <DeleteFeature 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={fetchFeatures}
        feature={selectedFeature}
        onDelete={handleDeleteFeature}
      />
    </>
  );
}