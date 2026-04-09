"use client";

import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import toast, { Toaster } from 'react-hot-toast';
import { MdCloudUpload, MdClose } from "react-icons/md";

const TestimonialSchema = Yup.object().shape({
  clientName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Client name is required"),
  jobTitle: Yup.string()
    .min(2, "Job title must be at least 2 characters")
    .max(50, "Job title must not exceed 50 characters")
    .required("Job title is required"),
  companyName: Yup.string().max(50, "Company name must not exceed 50 characters"),
  rating: Yup.number()
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5")
    .required("Rating is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  imageid: Yup.mixed().required("Client image is required"),
});

export default function AddTestimonial({ isOpen, onClose, onSuccess }) {
  const editor = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = async (file, setFieldValue, setTouched) => {
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append("images", file);
    
      const uploadRes = await fetch(process.env.NEXT_PUBLIC_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
    
      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        console.error("UPLOAD ERROR:", errText);
        throw new Error("Upload failed");
      }
    
      const uploadData = await uploadRes.json();
      const imageId = uploadData.id;
      
      if (imageId) {
        setFieldValue("imageid", imageId);
        setTouched({ imageid: true }); // Mark as touched to remove validation error
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("No image ID returned from server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
      setImagePreview(null);
      setFieldValue("imageid", null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    // Check if image is uploaded
    if (!values.imageid) {
      toast.error("Please upload a client image");
      setSubmitting(false);
      return;
    }

    const loadingToast = toast.loading("Creating testimonial...");
    
    try {
      const payload = {
        clientName: values.clientName,
        jobTitle: values.jobTitle,
        companyName: values.companyName || "",
        description: values.description,
        rating: values.rating,
        imageid: values.imageid
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Create failed');
      }
      
      const result = await response.json();
      toast.success("Testimonial created successfully!", { id: loadingToast });
      
      resetForm();
      setImagePreview(null);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (error) {
      console.error("Error creating testimonial:", error);
      toast.error(error.message || "Failed to create testimonial", {
        id: loadingToast,
        duration: 4000,
      });
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
            <h2 className="text-2xl font-bold text-[#04413D]">Add New Testimonial</h2>
            <p className="text-gray-600 text-sm mt-1">Add a new client testimonial</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            initialValues={{
              clientName: "",
              jobTitle: "",
              companyName: "",
              rating: 5,
              description: "",
              imageid: null,
            }}
            validationSchema={TestimonialSchema}
            validateOnMount={false}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, setTouched, isSubmitting, errors, touched, submitForm }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Image *
                  </label>
                  {imagePreview ? (
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-[#04413D]"
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
                    <label className={`border-2 border-dashed rounded-lg p-8 block text-center cursor-pointer hover:border-[#04413D] transition-colors ${touched.imageid && errors.imageid ? 'border-red-500' : 'border-gray-300'}`}>
                      <MdCloudUpload size={48} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Click to upload image</p>
                      <p className="text-gray-400 text-sm mt-1">PNG, JPG, JPEG, WEBP up to 5MB</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
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
                  {touched.imageid && errors.imageid && (
                    <div className="text-red-500 text-sm mt-1">{errors.imageid}</div>
                  )}
                  {uploadingImage && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name *
                    </label>
                    <Field
                      name="clientName"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                        errors.clientName && touched.clientName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter client name"
                    />
                    <ErrorMessage name="clientName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <Field
                      name="jobTitle"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                        errors.jobTitle && touched.jobTitle ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter job title"
                    />
                    <ErrorMessage name="jobTitle" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Field
                      name="companyName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="Enter company name (optional)"
                    />
                    <ErrorMessage name="companyName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <Field
                      as="select"
                      name="rating"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                        errors.rating && touched.rating ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="5">★★★★★ (5)</option>
                      <option value="4">★★★★☆ (4)</option>
                      <option value="3">★★★☆☆ (3)</option>
                      <option value="2">★★☆☆☆ (2)</option>
                      <option value="1">★☆☆☆☆ (1)</option>
                    </Field>
                    <ErrorMessage name="rating" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <JoditEditor
                    ref={editor}
                    value={values.description}
                    onBlur={(content) => {
                      setFieldValue("description", content);
                      if (content && touched.description === undefined) {
                        setTouched({ description: true });
                      }
                    }}
                    config={{
                      height: 300,
                      placeholder: 'Write your testimonial description here...',
                    }}
                  />
                  {touched.description && errors.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      // Mark all fields as touched to show validation errors
                      setTouched({
                        clientName: true,
                        jobTitle: true,
                        rating: true,
                        description: true,
                        imageid: true,
                      });
                      // Submit the form
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
                        {uploadingImage ? "Uploading Image..." : "Creating..."}
                      </span>
                    ) : (
                      "Create Testimonial"
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