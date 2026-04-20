// PageComponent/cms/Countries/ViewCountry.js
"use client";

import React, { useState } from "react";
import { MdClose, MdAdd, MdSchool, MdLocationOn, MdStar, MdCalendarToday, MdPeople } from "react-icons/md";
import { patchData } from "@/lib/frontendApi";
import toast from "react-hot-toast";

export default function ViewCountry({ isOpen, onClose, country, onSuccess }) {
  const [selectedState, setSelectedState] = useState(null);
  const [showAddUniversity, setShowAddUniversity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUniversity, setNewUniversity] = useState({
    title: "",
    universityName: "",
    location: "",
    ranking: "",
    program: "",
    established: "",
    students: ""
  });

  if (!isOpen || !country) return null;

  const statesList = country?.states || [];
  const universitiesList = country?.universities || [];

  const handleAddUniversity = async () => {
    if (!newUniversity.universityName) {
      toast.error("University name is required");
      return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading("Adding university...");
    
    try {
      // Get current universities or initialize empty array
      const currentUniversities = country.universities || [];
      
      // Add new university
      const updatedUniversities = [...currentUniversities, newUniversity];
      
      // Update the country with new university
      await patchData(`countries/${country.id}`, {
        universities: updatedUniversities
      });
      
      toast.success("University added successfully!", { id: loadingToast });
      setShowAddUniversity(false);
      setNewUniversity({
        title: "",
        universityName: "",
        location: "",
        ranking: "",
        program: "",
        established: "",
        students: ""
      });
      
      // Refresh the data
      if (onSuccess) await onSuccess();
      
    } catch (error) {
      console.error("Error adding university:", error);
      toast.error(error.message || "Failed to add university", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Country Details</h2>
            <p className="text-gray-600 text-sm mt-1">View country information and manage universities</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Country Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8 pb-8 border-b">
            <div className="lg:w-1/4 flex justify-center">
              <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-gray-100 border-4 border-[#04413D] shadow-lg">
                {country.imageid?.imageUrl ? (
                  <img
                    src={country.imageid.imageUrl}
                    alt={country.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-3/4 space-y-3">
              <h1 className="text-3xl font-bold text-[#04413D]">{country.name}</h1>
              {(country.categories || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {country.categories.map((cat, i) => (
                    <span key={i} className="text-sm px-3 py-1 bg-[#FDC653]/20 rounded-full text-gray-700">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-4 text-sm text-gray-600">
                <span>📊 {statesList.length} States</span>
                <span>🎓 {universitiesList.length} Universities</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#04413D] mb-3">Description</h3>
            <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: country.description }} />
            </div>
          </div>

          {/* States Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#04413D] mb-3">States & Regions</h3>
            {statesList.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No states added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statesList.map((state, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-[#04413D] text-lg mb-2">{state.name || state}</h4>
                    <button
                      onClick={() => {
                        setSelectedState(state);
                        setShowAddUniversity(true);
                      }}
                      className="text-[#04413D] hover:text-[#04413D]/80 flex items-center gap-1 text-sm mt-2"
                    >
                      <MdAdd /> Add University to this State
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Universities Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#04413D]">All Universities</h3>
              <button
                onClick={() => {
                  setSelectedState(null);
                  setShowAddUniversity(true);
                }}
                className="bg-[#04413D] text-white px-4 py-2 rounded-lg hover:bg-[#04413D]/80 flex items-center gap-2"
              >
                <MdAdd /> Add University
              </button>
            </div>
            
            {universitiesList.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <MdSchool size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No universities added yet</p>
                <button
                  onClick={() => setShowAddUniversity(true)}
                  className="mt-3 text-[#04413D] font-medium hover:underline"
                >
                  Add your first university
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {universitiesList.map((uni, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        {uni.title && (
                          <span className="text-xs text-[#04413D] bg-[#04413D]/10 px-2 py-1 rounded mb-2 inline-block">
                            {uni.title}
                          </span>
                        )}
                        <h4 className="font-semibold text-lg text-gray-800 mt-1">{uni.universityName || uni.name}</h4>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1"><MdLocationOn size={14} /> {uni.location}</span>
                          <span className="flex items-center gap-1"><MdStar size={14} className="text-yellow-500" /> {uni.ranking}</span>
                          {uni.program && <span>📚 {uni.program}</span>}
                          {uni.established && <span className="flex items-center gap-1"><MdCalendarToday size={14} /> {uni.established}</span>}
                          {uni.students && <span className="flex items-center gap-1"><MdPeople size={14} /> {uni.students}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add University Modal */}
        {showAddUniversity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#04413D]">
                  {selectedState ? `Add University to ${selectedState.name || selectedState}` : "Add New University"}
                </h3>
                <button onClick={() => setShowAddUniversity(false)} className="text-gray-400 hover:text-gray-600">
                  <MdClose size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                  <input
                    type="text"
                    value={newUniversity.title}
                    onChange={(e) => setNewUniversity({...newUniversity, title: e.target.value})}
                    placeholder="e.g., Top Engineering School"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University Name *</label>
                  <input
                    type="text"
                    value={newUniversity.universityName}
                    onChange={(e) => setNewUniversity({...newUniversity, universityName: e.target.value})}
                    placeholder="Enter university name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={newUniversity.location}
                    onChange={(e) => setNewUniversity({...newUniversity, location: e.target.value})}
                    placeholder="City, State"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ranking *</label>
                  <input
                    type="text"
                    value={newUniversity.ranking}
                    onChange={(e) => setNewUniversity({...newUniversity, ranking: e.target.value})}
                    placeholder="#1 in Country"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
                  <input
                    type="text"
                    value={newUniversity.program}
                    onChange={(e) => setNewUniversity({...newUniversity, program: e.target.value})}
                    placeholder="Computer Science, Business, etc."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Established</label>
                    <input
                      type="text"
                      value={newUniversity.established}
                      onChange={(e) => setNewUniversity({...newUniversity, established: e.target.value})}
                      placeholder="1950"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Students</label>
                    <input
                      type="text"
                      value={newUniversity.students}
                      onChange={(e) => setNewUniversity({...newUniversity, students: e.target.value})}
                      placeholder="10,000+"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
              </div>
              <div className="border-t px-6 py-4 flex gap-3">
                <button
                  onClick={handleAddUniversity}
                  disabled={loading}
                  className="flex-1 bg-[#04413D] text-white py-2 rounded-lg hover:bg-[#04413D]/90 disabled:bg-gray-400"
                >
                  {loading ? "Adding..." : "Add University"}
                </button>
                <button
                  onClick={() => setShowAddUniversity(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-6 mt-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 bg-[#04413D] text-white py-2 rounded-lg hover:bg-[#04413D]/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}