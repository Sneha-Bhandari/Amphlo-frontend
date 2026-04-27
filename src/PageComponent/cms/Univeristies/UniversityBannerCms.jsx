"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import JoditEditor from "jodit-react";

import {
  fetchData,
  postData,
  patchData,
} from "@/lib/frontendApi";

export default function UniversityBannerCMS() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        const res = await fetchData("university-banner");

        if (res && res.length > 0) {
          setData(res[0]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("Title is required"),
    description: Yup.string()
      .min(10, "Minimum 10 characters")
      .required("Description is required"),
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      <Toaster position="top-right" />

      <div>
        <h1 className="text-3xl font-bold text-[#04413D]">
          University Banner
        </h1>
        <p className="text-gray-500 text-sm">
          Manage title and description
        </p>
      </div>

      <div className="border p-6 rounded-xl">
        <Formik
          enableReinitialize
          initialValues={{
            title: data?.title || "",
            description: data?.description || "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const toastId = toast.loading(
              data ? "Updating..." : "Creating..."
            );

            try {
              setLoading(true);

              const payload = {
                title: values.title,
                description: values.description,
              };

              if (data?.id) {
                await patchData(`university-banner/${data.id}`, payload);
                toast.success("Updated successfully!", { id: toastId });
              } else {
                await postData("university-banner", payload);
                toast.success("Created successfully!", { id: toastId });
              }

              const refreshed = await fetchData("university-banner");
              if (refreshed && refreshed.length > 0) {
                setData(refreshed[0]);
              }
            } catch (err) {
              console.error(err);
              toast.error("Something went wrong", { id: toastId });
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="space-y-4">

              {/* Title */}
              <div>
                <label className="font-medium">Title *</label>
                <Field
                  name="title"
                  className="w-full border p-2 rounded-lg"
                  placeholder="Enter title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-medium">Description *</label>
                <JoditEditor
                  value={values.description}
                  onBlur={(content) =>
                    setFieldValue("description", content)
                  }
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-6 py-2 rounded-lg bg-yellow-500 text-white"
              >
                {loading
                  ? "Processing..."
                  : data
                  ? "Update"
                  : "Create"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}