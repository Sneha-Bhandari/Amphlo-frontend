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
    <div className="min-h-screen bg-linear-to-br from-[#f8fafc] to-[#eef2f7] py-10">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <Toaster position="top-right" />

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-[#04413D] tracking-tight">
            Core Strengths
          </h1>
          <p className="text-gray-500">
            Manage your statistics and visual representation
          </p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/70 border border-gray-200 shadow-xl rounded-3xl p-8">
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
              <Form className="space-y-10">
                {/* Stats Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Statistics
                  </h2>

                  <FieldArray name="stats">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.stats.map((_, index) => (
                          <div
                            key={index}
                            className="grid md:grid-cols-3 gap-4 items-center bg-white shadow-md rounded-xl p-4 border border-gray-100 hover:shadow-lg transition"
                          >
                            <Field
                              name={`stats.${index}.count`}
                              placeholder="Count (e.g. 120+)"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#04413D] outline-none"
                            />

                            <Field
                              name={`stats.${index}.label`}
                              placeholder="Label (e.g. Students)"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#04413D] outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => push({ count: "", label: "" })}
                          className="mt-2 inline-block bg-[#04413D] text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition"
                        >
                          + Add Statistic
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Image Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Upload Image
                  </h2>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#04413D] transition">
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-sm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          setFieldValue("imageid", file);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />

                    <p className="text-gray-400 mt-2">
                      Click to upload or drag an image
                    </p>
                  </div>

                  {(preview || data?.imageid?.imageUrl) && (
                    <div className="mt-6 flex justify-center">
                      <div className="overflow-hidden rounded-2xl shadow-lg border">
                        <Image
                          src={preview || data?.imageid?.imageUrl}
                          alt="Preview"
                          width={260}
                          height={180}
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="bg-linear-to-r from-[#04413D] to-[#06635B] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
                  >
                    {loading
                      ? "Processing..."
                      : data
                      ? "Update Core Strengths"
                      : "Create Core Strengths"}
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