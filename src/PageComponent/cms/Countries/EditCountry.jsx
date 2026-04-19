"use client";

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import toast, { Toaster } from 'react-hot-toast';
import { MdCloudUpload, MdClose, MdAdd, MdDelete } from "react-icons/md";
import { patchData, uploadImageData } from "@/lib/frontendApi";

const CountrySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .required("Country name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  categories: Yup.array().of(Yup.string()),
  states: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("State name is required")
    })
  ),
  universities: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("University name is required"),
      location: Yup.string().required("Location is required"),
      ranking: Yup.string().required("Ranking is required"),
      programs: Yup.number().nullable(),
      established: Yup.number().nullable(),
      students: Yup.number().nullable()
    })
  )
});

export default function EditCountry({ isOpen, onClose, onSuccess, country }) {
  const editor = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (country) {
      setData(country);
      setPreview(null);
    }
  }, [country]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!data?.id) {
      toast.error("Country ID is missing");
      return;
    }

    const loadingToast = toast.loading("Updating country...");
    
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
        name: values.name.trim(),
        description: values.description,
        categories: values.categories || [],
        states: values.states || [],
        universities: values.universities || [],
        imageid: imageId,
      };
      
      await patchData(`countries/${data.id}`, payload);
      
      toast.success("Country updated successfully!", { id: loadingToast });
      
      resetForm();
      setPreview(null);
      if (onSuccess) await onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating country:", error);
      toast.error(error.message || "Failed to update country", {
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
            <h2 className="text-2xl font-bold text-[#04413D]">Edit Country</h2>
            <p className="text-gray-600 text-sm mt-1">Edit country information</p>
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
              description: data.description || "",
              categories: data.categories || [],
              states: data.states?.length ? data.states : [{ name: "" }],
              universities: data.universities?.length ? data.universities : [{ name: "", location: "", ranking: "", programs: "", established: "", students: "" }],
              imageFile: null,
              imageRemoved: false,
            }}
            validationSchema={CountrySchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country Image
                  </label>
                  
                  {(preview || (data?.imageid?.imageUrl && !values.imageRemoved)) ? (
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={preview || data?.imageid?.imageUrl}
                        alt="Preview"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-[#04413D]"
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
                        className="text-red-600 flex items-center gap-1 hover:text-red-700"
                      >
                        <MdClose /> Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-lg p-8 block text-center cursor-pointer hover:border-[#04413D] transition-colors border-gray-300">
                      <MdCloudUpload size={48} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Click to upload new image</p>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFieldValue("imageFile", file);
                            setFieldValue("imageRemoved", false);
                            if (preview) URL.revokeObjectURL(preview);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  )}
                  {uploadingImage && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country Name *
                  </label>
                  <Field
                    name="name"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                      errors.name && touched.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter country name"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <Field
                    name="categories"
                    as="select"
                    multiple
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    onChange={(e) => {
                      const options = e.target.options;
                      const selected = [];
                      for (let i = 0; i < options.length; i++) {
                        if (options[i].selected) {
                          selected.push(options[i].value);
                        }
                      }
                      setFieldValue("categories", selected);
                    }}
                  >
                    <option value="Most Popular">Most Popular</option>
                    <option value="Top Ranked">Top Ranked</option>
                    <option value="Affordable">Affordable</option>
                    <option value="Scholarship Available">Scholarship Available</option>
                  </Field>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <JoditEditor
                    ref={editor}
                    value={values.description}
                    onBlur={(newContent) => setFieldValue("description", newContent)}
                    config={{
                      readonly: false,
                      height: 300,
                      placeholder: "Write country description...",
                    }}
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* States Section */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      States & Regions
                    </label>
                    <button
                      type="button"
                      onClick={() => setFieldValue("states", [...values.states, { name: "" }])}
                      className="text-[#04413D] flex items-center gap-1 text-sm hover:text-[#04413D]/80"
                    >
                      <MdAdd /> Add State
                    </button>
                  </div>
                  
                  <FieldArray name="states">
                    {({ remove, push }) => (
                      <div className="space-y-3">
                        {values.states.map((state, index) => (
                          <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1">
                              <Field
                                name={`states.${index}.name`}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                placeholder="State/Region name"
                              />
                              <ErrorMessage name={`states.${index}.name`} component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Universities Section */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Universities
                    </label>
                    <button
                      type="button"
                      onClick={() => setFieldValue("universities", [...values.universities, { name: "", location: "", ranking: "", programs: "", established: "", students: "" }])}
                      className="text-[#04413D] flex items-center gap-1 text-sm hover:text-[#04413D]/80"
                    >
                      <MdAdd /> Add University
                    </button>
                  </div>
                  
                  <FieldArray name="universities">
                    {({ remove, push }) => (
                      <div className="space-y-6">
                        {values.universities.map((university, index) => (
                          <div key={index} className="border rounded-lg p-4 relative">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                            >
                              <MdDelete size={20} />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">University Name *</label>
                                <Field
                                  name={`universities.${index}.name`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                  placeholder="University name"
                                />
                                <ErrorMessage name={`universities.${index}.name`} component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Location *</label>
                                <Field
                                  name={`universities.${index}.location`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                  placeholder="City, State"
                                />
                                <ErrorMessage name={`universities.${index}.location`} component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Ranking *</label>
                                <Field
                                  name={`universities.${index}.ranking`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                  placeholder="e.g., Ivy League, Russell Group"
                                />
                                <ErrorMessage name={`universities.${index}.ranking`} component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Programs</label>
                                <Field
                                  name={`universities.${index}.programs`}
                                  type="number"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                  placeholder="Number of programs"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Established</label>
                                <Field
                                  name={`universities.${index}.established`}
                                  type="number"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                  placeholder="Year established"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Students</label>
                                <Field
                                  name={`universities.${index}.students`}
                                  type="number"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                  placeholder="Number of students"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
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
                      "Update Country"
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