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

  const fields = [
    { label: "Title", name: "title", type: "text" },
    { label: "Description", name: "description", type: "textarea" },
  ];

  useEffect(() => {
    const fetchUniversityBanner = async () => {
      try {
        setLoading(true);
        const res = await fetchData("university-banner");
        console.log("University Banner API Response:", res);
        
        if (res && res.length > 0) {
          setData(res[0]);
        } else if (res && typeof res === 'object' && !Array.isArray(res)) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch university banner data");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityBanner();
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title must not exceed 200 characters")
      .required("Title is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must not exceed 1000 characters")
      .required("Description is required"),
  });

  return (
    <div className="flex flex-col gap-8 mx-auto w-full rounded-2xl">
      <Toaster position="top-right" />

      <div className="flex flex-col md:items-center">
        <div className="text-4xl text-[#04413D] font-bold">
          University Banner Section
        </div>
        <div className="text-sm text-gray-500">
          Manage title and description for university banner
        </div>
      </div>

      <div className="border border-gray-300 rounded-2xl p-8 w-full">
        <Formik
          enableReinitialize
          initialValues={{
            title: data?.title || "",
            description: data?.description || "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const toastId = toast.loading(
              data ? "Updating university banner..." : "Creating university banner..."
            );

            try {
              setLoading(true);

              // Clean the description HTML
              let cleanDescription = values.description;
              
              // Remove any problematic characters
              if (cleanDescription) {
                cleanDescription = cleanDescription.replace(/&quot;$/g, '');
              }
              
              // Ensure HTML is properly formatted
              if (cleanDescription && !cleanDescription.includes('<') && !cleanDescription.includes('>')) {
                cleanDescription = `<p>${cleanDescription}</p>`;
              }

              const payload = {
                title: values.title.trim(),
                description: cleanDescription,
              };

              console.log("Final payload:", payload);

              if (data?.id) {
                await patchData(`university-banner/${data.id}`, payload);
                toast.success("University banner updated successfully!", {
                  id: toastId,
                });
                
                // Refresh data after update
                const refreshedData = await fetchData("university-banner");
                if (refreshedData && refreshedData.length > 0) {
                  setData(refreshedData[0]);
                } else if (refreshedData && typeof refreshedData === 'object') {
                  setData(refreshedData);
                }
              } else {
                await postData("university-banner", payload);
                toast.success("University banner created successfully!", {
                  id: toastId,
                });

                resetForm();
                
                // Refresh data after create
                const refreshedData = await fetchData("university-banner");
                if (refreshedData && refreshedData.length > 0) {
                  setData(refreshedData[0]);
                } else if (refreshedData && typeof refreshedData === 'object') {
                  setData(refreshedData);
                }
              }
            } catch (err) {
              console.error(err);
              toast.error(err.message || "Something went wrong!", {
                id: toastId,
              });
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="space-y-4">
              {fields.map((val, i) => (
                <div key={i}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {val.label} *
                  </label>

                  {val.type === "textarea" ? (
                    <JoditEditor
                      value={values.description}
                      onBlur={(content) => setFieldValue("description", content)}
                      config={{
                        height: 300,
                        placeholder: "Enter description...",
                      }}
                    />
                  ) : (
                    <Field
                      name={val.name}
                      type={val.type}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder={`Enter ${val.label.toLowerCase()}`}
                    />
                  )}

                  <ErrorMessage
                    name={val.name}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg font-semibold bg-linear-to-r from-[#FDC653] to-yellow-500 text-white hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading
                  ? "Processing..."
                  : data
                    ? "Update University Banner"
                    : "Create University Banner"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}