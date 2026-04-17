"use client";

import { useState } from "react";
import { Field, Form, Formik, FieldArray } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";

export default function ServiceForm({ section, data, onSubmit }) {
  const [preview, setPreview] = useState(null);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    features: Yup.array().of(Yup.string()).min(1),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: data?.title || "",
        description: data?.description || "",
        features: data?.features || [""],
        imageid: null,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, isSubmitting, values }) => (
        <Form className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="bg-white p-6 rounded-2xl border space-y-3">
            <h2 className="text-lg font-semibold">
              {section.name}
            </h2>
        <h1 className="text-lg">Title:</h1>
            <Field
              name="title"
              className="w-full p-3 border rounded-xl"
              placeholder="Title"
            />
        <h1 className="text-lg">Description:</h1>

            <JoditEditor
              value={values.description}
              onBlur={(content) =>
                setFieldValue("description", content)
              }
            />
        <h1 className="text-lg">Features:</h1>

            <FieldArray name="features">
              {({ push, remove }) => (
                <div>
                  {values.features.map((_, i) => (
                    <div key={i} className="flex gap-2 mt-2">
                      <Field
                        name={`features.${i}`}
                        className="flex-1 p-2 border"
                      />
                      <button type="button" onClick={() => remove(i)}>
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => push("")}
                  >
                    + Add
                  </button>
                </div>
              )}
            </FieldArray>
            <h1 className="text-lg">Image Section</h1>

            {/* IMAGE */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setFieldValue("imageid", file);
                setPreview(URL.createObjectURL(file));
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 text-white py-3 rounded-xl"
            >
              {data ? "Update" : "Create"}
            </button>
          </div>

          {/* RIGHT */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <img
              src={preview || data?.imageid?.imageUrl}
              className="w-full h-56 object-cover rounded"
            />

            <h3 className="mt-4 text-lg font-bold">
              {values.title}
            </h3>
          </div>

        </Form>
      )}
    </Formik>
  );
}