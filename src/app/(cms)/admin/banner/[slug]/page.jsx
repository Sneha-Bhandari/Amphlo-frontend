"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";

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
        <Form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-lg font-semibold text-[#04413D]">
              Banner Details
            </h2>

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

              <div className="mt-2 border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-green-400 transition bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setFieldValue("imageid", file);
                    const previewUrl = URL.createObjectURL(file);
                    setPreview(previewUrl);
                  }}
                />
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#04413D] hover:bg-green-600 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
            >
              {data ? "Update Banner" : "Create Banner"}
            </button>
          </div>

          {/* RIGHT - PREVIEW */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold text-[#04413D] mb-4">
              Live Preview
            </h2>

            <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
              {(preview || data?.imageid?.imageUrl) ? (
                <img
                  src={preview || data?.imageid?.imageUrl}
                  className="w-full h-64 object-cover"
                  alt="Banner preview"
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No image selected
                </div>
              )}

              <div className="p-4">
                <h3 className="text-xl font-semibold text-[#04413D]">
                  {liveTitle || "Banner Title"}
                </h3>
                <p className="text-gray-500 mt-1">
                  {liveSubtitle || "Banner subtitle will appear here"}
                </p>
              </div>
            </div>
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