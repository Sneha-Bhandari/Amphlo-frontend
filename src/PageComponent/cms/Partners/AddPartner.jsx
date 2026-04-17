"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { postData, uploadImageData } from "@/lib/frontendApi";

const PartnerSchema = Yup.object().shape({
  imageid: Yup.mixed().required("Partner image is required"),
});

export default function AddPartner({ isOpen, onClose, onSuccess }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (file, setFieldValue, setTouched) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploadingImage(true);
    
    try {
      const res = await uploadImageData(file);
      console.log("Upload response:", res);
      setFieldValue("imageid", res?.id);
      setTouched({ imageid: true });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed");
      setImagePreview(null);
      setFieldValue("imageid", null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (!values.imageid) {
      toast.error("Please upload an image");
      setSubmitting(false);
      return;
    }

    const t = toast.loading("Adding partner...");

    try {
      const payload = {
        imageid: values.imageid,
      };
      
      console.log("Sending payload:", payload);
      
      const response = await postData("partners", payload);
      console.log("Response:", response);

      toast.success("Partner added!", { id: t });
      resetForm();
      setImagePreview(null);
      onSuccess?.();
      onClose();
    } catch (e) {
      console.error("Error:", e);
      toast.error(e.message || "Failed", { id: t });
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
            <h2 className="text-2xl font-bold text-[#04413D]">Add Partner</h2>
            <p className="text-gray-600 text-sm mt-1">Add a new partner logo</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            initialValues={{
              imageid: null,
            }}
            validationSchema={PartnerSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, setTouched, isSubmitting, errors, touched, submitForm }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Logo *
                  </label>
                  {imagePreview ? (
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-contain border-2 border-[#04413D] rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFieldValue("imageid", null);
                          setTouched({ imageid: false });
                        }}
                        className="text-red-600 flex items-center gap-1 hover:text-red-700"
                      >
                        <MdClose /> Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-lg p-8 block text-center cursor-pointer hover:border-[#04413D] transition-colors border-gray-300">
                      <MdCloudUpload size={48} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Click to upload image</p>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(file, setFieldValue, setTouched);
                          }
                        }}
                      />
                    </label>
                  )}
                  {touched.imageid && errors.imageid && !imagePreview && (
                    <div className="text-red-500 text-sm mt-1">{errors.imageid}</div>
                  )}
                  {uploadingImage && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setTouched({ imageid: true });
                      submitForm();
                    }}
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
                        {uploadingImage ? "Uploading Image..." : "Adding..."}
                      </span>
                    ) : (
                      "Add Partner"
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