"use client";

import React, { useState, useEffect } from "react";
import { fetchData, deleteData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import AddService from "@/PageComponent/cms/OurServices/AddService";
import EditService from "@/PageComponent/cms/OurServices/EditService";
import DeleteService from "@/PageComponent/cms/OurServices/DeleteService";
import ViewService from "@/PageComponent/cms/OurServices/ViewService";
import ServicesTable from "@/PageComponent/cms/OurServices/ServiceTable";
import { Toaster } from "react-hot-toast";

export default function ServicesCms() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await fetchData("our-services");
      console.log("Fetched services:", data);
      
      if (Array.isArray(data)) {
        setServices(data);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        setServices([data]);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteData(`our-services/${serviceId}`);
      await fetchServices();
      return true;
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  };

  const handleView = (service) => {
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const filteredServices = services.filter(service => {
    return service.title?.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="min-h-screen w-full p-6 mt-16">
        <Toaster position="top-right" />
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-[#04413D]">Services Management</h1>
              <p className="text-gray-600 mt-1">Manage services with title and description</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#04413D] text-white px-4 py-2 cursor-pointer transition-colors duration-500 rounded-lg hover:bg-[#04413D]/80 ease-in-out hover:scale-103 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Service
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

          <ServicesTable 
            services={filteredServices}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <AddService 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchServices}
      />

      <ViewService 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        service={selectedService}
      />

      <EditService 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchServices}
        service={selectedService}
      />

      <DeleteService 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={fetchServices}
        service={selectedService}
        onDelete={handleDeleteService}
      />
    </>
  );
}