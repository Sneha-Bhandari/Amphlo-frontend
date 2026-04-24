"use client";

import { useEffect, useState } from "react";
import { Field, Form, Formik, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

import {
  fetchData,
  postData,
  patchData,
  uploadImageData,
} from "@/lib/frontendApi";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  subTitle: Yup.string().required("Subtitle is required"),
  description: Yup.string().required("Description is required"),
  features: Yup.array()
    .of(Yup.string().required("Feature is required"))
    .min(1, "At least one feature is required"),
});

export default function CrmCMS() {
  const [data, setData] = useState(null);
  const [previewSide, setPreviewSide] = useState(null);
  const [previewBg, setPreviewBg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchCrmData = async () => {
      try {
        setLoading(true);
        const res = await fetchData("crm");

        console.log("Fetched CRM data:", res);

        if (res && res.length > 0) {
          setData(res[0]);
          
          if (res[0]?.imageid?.imageUrl) {
            setPreviewSide(res[0].imageid.imageUrl);
          }
          
          if (res[0]?.backgroundImageId?.imageUrl) {
            setPreviewBg(res[0].backgroundImageId.imageUrl);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch CRM data");
      } finally {
        setLoading(false);
      }
    };

    fetchCrmData();
  }, []);

  return (
    <div className="flex flex-col gap-8 mx-auto w-11/12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col items-start gap-3">
        <div className="text-4xl text-[#04413D] font-bold">
          CRM Section
        </div>
        <div className="text-sm text-gray-500">
          Manage title, subtitle, description, features and images
        </div>
      </div>

      {/* Form */}
      <div className="border border-gray-300 rounded-2xl p-6 shadow-sm">
        <Formik
          enableReinitialize
          initialValues={{
            title: data?.title || "",
            subTitle: data?.subTitle || "",
            description: data?.description || "",
            features: data?.features || [],
            sideImage: null,
            backgroundImage: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const toastId = toast.loading(
              data ? "Updating..." : "Creating..."
            );
          
            try {
              setLoading(true);
          
              let sideImageId = data?.imageid?.id;
              let bgImageId = data?.backgroundImageId?.id;
          
              // upload side image
              if (values.sideImage) {
                const res = await uploadImageData(values.sideImage);
                sideImageId = res?.id || res?.data?.id;
              }
          
              // upload bg image
              if (values.backgroundImage) {
                const res = await uploadImageData(values.backgroundImage);
                bgImageId = res?.id || res?.data?.id;
              }
          
              const payload = {
                title: values.title?.trim(),
                subTitle: values.subTitle?.trim(),
                description:
                  values.description === "<p><br></p>"
                    ? ""
                    : values.description,
          
                features: (values.features || [])
                  .filter((f) => f && f.trim() !== "")
                  .map((f) => f.trim()),
              };
          
              if (sideImageId) payload.imageid = sideImageId;
              if (bgImageId) payload.backgroundImageId = bgImageId;
          
              console.log("🔥 FINAL PAYLOAD:", payload);
          
              const endpoint = data?.id
                ? `crm/${data.id}`
                : "crm";
          
              const response = data?.id
                ? await patchData(endpoint, payload)
                : await postData(endpoint, payload);
          
              console.log("✅ RESPONSE:", response);
          
              toast.success(data ? "Updated!" : "Created!", { id: toastId });
          
              if (!data) resetForm();
            } catch (err) {
              console.error("❌ CRM ERROR:", err);
          
              toast.error(
                err.message || "CRM request failed",
                { id: toastId }
              );
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
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#04413D] focus:border-transparent"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Subtitle Field */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Subtitle *
                </label>
                <Field
                  name="subTitle"
                  placeholder="Enter subtitle"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#04413D] focus:border-transparent"
                />
                <ErrorMessage name="subTitle" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Description Field */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Description *
                </label>
                <JoditEditor
                  value={values.description}
                  onBlur={(content) => setFieldValue("description", content)}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Features Section */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Features *
                </label>

                <FieldArray name="features">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.features.map((_, index) => (
                        <div
                          key={index}
                          className="flex gap-4 items-start p-4 border rounded-lg"
                        >
                          <Field
                            name={`features.${index}`}
                            placeholder={`Feature ${index + 1}`}
                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#04413D] focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => push("")}
                        className="border border-[#04413D] text-[#04413D] px-4 py-2 rounded hover:bg-[#04413D] hover:text-white transition"
                      >
                        + Add Feature
                      </button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage name="features" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Side Image - Updated UI */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Side Image
                </label>

                {/* Hidden file input */}
                <input
                  type="file"
                  id="side-image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("sideImage", file);
                      setPreviewSide(URL.createObjectURL(file));
                    }
                  }}
                />

                {/* Clickable image preview area */}
                <div 
                  className="mt-2 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#04413D] transition-colors duration-200"
                  onClick={() => document.getElementById('side-image-upload').click()}
                >
                  {(previewSide || data?.imageid?.imageUrl) ? (
                    <div className="relative w-full p-4">
                      <Image
                        height={1000}
                        width={3000}
                        src={previewSide || data?.imageid?.imageUrl}
                        alt="Side image preview"
                        unoptimized
                        className="w-full h-48 object-contain"
                      />
                      <p className="text-center text-sm text-gray-500 mt-2">
                        Click to change side image
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
                        Click to upload side image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Background Image - Updated UI */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Background Image
                </label>

                {/* Hidden file input */}
                <input
                  type="file"
                  id="bg-image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("backgroundImage", file);
                      setPreviewBg(URL.createObjectURL(file));
                    }
                  }}
                />

                {/* Clickable image preview area */}
                <div 
                  className="mt-2 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#04413D] transition-colors duration-200"
                  onClick={() => document.getElementById('bg-image-upload').click()}
                >
                  {(previewBg || data?.backgroundImageId?.imageUrl) ? (
                    <div className="relative w-full p-4">
                      <Image
                        height={1000}
                        width={3000}
                        src={previewBg || data?.backgroundImageId?.imageUrl}
                        alt="Background image preview"
                        unoptimized
                        className="w-full h-48 object-cover"
                      />
                      <p className="text-center text-sm text-gray-500 mt-2">
                        Click to change background image
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
                        Click to upload background image
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
                disabled={isSubmitting || loading || uploadingImage}
                className="px-6 py-3 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || uploadingImage
                  ? "Processing..."
                  : data
                  ? "Update CRM"
                  : "Create CRM"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}