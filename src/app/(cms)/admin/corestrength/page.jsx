"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Field, Form, Formik, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from 'react-hot-toast';

export default function CoreStrengthsCMS() {
  const { getdata, postdatas, patchdata, loading } = useApi();

  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchCoreStrengths = async () => {
      try {
        const res = await getdata("core-strengths");
        if (res && res.length > 0) {
          setData(res[0]);
          if (res[0]?.imageid?.imageUrl) {
            setPreview(res[0].imageid.imageUrl);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch core strengths data");
      }
    };

    fetchCoreStrengths();
  }, []);

  const validationSchema = Yup.object({
    stats: Yup.array().of(
      Yup.object({
        count: Yup.string().required("Count is required"),
        label: Yup.string().required("Label is required"),
      })
    ).min(1, "At least one stat is required"),
    imageid: Yup.mixed().nullable(),
  });

  const initialStats = [
    { count: "4800+", label: "Agents" },
    { count: "140+", label: "Global Institutions" },
    { count: "75+", label: "Countries" },
    { count: "500+", label: "Courses Available" },
    { count: "5000+", label: "Students" },
  ];

  return (
    <div className="flex flex-col gap-8 mx-auto  w-full">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="flex flex-col md:items-center gap-3">
        <div className="text-4xl text-[#04413D] font-bold">
          Core Strengths Section
        </div>
        <div className="text-sm text-gray-500">
          Manage statistics and image for core strengths section
        </div>
      </div>

      <div className="border border-gray-300 rounded-2xl p-6 w-full  shadow-sm">
        <Formik
          enableReinitialize
          initialValues={{
            stats: data?.stats && data.stats.length > 0 ? data.stats : initialStats,
            imageid: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const loadingToast = toast.loading(data ? "Updating core strengths..." : "Creating core strengths...");
            
            try {
              let imageId = data?.imageid?.id;

              if (values.imageid) {
                toast.loading("Uploading image...", { id: loadingToast });
                
                const formData = new FormData();
                formData.append("images", values.imageid);
              
                const uploadRes = await fetch(
                  process.env.NEXT_PUBLIC_UPLOAD_URL,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
              
                if (!uploadRes.ok) {
                  const errText = await uploadRes.text();
                  console.error("UPLOAD ERROR:", errText);
                  throw new Error("Upload failed");
                }
              
                const uploadData = await uploadRes.json();
                imageId = uploadData.id;
                toast.success("Image uploaded successfully!", { id: loadingToast });
              }

              const payload = {
                stats: values.stats,
                imageid: imageId,
              };

              if (data?.id) {
                await patchdata(`core-strengths/${data.id}`, payload);
                toast.success("Core strengths updated successfully! ", {
                  id: loadingToast,
                });
              } else {
                await postdatas("core-strengths", payload);
                toast.success("Core strengths created successfully! ", {
                  id: loadingToast,
                });
                resetForm();
              }
            } catch (err) {
              console.error("ERROR:", err);
              toast.error(err.message || "Something went wrong! Please try again.", {
                id: loadingToast,
                duration: 4000,
              });
            }
          }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="space-y-6  w-full">
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Statistics
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Add, edit, or remove statistics that showcase your strengths
                </p>
                
                <FieldArray name="stats">
                  {({ push, remove, form }) => (
                    <div className="space-y-4">
                      {values.stats && values.stats.map((_, index) => (
                        <div key={index} className="flex gap-4 items-start p-4 border border-gray-300 rounded-lg ">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Count
                            </label>
                            <Field
                              name={`stats.${index}.count`}
                              type="text"
                              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                              placeholder="e.g., 4800+"
                            />
                            <ErrorMessage
                              name={`stats.${index}.count`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Label
                            </label>
                            <Field
                              name={`stats.${index}.label`}
                              type="text"
                              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                              placeholder="e.g., Agents"
                            />
                            <ErrorMessage
                              name={`stats.${index}.label`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="mt-6 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => push({ count: "", label: "" })}
                        className="flex items-center gap-2 text-[#04413D] border-2 border-[#04413D] rounded-lg px-4 py-2 hover:bg-[#04413D] hover:text-white transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
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
                <p className="text-sm text-gray-500 mb-4">
                  Upload an image that represents your core strengths
                </p>
                
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("Image size should be less than 5MB");
                        e.target.value = '';
                        return;
                      }
                      
                      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                      if (!validTypes.includes(file.type)) {
                        toast.error("Please upload a valid image (JPEG, PNG, WEBP)");
                        e.target.value = '';
                        return;
                      }
                      
                      setFieldValue("imageid", file);
                      setPreview(URL.createObjectURL(file));
                      toast.success("Image selected successfully!");
                    } else {
                      setFieldValue("imageid", null);
                      setPreview(null);
                    }
                  }}
                />

                {(preview || data?.imageid?.imageUrl) && (
                  <div className="mt-7 relative group border-2 border-dashed hover:border-gray-900 cursor-pointer border-gray-400 rounded-lg items-center justify-center mx-auto flex flex-col">
                    <img
                      src={preview || data?.imageid?.imageUrl}
                      alt="Core Strengths Preview"
                      className="my-5 w-68 h-38 object-contain"
                    />
                  </div>
                )}
                
                <ErrorMessage
                  name="imageid"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-start pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                    isSubmitting || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : " bg-linear-to-r from-[#FDC653] to-yellow-500 hover:from-yellow-600 hover:to-yellow-700 text-white"
                  }`}
                >
                  {isSubmitting || loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    data ? "Update Core Strengths" : "Create Core Strengths"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}