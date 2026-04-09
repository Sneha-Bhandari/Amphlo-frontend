"use client";

import React, { useState, useEffect } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import Pagination from "@/Global/Pagination";
import AddTeamMember from "@/PageComponent/cms/OurTeam/AddTeamMember";
import EditTeamMember from "@/PageComponent/cms/OurTeam/EditTeamMember";
import DeleteTeamMember from "@/PageComponent/cms/OurTeam/DeleteTeamMember";
import ViewTeamMember from "@/PageComponent/cms/OurTeam/ViewTeamMember";
import TeamMemberTable from "@/PageComponent/cms/OurTeam/TeamMemberTable";
import { Toaster } from "react-hot-toast";

export default function OurTeamCMS() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await fetchData("our-team");
      if (Array.isArray(data)) {
        setTeamMembers(data);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        setTeamMembers([data]);
      } else {
        setTeamMembers([]);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleDelete = (member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const uniquePositions = [...new Set(teamMembers.map(member => member.position).filter(Boolean))];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = filterPosition === "all" || member.position === filterPosition;
    
    return matchesSearch && matchesPosition;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPosition]);

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
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-[#04413D]">Team Members Management</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their information</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#04413D] text-white px-4 py-2 cursor-pointer transition-colors duration-500 rounded-lg hover:bg-[#04413D]/80 ease-in-out hover:scale-103 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Team Member
          </button>
        </div>

       
          

          <div className="text-sm text-gray-600 flex justify-end mx-auto mb-5">
            Total: {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
          </div>
       

        <TeamMemberTable 
          teamMembers={paginatedMembers}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {filteredMembers.length > itemsPerPage && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <AddTeamMember 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchTeamMembers}
      />

      <ViewTeamMember 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        teamMember={selectedMember}
      />

      <EditTeamMember 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchTeamMembers}
        teamMember={selectedMember}
      />

      <DeleteTeamMember 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={fetchTeamMembers}
        teamMember={selectedMember}
      />
    </div>
  );
}