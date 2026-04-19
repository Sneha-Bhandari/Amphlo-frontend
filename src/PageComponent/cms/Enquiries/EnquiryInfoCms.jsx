"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";

import {
  fetchData,
  postData,
  patchData,
} from "@/lib/frontendApi";

export default function EnquiryInfoCms() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fields = [
    { label: "Email Address", name: "email", type: "email", placeholder: "info@amphlo.com" },
    { label: "Phone Number", name: "phoneNo", type: "tel", placeholder: "+977 9745432207" },
    { label: "Address", name: "address", type: "textarea", placeholder: "Santikunja, Yogikuti (next to Garima Bikash Bank)" },
  ];

  useEffect(() => {
    const fetchEnquiryData = async () => {
      try {
        setInitialLoading(true);
        const res = await fetchData("contact");
        console.log("Fetched enquiry data:", res);
        
        // Handle different response formats
        if (res) {
          if (Array.isArray(res) && res.length > 0) {
            setData(res[0]);
          } else if (typeof res === 'object' && !Array.isArray(res) && res.id) {
            setData(res);
          } else if (res.data && Array.isArray(res.data)) {
            setData(res.data[0]);
          } else if (res.data && typeof res.data === 'object') {
            setData(res.data);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error(err.message || "Failed to fetch enquiry data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchEnquiryData();
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNo: Yup.string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits")
      .required("Phone number is required"),
    address: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address must not exceed 500 characters")
      .required("Address is required"),
  });

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04413D]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 mx-auto w-full rounded-2xl">
      <Toaster position="top-right" />

      <div className="flex flex-col md:items-center">
        <div className="text-4xl text-[#04413D] font-bold">
          Enquiry / Contact Information
        </div>
        <div className="text-sm text-gray-500">
          Manage email, phone number, and address
        </div>
      </div>

      <div className="border border-gray-300 rounded-2xl p-8 w-full">
        <Formik
          enableReinitialize
          initialValues={{
            email: data?.email || "",
            phoneNo: data?.phoneNo || "",
            address: data?.address || "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            const toastId = toast.loading(
              data?.id ? "Updating enquiry information..." : "Creating enquiry information..."
            );

            try {
              setLoading(true);

              const payload = {
                email: values.email?.trim(),
                phoneNo: values.phoneNo?.trim(),
                address: values.address?.trim(),
              };

              console.log("Payload being sent:", payload);
              console.log("Data ID:", data?.id);

              let response;
              if (data?.id) {
                response = await patchData(`contact/${data.id}`, payload);
                console.log("Update response:", response);
                toast.success("Enquiry information updated successfully!", { id: toastId });
              } else {
                response = await postData("contact", payload);
                console.log("Create response:", response);
                toast.success("Enquiry information created successfully!", { id: toastId });
                resetForm();
              }
              
              // Refresh data after successful operation
              const refreshedData = await fetchData("contact");
              console.log("Refreshed data:", refreshedData);
              
              if (refreshedData) {
                if (Array.isArray(refreshedData) && refreshedData.length > 0) {
                  setData(refreshedData[0]);
                } else if (typeof refreshedData === 'object' && !Array.isArray(refreshedData) && refreshedData.id) {
                  setData(refreshedData);
                } else if (refreshedData.data) {
                  if (Array.isArray(refreshedData.data) && refreshedData.data.length > 0) {
                    setData(refreshedData.data[0]);
                  } else if (typeof refreshedData.data === 'object') {
                    setData(refreshedData.data);
                  }
                }
              }
            } catch (err) {
              console.error("Submit error:", err);
              toast.error(err.message || "Something went wrong!", { id: toastId });
            } finally {
              setLoading(false);
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              {fields.map((val, i) => (
                <div key={i}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {val.label} *
                  </label>

                  {val.type === "textarea" ? (
                    <Field
                      as="textarea"
                      name={val.name}
                      rows={3}
                      className={`w-full border ${
                        errors[val.name] && touched[val.name] ? "border-red-500" : "border-gray-300"
                      } rounded-lg p-2 resize-y focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                      placeholder={val.placeholder}
                    />
                  ) : (
                    <Field
                      name={val.name}
                      type={val.type}
                      className={`w-full border ${
                        errors[val.name] && touched[val.name] ? "border-red-500" : "border-gray-300"
                      } rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                      placeholder={val.placeholder}
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
                  : data?.id
                    ? "Update Enquiry Information"
                    : "Create Enquiry Information"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}