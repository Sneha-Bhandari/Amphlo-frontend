"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

export default function DeletePartner({ isOpen, onClose, onSuccess, partner, onDelete }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !partner) return null;

  const handleDelete = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Deleting partnership request...");
    try {
      await onDelete(partner.id);
      toast.success("Partnership request deleted successfully!", { id: loadingToast });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to delete partnership request", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-red-600">Delete Partnership Request</h2>
            <button onClick={onClose} className="text-gray-400">
              <MdClose size={24} />
            </button>
          </div>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete partnership request from <strong>{partner.firstName} {partner.lastName}</strong>?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm"><strong>Company:</strong> {partner.companyName}</p>
            <p className="text-sm"><strong>Email:</strong> {partner.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}