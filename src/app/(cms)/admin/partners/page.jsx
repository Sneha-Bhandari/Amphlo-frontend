"use client";

import React, { useState, useEffect } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import Pagination from "@/Global/Pagination";
import AddPartner from "@/PageComponent/cms/Partners/AddPartner";
import EditPartner from "@/PageComponent/cms/Partners/EditPartner";
import DeletePartner from "@/PageComponent/cms/Partners/DeletePartner";
import ViewPartner from "@/PageComponent/cms/Partners/ViewPartner";
import PartnerTable from "@/PageComponent/cms/Partners/PartnerTable";
import { Toaster } from "react-hot-toast";

export default function PartnersCMS() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await fetchData("partners");
      console.log("Fetched partners:", data);
      
      if (Array.isArray(data)) {
        setPartners(data);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        setPartners([data]);
      } else {
        setPartners([]);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (partner) => {
    setSelectedPartner(partner);
    setIsViewModalOpen(true);
  };

  const handleEdit = (partner) => {
    setSelectedPartner(partner);
    setIsEditModalOpen(true);
  };

  const handleDelete = (partner) => {
    setSelectedPartner(partner);
    setIsDeleteModalOpen(true);
  };

  const filteredPartners = partners.filter(partner => {
    const displayName = `Partner ${partners.indexOf(partner) + 1}`;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           partner.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const paginatedPartners = filteredPartners.slice(
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
              <h1 className="text-3xl font-bold text-[#04413D]">Partners Management</h1>
              <p className="text-gray-600 mt-1">Manage partner logos and information</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#04413D] text-white px-4 py-2 cursor-pointer transition-colors duration-500 rounded-lg hover:bg-[#04413D]/80 ease-in-out hover:scale-103 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Partner
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search by partner ID or name..."
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

          <PartnerTable 
            partners={paginatedPartners}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          {filteredPartners.length > itemsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals - Render outside the main div with higher z-index */}
      <AddPartner 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchPartners}
      />

      <ViewPartner 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        partner={selectedPartner}
      />

      <EditPartner 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchPartners}
        partner={selectedPartner}
      />

      <DeletePartner 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={fetchPartners}
        partner={selectedPartner}
      />
    </>
  );
}