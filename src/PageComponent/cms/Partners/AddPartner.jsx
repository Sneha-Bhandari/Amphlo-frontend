"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import { MdClose } from "react-icons/md";
import { postData, uploadImageData } from "@/lib/frontendApi";

const PartnerSchema = Yup.object().shape({
  images: Yup.mixed().required("Partner image is required"),
});

export default function AddPartner({ isOpen, onClose, onSuccess }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploadedImageId, setUploadedImageId] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setPreview(null);
      setUploadedImageId(null);
      setUploadingImage(false);
    }
  }, [isOpen]);

  const handleImageUpload = async (file, setFieldValue) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, WEBP, GIF)");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploadingImage(true);
    
    try {
      const uploadRes = await uploadImageData(file);
      console.log("Upload response:", uploadRes);
      
      const imageId = uploadRes?.id || uploadRes?.imageId || uploadRes?.data?.id;
      setUploadedImageId(imageId);
      setFieldValue("images", imageId);
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
      setPreview(null);
      setUploadedImageId(null);
      setFieldValue("images", null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (!uploadedImageId) {
      toast.error("Please upload a partner image");
      setSubmitting(false);
      return;
    }
  
    const toastId = toast.loading("Creating partner...");
    
    try {
      // Try different property names
      const payloadsToTry = [
        { image: uploadedImageId },      // Try 'image' first
        { Image: uploadedImageId },      // Try 'Image'
        { imageId: uploadedImageId },    // Try 'imageId'
        { image_id: uploadedImageId },   // Try 'image_id'
        { id: uploadedImageId },         // Try 'id'
      ];
      
      let lastError = null;
      
      for (const payload of payloadsToTry) {
        try {
          console.log("Trying payload:", payload);
          const result = await postData("partners", payload);
          console.log("Success with payload:", payload, result);
          
          toast.success("Partner created successfully!", { id: toastId });
          
          resetForm();
          setPreview(null);
          setUploadedImageId(null);
          if (onSuccess) onSuccess();
          onClose();
          return;
        } catch (err) {
          console.log("Failed with payload:", payload, err.message);
          lastError = err;
        }
      }
      
      throw lastError || new Error("No valid payload structure found");
      
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!", {
        id: toastId,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
            <h2 className="text-2xl font-bold text-[#04413D]">Add New Partner</h2>
            <p className="text-gray-600 text-sm mt-1">Add a new partner with image</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            enableReinitialize
            initialValues={{
              images: null,
            }}
            validationSchema={PartnerSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-lg">
                    Partner Image *
                  </label>
                  
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, setFieldValue);
                      }
                      e.target.value = '';
                    }}
                  />

                  {preview && (
                    <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center relative group">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={200}
                        height={150}
                        unoptimized
                        className="object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setUploadedImageId(null);
                          setFieldValue("images", null);
                          toast.success("Image removed");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {touched.images && errors.images && !preview && (
                    <div className="text-red-500 text-sm mt-1">{errors.images}</div>
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
                        {uploadingImage ? "Uploading Image..." : "Creating..."}
                      </span>
                    ) : (
                      "Create Partner"
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