"use client";

import React, { useState, useEffect } from "react";
import { fetchData, deleteData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import AddPartner from "../../../../PageComponent/cms/Partners/AddPartner";
import EditPartner from "../../../../PageComponent/cms/Partners/EditPartner";
import DeletePartner from "../../../../PageComponent/cms/Partners/DeletePartner";
import ViewPartner from "../../../../PageComponent/cms/Partners/ViewPartner";
import PartnerTable from "../../../../PageComponent/cms/Partners/PartnerTable";
import { Toaster } from "react-hot-toast";

export default function PartnersCMS() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await fetchData("partners");
      console.log("Fetched partners:", JSON.stringify(data, null, 2));
      
      if (Array.isArray(data)) {
        setPartners([...data]); // Create new array to force re-render
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
  const handleDeletePartner = async (partnerId) => {
    try {
      await deleteData(`partners/${partnerId}`);
      await fetchPartners();
      return true;
    } catch (error) {
      console.error("Error deleting partner:", error);
      throw error;
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
              <h1 className="text-3xl font-bold text-[#04413D]">Partners Management</h1>
              <p className="text-gray-600 mt-1">Manage your partner logos</p>
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
          
          <div className="text-sm text-gray-600 flex justify-end mb-5">
            Total: {partners.length} partner{partners.length !== 1 ? 's' : ''}
          </div>

          <PartnerTable 
            partners={partners}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

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
        onDelete={handleDeletePartner}
      />
    </>
  );
}