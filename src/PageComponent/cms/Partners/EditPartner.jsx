"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from 'react-hot-toast';
import { MdClose } from "react-icons/md";
import { patchData, uploadImageData } from "@/lib/frontendApi";

const PartnerSchema = Yup.object().shape({
  partnerName: Yup.string()
    .max(100, "Name must not exceed 100 characters")
    .optional(),
});

export default function EditPartner({ isOpen, onClose, onSuccess, partner }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (partner) {
      setData(partner);
      setPreview(null); 
    }
  }, [partner]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!data?.id) {
      toast.error("Partner ID is missing");
      return;
    }

    const loadingToast = toast.loading("Updating partner...");
    
    try {
      let imageId = data?.imageid?.id || data?.imageid || null;

      if (values.imageFile) {
        toast.loading("Uploading image...", { id: loadingToast });
        
        const uploadRes = await uploadImageData(values.imageFile);
        imageId = uploadRes?.id;
        
        if (!imageId) {
          throw new Error("Failed to upload image");
        }
        toast.success("Image uploaded successfully!", { id: loadingToast });
      } else if (values.imageRemoved) {
        imageId = null;
      }

      const payload = {
        partnerName: values.partnerName?.trim() || "",
        imageid: imageId,
      };
      
      await patchData(`partners/${data.id}`, payload);
      
      toast.success("Partner updated successfully!", { id: loadingToast });
      
      resetForm();
      setPreview(null);
      if (onSuccess) onSuccess();
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
            <p className="text-gray-600 text-sm mt-1">Edit partner information</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            enableReinitialize
            initialValues={{
              partnerName: data.partnerName || "",
              imageFile: null, 
              imageRemoved: false, 
            }}
            validationSchema={PartnerSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Image
                  </label>
                  
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Image size should be less than 5MB");
                          e.target.value = '';
                          return;
                        }
                        
                        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                        if (!validTypes.includes(file.type)) {
                          toast.error("Please upload a valid image (JPEG, PNG, WEBP)");
                          e.target.value = '';
                          return;
                        }
                        
                        setFieldValue("imageFile", file);
                        setFieldValue("imageRemoved", false);
                        if (preview) URL.revokeObjectURL(preview);
                        setPreview(URL.createObjectURL(file));
                        toast.success("Image selected successfully!");
                      } else {
                        setFieldValue("imageFile", null);
                        if (preview) {
                          URL.revokeObjectURL(preview);
                          setPreview(null);
                        }
                      }
                    }}
                  />

                  {(preview || (data?.imageid?.imageUrl && !values.imageRemoved)) && (
                    <div className="mt-4 relative group border-2 border-dashed hover:border-gray-900 cursor-pointer border-gray-400 rounded-lg items-center justify-center mx-auto flex flex-col">
                      <img
                        src={preview || data?.imageid?.imageUrl}
                        alt="Preview"
                        className="my-5 w-32 h-32 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (preview) URL.revokeObjectURL(preview);
                          setPreview(null);
                          setFieldValue("imageFile", null);
                          setFieldValue("imageRemoved", true);
                          toast.success("Image removed");
                        }}
                        className="absolute top-4 right-4 bg-red-500 text-white cursor-pointer rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Name (Optional)
                  </label>
                  <Field
                    name="partnerName"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                      errors.partnerName && touched.partnerName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter partner name (optional)"
                  />
                  <ErrorMessage name="partnerName" component="div" className="text-red-500 text-sm mt-1" />
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