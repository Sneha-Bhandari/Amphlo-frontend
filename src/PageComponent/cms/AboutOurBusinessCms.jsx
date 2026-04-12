"use client";

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import { fetchData } from "@/lib/frontendApi";
import { useApi } from "@/hooks/useApi";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters")
    .required("Description is required"),
  imageid: Yup.mixed().nullable(),
});

const AboutOurBusiness = () => {
  const editor = useRef(null);
  const { patchdata, postdatas, loading: apiLoading } = useApi();
  const [loading, setLoading] = useState(true);
  const [storedData, setStoredData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetchData("about-business");
        console.log("About Business API Response:", response);
        
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
    fetchAboutData();
  }, []);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("images", file);

    const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("UPLOAD ERROR:", errText);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const uploadData = await response.json();
    console.log("Upload successful, image ID:", uploadData.id);
    return uploadData.id;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const loadingToast = toast.loading(
      hasData ? "Updating section..." : "Creating section..."
    );

    try {
      let imageId = storedData?.imageid?.id || null;

      if (values.imageid && values.imageid instanceof File) {
        toast.loading("Uploading image...", { id: loadingToast });

        if (values.imageid.size > 5 * 1024 * 1024) {
          throw new Error("Image size should be less than 5MB");
        }

        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!validTypes.includes(values.imageid.type)) {
          throw new Error("Please upload a valid image (JPEG, PNG, WEBP)");
        }

        imageId = await uploadImage(values.imageid);
        console.log("New image uploaded with ID:", imageId);
      }

      // Clean the description HTML
      let cleanDescription = values.description;
      
      // Remove any problematic characters
      cleanDescription = cleanDescription.replace(/&quot;$/g, '');
      
      // Ensure HTML is properly formatted
      if (cleanDescription && !cleanDescription.includes('<') && !cleanDescription.includes('>')) {
        cleanDescription = `<p>${cleanDescription}</p>`;
      }

      const payload = {
        title: values.title.trim(),
        description: cleanDescription,
      };

      if (imageId) {
        payload.imageid = imageId;
      }

      console.log("Final payload description length:", payload.description.length);
      console.log("Final payload:", JSON.stringify(payload, null, 2));

      let response;
      
      if (hasData && storedData?.id) {
        console.log(`Updating About Business with ID: ${storedData.id}`);
        
        let updateSuccess = false;
        const endpointsToTry = [
          `about-business/${storedData.id}`,
          `about-business/update/${storedData.id}`,
          `about-business?id=${storedData.id}`,
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
          throw new Error("Failed to update About Business data. Please check your API endpoints.");
        }
        
        toast.success("About Business section updated successfully!", { id: loadingToast });
        
        setStoredData({
          ...storedData,
          ...payload,
          imageid: imageId ? { id: imageId, imageUrl: values.imageid ? URL.createObjectURL(values.imageid) : storedData?.imageid?.imageUrl } : storedData?.imageid,
        });
      } else {
        console.log("Creating new About Business data");
        response = await postdatas("about-business", payload);
        console.log("Create response:", response);
        toast.success("About Business section created successfully!", { id: loadingToast });
        
        if (response && response.id) {
          setStoredData(response);
          setHasData(true);
        } else {
          setStoredData(payload);
          setHasData(true);
        }
      }
      
      setPreview(null);
      
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
            About Our Business Section
          </h3>
          <p className="text-xs text-gray-400">
            Title, Description, and Image
          </p>
        </div>

        <div className="w-full">
          <Formik
            enableReinitialize
            initialValues={{
              title: storedData?.title || "",
              description: storedData?.description || "",
              imageid: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="flex flex-col gap-4 shadow-2xl shadow-blue-50 md:p-12 p-8 rounded-xl">
                
                <div>
                  <label className="text-md font-medium">Title *</label>
                  <Field
                    name="title"
                    className={`border ${
                      errors.title && touched.title ? "border-red-500" : "border-gray-400"
                    } text-gray-700 px-4 py-2 rounded-md w-full`}
                    placeholder="Enter title"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="text-md font-medium">Description *</label>
                  <JoditEditor
                    ref={editor}
                    value={values.description}
                    onBlur={(content) => {
                      // Ensure content is not truncated
                      if (content && content.length > 0) {
                        setFieldValue("description", content);
                      }
                    }}
                    config={{
                      height: 400,
                      placeholder: 'Write your description here...',
                      removeButtons: ['source', 'about'],
                      toolbarAdaptive: false,
                      maxHeight: 500,
                    }}
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Tip: Keep your description concise. Avoid copying from external sources with complex formatting.
                  </div>
                </div>

                <div>
                  <label className="text-md font-medium">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="border border-gray-400 px-4 py-2 rounded-md w-full mt-1"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Image size should be less than 5MB");
                          e.target.value = "";
                          return;
                        }
                        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
                        if (!validTypes.includes(file.type)) {
                          toast.error("Please upload a valid image (JPEG, PNG, WEBP)");
                          e.target.value = "";
                          return;
                        }
                        setFieldValue("imageid", file);
                        setPreview(URL.createObjectURL(file));
                        toast.success("Image selected successfully!");
                      }
                    }}
                  />

                  {preview && (
                    <div className="mt-2 relative group border-2 border-dashed rounded-lg p-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-32 object-contain mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setFieldValue("imageid", null);
                          toast.success("Image removed");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {!values.imageid && storedData?.imageid?.imageUrl && !preview && (
                    <div className="mt-2 border-2 border-dashed rounded-lg p-4">
                      <img
                        src={storedData.imageid.imageUrl}
                        alt="Current image"
                        className="w-48 h-32 object-contain mx-auto"
                      />
                      <p className="text-xs text-center text-gray-500 mt-2">Current Image</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || apiLoading}
                  className={`font-semibold bg-linear-to-r from-[#0B0C28] to-cyan-400 text-white py-2.5 px-4 w-fit rounded-xl transition-all ${
                    isSubmitting || apiLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                  }`}
                >
                  {isSubmitting || apiLoading ? "Processing..." : (hasData ? "Update Section" : "Create Section")}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AboutOurBusiness;