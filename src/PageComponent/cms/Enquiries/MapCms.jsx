"use client";

import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { fetchData, postData, patchData } from "@/lib/frontendApi";

export default function MapCms() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const hasFetched = useRef(false); // Prevent multiple fetches

  useEffect(() => {
    // Prevent multiple API calls
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const fetchMapData = async () => {
      try {
        setInitialLoading(true);
        const res = await fetchData("map/");
        console.log("Fetched map data:", res);
        
        if (res && Array.isArray(res) && res.length > 0) {
          setData(res[0]);
        } else if (res && typeof res === 'object' && !Array.isArray(res)) {
          setData(res);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        // Don't show error for 404
        if (!err.message?.includes("404")) {
          toast.error("Failed to fetch map data");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMapData();
  }, []); // Empty dependency array

  const validationSchema = Yup.object({
    mapUrl: Yup.string()
      .url("Must be a valid URL")
      .required("Map URL is required"),
  });

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04413D]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 mx-auto w-full rounded-2xl pt-12">
      <Toaster position="top-right" />

      <div className="flex flex-col md:items-center">
        <div className="text-4xl text-[#04413D] font-bold">
          Map Configuration
        </div>
        <div className="text-sm text-gray-500">
          Manage Google Maps embed URL for location display
        </div>
      </div>

      <div className="border border-gray-300 rounded-2xl p-8 w-full ">
        <Formik
          enableReinitialize
          initialValues={{
            mapUrl: data?.mapUrl || "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const toastId = toast.loading("Saving map information...");

            try {
              setLoading(true);

              const payload = {
                mapUrl: values.mapUrl?.trim(),
              };

              console.log("Payload being sent:", payload);

              if (data?.id) {
                await patchData(`map/${data.id}`, payload);
                toast.success("Map information updated successfully!", { id: toastId });
              } else {
                await postData("map/", payload);
                toast.success("Map information created successfully!", { id: toastId });
              }
              
              // Refresh data after successful operation
              const refreshedData = await fetchData("map/");
              if (refreshedData && Array.isArray(refreshedData) && refreshedData.length > 0) {
                setData(refreshedData[0]);
              } else if (refreshedData && typeof refreshedData === 'object') {
                setData(refreshedData);
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
          {({ values, errors, isSubmitting, touched }) => (
            <Form className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Google Maps Embed URL *
                </label>
                <Field
                  name="mapUrl"
                  type="text"
                  className={`w-full border ${
                    errors.mapUrl && touched.mapUrl ? "border-red-500" : "border-gray-300"
                  } rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <ErrorMessage
                  name="mapUrl"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
                
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Working URL:</p>
                  <code className="text-xs text-blue-700 break-all">
                    https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1552975551726!2d83.46193627549206!3d27.697835525390897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996868a80185519%3A0xbad4eeb3b7798ee5!2sShantikunja%2C%20Butwal%2032907!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp
                  </code>
                </div>
              </div>

              {values.mapUrl && !errors.mapUrl && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-gray-700">Preview</label>
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                    <iframe
                      src={values.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Map Preview"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg font-semibold bg-linear-to-r from-[#FDC653] to-yellow-500 text-white hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? "Processing..." : "Save Map Information"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}