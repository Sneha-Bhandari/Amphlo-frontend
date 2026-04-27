"use client";

import React, { useEffect, useState } from "react";
import { MdClose, MdAdd, MdLocationOn, MdSchool, MdDelete, MdCloudUpload } from "react-icons/md";
import { fetchData, postData, uploadImageData, deleteData } from "@/lib/frontendApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/Global/Loading";

const getCategoryStyles = (category) => {
  const styles = {
    "most-popular": { bg: "bg-orange-100", text: "text-orange-700", icon: "🔥", label: "Most Popular" },
    "top-ranked": { bg: "bg-purple-100", text: "text-purple-700", icon: "🏆", label: "Top Ranked" },
    "emerging": { bg: "bg-green-100", text: "text-green-700", icon: "📈", label: "Emerging" },
    "budget-friendly": { bg: "bg-blue-100", text: "text-blue-700", icon: "💰", label: "Budget Friendly" },
    "study-abroad": { bg: "bg-pink-100", text: "text-pink-700", icon: "🌍", label: "Study Abroad" },
  };
  return styles[category] || { bg: "bg-gray-100", text: "text-gray-700", icon: "📌", label: category };
};

export default function ViewCountry({ isOpen, onClose, country }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [stateName, setStateName] = useState("");
  const [stateImage, setStateImage] = useState(null);
  const [stateImagePreview, setStateImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingStateId, setDeletingStateId] = useState(null);
  const [hoveredStateId, setHoveredStateId] = useState(null);

  const id = country?.id;
  const router = useRouter();

  const loadCountry = async () => {
    try {
      setLoading(true);
      const res = await fetchData(`countries/${id}/details`);
      setData(res?.data || res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load country details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && id) loadCountry();
  }, [isOpen, id]);

  if (!isOpen) return null;

  const statesList = data?.states || [];
  const categoryStyle = getCategoryStyles(data?.category);

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file);
    setStateImagePreview(previewUrl);
    setUploadingImage(true);
    
    try {
      const res = await uploadImageData(file);
      setStateImage(res?.id);
      toast.success("Image uploaded successfully");
      return res?.id;
    } catch (err) {
      toast.error("Image upload failed");
      setStateImagePreview(null);
      setStateImage(null);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddState = async () => {
    if (!stateName.trim()) {
      return toast.error("State name required");
    }

    try {
      setAdding(true);
      const toastId = toast.loading("Adding state...");
      
      let imageid = null;
      if (stateImage) {
        imageid = stateImage;
      }

      await postData("states", {
        name: stateName,
        countryId: id,
        imageid: imageid,
      });

      toast.success("State added successfully", { id: toastId });
      setStateName("");
      setStateImage(null);
      setStateImagePreview(null);
      setShowForm(false);
      await loadCountry();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to add state");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteState = async (stateId, stateName) => {
    if (!confirm(`Are you sure you want to delete "${stateName}"? This will also delete all universities in this state.`)) {
      return;
    }

    setDeletingStateId(stateId);
    const toastId = toast.loading(`Deleting ${stateName}...`);

    try {
      await deleteData(`states/${stateId}`);
      toast.success(`${stateName} deleted successfully`, { id: toastId });
      await loadCountry();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to delete state", { id: toastId });
    } finally {
      setDeletingStateId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Country Details</h2>
            <p className="text-gray-600 text-sm">View country & states information</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <Loading/>
          ) : (
            <>
              <div className="flex gap-8 mb-8 pb-8 border-b">
                <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 border-4 border-[#04413D]">
                  {data?.imageid?.imageUrl ? (
                    <img
                      src={data.imageid.imageUrl}
                      className="w-full h-full object-cover"
                      alt={data?.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl">🌍</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-[#04413D]">{data?.name}</h1>
                    {data?.category && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                        <span>{categoryStyle.icon}</span>
                        <span>{categoryStyle.label}</span>
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mt-2 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MdLocationOn /> {statesList.length} States
                    </span>
                    <span className="flex items-center gap-1">
                      <MdSchool /> {data?.universityCount || 0} Universities
                    </span>
                  </p>

                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="mt-3 flex items-center gap-1 text-sm text-white bg-[#04413D] px-4 py-2 rounded-lg hover:opacity-90"
                  >
                    <MdAdd /> Add State
                  </button>
                </div>
              </div>

              {/* Add State Form with Improved Image Upload */}
              {showForm && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-3 text-lg">Add New State</h3>
                  
                  {/* State Name Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State Name *
                    </label>
                    <input
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="Enter state name (e.g., California, Ontario, England)"
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] focus:border-transparent"
                    />
                  </div>

                  {/* State Image Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State Image (Optional)
                    </label>
                    
                    {stateImagePreview ? (
                      <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                        <img
                          src={stateImagePreview}
                          alt="State preview"
                          className="w-20 h-20 rounded-lg object-cover border-2 border-[#04413D]"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Image uploaded successfully</p>
                          <button
                            type="button"
                            onClick={() => {
                              if (stateImagePreview) URL.revokeObjectURL(stateImagePreview);
                              setStateImagePreview(null);
                              setStateImage(null);
                            }}
                            className="mt-2 text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
                          >
                            <MdClose /> Remove Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 block text-center cursor-pointer hover:border-[#04413D] transition-colors bg-white">
                        <MdCloudUpload size={40} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600 text-sm">Click to upload state image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                        />
                      </label>
                    )}
                    
                    {uploadingImage && (
                      <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading image...
                      </p>
                    )}
                  </div>

                  {/* Form Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleAddState}
                      disabled={adding || uploadingImage || !stateName.trim()}
                      className="flex-1 bg-[#04413D] text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {adding ? "Adding..." : "Save State"}
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setStateName("");
                        setStateImage(null);
                        if (stateImagePreview) URL.revokeObjectURL(stateImagePreview);
                        setStateImagePreview(null);
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-semibold text-[#04413D] mb-3">Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: data?.description }} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#04413D] mb-3">States & Regions</h3>
                {statesList.length === 0 ? (
                  <p className="text-gray-500">No states found. Click "Add State" to create one.</p>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {statesList.map((state) => (
                      <div
                        key={state.id}
                        className="relative border p-4 rounded-lg hover:shadow-lg transition-all duration-300 group"
                        onMouseEnter={() => setHoveredStateId(state.id)}
                        onMouseLeave={() => setHoveredStateId(null)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {state.imageid?.imageUrl ? (
                            <img
                              src={state.imageid.imageUrl}
                              className="w-12 h-12 rounded-lg object-cover"
                              alt={state.name}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                              <MdLocationOn size={20} />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{state.name}</h4>
                            <p className="text-xs text-gray-500">
                              Universities: {state.universities?.length || 0}
                            </p>
                          </div>
                        </div>
                        
                        {/* Delete Button - Appears on Hover */}
                        {hoveredStateId === state.id && (
                          <button
                            onClick={() => handleDeleteState(state.id, state.name)}
                            disabled={deletingStateId === state.id}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete State"
                          >
                            {deletingStateId === state.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <MdDelete size={16} />
                            )}
                          </button>
                        )}
                        
                        {/* View Universities Button */}
                        <button
                          className="mt-3 text-xs text-[#04413D] hover:underline flex items-center gap-1 transition-all hover:gap-2"
                          onClick={() => {
                            router.push(`/admin/universities?stateId=${state.id}&stateName=${encodeURIComponent(state.name)}&countryName=${encodeURIComponent(data?.name)}`);
                          }}
                        >
                          <MdSchool size={12} />
                          View {state.universities?.length || 0} universities
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t">
          <button onClick={onClose} className="w-full bg-[#04413D] text-white py-2 rounded hover:opacity-90">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}