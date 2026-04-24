"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import JoditEditor from "jodit-react";

import {
  fetchData,
  postData,
  patchData,
  uploadImageData,
} from "@/lib/frontendApi";

export default function GetInTouchCMS() {
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fields = [
    { label: "Title", name: "title", type: "text" },
    { label: "Description", name: "description", type: "textarea" },
    { label: "Image", name: "images", type: "file" },
  ];

  useEffect(() => {
    const fetchGetInTouch = async () => {
      try {
        setLoading(true);
        const res = await fetchData("get-in-touch");
        console.log("Fetched data:", res);
        
        if (res && res.length > 0) {
          setData(res[0]);
          if (res[0]?.imageid?.imageUrl) {
            setPreview(res[0].imageid.imageUrl);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch get in touch data");
      } finally {
        setLoading(false);
      }
    };

    fetchGetInTouch();
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    images: Yup.mixed().when([], {
      is: () => !data,
      then: (schema) => schema.required("Image is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  return (
    <div className="flex flex-col gap-8 mx-auto w-full rounded-2xl">
      <Toaster position="top-right" />

      <div className="flex flex-col md:items-start">
        <div className="text-4xl text-[#04413D] font-bold">
          Get In Touch Section
        </div>
        <div className="text-sm text-gray-500">
          Manage title, description, and image
        </div>
      </div>

      <div className="border border-gray-300 rounded-2xl p-8 w-full">
        <Formik
          enableReinitialize
          initialValues={{
            title: data?.title || "",
            description: data?.description || "",
            images: null,
            existingImage: data?.imageid?.id || null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const toastId = toast.loading(
              data ? "Updating get in touch section..." : "Creating get in touch section..."
            );

            try {
              setLoading(true);

              let imageId = data?.imageid?.id;

              if (values.images) {
                toast.loading("Uploading image...", { id: toastId });

                const uploadRes = await uploadImageData(values.images);
                imageId = uploadRes?.id;
                
                if (!imageId) {
                  throw new Error("Failed to upload image");
                }
              }

              if (!imageId && !data) {
                throw new Error("Image is required");
              }

              const cleanDescription = values.description === "<p><br></p>" ? "" : values.description;

              const payload = {
                title: values.title?.trim(),
                description: cleanDescription,
              };

              if (imageId) {
                payload.imageid = imageId;
              }

              console.log("Payload being sent:", payload);

              if (data?.id) {
                await patchData(`get-in-touch/${data.id}`, payload);
                toast.success("Get in touch section updated successfully!", {
                  id: toastId,
                });
                
                const refreshedData = await fetchData("get-in-touch");
                if (refreshedData && refreshedData.length > 0) {
                  setData(refreshedData[0]);
                  if (refreshedData[0]?.imageid?.imageUrl) {
                    setPreview(refreshedData[0].imageid.imageUrl);
                  }
                }
              } else {
                await postData("get-in-touch", payload);
                toast.success("Get in touch section created successfully!", {
                  id: toastId,
                });

                resetForm();
                setPreview(null);
                
                const refreshedData = await fetchData("get-in-touch");
                if (refreshedData && refreshedData.length > 0) {
                  setData(refreshedData[0]);
                  if (refreshedData[0]?.imageid?.imageUrl) {
                    setPreview(refreshedData[0].imageid.imageUrl);
                  }
                }
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
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="space-y-4">
              {fields.map((val, i) => (
                <div key={i}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {val.label} {val.name !== "images" && "*"}
                  </label>

                  {val.type === "file" ? (
                    <>
                      {/* Hidden file input */}
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFieldValue("images", file);
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
                    </>
                  ) : val.type === "textarea" ? (
                    <JoditEditor
                      value={values.description}
                      onBlur={(content) => setFieldValue("description", content)}
                      config={{
                        height: 300,
                        placeholder: "Enter description...",
                      }}
                    />
                  ) : (
                    <Field
                      name={val.name}
                      type={val.type}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder={`Enter ${val.label.toLowerCase()}`}
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
                className="w-full md:w-auto px-6 py-2.5 rounded-lg font-semibold bg-linear-to-r from-[#FDC653] to-yellow-500 text-white hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading
                  ? "Processing..."
                  : data
                    ? "Update Get In Touch"
                    : "Create Get In Touch"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}