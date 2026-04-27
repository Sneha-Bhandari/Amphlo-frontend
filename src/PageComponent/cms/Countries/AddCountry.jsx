"use client";

import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import toast, { Toaster } from 'react-hot-toast';
import { MdCloudUpload, MdClose } from "react-icons/md";
import { postData, uploadImageData } from "@/lib/frontendApi";

const schema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Country name must be at least 2 characters")
    .max(100, "Country name must not exceed 100 characters")
    .required("Country name is required"),
  
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  
  category: Yup.string()
    .required("Category is required"),
  
  // imageid: Yup.mixed().required("Image is required"),
});

const CATEGORY_OPTIONS = [
  "Most Popular",
  "Top Ranked",
  "Emerging",
  "Budget Friendly",
  "Study Abroad",
];

export default function AddCountry({ isOpen, onClose, onSuccess }) {
  // const editor = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = async (file, setFieldValue, setTouched) => {
    if (!file) return;

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploadingImage(true);
    
    try {
      const res = await uploadImageData(file);
      setFieldValue("imageid", res?.id);
      setTouched({ imageid: true });
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed");
      setImagePreview(null);
      setFieldValue("imageid", null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (!values.imageid) {
      toast.error("Please upload a country image");
      setSubmitting(false);
      return;
    }

    const loadingToast = toast.loading("Creating country...");
    
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description,
        category: values.category,
        imageid: values.imageid
      };
      
      await postData("countries/", payload);
      
      toast.success("Country created successfully!", { id: loadingToast });
      
      resetForm();
      setImagePreview(null);
      if (onSuccess) await onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating country:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create country";
      
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach(msg => toast.error(msg));
      } else {
        toast.error(errorMessage, { id: loadingToast });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            <h2 className="text-2xl font-bold text-[#04413D]">Add New Country</h2>
            <p className="text-gray-600 text-sm mt-1">Fill in the details to add a new country</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            initialValues={{
              name: "",
              description: "",
              category: "",
              imageid: null,
            }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, setTouched, isSubmitting, errors, touched, submitForm }) => (
              <Form className="space-y-6">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country Image *
                  </label>
                  {imagePreview ? (
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-[#04413D]"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Image uploaded successfully</p>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFieldValue("imageid", null);
                            setTouched({ imageid: false });
                          }}
                          className="mt-2 text-red-600 flex items-center gap-1 hover:text-red-700"
                        >
                          <MdClose /> Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className={`border-2 border-dashed rounded-lg p-8 block text-center cursor-pointer hover:border-[#04413D] transition-colors ${
                      touched.imageid && errors.imageid ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <MdCloudUpload size={48} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            // Validate file size
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error("Image size should be less than 5MB");
                              return;
                            }
                            handleImageUpload(file, setFieldValue, setTouched);
                          }
                        }}
                      />
                    </label>
                  )}
                  {touched.imageid && errors.imageid && (
                    <div className="text-red-500 text-sm mt-1">{errors.imageid}</div>
                  )}
                  {uploadingImage && (
                    <p className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading image...
                    </p>
                  )}
                </div>

                {/* Category Field */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="category"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] focus:border-transparent ${
                      errors.category && touched.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Name Field */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Country Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="name"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] focus:border-transparent ${
                      errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter country name"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <JoditEditor
                    // ref={editor}
                    value={values.description}
                    onBlur={(content) => {
                      setFieldValue("description", content);
                    }}
                    // config={{ 
                    //   height: 250,
                    //   placeholder: "Enter country description...",
                    // }}
                  />
                  {touched.description && errors.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setTouched({
                        name: true,
                        description: true,
                        category: true,
                        imageid: true,
                      });
                      submitForm();
                    }}
                    disabled={isSubmitting || uploadingImage}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                      isSubmitting || uploadingImage
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#04413D] hover:bg-[#0A6B63] text-white"
                    }`}
                  >
                    {isSubmitting || uploadingImage ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {uploadingImage ? "Uploading Image..." : "Creating Country..."}
                      </span>
                    ) : (
                      "Create Country"
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