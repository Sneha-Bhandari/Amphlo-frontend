"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from 'react-hot-toast';
import { MdCloudUpload, MdClose } from "react-icons/md";
import { patchData, uploadImageData } from "@/lib/frontendApi";

export default function EditPartner({ isOpen, onClose, onSuccess, partner }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (partner) {
      setData(partner);
      if (partner.imageid?.imageUrl) {
        setPreview(partner.imageid.imageUrl);
      }
    }
  }, [partner]);

  const handleImageUpload = async (file, setFieldValue) => {
    if (!file) return;

    // Create local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploadingImage(true);
    
    try {
      const res = await uploadImageData(file);
      console.log("Upload response:", res);
      
      if (res?.id) {
        setFieldValue("imageFile", res.id);
        setFieldValue("imageRemoved", false);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("No image ID returned");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed");
      // Revert to original image on error
      setPreview(data?.imageid?.imageUrl || null);
      setFieldValue("imageFile", null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!data?.id) {
      toast.error("Partner ID is missing");
      return;
    }

    const loadingToast = toast.loading("Updating partner...");
    
    try {
      let imageId = data?.imageid?.id || null;

      // If new image was uploaded
      if (values.imageFile && typeof values.imageFile === 'string') {
        imageId = values.imageFile;
      } 
      // If image was removed
      else if (values.imageRemoved) {
        imageId = null;
      }

      const payload = {};
      
      if (imageId) {
        payload.imageid = imageId;
      }

      console.log("Updating partner with payload:", payload);
      
      await patchData(`partners/${data.id}`, payload);
      
      toast.success("Partner updated successfully!", { id: loadingToast });
      
      // Refresh the partners list
      if (onSuccess) {
        await onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error("Error updating partner:", error);
      toast.error(error.message || "Failed to update partner", {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Edit Partner</h2>
            <p className="text-gray-600 text-sm mt-1">Edit partner logo</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            enableReinitialize
            initialValues={{
              imageFile: null,
              imageRemoved: false,
            }}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Logo
                  </label>
                  
                  {preview && !values.imageRemoved ? (
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-contain border-2 border-[#04413D] rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          // Clean up object URL if it's a blob
                          if (preview.startsWith('blob:')) {
                            URL.revokeObjectURL(preview);
                          }
                          setPreview(data?.imageid?.imageUrl || null);
                          setFieldValue("imageFile", null);
                          setFieldValue("imageRemoved", true);
                          toast.success("Image removed");
                        }}
                        className="text-red-600 flex items-center gap-1 hover:text-red-700"
                      >
                        <MdClose /> Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-lg p-8 block text-center cursor-pointer hover:border-[#04413D] transition-colors border-gray-300">
                      <MdCloudUpload size={48} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">
                        {values.imageRemoved ? "Click to upload new image" : "Click to upload new image"}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFieldValue("imageRemoved", false);
                            handleImageUpload(file, setFieldValue);
                          }
                          e.target.value = ''; // Reset input
                        }}
                      />
                    </label>
                  )}
                  {uploadingImage && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingImage}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                      isSubmitting || uploadingImage
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-[#FDC653] to-yellow-500 hover:from-yellow-600 hover:to-yellow-700 text-white"
                    }`}
                  >
                    {isSubmitting || uploadingImage ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {uploadingImage ? "Uploading Image..." : "Updating..."}
                      </span>
                    ) : (
                      "Update Partner"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}