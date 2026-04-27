"use client";

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import toast, { Toaster } from "react-hot-toast";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { patchData, uploadImageData } from "@/lib/frontendApi";

const CountrySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .required("Country name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  category: Yup.string().required("Category is required"),
});

const CATEGORY_OPTIONS = [
  "Most Popular",
  "Top Ranked",
  "Emerging",
  "Budget Friendly",
  "Study Abroad",
];

export default function EditCountry({ isOpen, onClose, onSuccess, country }) {
  const editor = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (country) {
      setPreview(null);
      setSelectedFile(null);
    }
  }, [country]);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!country?.id) {
      toast.error("Country ID is missing");
      return;
    }

    const loadingToast = toast.loading("Updating country...");

    try {
      setUploadingImage(true);
      let imageId = country?.imageid?.id || null;

      if (values.imageRemoved) {
        imageId = null;
      }

      if (selectedFile instanceof File) {
        const uploadRes = await uploadImageData(selectedFile);
        imageId = uploadRes?.id || uploadRes?.data?.id || uploadRes?.data?.data?.id;
        if (!imageId) throw new Error("Image upload failed");
      }

      const payload = {
        name: values.name.trim(),
        description: values.description,
        category: values.category,
        imageid: imageId,
      };

      await patchData(`countries/${country.id}`, payload);
      toast.success("Country updated successfully!", { id: loadingToast });

      setPreview(null);
      setSelectedFile(null);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update country", { id: loadingToast });
    } finally {
      setUploadingImage(false);
      setSubmitting(false);
    }
  };

  if (!isOpen || !country) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <Toaster position="top-right" />

        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Edit Country</h2>
            <p className="text-sm text-gray-500">Update country information</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition p-2 hover:bg-gray-100 rounded-full">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            enableReinitialize
            initialValues={{
              name: country?.name || "",
              description: country?.description || "",
              category: country?.category || "",
              imageRemoved: false,
            }}
            validationSchema={CountrySchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Current Category Display */}
                {values.category && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Current Category:</p>
                    <span className="inline-flex px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                      {values.category}
                    </span>
                  </div>
                )}

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

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country Image
                  </label>
                  {(preview || (country?.imageid?.imageUrl && !values.imageRemoved)) ? (
                    <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50">
                      <img
                        src={preview || country?.imageid?.imageUrl}
                        className="w-24 h-24 rounded-lg object-cover border"
                        alt="Preview"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (preview) URL.revokeObjectURL(preview);
                          setPreview(null);
                          setSelectedFile(null);
                          setFieldValue("imageRemoved", true);
                        }}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <MdClose /> Remove
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center block cursor-pointer hover:border-[#04413D] transition">
                      <MdCloudUpload size={40} className="mx-auto text-gray-400" />
                      <p className="text-gray-600 mt-2">Click to upload image</p>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setPreview(URL.createObjectURL(file));
                            setFieldValue("imageRemoved", false);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-medium">Country Name</label>
                  <Field
                    name="name"
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D]"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <div className="mt-1 border rounded-lg overflow-hidden">
                    <JoditEditor
                      ref={editor}
                      value={values.description}
                      onChange={(val) => setFieldValue("description", val)}
                    />
                  </div>
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingImage}
                    className="flex-1 bg-[#04413D] text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                  >
                    {isSubmitting || uploadingImage ? "Updating..." : "Update Country"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
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