"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

import {
  fetchData,
  postData,
  patchData,
  uploadImageData,
} from "@/lib/frontendApi";

export default function HeroSection() {
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fields = [
    { label: "Title", name: "title", type: "text" },
    { label: "Subtitle", name: "subtitle", type: "text" },
    { label: "Image", name: "images", type: "file" },
  ]

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const res = await fetchData("hero-section");
        if (res && res.length > 0) {
          setData(res[0]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch hero section data");
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    subtitle: Yup.string().required("Subtitle is required"),
    images: Yup.mixed().when([], {
      is: () => !data,
      then: (schema) => schema.required("Image is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  return (
    <div className="flex flex-col gap-8 mx-auto w-full rounded-2xl">
      <Toaster position="top-right" />

      <div className="flex flex-col md:items-center">
        <div className="text-4xl text-[#04413D] font-bold">
          Hero Section Page
        </div>
        <div className="text-sm text-gray-500">
          title, subtitle, image
        </div>
      </div>

      <div className="border border-gray-300 rounded-2xl p-8 w-full">
        <Formik
          enableReinitialize
          initialValues={{
            title: data?.title || "",
            subtitle: data?.subTitle || "",
            images: null,
            existingImage: data?.imageid?.id || null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const toastId = toast.loading(
              data ? "Updating hero section..." : "Creating hero section..."
            );

            try {
              setLoading(true);

              let imageId = data?.imageid?.id;

              if (values.images) {
                toast.loading("Uploading image...", { id: toastId });

                const uploadRes = await uploadImageData(values.images);
                imageId = uploadRes?.id;
              }

              if (!imageId) {
                throw new Error("Image is required");
              }

              const payload = {
                title: values.title,
                subTitle: values.subtitle,
                imageid: imageId,
              };

              if (data?.id) {
                await patchData(`hero-section/${data.id}`, payload);
                toast.success("Hero section updated successfully!", {
                  id: toastId,
                });
              } else {
                await postData("hero-section", payload);
                toast.success("Hero section created successfully!", {
                  id: toastId,
                });

                resetForm();
                setPreview(null);
              }
            } catch (err) {
              console.error(err);
              toast.error(err.message || "Something went wrong!", {
                id: toastId,
              });
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              {fields.map((val, i) => (
                <div key={i}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {val.label}
                  </label>

                  {val.type === "file" ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            setFieldValue("images", file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />

                      {(preview || data?.imageid?.imageUrl) && (
                        <div className="mt-7 relative group border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center">
                          <Image
                            height={1000}
                            width={3000}
                            src={preview || data?.imageid?.imageUrl}
                            alt="Preview"
                            unoptimized
                            className="my-5 w-68 h-38 object-contain"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              setFieldValue("images", null);
                            }}
                            className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Field
                      name={val.name}
                      type={val.type}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder={`Enter ${val.label}`}
                    />
                  )}

                  <ErrorMessage
                    name={val.name}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg font-semibold bg-linear-to-r from-[#FDC653] to-yellow-500 text-white"
              >
                {isSubmitting || loading
                  ? "Processing..."
                  : data
                    ? "Update Hero Section"
                    : "Create Hero Section"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}