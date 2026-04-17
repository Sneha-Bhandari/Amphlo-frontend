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
  const [preview, setPreview] = useState({
    side: null,
    background: null,
  });
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
            setPreview(prev => ({ ...prev, side: res[0].imageid.imageUrl }));
          }
          
          if (res[0]?.backgroundImageId?.imageUrl) {
            setPreview(prev => ({ ...prev, background: res[0].backgroundImageId.imageUrl }));
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

  // Separate function to handle image upload
  const handleImageUpload = async (file, type, setFieldValue) => {
    if (!file) return null;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} image should be less than 5MB`);
      return null;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, WEBP)");
      return null;
    }
    
    setUploadingImage(true);
    const uploadToast = toast.loading(`Uploading ${type} image...`);
    
    try {
      const uploadRes = await uploadImageData(file);
      console.log(`${type} image upload response:`, uploadRes);
      
      const imageId = uploadRes?.id || uploadRes?.imageId || uploadRes?.fileId;
      
      if (imageId) {
        toast.success(`${type} image uploaded successfully`, { id: uploadToast });
        return imageId;
      } else {
        throw new Error("No image ID returned from server");
      }
    } catch (error) {
      console.error(`${type} image upload error:`, error);
      toast.error(`Failed to upload ${type} image: ${error.message}`, { id: uploadToast });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 mx-auto w-11/12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:items-center gap-3">
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
          
              // IMPORTANT: correct backend keys
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

              {/* Side Image */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Side Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("sideImage", file);
                      setPreview(prev => ({ ...prev, side: URL.createObjectURL(file) }));
                    }
                  }}
                />

                {(preview.side || data?.imageid?.imageUrl) && (
                  <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center gap-3">
                    <Image
                      src={preview.side || data?.imageid?.imageUrl}
                      alt="Side image preview"
                      width={200}
                      height={150}
                      unoptimized
                      className="object-contain"
                    />
                    {preview.side && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(prev => ({ ...prev, side: null }));
                          setFieldValue("sideImage", null);
                          toast.success("Side image removed");
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Background Image */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Background Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("backgroundImage", file);
                      setPreview(prev => ({ ...prev, background: URL.createObjectURL(file) }));
                    }
                  }}
                />

                {(preview.background || data?.backgroundImageId?.imageUrl) && (
                  <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center gap-3">
                    <Image
                      src={preview.background || data?.backgroundImageId?.imageUrl}
                      alt="Background image preview"
                      width={200}
                      height={150}
                      unoptimized
                      className="object-cover"
                    />
                    {preview.background && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(prev => ({ ...prev, background: null }));
                          setFieldValue("backgroundImage", null);
                          toast.success("Background image removed");
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
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