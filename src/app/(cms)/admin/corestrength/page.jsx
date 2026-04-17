"use client";

import { useEffect, useState } from "react";
import { Field, Form, Formik, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

import {
  fetchData,
  postData,
  patchData,
  uploadImageData,
} from "@/lib/frontendApi";

export default function CoreStrengthsCMS() {
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoreStrengths = async () => {
      try {
        setLoading(true);
        const res = await fetchData("core-strengths");

        if (res && res.length > 0) {
          setData(res[0]);

          if (res[0]?.imageid?.imageUrl) {
            setPreview(res[0].imageid.imageUrl);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch core strengths data");
      } finally {
        setLoading(false);
      }
    };

    fetchCoreStrengths();
  }, []);

  const validationSchema = Yup.object({
    stats: Yup.array()
      .of(
        Yup.object({
          count: Yup.string().required("Count is required"),
          label: Yup.string().required("Label is required"),
        })
      )
      .min(1, "At least one stat is required"),
  });

  return (
    <div className="flex flex-col gap-8 mx-auto w-11/12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:items-center gap-3">
        <div className="text-4xl text-[#04413D] font-bold">
          Core Strengths Section
        </div>
        <div className="text-sm text-gray-500">
          Manage statistics and image
        </div>
      </div>

      {/* Form */}
      <div className="border border-gray-300 rounded-2xl p-6 shadow-sm">
        <Formik
          enableReinitialize
          initialValues={{
            stats: data?.stats || [],
            imageid: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const toastId = toast.loading(
              data ? "Updating..." : "Creating..."
            );

            try {
              setLoading(true);

              let imageId = data?.imageid?.id;

              if (values.imageid) {
                const uploadRes = await uploadImageData(values.imageid);
                imageId = uploadRes?.id;
              }

              const payload = {
                stats: values.stats,
                imageid: imageId,
              };

              if (data?.id) {
                await patchData(`core-strengths/${data.id}`, payload);
                toast.success("Updated successfully!", { id: toastId });
              } else {
                await postData("core-strengths", payload);
                toast.success("Created successfully!", { id: toastId });
                resetForm();
                setPreview(null);
              }
            } catch (err) {
              console.error(err);
              toast.error(err.message || "Something went wrong", {
                id: toastId,
              });
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="space-y-6">
              
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Statistics
                </label>

                <FieldArray name="stats">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.stats.map((_, index) => (
                        <div
                          key={index}
                          className="flex gap-4 items-start p-4 border rounded-lg"
                        >
                          <Field
                            name={`stats.${index}.count`}
                            placeholder="Count"
                            className="w-full border p-2 rounded"
                          />

                          <Field
                            name={`stats.${index}.label`}
                            placeholder="Label"
                            className="w-full border p-2 rounded"
                          />

                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => push({ count: "", label: "" })}
                        className="border px-4 py-2 rounded text-[#04413D]"
                      >
                        Add Statistic
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full border p-2 rounded"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setFieldValue("imageid", file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                {(preview || data?.imageid?.imageUrl) && (
                  <div className="mt-6 border-2 border-dashed border-gray-800 rounded-lg p-4 flex justify-center">
                    <Image
                      src={preview || data?.imageid?.imageUrl}
                      alt="Preview"
                      width={200}
                      height={150}
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-6 py-3 rounded-lg font-semibold bg-yellow-500 text-white"
              >
                {loading
                  ? "Processing..."
                  : data
                  ? "Update Core Strengths"
                  : "Create Core Strengths"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}