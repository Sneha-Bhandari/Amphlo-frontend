"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";
import Image from "next/image";

import {
  fetchData,
  patchData,
  postData,
  uploadImageData,
} from "@/lib/frontendApi";

const sectionsMap = {
  aboutus: { name: "About Us", apiPath: "aboutus" },
  partnerWithUs: { name: "Partner With Us", apiPath: "partnerWithUs" },
  bookAnAppointment: { name: "Book Appointment", apiPath: "bookAnAppointment" },
};

function Input(props) {
  return (
    <Field
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 
      focus:border-[#04413D] focus:ring-2 focus:ring-green-100 
      outline-none transition"
    />
  );
}

function DynamicForm({ section, data, onSuccess }) {
  const [preview, setPreview] = useState(null);
  const [liveTitle, setLiveTitle] = useState(data?.title || "");
  const [liveSubtitle, setLiveSubtitle] = useState(data?.subTitle || "");

  const handleSubmit = async (values, { setSubmitting }) => {
    const toastId = toast.loading("Saving changes...");

    try {
      let imageId = data?.imageid?.id || null;

      if (values.imageid instanceof File) {
        const uploadRes = await uploadImageData(values.imageid);
        imageId = uploadRes?.id;
      }

      const payload = {
        title: values.title,
        subTitle: values.subtitle,
        path: section.apiPath,
        ...(imageId && { imageid: imageId }),
      };

      if (data) {
        await patchData(`banner/${section.apiPath}`, payload);
        toast.success("Banner updated successfully", { id: toastId });
      } else {
        await postData("banner", payload);
        toast.success("Banner created successfully", { id: toastId });
      }

      setPreview(null);
      onSuccess();
    } catch (err) {
      toast.error(err?.message || "Something went wrong", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: data?.title || "",
        subtitle: data?.subTitle || "",
        imageid: null,
      }}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting, values }) => (
        <Form className="space-y-6">
          <div className=" p-6 space-y-4">
            

            <div>
              <label className="text-sm text-gray-600">Title</label>
              <Input 
                name="title" 
                placeholder="Enter title"
                onChange={(e) => {
                  setLiveTitle(e.target.value);
                  setFieldValue("title", e.target.value);
                }}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Subtitle</label>
              <Input 
                name="subtitle" 
                placeholder="Enter subtitle"
                onChange={(e) => {
                  setLiveSubtitle(e.target.value);
                  setFieldValue("subtitle", e.target.value);
                }}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Banner Image</label>

              {/* Hidden file input */}
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
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

            

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-fit px-4 bg-[#04413D] hover:bg-[#04413D]/90 cursor-pointer text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
            >
              {data ? "Update Banner" : "Create Banner"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default function Page() {
  const { slug } = useParams();
  const section = sectionsMap[slug];
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchData("banner");
      const found = res.find((b) => b.path === section.apiPath);
      setData(found || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (section) load();
  }, [slug]);

  if (!section) return <p className="p-6">Invalid section</p>;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <Toaster />

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#04413D]">
            {section.name}
          </h1>
          <p className="text-gray-500 text-sm">
            Manage banner content for this section
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl 
          hover:bg-green-50 hover:border-green-300 text-[#04413D] transition"
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <Loading />
      ) : (
        <DynamicForm section={section} data={data} onSuccess={load} />
      )}
    </div>
  );
}