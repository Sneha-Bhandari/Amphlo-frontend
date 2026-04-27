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

export default function ConnectedCountriesCms() {
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConnectedCountries = async () => {
      try {
        setLoading(true);
        const res = await fetchData("connected-countries");

        if (res && res.length > 0) {
          setData(res[0]);

          if (res[0]?.imageid?.imageUrl) {
            setPreview(res[0].imageid.imageUrl);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch connected countries data");
      } finally {
        setLoading(false);
      }
    };

    fetchConnectedCountries();
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
      <div className="flex flex-col md:items-start gap-3">
        <div className="text-4xl text-[#04413D] font-bold">
          Connected Countries Section
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
                await patchData(`connected-countries/${data.id}`, payload);
                toast.success("Updated successfully!", { id: toastId });
              } else {
                await postData("connected-countries", payload);
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

              {/* Image Field - Updated UI like HeroSection */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-6 py-3 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : data
                  ? "Update Connected Countries"
                  : "Create Connected Countries"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}