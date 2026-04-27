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
        <Form className=" flex flex-col">

          <h2 className="text-lg font-semibold text-[#04413D] mb-6">
            Edit {section.name}
          </h2>

          <div className="mb-5">
            <label className="text-sm text-gray-600 mb-1 block">Title</label>
            <Field
              name="title"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#04413D]/20 outline-none"
              placeholder="Enter title..."
            />
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-600 mb-1 block">
              Description
            </label>

            <div className="border rounded-xl overflow-hidden">
              <JoditEditor
                value={values.description}
                onBlur={(content) => setFieldValue("description", content)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-fit px-4 py-3 rounded-xl cursor-pointer bg-[#04413D] text-white font-medium 
              hover:opacity-90 transition"
          >
            {data ? "Update Section" : "Create Section"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
