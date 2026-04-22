"use client";

import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { postData, uploadImageData } from "@/lib/frontendApi";

const schema = Yup.object().shape({
  name: Yup.string().required("Country name is required"),
  description: Yup.string().required("Description is required"),
  imageFile: Yup.mixed().required("Image is required"),
});

export default function AddCountry({ isOpen, onClose, onSuccess }) {
  const editor = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFieldValue("imageFile", file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full">

        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-[#04413D]">Add Country</h2>
          <button onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <Formik
            initialValues={{
              name: "",
              description: "",
              imageFile: null,
            }}
            validationSchema={schema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              const loadingToast = toast.loading("Creating country...");

              try {
                setLoading(true);

                const uploadRes = await uploadImageData(values.imageFile);

                const imageId = uploadRes?.id || uploadRes?.data?.id;

                if (!imageId) throw new Error("Image upload failed");

                await postData("countries", {
                  name: values.name.trim(),
                  description: values.description,
                  imageid: imageId,
                });

                toast.success("Country created successfully!", { id: loadingToast });

                resetForm();
                setImagePreview(null);

                if (onSuccess) await onSuccess();
                onClose();

              } catch (error) {
                console.error(error);
                toast.error(error.message || "Failed to create country", {
                  id: loadingToast,
                });
              } finally {
                setLoading(false);
                setSubmitting(false);
              }
            }}
          >
            {({ setFieldValue, values, isSubmitting, errors, touched }) => (
              <Form className="space-y-6">

                {/* Image */}
                <div>
                  <label className="block mb-2 font-medium">Country Image *</label>

                  {imagePreview ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={imagePreview}
                        className="w-24 h-24 rounded-lg object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFieldValue("imageFile", null);
                        }}
                        className="text-red-600 flex items-center gap-1"
                      >
                        <MdClose /> Remove
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
                      <MdCloudUpload size={40} className="mx-auto text-gray-400" />
                      <p>Click to upload</p>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                      />
                    </label>
                  )}

                  {/* FIXED ERROR FIELD */}
                  {errors.imageFile && touched.imageFile && (
                    <p className="text-red-500 text-sm mt-1">{errors.imageFile}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block mb-2 font-medium">Country Name *</label>
                  <Field
                    name="name"
                    className="w-full border px-4 py-2 rounded-lg"
                    placeholder="Enter country name"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 font-medium">Description *</label>
                  <JoditEditor
                    ref={editor}
                    value={values.description}
                    onBlur={(content) => setFieldValue("description", content)}
                    config={{ height: 250 }}
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="flex-1 bg-[#04413D] text-white py-2 rounded-lg"
                  >
                    {isSubmitting ? "Creating..." : "Create"}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 py-2 rounded-lg"
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