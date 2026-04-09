"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from 'react-hot-toast';
import { MdClose } from "react-icons/md";

const TeamMemberSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .required("Name is required"),
  position: Yup.string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position must not exceed 100 characters")
    .required("Position is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must not exceed 20 digits")
    .required("Phone number is required"),
});

export default function EditTeamMember({ isOpen, onClose, onSuccess, teamMember }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (teamMember) {
      setData(teamMember);
      setPreview(null); 
    }
  }, [teamMember]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!data?.id) {
      toast.error("Team member ID is missing");
      return;
    }

    const loadingToast = toast.loading("Updating team member...");
    
    try {
      let imageId = data?.imageid?.id || data?.imageid || null;

      if (values.imageFile) {
        toast.loading("Uploading image...", { id: loadingToast });
        
        const formData = new FormData();
        formData.append("images", values.imageFile);
      
        const uploadRes = await fetch(process.env.NEXT_PUBLIC_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });
      
        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          console.error("UPLOAD ERROR:", errText);
          throw new Error("Image upload failed");
        }
      
        const uploadData = await uploadRes.json();
        imageId = uploadData.id;
        toast.success("Image uploaded successfully!", { id: loadingToast });
      } else if (values.imageRemoved) {
        imageId = null;
      }

      const payload = {
        name: values.name.trim(),
        position: values.position.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        imageid: imageId,
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/our-team/${data.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Update failed with status ${response.status}`);
      }
      
      const result = await response.json();
      toast.success("Team member updated successfully!", { id: loadingToast });
      
      resetForm();
      setPreview(null);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error(error.message || "Failed to update team member", {
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
            <h2 className="text-2xl font-bold text-[#04413D]">Edit Team Member</h2>
            <p className="text-gray-600 text-sm mt-1">Edit team member information</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            enableReinitialize
            initialValues={{
              name: data.name || "",
              position: data.position || "",
              email: data.email || "",
              phone: data.phone || "",
              imageFile: null, 
              imageRemoved: false, 
            }}
            validationSchema={TeamMemberSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
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
                        className="my-5 w-32 h-32 rounded-full object-cover"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Field
                      name="name"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                        errors.name && touched.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter full name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position *
                    </label>
                    <Field
                      name="position"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                        errors.position && touched.position ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., Managing Director, IT Consultant"
                    />
                    <ErrorMessage name="position" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                        errors.email && touched.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="example@company.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Field
                      name="phone"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                        errors.phone && touched.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="+977 98XXXXXXXX"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
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
                      "Update Team Member"
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