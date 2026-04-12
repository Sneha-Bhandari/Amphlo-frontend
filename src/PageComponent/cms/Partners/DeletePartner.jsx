"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { deleteData } from "@/lib/frontendApi";

export default function DeletePartner({ isOpen, onClose, onSuccess, partner }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!partner?.id) {
      toast.error("Partner ID is missing");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Deleting partner...");
    
    try {
      await deleteData(`partners/${partner.id}`);
      
      toast.success("Partner deleted successfully", { id: loadingToast });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error(error.message || "Failed to delete partner", { 
        id: loadingToast,
        duration: 4000 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !partner) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-red-600">Delete Partner</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <MdClose size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete this partner?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-3">
              <div className="flex items-center gap-3">
                {partner.imageid?.imageUrl ? (
                  <img 
                    src={partner.imageid.imageUrl} 
                    alt={partner.partnerName}
                    className="w-12 h-12 object-contain rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <p className="font-medium text-gray-900">{partner.partnerName}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}