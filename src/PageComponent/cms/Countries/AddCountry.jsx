// PageComponent/cms/Countries/AddCountry.js
"use client";

import React, { useState, useRef } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import { MdCloudUpload, MdClose, MdAdd, MdDelete, MdArrowDropDown } from "react-icons/md";
import { postData, uploadImageData } from "@/lib/frontendApi";

const categoryOptions = [
  { value: "Most Popular", label: "Most Popular" },
  { value: "Top Ranked", label: "Top Ranked" },
  { value: "Affordable", label: "Affordable" },
  { value: "Scholarship Available", label: "Scholarship Available" },
];

const schema = Yup.object().shape({
  name: Yup.string().required("Country name is required"),
  description: Yup.string().required("Description is required"),
  categories: Yup.array(),
  states: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("State name is required")
    })
  ),
  imageFile: Yup.mixed().required("Image is required"),
});

export default function AddCountry({ isOpen, onClose, onSuccess }) {
  const editor = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFieldValue("imageFile", file);
    }
  };

  const handleCategoryToggle = (categoryValue, currentCategories, setFieldValue) => {
    const newCategories = currentCategories.includes(categoryValue)
      ? currentCategories.filter(c => c !== categoryValue)
      : [...currentCategories, categoryValue];
    setFieldValue("categories", newCategories);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Add New Country</h2>
            <p className="text-gray-600 text-sm">Add country and states (Universities can be added later)</p>
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
              categories: [],
              states: [],
              imageFile: null,
            }}
            validationSchema={schema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              if (!values.imageFile) {
                toast.error("Please upload a country image");
                setSubmitting(false);
                return;
              }

              const loadingToast = toast.loading("Creating country...");
              
              try {
                setUploadingImage(true);
                
                // Upload image
                const uploadRes = await uploadImageData(values.imageFile);
                const imageId = uploadRes?.id || uploadRes?.data?.id;
                
                if (!imageId) {
                  throw new Error("Failed to upload image");
                }
                
                // Filter out empty states
                const filteredStates = values.states.filter(state => state.name && state.name.trim() !== "");
                
                const submitData = {
                  name: values.name.trim(),
                  description: values.description,
                  categories: values.categories || [],
                  states: filteredStates,
                  universities: [], // Empty array initially
                  imageid: imageId,
                };
                
                await postData("countries", submitData);
                
                toast.success("Country created successfully!", { id: loadingToast });
                resetForm();
                setImagePreview(null);
                if (onSuccess) await onSuccess();
                onClose();
              } catch (error) {
                console.error("Error creating country:", error);
                toast.error(error.message || "Failed to create country", { id: loadingToast });
              } finally {
                setUploadingImage(false);
                setSubmitting(false);
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country Image *</label>
                  {imagePreview ? (
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover border-2 border-[#04413D]" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFieldValue("imageFile", null);
                        }}
                        className="text-red-600 flex items-center gap-1"
                      >
                        <MdClose /> Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-lg p-8 block text-center cursor-pointer hover:border-[#04413D] transition-colors">
                      <MdCloudUpload size={48} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Click to upload image</p>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                      />
                    </label>
                  )}
                  {errors.imageFile && touched.imageFile && <div className="text-red-500 text-sm mt-1">{errors.imageFile}</div>}
                </div>

                {/* Country Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country Name *</label>
                  <Field name="name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder="Enter country name" />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Categories Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <div className="relative" ref={categoryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className="w-full px-4 py-2 border rounded-lg bg-white text-left flex justify-between items-center"
                    >
                      <span>{values.categories.length === 0 ? "Select categories" : `${values.categories.length} selected`}</span>
                      <MdArrowDropDown className={`transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} size={24} />
                    </button>
                    
                    {isCategoryDropdownOpen && (
                      <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {categoryOptions.map((option) => (
                          <label key={option.value} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={values.categories.includes(option.value)}
                              onChange={() => handleCategoryToggle(option.value, values.categories, setFieldValue)}
                              className="w-4 h-4 text-[#04413D] rounded"
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {values.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {values.categories.map((category) => (
                        <span key={category} className="text-xs px-2 py-1 rounded-full bg-gray-100 flex items-center gap-1">
                          {category}
                          <button type="button" onClick={() => handleCategoryToggle(category, values.categories, setFieldValue)}>
                            <MdClose size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <JoditEditor
                    ref={editor}
                    value={values.description}
                    onBlur={(content) => setFieldValue("description", content)}
                    config={{ height: 300, placeholder: 'Write country description...' }}
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* States Section */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">States (Add states as comma separated or individually)</label>
                    <button
                      type="button"
                      onClick={() => setFieldValue("states", [...values.states, { name: "" }])}
                      className="text-[#04413D] flex items-center gap-1 text-sm"
                    >
                      <MdAdd /> Add State
                    </button>
                  </div>
                  
                  <FieldArray name="states">
                    {({ remove, push }) => (
                      <div className="space-y-3">
                        {values.states.map((state, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <Field
                                name={`states.${index}.name`}
                                placeholder={`State ${index + 1} name`}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                              />
                              <ErrorMessage name={`states.${index}.name`} component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 p-2 hover:bg-red-50 rounded-lg"
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                  <p className="text-xs text-gray-500 mt-2">Tip: You can add universities for each state from the view page</p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button type="submit" disabled={isSubmitting || uploadingImage} className="flex-1 py-2 rounded-lg font-semibold bg-[#FDC653] text-white hover:bg-yellow-600 disabled:bg-gray-400">
                    {isSubmitting || uploadingImage ? (uploadingImage ? "Uploading..." : "Creating...") : "Create Country"}
                  </button>
                  <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
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