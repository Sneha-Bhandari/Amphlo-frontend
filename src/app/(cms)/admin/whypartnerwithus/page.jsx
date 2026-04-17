"use client";

import { useEffect, useState } from "react";
import { Field, Form, Formik, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import JoditEditor from "jodit-react";
import { MdAdd, MdDelete } from "react-icons/md";

import {
  fetchData,
  postData,
  patchData,
  uploadImageData,
} from "@/lib/frontendApi";

const PartnerSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Title is required"),
  subTitle: Yup.string()
    .min(2, "Subtitle must be at least 2 characters")
    .max(100, "Subtitle must not exceed 100 characters")
    .required("Subtitle is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  benefits: Yup.array()
    .of(Yup.string().min(1, "Benefit cannot be empty").required("Benefit is required"))
    .min(1, "At least one benefit is required"),
  satisfactionTitle: Yup.string()
    .min(2, "Satisfaction title must be at least 2 characters")
    .max(50, "Satisfaction title must not exceed 50 characters")
    .required("Satisfaction title is required"),
  satisfactionPercent: Yup.string()
    .matches(/^\d+%$/, "Must be a percentage (e.g., 98%)")
    .required("Satisfaction percentage is required"),
});

export default function WhyPartnerCMS() {
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        setLoading(true);
        const res = await fetchData("why-partner-with-us");

        if (res && res.length > 0) {
          setData(res[0]);

          if (res[0]?.imageid?.imageUrl) {
            setPreview(res[0].imageid.imageUrl);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch partner data");
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, []);

  return (
    <div className="flex flex-col gap-8 mx-auto w-11/12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:items-center gap-3">
        <div className="text-4xl text-[#04413D] font-bold">
          Why Partner With Us Section
        </div>
        <div className="text-sm text-gray-500">
          Manage title, subtitle, description, benefits, satisfaction metrics, and image
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
            benefits: data?.benefits?.length ? data.benefits : [""],
            satisfactionTitle: data?.satisfactionTitle || "",
            satisfactionPercent: data?.satisfactionPercent || "",
            images: null, // Changed from 'imageid' to 'images' to match HeroSection
          }}
          validationSchema={PartnerSchema}
          onSubmit={async (values, { resetForm }) => {
            const toastId = toast.loading(
              data ? "Updating..." : "Creating..."
            );

            try {
              setLoading(true);

              let imageId = data?.imageid?.id;

              // Upload new image if selected (same as HeroSection)
              if (values.images) {
                toast.loading("Uploading image...", { id: toastId });
                const uploadRes = await uploadImageData(values.images);
                imageId = uploadRes?.id;
                
                if (!imageId) {
                  throw new Error("Failed to upload image");
                }
              }

              const payload = {
                title: values.title.trim(),
                subTitle: values.subTitle.trim(),
                description: values.description,
                benefits: values.benefits.filter(b => b && b.trim() !== ""),
                satisfactionTitle: values.satisfactionTitle.trim(),
                satisfactionPercent: values.satisfactionPercent,
                imageid: imageId,
              };

              console.log("Saving payload:", payload);

              if (data?.id) {
                await patchData(`why-partner-with-us/${data.id}`, payload);
                toast.success("Updated successfully!", { id: toastId });
                
                // Update preview if new image was uploaded
                if (values.images) {
                  setPreview(URL.createObjectURL(values.images));
                }
              } else {
                await postData("why-partner-with-us", payload);
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
          {({ setFieldValue, values, isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              {/* Title and Subtitle Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-lg">
                    Subtitle *
                  </label>
                  <Field
                    name="subTitle"
                    placeholder="Enter subtitle"
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#04413D] focus:border-transparent"
                  />
                  <ErrorMessage
                    name="subTitle"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
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
                  config={{
                    height: 300,
                    placeholder: 'Write your description here...',
                  }}
                  className="border rounded-lg"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Benefits FieldArray */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Benefits *
                </label>

                <FieldArray name="benefits">
                  {({ push, remove, form }) => (
                    <div className="space-y-3">
                      {form.values.benefits.map((_, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <div className="flex-1">
                            <Field
                              name={`benefits.${index}`}
                              placeholder={`Benefit ${index + 1}`}
                              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#04413D] focus:border-transparent"
                            />
                            {errors.benefits?.[index] && touched.benefits?.[index] && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.benefits[index]}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => push("")}
                        className="flex items-center gap-2 text-[#04413D] hover:text-[#04413D]/80 font-medium"
                      >
                        <MdAdd size={20} /> Add Benefit
                      </button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage
                  name="benefits"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Satisfaction Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-lg">
                    Satisfaction Title *
                  </label>
                  <Field
                    name="satisfactionTitle"
                    placeholder="e.g., Partner Satisfaction"
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#04413D] focus:border-transparent"
                  />
                  <ErrorMessage
                    name="satisfactionTitle"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-lg">
                    Satisfaction Percentage *
                  </label>
                  <Field
                    name="satisfactionPercent"
                    placeholder="e.g., 98%"
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#04413D] focus:border-transparent"
                  />
                  <ErrorMessage
                    name="satisfactionPercent"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Image Field - Same as HeroSection */}
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

                      setFieldValue("images", file); // Changed from 'imageid' to 'images'
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
                    {(preview || values.images) && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(data?.imageid?.imageUrl || null);
                          setFieldValue("images", null);
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
                  ? "Update Why Partner With Us"
                  : "Create Why Partner With Us"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}