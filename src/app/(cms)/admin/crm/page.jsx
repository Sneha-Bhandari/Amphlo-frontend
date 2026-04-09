"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import { fetchData } from "@/lib/frontendApi";
import { useApi } from "@/hooks/useApi";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";

const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  subTitle: Yup.string().required("Subtitle is required"),
  description: Yup.string().required("Description is required"),
  features: Yup.array()
    .of(Yup.string().required("Feature is required"))
    .min(1, "At least one feature is required"),
});

const CrmCms = () => {
  const { patchdata, postdatas, loading: apiLoading } = useApi();
  const [storedData, setStoredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState({
    sideImage: null,
    backgroundImage: null,
  });
  const hasData = Boolean(storedData);

  useEffect(() => {
    const getCrmData = async () => {
      try {
        const data = await fetchData("crm");
        console.log("CRM API Response:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setStoredData(data[0]);
        } else if (data && !Array.isArray(data)) {
          setStoredData(data);
        }
      } catch (error) {
        console.error("Error fetching CRM data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCrmData();
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
      let sideImageId = storedData?.imageid?.id || null;
      let backgroundImageId = storedData?.backgroundImageId?.id || null;

      if (values.sideImage && values.sideImage instanceof File) {
        toast.loading("Uploading side image...", { id: loadingToast });

        if (values.sideImage.size > 5 * 1024 * 1024) {
          throw new Error("Image size should be less than 5MB");
        }

        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!validTypes.includes(values.sideImage.type)) {
          throw new Error("Please upload a valid image (JPEG, PNG, WEBP)");
        }

        sideImageId = await uploadImage(values.sideImage);
        console.log("New side image uploaded with ID:", sideImageId);
      }

      if (values.backgroundImage && values.backgroundImage instanceof File) {
        toast.loading("Uploading background image...", { id: loadingToast });

        if (values.backgroundImage.size > 5 * 1024 * 1024) {
          throw new Error("Background image size should be less than 5MB");
        }

        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!validTypes.includes(values.backgroundImage.type)) {
          throw new Error("Please upload a valid image (JPEG, PNG, WEBP)");
        }

        backgroundImageId = await uploadImage(values.backgroundImage);
        console.log("New background image uploaded with ID:", backgroundImageId);
      }

      const payload = {
        title: values.title,
        subTitle: values.subTitle,
        description: values.description,
        features: values.features.filter(f => f.trim() !== ""),
      };

      if (sideImageId) {
        payload.imageid = sideImageId;
      }

      if (backgroundImageId) {
        payload.backgroundImageId = backgroundImageId;
      }

      console.log("Final payload:", JSON.stringify(payload, null, 2));

      let response;
      
      if (hasData && storedData?.id) {
        console.log(`Updating CRM with ID: ${storedData.id}`);
        
        let updateSuccess = false;
        const endpointsToTry = [
          `crm/${storedData.id}`,
          `crm/update/${storedData.id}`,
          `crm?id=${storedData.id}`,
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
          throw new Error("Failed to update CRM data. Please check your API endpoints.");
        }
        
        toast.success("CRM section updated successfully!", { id: loadingToast });
        
        setStoredData({
          ...storedData,
          ...payload,
          imageid: sideImageId ? { id: sideImageId, imageUrl: values.sideImage ? URL.createObjectURL(values.sideImage) : storedData?.imageid?.imageUrl } : storedData?.imageid,
          backgroundImageId: backgroundImageId ? { id: backgroundImageId, imageUrl: values.backgroundImage ? URL.createObjectURL(values.backgroundImage) : storedData?.backgroundImageId?.imageUrl } : storedData?.backgroundImageId,
        });
      } else {
        console.log("Creating new CRM data");
        response = await postdatas("crm", payload);
        console.log("Create response:", response);
        toast.success("CRM section created successfully!", { id: loadingToast });
        
        if (response && response.id) {
          setStoredData(response);
        } else {
          setStoredData(payload);
        }
      }
      
      setPreview({ sideImage: null, backgroundImage: null });
      
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
      
      <div className="bg-white md:my-12 flex-col flex w-full mx-auto">
        <div className="w-full mt-4 flex flex-col justify-center items-center mx-auto">
          <h3 className="text-4xl font-semibold mb-1 text-[#0B0C28] underline-offset-2">
            CRM Section
          </h3>
          <p className="text-xs text-gray-400">
            Title, Subtitle, Description, Features, and Images
          </p>
        </div>

        <div className="w-full">
          <Formik
            enableReinitialize
            initialValues={{
              title: storedData?.title || "",
              subTitle: storedData?.subTitle || "",
              description: storedData?.description || "",
              features: storedData?.features || ["", "", ""],
              sideImage: null,
              backgroundImage: null,
            }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="flex flex-col gap-4 shadow-2xl shadow-blue-100 md:p-12 p-8 rounded-xl">
                
                <div>
                  <label className="text-md font-medium">Title *</label>
                  <Field
                    name="title"
                    className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md w-full"
                    placeholder="Enter title"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="text-md font-medium">Subtitle *</label>
                  <Field
                    name="subTitle"
                    className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md w-full"
                    placeholder="Enter subtitle"
                  />
                  <ErrorMessage
                    name="subTitle"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="text-md font-medium">Description *</label>
                  <JoditEditor
                    value={values.description}
                    onBlur={(content) => setFieldValue("description", content)}
                    onChange={() => {}}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-md font-medium">Features *</label>
                  <FieldArray name="features">
                    {({ push, remove, form }) => (
                      <div className="space-y-3 mt-2">
                        {form.values.features.map((_, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <Field
                                name={`features.${index}`}
                                className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md w-full"
                                placeholder={`Feature ${index + 1}`}
                              />
                              <ErrorMessage
                                name={`features.${index}`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                        >
                          + Add Feature
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage
                    name="features"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-md font-medium">Side Image</label>
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
                        setFieldValue("sideImage", file);
                        setPreview(prev => ({ ...prev, sideImage: URL.createObjectURL(file) }));
                        toast.success("Side image selected successfully!");
                      }
                    }}
                  />

                  {preview.sideImage && (
                    <div className="mt-2 relative group border-2 border-dashed rounded-lg p-4">
                      <img
                        src={preview.sideImage}
                        alt="Side preview"
                        className="w-48 h-32 object-contain mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(prev => ({ ...prev, sideImage: null }));
                          setFieldValue("sideImage", null);
                          toast.success("Side image removed");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {!values.sideImage && storedData?.imageid?.imageUrl && !preview.sideImage && (
                    <div className="mt-2 border-2 border-dashed rounded-lg p-4">
                      <img
                        src={storedData.imageid.imageUrl}
                        alt="Current side image"
                        className="w-48 h-32 object-contain mx-auto"
                      />
                      <p className="text-xs text-center text-gray-500 mt-2">Current Side Image</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-md font-medium">Background Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="border border-gray-400 px-4 py-2 rounded-md w-full mt-1"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Background image size should be less than 5MB");
                          e.target.value = "";
                          return;
                        }
                        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
                        if (!validTypes.includes(file.type)) {
                          toast.error("Please upload a valid image (JPEG, PNG, WEBP)");
                          e.target.value = "";
                          return;
                        }
                        setFieldValue("backgroundImage", file);
                        setPreview(prev => ({ ...prev, backgroundImage: URL.createObjectURL(file) }));
                        toast.success("Background image selected successfully!");
                      }
                    }}
                  />

                  {/* New Background Image Preview */}
                  {preview.backgroundImage && (
                    <div className="mt-2 relative group border-2 border-dashed rounded-lg p-4">
                      <img
                        src={preview.backgroundImage}
                        alt="Background preview"
                        className="w-48 h-32 object-cover mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(prev => ({ ...prev, backgroundImage: null }));
                          setFieldValue("backgroundImage", null);
                          toast.success("Background image removed");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Current Background Image */}
                  {!values.backgroundImage && storedData?.backgroundImageId?.imageUrl && !preview.backgroundImage && (
                    <div className="mt-2 border-2 border-dashed rounded-lg p-4">
                      <img
                        src={storedData.backgroundImageId.imageUrl}
                        alt="Current background image"
                        className="w-48 h-32 object-cover mx-auto"
                      />
                      <p className="text-xs text-center text-gray-500 mt-2">Current Background Image</p>
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

export default CrmCms;