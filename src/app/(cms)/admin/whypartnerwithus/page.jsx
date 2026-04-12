"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import { fetchData } from "@/lib/frontendApi";
import { useApi } from "@/hooks/useApi";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";
import { MdCloudUpload, MdClose, MdAdd, MdDelete } from "react-icons/md";

const PartnerSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Title is required"),
  subTitle: Yup.string()
    .min(2, "Subtitle must be at least 2 characters")
    .max(100, "Subtitle must not exceed 100 characters")
    .required("Subtitle is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  benefits: Yup.array()
    .of(Yup.string().min(1, "Benefit cannot be empty").required("Benefit is required"))
    .min(1, "At least one benefit is required"),
  satisfactionTitle: Yup.string()
    .min(2, "Satisfaction title must be at least 2 characters")
    .max(50, "Satisfaction title must not exceed 50 characters")
    .required("Satisfaction title is required"),
  satisfactionPercent: Yup.string()
    .matches(/^\d+%$/, "Must be a percentage (e.g., 98%)")
    .required("Satisfaction percentage is required"),
});

const WhyPartnerCMS = () => {
  const { patchdata, postdatas, loading: apiLoading } = useApi();
  const [loading, setLoading] = useState(true);
  const [storedData, setStoredData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const response = await fetchData("why-partner-with-us");
        console.log("Partner API Response:", response);
        
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
    fetchPartnerData();
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
      hasData ? "Updating partner section..." : "Creating partner section..."
    );

    try {
      let imageId = storedData?.imageid?.id || null;

      if (values.imageFile && values.imageFile instanceof File) {
        toast.loading("Uploading image...", { id: loadingToast });

        if (values.imageFile.size > 5 * 1024 * 1024) {
          throw new Error("Image size should be less than 5MB");
        }

        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!validTypes.includes(values.imageFile.type)) {
          throw new Error("Please upload a valid image (JPEG, PNG, WEBP)");
        }

        imageId = await uploadImage(values.imageFile);
        console.log("New image uploaded with ID:", imageId);
      }

      const payload = {
        title: values.title.trim(),
        subTitle: values.subTitle.trim(),
        description: values.description,
        benefits: values.benefits.filter(b => b && b.trim() !== ""),
        satisfactionTitle: values.satisfactionTitle.trim(),
        satisfactionPercent: values.satisfactionPercent,
      };

      if (imageId) {
        payload.imageid = imageId;
      }

      console.log("Final payload:", JSON.stringify(payload, null, 2));

      let response;
      
      if (hasData && storedData?.id) {
        console.log(`Updating Partner Section with ID: ${storedData.id}`);
        
        let updateSuccess = false;
        const endpointsToTry = [
          `why-partner-with-us/${storedData.id}`,
          `why-partner-with-us/update/${storedData.id}`,
          `why-partner-with-us?id=${storedData.id}`,
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
          throw new Error("Failed to update Partner data. Please check your API endpoints.");
        }
        
        toast.success("Partner section updated successfully!", { id: loadingToast });
        
        setStoredData({
          ...storedData,
          ...payload,
          imageid: imageId ? { id: imageId, imageUrl: values.imageFile ? URL.createObjectURL(values.imageFile) : storedData?.imageid?.imageUrl } : storedData?.imageid,
        });
      } else {
        console.log("Creating new Partner data");
        response = await postdatas("why-partner-with-us", payload);
        console.log("Create response:", response);
        toast.success("Partner section created successfully!", { id: loadingToast });
        
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
            Why Partner With Us Section
          </h3>
          <p className="text-xs text-gray-400">
            Title, Subtitle, Description, Benefits, Satisfaction Metrics, and Image
          </p>
        </div>

        <div className="w-full">
          <Formik
            enableReinitialize
            initialValues={{
              title: storedData?.title || "",
              subTitle: storedData?.subTitle || "",
              description: storedData?.description || "",
              benefits: storedData?.benefits || [""],
              satisfactionTitle: storedData?.satisfactionTitle || "",
              satisfactionPercent: storedData?.satisfactionPercent || "",
              imageFile: null,
            }}
            validationSchema={PartnerSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched, setTouched }) => (
              <Form className="flex flex-col gap-4 shadow-2xl shadow-blue-50 md:p-12 p-8 rounded-xl">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-md font-medium">Title *</label>
                    <Field
                      name="title"
                      className={`border ${
                        errors.title && touched.title ? "border-red-500" : "border-gray-400"
                      } text-gray-700 px-4 py-2 rounded-md w-full`}
                      placeholder="Enter title"
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label className="text-md font-medium">Subtitle *</label>
                    <Field
                      name="subTitle"
                      className={`border ${
                        errors.subTitle && touched.subTitle ? "border-red-500" : "border-gray-400"
                      } text-gray-700 px-4 py-2 rounded-md w-full`}
                      placeholder="Enter subtitle"
                    />
                    <ErrorMessage name="subTitle" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-md font-medium">Description *</label>
                  <JoditEditor
                    value={values.description}
                    onBlur={(content) => {
                      setFieldValue("description", content);
                      if (content && touched.description === undefined) {
                        setTouched({ description: true });
                      }
                    }}
                    config={{
                      height: 300,
                      placeholder: 'Write your description here...',
                    }}
                  />
                  {touched.description && errors.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                <div>
                  <label className="text-md font-medium">Benefits *</label>
                  <FieldArray name="benefits">
                    {({ push, remove, form }) => (
                      <div className="space-y-3 mt-2">
                        {form.values.benefits.map((_, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <Field
                                name={`benefits.${index}`}
                                className="w-full px-4 py-2 border border-gray-400 rounded-md"
                                placeholder={`Benefit ${index + 1}`}
                              />
                              {errors.benefits?.[index] && touched.benefits?.[index] && (
                                <div className="text-red-500 text-sm mt-1">{errors.benefits[index]}</div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="flex items-center gap-2 text-[#04413D] hover:text-[#04413D]/80"
                        >
                          <MdAdd size={20} /> Add Benefit
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage name="benefits" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-md font-medium">Satisfaction Title *</label>
                    <Field
                      name="satisfactionTitle"
                      className={`border ${
                        errors.satisfactionTitle && touched.satisfactionTitle ? "border-red-500" : "border-gray-400"
                      } text-gray-700 px-4 py-2 rounded-md w-full`}
                      placeholder="e.g., Partner Satisfaction"
                    />
                    <ErrorMessage name="satisfactionTitle" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label className="text-md font-medium">Satisfaction Percentage *</label>
                    <Field
                      name="satisfactionPercent"
                      className={`border ${
                        errors.satisfactionPercent && touched.satisfactionPercent ? "border-red-500" : "border-gray-400"
                      } text-gray-700 px-4 py-2 rounded-md w-full`}
                      placeholder="e.g., 98%"
                    />
                    <ErrorMessage name="satisfactionPercent" component="div" className="text-red-500 text-sm" />
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
                        setFieldValue("imageFile", file);
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
                          setFieldValue("imageFile", null);
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

                  {!values.imageFile && storedData?.imageid?.imageUrl && !preview && (
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

export default WhyPartnerCMS;