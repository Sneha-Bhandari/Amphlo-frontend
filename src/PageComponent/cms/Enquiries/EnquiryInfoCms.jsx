"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { fetchData } from "@/lib/frontendApi";
import { useApi } from "@/hooks/useApi";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";
import { MdClose } from "react-icons/md";

const EnquirySchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNo: Yup.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .required("Phone number is required"),
  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters")
    .required("Address is required"),
  mapEmbedUrl: Yup.string()
    .url("Must be a valid URL")
    .required("Google Maps embed URL is required"),
});

const EnquiryInfoCms = () => {
  const { patchdata, postdatas, loading: apiLoading } = useApi();
  const [loading, setLoading] = useState(true);
  const [storedData, setStoredData] = useState(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchEnquiryData = async () => {
      try {
        const response = await fetchData("contact");
        console.log("Enquiry API Response:", response);
        
        if (response && response.length > 0) {
          setStoredData(response[0]);
          setHasData(true);
        } else if (response && !Array.isArray(response)) {
          setStoredData(response);
          setHasData(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiryData();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    const loadingToast = toast.loading(
      hasData ? "Updating enquiry info..." : "Creating enquiry info..."
    );

    try {
      const payload = {
        email: values.email.trim(),
        phoneNo: values.phoneNo.trim(),
        address: values.address.trim(),
        mapEmbedUrl: values.mapEmbedUrl.trim(),
      };

      console.log("Final payload:", JSON.stringify(payload, null, 2));

      let response;
      
      if (hasData && storedData?.id) {
        console.log(`Updating Enquiry Info with ID: ${storedData.id}`);
        
        let updateSuccess = false;
        const endpointsToTry = [
          `contact/${storedData.id}`,
          `contact/update/${storedData.id}`,
          `contact?id=${storedData.id}`,
        ];
        
        for (const endpoint of endpointsToTry) {
          try {
            console.log(`Trying update endpoint: ${endpoint}`);
            response = await patchdata(endpoint, payload);
            updateSuccess = true;
            console.log(`Update successful with endpoint: ${endpoint}`);
            break;
          } catch (err) {
            console.log(`Endpoint ${endpoint} failed:`, err.message);
          }
        }
        
        if (!updateSuccess) {
          throw new Error("Failed to update Enquiry data. Please check your API endpoints.");
        }
        
        toast.success("Enquiry info updated successfully!", { id: loadingToast });
        
        setStoredData({
          ...storedData,
          ...payload,
        });
      } else {
        console.log("Creating new Enquiry data");
        response = await postdatas("contact", payload);
        console.log("Create response:", response);
        toast.success("Enquiry info created successfully!", { id: loadingToast });
        
        if (response && response.id) {
          setStoredData(response);
          setHasData(true);
        } else {
          setStoredData(payload);
          setHasData(true);
        }
      }
      
    } catch (err) {
      console.error("Error:", err);
      let errorMessage = err.message || "Something went wrong";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 404) {
        errorMessage = "API endpoint not found. Please check your backend configuration.";
      } else if (err.response?.status === 400) {
        errorMessage = "Bad request. Please check if all fields are correct.";
      }
      
      toast.error(`Error: ${errorMessage}`, {
        id: loadingToast,
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
      
      <div className="md:my-12 flex-col flex w-full mx-auto">
        <div className="w-full mt-4 flex flex-col justify-center items-center mx-auto mb-4">
          <h3 className="text-4xl font-semibold mb-1 text-[#0B0C28] underline-offset-2">
            Enquiry / Contact Information
          </h3>
          <p className="text-xs text-gray-400">
            Manage email, phone number, address, and map location
          </p>
        </div>

        <div className="w-full">
          <Formik
            enableReinitialize
            initialValues={{
              email: storedData?.email || "",
              phoneNo: storedData?.phoneNo || "",
              address: storedData?.address || "",
              mapEmbedUrl: storedData?.mapEmbedUrl || "",
            }}
            validationSchema={EnquirySchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, errors, touched, setTouched }) => (
              <Form className="flex flex-col gap-4 shadow-2xl shadow-blue-50 md:p-12 p-8 rounded-xl">
                
                <div>
                  <label className="text-md font-medium">Email Address *</label>
                  <Field
                    name="email"
                    type="email"
                    className={`border ${
                      errors.email && touched.email ? "border-red-500" : "border-gray-400"
                    } text-gray-700 px-4 py-2 rounded-md w-full`}
                    placeholder="Enter email address (e.g., info@amphlo.com)"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="text-md font-medium">Phone Number *</label>
                  <Field
                    name="phoneNo"
                    type="tel"
                    className={`border ${
                      errors.phoneNo && touched.phoneNo ? "border-red-500" : "border-gray-400"
                    } text-gray-700 px-4 py-2 rounded-md w-full`}
                    placeholder="Enter phone number (e.g., +977 9745432207)"
                  />
                  <ErrorMessage name="phoneNo" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="text-md font-medium">Address *</label>
                  <Field
                    as="textarea"
                    name="address"
                    rows="3"
                    className={`border ${
                      errors.address && touched.address ? "border-red-500" : "border-gray-400"
                    } text-gray-700 px-4 py-2 rounded-md w-full`}
                    placeholder="Enter complete address"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="text-md font-medium">Google Maps Embed URL *</label>
                  <Field
                    as="textarea"
                    name="mapEmbedUrl"
                    rows="4"
                    className={`border ${
                      errors.mapEmbedUrl && touched.mapEmbedUrl ? "border-red-500" : "border-gray-400"
                    } text-gray-700 px-4 py-2 rounded-md w-full font-mono text-sm`}
                    placeholder="Paste Google Maps embed iframe src URL here"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe code
                  </p>
                  <ErrorMessage name="mapEmbedUrl" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Preview Map */}
                {values.mapEmbedUrl && !errors.mapEmbedUrl && (
                  <div className="mt-4">
                    <label className="text-md font-medium">Map Preview</label>
                    <div className="mt-2 h-64 rounded-lg overflow-hidden border border-gray-300">
                      <iframe
                        src={values.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Location Map Preview"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || apiLoading}
                  className={`font-semibold bg-linear-to-r from-[#0B0C28] to-cyan-400 text-white py-2.5 px-4 w-fit rounded-xl transition-all ${
                    isSubmitting || apiLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                  }`}
                >
                  {isSubmitting || apiLoading ? "Processing..." : (hasData ? "Update Information" : "Create Information")}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default EnquiryInfoCms;