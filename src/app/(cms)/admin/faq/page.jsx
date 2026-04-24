"use client";

import React, { useState, useEffect } from "react";
import { fetchData, deleteData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import AddFaq from "../../../../PageComponent/cms/FAQ/AddFaq";
import EditFaq from "../../../../PageComponent/cms/FAQ/EditFaq";
import DeleteFaq from "../../../../PageComponent/cms/FAQ/DeleteFaq";
import ViewFaq from "../../../../PageComponent/cms/FAQ/ViewFaq";
import FaqTable from "../../../../PageComponent/cms/FAQ/FaqTable";
import { Toaster } from "react-hot-toast";

export default function FaqsCMS() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const data = await fetchData("faq");
      console.log("Fetched FAQs:", data);
      
      if (Array.isArray(data)) {
        setFaqs(data);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        setFaqs([data]);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (faqId) => {
    try {
      await deleteData(`faq/${faqId}`);
      await fetchFaqs();
      return true;
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      throw error;
    }
  };

  const handleView = (faq) => {
    setSelectedFaq(faq);
    setIsViewModalOpen(true);
  };

  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setIsEditModalOpen(true);
  };

  const handleDelete = (faq) => {
    setSelectedFaq(faq);
    setIsDeleteModalOpen(true);
  };

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq => {
    return faq.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           faq.description?.toLowerCase().includes(searchTerm.toLowerCase());
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
              <h1 className="text-3xl font-bold text-[#04413D]">FAQ Management</h1>
              <p className="text-gray-600 mt-1">Manage frequently asked questions</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#04413D] text-white px-4 py-2 cursor-pointer transition-colors duration-500 rounded-lg hover:bg-[#04413D]/80 ease-in-out hover:scale-103 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add FAQ
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search by question or answer..."
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
          
          <div className="text-sm text-gray-600 flex justify-end mb-5">
            Total: {filteredFaqs.length} FAQ{filteredFaqs.length !== 1 ? 's' : ''}
          </div>

          <FaqTable 
            faqs={filteredFaqs}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <AddFaq 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchFaqs}
      />

      <ViewFaq 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        faq={selectedFaq}
      />

      <EditFaq 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchFaqs}
        faq={selectedFaq}
      />

      <DeleteFaq 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={fetchFaqs}
        faq={selectedFaq}
        onDelete={handleDeleteFaq}
      />
    </>
  );
}