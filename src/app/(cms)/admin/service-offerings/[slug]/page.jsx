"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Field, Form, Formik, FieldArray } from "formik";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

import {
  fetchData,
  patchData,
  postData,
  uploadImageData,
} from "@/lib/frontendApi";

// Dynamically import Jodit editor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const sectionsMap = {
  partner: { name: "Partner", apiPath: "partner" },
  university: { name: "University", apiPath: "university" },
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

function DynamicForm({ section, data, onSubmit }) {
  const [preview, setPreview] = useState(null);
  const [liveTitle, setLiveTitle] = useState(data?.title || "");
  const [liveDescription, setLiveDescription] = useState(data?.description || "");
  const editor = useRef(null);

  // Jodit editor configuration
  const config = {
    readonly: false,
    placeholder: "Enter description...",
    height: 300,
    uploader: {
      insertImageAsBase64URI: true,
    },
    toolbar: true,
    buttons: [
      "source", "|",
      "bold", "italic", "underline", "strikethrough", "|",
      "ul", "ol", "|",
      "font", "fontsize", "brush", "paragraph", "|",
      "image", "table", "link", "|",
      "align", "undo", "redo", "|",
      "hr", "eraser", "fullsize"
    ],
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: data?.title || "",
        description: data?.description || "",
        features: data?.features || [""],
        imageid: null,
      }}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, isSubmitting, values }) => (
        <Form className="space-y-6">
          <div className="p-6 space-y-4">
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
              <label className="text-sm text-gray-600">Description</label>
              <JoditEditor
                ref={editor}
                value={values.description}
                config={config}
                onBlur={(newContent) => {
                  setLiveDescription(newContent);
                  setFieldValue("description", newContent);
                }}
                onChange={(newContent) => {
                  setLiveDescription(newContent);
                  setFieldValue("description", newContent);
                }}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Features</label>
              <FieldArray name="features">
                {({ push, remove, form }) => (
                  <div className="space-y-3">
                    {values.features.map((_, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Field
                          name={`features.${index}`}
                          placeholder={`Feature ${index + 1}`}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 
                          focus:border-[#04413D] focus:ring-2 focus:ring-green-100 
                          outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push("")}
                      className="flex items-center gap-2 text-[#04413D] hover:text-green-600 transition mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Feature
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div>
              <label className="text-sm text-gray-600">Service Image</label>

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
              className="w-fit px-6 bg-[#04413D] hover:bg-[#04413D]/90 cursor-pointer text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : data ? "Update Service" : "Create Service"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default function Page() {
  const { slug } = useParams();
  const router = useRouter();
  const section = sectionsMap[slug];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetchData("service-offerings");
      const found = res.find((x) => x.path === section.apiPath);
      setData(found || null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, actions) => {
    const toastId = toast.loading("Saving...");

    try {
      let imageId = data?.imageid?.id || null;

      if (values.imageid instanceof File) {
        const uploadRes = await uploadImageData(values.imageid);
        imageId = uploadRes?.id;
      }

      const payload = {
        title: values.title,
        description: values.description,
        features: values.features.filter(Boolean),
        path: section.apiPath,
        imageid: imageId,
      };

      if (data) {
        await patchData(`service-offerings/${data.path}`, payload);
        toast.success("Updated successfully", { id: toastId });
      } else {
        await postData("service-offerings", payload);
        toast.success("Created successfully", { id: toastId });
      }

      await load();
      actions.setSubmitting(false);
    } catch (err) {
      toast.error(err.message, { id: toastId });
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (section) load();
  }, [slug]);

  if (!section) return <p className="p-6">Invalid section</p>;

  return (
    <div className="min-h-screen">
      <Toaster />

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#04413D]">
            {section.name} Service Offering
          </h1>
          <p className="text-gray-500 text-sm">
            Manage service offering content for {section.name}
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <DynamicForm
            section={section}
            data={data}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}