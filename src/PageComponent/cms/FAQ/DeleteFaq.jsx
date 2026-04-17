"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdClose } from "react-icons/md";

export default function DeleteFaq({ isOpen, onClose, onSuccess, faq, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!faq?.id) {
      toast.error("FAQ ID is missing");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Deleting FAQ...");
    
    try {
      await onDelete(faq.id);
      toast.success("FAQ deleted successfully", { id: loadingToast });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error(error.message || "Failed to delete FAQ", { 
        id: loadingToast,
        duration: 4000 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !faq) return null;

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
            <h2 className="text-2xl font-bold text-red-600">Delete FAQ</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <MdClose size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete this FAQ?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-3">
              <p className="font-medium text-gray-900">{faq.title}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {faq.description?.replace(/<[^>]*>/g, '')}
              </p>
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