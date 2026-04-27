"use client";

import { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import Image from "next/image";

export default function MissionVisionForm({ section, data, onSubmit }) {
  const [preview, setPreview] = useState(null);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    subTitle: Yup.string().required("Subtitle is required"),
    description: Yup.string().required("Description is required"),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: data?.title || "",
        subTitle: data?.subTitle || "",
        description: data?.description || "",
        imageid: null,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, isSubmitting, values }) => (
        <Form className="flex flex-col gap-8">
          {/* LEFT COLUMN - Form Fields */}
          <div className=" space-y-4">
            <h2 className="text-xl font-bold text-[#04413D]">
              {section.name} Section
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Field
                name="title"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle *
              </label>
              <Field
                name="subTitle"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter subtitle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <JoditEditor
              value={values.description}
              onBlur={(content) =>
                setFieldValue("description", content)
              }
            />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>

              {/* Hidden file input */}
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFieldValue("imageid", file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />

              {/* Clickable image preview area */}
              <div 
                className="mt-2 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#04413D] transition-colors duration-200"
                onClick={() => document.getElementById('image-upload').click()}
              >
                {(preview || data?.imageid?.imageUrl) ? (
                  <div className="relative w-full p-4">
                    <Image
                      height={1000}
                      width={3000}
                      src={preview || data?.imageid?.imageUrl}
                      alt="Preview"
                      unoptimized
                      className="w-full h-48 object-contain"
                    />
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-fit px-5  bg-yellow-500 text-white py-2 cursor-pointer rounded-xl font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : data ? "Update" : "Create"}
            </button>
          </div>

          
        </Form>
      )}
    </Formik>
  );
}