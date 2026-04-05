"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from 'react-hot-toast';

export default function HeroSection() {
  const { getdata, postdatas, patchdata, loading } = useApi();

  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);

  const fields = [
    { label: "Title", name: "title", type: "text" },
    { label: "Subtitle", name: "subtitle", type: "text" },
    { label: "Image", name: "imageid", type: "file" },
  ];

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await getdata("hero-section");
        if (res && res.length > 0) {
          setData(res[0]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch hero section data");
      }
    };

    fetchHero();
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    subtitle: Yup.string().required("Subtitle is required"),
    imageid: Yup.mixed().nullable(),
  });

  return (
    <div className="flex flex-col gap-8 mx-auto w-full rounded-2xl">
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
            imageid: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const loadingToast = toast.loading(data ? "Updating hero section..." : "Creating hero section...");
            
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
                title: values.title,
                subTitle: values.subtitle,
                imageid: imageId,
              };

              if (data?.id) {
                await patchdata(`hero-section/${data.id}`, payload);
                toast.success("Hero section updated successfully! ", {
                  id: loadingToast,
                });
              } else {
                await postdatas("hero-section", payload);
                toast.success("Hero section created successfully! ", {
                  id: loadingToast,
                });
                resetForm();
                setPreview(null);
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
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 font-medium text-gray-700">{field.label}</label>

                  {field.type === "file" ? (
                    <>
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
                            alt="Preview"
                            className="my-5 w-68 h-38 object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              setFieldValue("imageid", null);
                              toast.success("Image removed");
                            }}
                            className="absolute top-4 right-4 bg-red-500 text-white cursor-pointer rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Field
                      name={field.name}
                      type={field.type}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}

                  <ErrorMessage
                    name={field.name}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                  isSubmitting || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-[#FDC653] to-yellow-500 hover:from-yellow-600 hover:to-yellow-700 text-white"
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
                  data ? "Update Hero Section" : "Create Hero Section"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}