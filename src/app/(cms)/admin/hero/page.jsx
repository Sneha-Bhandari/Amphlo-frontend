"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function HeroSection() {
  const { getdata, postdatas, patchdata, uploadImageData, loading } = useApi();

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
            imageid: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const toastId = toast.loading(
              data ? "Updating hero section..." : "Creating hero section..."
            );

            try {
              let imageId = data?.imageid?.id;

              // ✅ USE HOOK INSTEAD OF DIRECT FETCH
              if (values.imageid) {
                toast.loading("Uploading image...", { id: toastId });

                const uploadRes = await uploadImageData(values.imageid);
                imageId = uploadRes?.id;
              }

              const payload = {
                title: values.title,
                subTitle: values.subtitle,
                imageid: imageId,
              };

              if (data?.id) {
                await patchdata(`hero-section/${data.id}`, payload);
                toast.success("Hero section updated successfully!", {
                  id: toastId,
                });
              } else {
                await postdatas("hero-section", payload);
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
            }
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">

              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {field.label}
                  </label>

                  {field.type === "file" ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            setFieldValue("imageid", file);
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
                            className="my-5 w-68 h-38 object-contain"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              setFieldValue("imageid", null);
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
                      name={field.name}
                      type={field.type}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder={`Enter ${field.label}`}
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