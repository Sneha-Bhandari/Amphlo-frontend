"use client";

import { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";

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
        <Form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN - Form Fields */}
          <div className="bg-white p-6 rounded-2xl border space-y-4">
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
                onBlur={(content) => setFieldValue("description", content)}
                config={{
                  height: 300,
                  placeholder: "Enter description...",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg p-2"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setFieldValue("imageid", file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : data ? "Update" : "Create"}
            </button>
          </div>

          {/* RIGHT COLUMN - Preview */}
          <div className="bg-gray-50 p-6 rounded-xl sticky top-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            
            {(preview || data?.imageid?.imageUrl) && (
              <img
                src={preview || data?.imageid?.imageUrl}
                alt="Preview"
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-[#04413D]">
                {values.title || "Title will appear here"}
              </h4>
              
              <h5 className="text-md font-medium text-gray-600">
                {values.subTitle || "Subtitle will appear here"}
              </h5>
              
              <div className="text-sm text-gray-700 mt-2">
                {values.description ? (
                  <div dangerouslySetInnerHTML={{ __html: values.description.substring(0, 200) + (values.description.length > 200 ? "..." : "") }} />
                ) : (
                  "Description will appear here"
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}