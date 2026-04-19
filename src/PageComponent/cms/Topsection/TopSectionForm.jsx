"use client";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";

export default function TopSectionForm({ section, data, onSubmit }) {

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: data?.title || "",
        description: data?.description || "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT FORM */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">

            <h2 className="text-lg font-semibold text-[#04413D] mb-6">
              Edit {section.name}
            </h2>

            {/* TITLE */}
            <div className="mb-5">
              <label className="text-sm text-gray-600 mb-1 block">
                Title
              </label>
              <Field
                name="title"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#04413D]/20 outline-none"
                placeholder="Enter title..."
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-6">
              <label className="text-sm text-gray-600 mb-1 block">
                Description
              </label>

              <div className="border rounded-xl overflow-hidden">
                <JoditEditor
                  value={values.description}
                  onBlur={(content) =>
                    setFieldValue("description", content)
                  }
                />
              </div>
            </div>

            {/* ACTION */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#04413D] text-white font-medium 
              hover:opacity-90 transition"
            >
              {data ? "Update Section" : "Create Section"}
            </button>

          </div>

          {/* RIGHT PREVIEW */}
          <div className="lg:col-span-2">

            <div className="sticky top-6 bg-white rounded-2xl p-6 border shadow-sm">

              <h3 className="text-sm text-gray-500 mb-3">
                Live Preview
              </h3>

              <div className="border rounded-xl p-4 bg-gray-50">

                <h2 className="text-xl font-bold text-[#04413D]">
                  {values.title || "Your title appears here"}
                </h2>

                <div
                  className="mt-3 text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: values.description || "Description preview...",
                  }}
                />

              </div>

            </div>

          </div>

        </Form>
      )}
    </Formik>
  );
}