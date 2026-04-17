"use client";

import React, { useState, useEffect } from "react";
import { fetchData, deleteData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";
import AddTeamMember from "../../../../PageComponent/cms/OurTeam/AddTeamMember";
import EditTeamMember from "../../../../PageComponent/cms/OurTeam/EditTeamMember";
import DeleteTeamMember from "../../../../PageComponent/cms/OurTeam/DeleteTeamMember";
import ViewTeamMember from "../../../../PageComponent/cms/OurTeam/ViewTeamMember";
import TeamMemberTable from "../../../../PageComponent/cms/OurTeam/TeamMemberTable";
import { Toaster } from "react-hot-toast";

export default function OurTeamCMS() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
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

  const handleDeleteTeamMember = async (memberId) => {
    try {
      await deleteData(`our-team/${memberId}`);
      await fetchTeamMembers();
      return true;
    } catch (error) {
      console.error("Error deleting team member:", error);
      throw error;
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

  // Get unique positions for filter
  const uniquePositions = [...new Set(teamMembers.map(member => member.position).filter(Boolean))];

  // Filter team members based on search and position
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = filterPosition === "all" || member.position === filterPosition;
    
    return matchesSearch && matchesPosition;
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

          {/* Search and Filter Section */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by name, position, email or phone..."
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
            
            {uniquePositions.length > 0 && (
              <div className="relative">
                <select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="all">All Positions</option>
                  {uniquePositions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 flex justify-end mb-5">
            Total: {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
          </div>

          <TeamMemberTable 
            teamMembers={filteredMembers}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
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
        onDelete={handleDeleteTeamMember}
      />
    </>
  );
}