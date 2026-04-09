"use client";

import React, { useState, useEffect } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import Pagination from "@/Global/Pagination";
import AddTestimonial from "@/PageComponent/cms/Testimonial/AddTestimonial";
import EditTestimonial from "@/PageComponent/cms/Testimonial/EditTestimonial";
import DeleteTestimonial from "@/PageComponent/cms/Testimonial/DeleteTestimonial";
import ViewTestimonial from "@/PageComponent/cms/Testimonial/ViewTestimonial";
import TestimonialTable from "@/PageComponent/cms/Testimonial/TestimonialTable";
import { Toaster } from "react-hot-toast";

export default function TestimonialsCMS() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await fetchData("testimonial");
      if (Array.isArray(data)) {
        setTestimonials(data);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        setTestimonials([data]);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsViewModalOpen(true);
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsEditModalOpen(true);
  };

  const handleDelete = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteModalOpen(true);
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = 
      testimonial.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === "all" || testimonial.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  });

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const paginatedTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRating]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6">
      <Toaster position="top-right" />
      <div className="w-full mx-auto ">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-[#04413D]">Testimonials Management</h1>
            <p className="text-gray-600 mt-1">Manage client testimonials and reviews</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#04413D] text-white px-4 py-2 cursor-pointer transition-colors duration-500  rounded-lg hover:bg-[#04413D]/80 ease-in-out hover:scale-103 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Testimonial
          </button>
        </div>

       

        <TestimonialTable 
          testimonials={paginatedTestimonials}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {filteredTestimonials.length > itemsPerPage && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <AddTestimonial 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchTestimonials}
      />

      <ViewTestimonial 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        testimonial={selectedTestimonial}
      />

      <EditTestimonial 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchTestimonials}
        testimonial={selectedTestimonial}
      />

      <DeleteTestimonial 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={fetchTestimonials}
        testimonial={selectedTestimonial}
      />
    </div>
  );
}