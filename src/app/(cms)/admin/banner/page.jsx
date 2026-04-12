"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";

function DynamicForm({ section, data, onSuccess }) {
  const { postdatas, patchdata, loading } = useApi();
  const [preview, setPreview] = useState(null);

  const formFields = [
    { label: "Title", name: "title", type: "text" },
    { label: "Subtitle", name: "subtitle", type: "text" },
    { label: "Image", name: "imageid", type: "file" },
  ];

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    subtitle: Yup.string().required("Subtitle is required"),
    imageid: Yup.mixed().nullable(),
  });

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
      data ? "Updating section..." : "Creating section..."
    );

    try {
      console.log("=== SUBMIT START ===");
      console.log("Section:", section);
      console.log("Has existing data:", !!data);

      let imageId = data?.imageid?.id || null;

      if (values.imageid && values.imageid instanceof File) {
        toast.loading("Uploading image...", { id: loadingToast });

        if (values.imageid.size > 5 * 1024 * 1024) {
          throw new Error("Image size should be less than 5MB");
        }

        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        if (!validTypes.includes(values.imageid.type)) {
          throw new Error("Please upload a valid image (JPEG, PNG, WEBP)");
        }

        imageId = await uploadImage(values.imageid);
        console.log("New image uploaded with ID:", imageId);
        toast.success("Image uploaded successfully!", { id: loadingToast });
      }

      const payload = {
        title: values.title,
        subTitle: values.subtitle,
        path: section.apiPath, // This is the key field for identification
      };

      if (imageId) {
        payload.imageid = imageId;
      }

      console.log("Final payload:", JSON.stringify(payload, null, 2));

      let response;
      if (data && data.id) {
        console.log(`Updating banner with ID: ${data.id}, path: ${section.apiPath}`);
        
        // Try updating with ID first
        try {
          response = await patchdata(`banner/${data.id}`, payload);
          console.log("Update response:", response);
        } catch (err) {
          console.log("Update with ID failed, trying with path:", err);
          response = await patchdata(`banner/path/${section.apiPath}`, payload);
        }
        
        toast.success(`${section.name} updated successfully!`, {
          id: loadingToast,
        });
      } else {
        console.log("Creating new banner for path:", section.apiPath);
        response = await postdatas("banner", payload);
        console.log("Create response:", response);
        toast.success(`${section.name} created successfully!`, {
          id: loadingToast,
        });
      }

      setPreview(null);
      onSuccess();
    } catch (err) {
      console.error("=== ERROR DETAILS ===");
      console.error("Error object:", err);
      console.error("Error message:", err.message);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);
      console.error("Error status:", err.response?.status);

      let errorMessage = err.message || "Something went wrong";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        errorMessage = JSON.stringify(err.response.data.errors);
      } else if (err.response?.status === 400) {
        errorMessage = "Bad request. Please check if all fields are correct.";
      } else if (err.response?.status === 404) {
        errorMessage = "API endpoint not found. Please check your backend configuration.";
      }

      toast.error(`Error: ${errorMessage}`, {
        id: loadingToast,
        duration: 5000,
      });
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
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting, values }) => (
        <Form className="p-4 space-y-4">
          {formFields.map((val) => (
            <div key={val.name}>
              <label className="block mb-1 font-medium text-gray-700">
                {val.label}
              </label>

              {val.type === "file" ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];

                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Image size should be less than 5MB");
                          e.target.value = "";
                          return;
                        }

                        const validTypes = [
                          "image/jpeg",
                          "image/png",
                          "image/jpg",
                          "image/webp",
                        ];
                        if (!validTypes.includes(file.type)) {
                          toast.error(
                            "Please upload a valid image (JPEG, PNG, WEBP)"
                          );
                          e.target.value = "";
                          return;
                        }

                        setFieldValue("imageid", file);
                        setPreview(URL.createObjectURL(file));
                        toast.success("Image selected successfully!");
                      } else {
                        setFieldValue("imageid", null);
                        setPreview(null);
                      }
                    }}
                  />

                  {preview && (
                    <div className="mt-2 relative group border border-dashed rounded-lg items-center justify-center mx-auto flex flex-col h-full w-full">
                      <img
                        src={preview}
                        alt="new preview"
                        className="my-5 w-68 h-38 object-contain shadow-md rounded-lg cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setFieldValue("imageid", null);
                          toast.success("Image removed");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white cursor-pointer rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  {!values.imageid && data?.imageid?.imageUrl && !preview && (
                    <div className="mt-7 relative group border-2 border-dashed hover:border-gray-900 cursor-pointer border-gray-400 rounded-lg items-center justify-center mx-auto flex flex-col">
                      <img
                        src={data.imageid.imageUrl}
                        alt="current"
                        className="my-5 w-68 h-38 object-contain"
                      />
                    </div>
                  )}
                </>
              ) : (
                <Field
                  name={val.name}
                  type={val.type}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
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
            disabled={loading || isSubmitting}
            className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
              loading || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-[#FDC653] to-yellow-500 hover:from-yellow-600 hover:to-yellow-700 text-white"
            }`}
          >
            {loading || isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : data ? (
              "Update"
            ) : (
              "Submit"
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default function Page() {
  const { getdata } = useApi();
  const [activeSection, setActiveSection] = useState(null);
  const [sectionData, setSectionData] = useState(null);
  const [allBanners, setAllBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bannersection = [
    { name: "About Us", displayPath: "aboutus", apiPath: "aboutus" },
    {
      name: "Partner With Us",
      displayPath: "partnerwithus",
      apiPath: "partnerwithus",
    },
    {
      name: "Book an Appointment",
      displayPath: "bookappointment",
      apiPath: "bookAnAppointment", // Make sure this matches exactly what's in the database
    },
  ];

  const fetchAllBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching all banners from: banner");
      const res = await getdata("banner");
      console.log("Fetched all banners:", JSON.stringify(res, null, 2));

      if (res && Array.isArray(res)) {
        setAllBanners(res);
        
        // Log all paths found in the database
        console.log("Available paths in database:");
        res.forEach(banner => {
          console.log(`- Path: "${banner.path}" for banner: ${banner.title}`);
        });
      } else {
        setAllBanners([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch data"
      );
      toast.error("Failed to fetch banners");
      setAllBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const getSectionData = (apiPath) => {
    if (!allBanners.length) return null;
    
    // Try exact match first
    let found = allBanners.find((banner) => banner.path === apiPath);
    
    // If not found, try case-insensitive match
    if (!found) {
      found = allBanners.find((banner) => 
        banner.path?.toLowerCase() === apiPath.toLowerCase()
      );
      if (found) {
        console.log(`Found case-insensitive match: "${found.path}" for "${apiPath}"`);
      }
    }
    
    console.log(`Looking for path: "${apiPath}", Found:`, found ? found.title : "NOT FOUND");
    return found || null;
  };

  const handleButtonClick = (section) => {
    console.log("Button clicked:", section);
    setActiveSection(section);
    const foundData = getSectionData(section.apiPath);
    console.log(`Setting section data for ${section.name}:`, foundData);
    setSectionData(foundData);
  };

  const refreshData = async () => {
    await fetchAllBanners();
    if (activeSection) {
      const updatedSectionData = getSectionData(activeSection.apiPath);
      setSectionData(updatedSectionData);
    }
  };

  useEffect(() => {
    fetchAllBanners();
  }, []);

  // Auto-select the first section if none is active and data is loaded
  useEffect(() => {
    if (!activeSection && bannersection.length > 0 && !loading) {
      handleButtonClick(bannersection[0]);
    }
  }, [allBanners, loading]);

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
      
      <div className="p-6">
        <div className="gap-4 justify-start flex bg-gray-300 rounded-full w-fit h-fit mb-5">
          {bannersection.map((val, i) => {
            const isActive = activeSection?.displayPath === val.displayPath;
            const hasData = getSectionData(val.apiPath) !== null;

            return (
              <button
                key={i}
                onClick={() => handleButtonClick(val)}
                className={`text-sm font-light py-2.5 px-2 rounded-2xl transition-colors relative cursor-pointer ${
                  isActive
                    ? "bg-yellow-500 text-white"
                    : "text-black hover:bg-[#04413D]/10"
                }`}
              >
                {val.name}
                {hasData && !isActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {activeSection ? (
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-6 justify-between items-center mb-6">
              <div className="flex flex-col gap-3">
                <div className="text-2xl text-[#04413D] font-bold">
                  {activeSection.name} Section
                </div>
                <p className="text-sm text-gray-500">
                  Title, Subtitle and Image
                </p>
              </div>
            </div>

            {loading ? (
              <div className="border border-gray-300 rounded-2xl p-8 text-center">
                <div className="text-gray-500"><Loading /></div>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-2xl overflow-hidden">
                <DynamicForm
                  section={activeSection}
                  data={sectionData}
                  onSuccess={refreshData}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12">
            Click on any button above to manage content
          </div>
        )}
      </div>
    </>
  );
}