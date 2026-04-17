"use client";

import { useEffect, useState } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
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

  useEffect(() => {
    const fetchGetInTouch = async () => {
      try {
        setLoading(true);
        const res = await fetchData("get-in-touch");

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
    imageid: Yup.mixed().nullable(),
  });

  return (
    <div className="flex flex-col gap-8 mx-auto w-11/12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:items-center gap-3">
        <div className="text-4xl text-[#04413D] font-bold">
          Get In Touch Section
        </div>
        <div className="text-sm text-gray-500">
          Manage title, description, and image
        </div>
      </div>

      {/* Form */}
      <div className="border border-gray-300 rounded-2xl p-6 shadow-sm">
        <Formik
          enableReinitialize
          initialValues={{
            title: data?.title || "",
            description: data?.description || "",
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

              // Upload new image if selected
              if (values.imageid) {
                const uploadRes = await uploadImageData(values.imageid);
                imageId = uploadRes?.id;
              }

              const payload = {
                title: values.title,
                description: values.description,
                imageid: imageId,
              };

              if (data?.id) {
                await patchData(`get-in-touch/${data.id}`, payload);
                toast.success("Updated successfully!", { id: toastId });
                
                // Update preview if new image was uploaded
                if (values.imageid) {
                  setPreview(URL.createObjectURL(values.imageid));
                }
              } else {
                await postData("get-in-touch", payload);
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
              {/* Title Field */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Title *
                </label>
                <Field
                  name="title"
                  placeholder="Enter title"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#04413D] focus:border-transparent"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Description Field with JoditEditor */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Description *
                </label>
                <JoditEditor
                  value={values.description}
                  onBlur={(content) => setFieldValue("description", content)}
                  onChange={() => {}}
                  className="border rounded-lg"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Image Field */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      // Validate file size (5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("Image size should be less than 5MB");
                        e.target.value = "";
                        return;
                      }

                      // Validate file type
                      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
                      if (!validTypes.includes(file.type)) {
                        toast.error("Please upload a valid image (JPEG, PNG, WEBP)");
                        e.target.value = "";
                        return;
                      }

                      setFieldValue("imageid", file);
                      setPreview(URL.createObjectURL(file));
                      toast.success("Image selected successfully!");
                    }
                  }}
                />

                {(preview || data?.imageid?.imageUrl) && (
                  <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center relative group">
                    <Image
                      src={preview || data?.imageid?.imageUrl}
                      alt="Preview"
                      width={200}
                      height={150}
                      unoptimized
                      className="object-contain"
                    />
                    {(preview || values.imageid) && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(data?.imageid?.imageUrl || null);
                          setFieldValue("imageid", null);
                          toast.success("Image removed");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-6 py-3 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
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