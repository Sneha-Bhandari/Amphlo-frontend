"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import { fetchData } from "@/lib/frontendApi";
import { useApi } from "@/hooks/useApi";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";

const sections = [
  { id: "our-core-strength", label: "Our Core Strength", apiPath: "core-strengths", frontendComponent: "OurCoreStrength" },
  { id: "services-offerings", label: "Services & Offerings", apiPath: "service-offerings", frontendComponent: "ServicesOfferings" },
  { id: "testimonials", label: "Testimonials", apiPath: "testimonials", frontendComponent: "Testimonials" },
  { id: "partners", label: "Partners", apiPath: "partners", frontendComponent: "Partners" },
  { id: "faq", label: "FAQ", apiPath: "faq", frontendComponent: "FAQ" },
  { id: "our-features", label: "Our Features", apiPath: "our-features", frontendComponent: "OurFeatures" },
  { id: "our-teams", label: "Our Teams", apiPath: "our-team", frontendComponent: "OurTeams" },
  { id: "countries", label: "Connected Countries", apiPath: "countries", frontendComponent: "ConnectedCountries" },
  { id: "become-partner", label: "Become a Partner", apiPath: "become-a-partner", frontendComponent: "BecomePartner" },
];

const TopSectionsSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
});

const TopSectionsCMS = () => {
  const { patchdata, postdatas, getdata, loading: apiLoading } = useApi();
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [storedData, setStoredData] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [allSectionsData, setAllSectionsData] = useState({});

  useEffect(() => {
    fetchAllSections();
  }, []);

  const fetchAllSections = async () => {
    try {
      setLoading(true);
      const data = {};
      
      for (const section of sections) {
        try {
          const response = await fetchData(`top-section/${section.apiPath}`);
          console.log(`Fetched ${section.label}:`, response);
          
          if (response && response.length > 0) {
            data[section.apiPath] = response[0];
          } else if (response && !Array.isArray(response)) {
            data[section.apiPath] = response;
          }
        } catch (error) {
          console.error(`Error fetching ${section.label}:`, error);
          data[section.apiPath] = null;
        }
      }
      
      setAllSectionsData(data);
      
      if (selectedSection && data[selectedSection.apiPath]) {
        setStoredData(data[selectedSection.apiPath]);
        setHasData(true);
      } else {
        setStoredData(null);
        setHasData(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Failed to fetch sections data");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (sectionId) => {
    const newSection = sections.find(s => s.id === sectionId);
    setSelectedSection(newSection);
    
    const sectionData = allSectionsData[newSection.apiPath];
    if (sectionData) {
      setStoredData(sectionData);
      setHasData(true);
    } else {
      setStoredData(null);
      setHasData(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const loadingToast = toast.loading(
      hasData ? `Updating ${selectedSection.label}...` : `Creating ${selectedSection.label}...`
    );

    try {
      const payload = {
        title: values.title.trim(),
        description: values.description,
        sectionKey: selectedSection.apiPath,
      };

      console.log("Final payload:", JSON.stringify(payload, null, 2));

      let response;
      
      if (hasData && storedData?.id) {
        console.log(`Updating ${selectedSection.apiPath} with ID: ${storedData.id}`);
        
        let updateSuccess = false;
        const endpointsToTry = [
          `top-section/${storedData.id}`,
          `top-section/update/${storedData.id}`,
          `top-section/${selectedSection.apiPath}`,
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
          throw new Error(`Failed to update ${selectedSection.label}`);
        }
        
        toast.success(`${selectedSection.label} updated successfully!`, { id: loadingToast });
        
        setStoredData({
          ...storedData,
          ...payload,
        });
        
        // Update allSectionsData
        setAllSectionsData(prev => ({
          ...prev,
          [selectedSection.apiPath]: { ...storedData, ...payload }
        }));
      } else {
        console.log(`Creating new ${selectedSection.apiPath}`);
        response = await postdatas("top-section", payload);
        console.log("Create response:", response);
        toast.success(`${selectedSection.label} created successfully!`, { id: loadingToast });
        
        if (response && response.id) {
          setStoredData(response);
          setHasData(true);
          setAllSectionsData(prev => ({
            ...prev,
            [selectedSection.apiPath]: response
          }));
        } else {
          setStoredData(payload);
          setHasData(true);
        }
      }
      
    } catch (err) {
      console.error("Error:", err);
      let errorMessage = err.message || "Something went wrong";
      
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
            Page Top Sections Manager
          </h3>
          <p className="text-xs text-gray-400">
            Manage title and description for each page's top section
          </p>
        </div>

        <div className="w-full">
          {/* Dropdown to select section */}
          <div className="mb-6">
            <label className="block text-md font-medium text-gray-700 mb-2">
              Select Page Section *
            </label>
            <select
              value={selectedSection.id}
              onChange={(e) => handleSectionChange(e.target.value)}
              className="w-full md:w-1/2 border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label} {allSectionsData[section.apiPath] ? "✓" : ""}
                </option>
              ))}
            </select>
            {allSectionsData[selectedSection.apiPath] && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Existing content loaded - Update to modify
              </p>
            )}
          </div>

          <div className="border rounded-xl p-6 bg-gray-50">
            <div className="mb-4 pb-2 border-b">
              <h4 className="text-lg font-semibold text-[#04413D]">
                Editing: {selectedSection.label}
              </h4>
              <p className="text-xs text-gray-500">
                Frontend Component: {selectedSection.frontendComponent}
              </p>
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                title: storedData?.title || "",
                description: storedData?.description || "",
              }}
              validationSchema={TopSectionsSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, isSubmitting, errors, touched, setTouched }) => (
                <Form className="flex flex-col gap-4">
                  <div>
                    <label className="text-md font-medium">Page Title *</label>
                    <Field
                      name="title"
                      className={`border ${
                        errors.title && touched.title ? "border-red-500" : "border-gray-400"
                      } text-gray-700 px-4 py-2 rounded-md w-full`}
                      placeholder={`Enter title for ${selectedSection.label}`}
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label className="text-md font-medium">Page Description *</label>
                    <JoditEditor
                      value={values.description}
                      onBlur={(content) => {
                        setFieldValue("description", content);
                        if (content && touched.description === undefined) {
                          setTouched({ description: true });
                        }
                      }}
                      config={{
                        height: 250,
                        placeholder: `Enter description for ${selectedSection.label}...`,
                      }}
                    />
                    {touched.description && errors.description && (
                      <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4 border-t mt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || apiLoading}
                      className={`font-semibold bg-linear-to-r from-[#0B0C28] to-cyan-400 text-white py-2.5 px-6 rounded-lg transition-all ${
                        isSubmitting || apiLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                      }`}
                    >
                      {isSubmitting || apiLoading ? "Processing..." : (hasData ? "Update Section" : "Create Section")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFieldValue("title", storedData?.title || "");
                        setFieldValue("description", storedData?.description || "");
                        toast.success("Form reset");
                      }}
                      className="font-semibold bg-gray-200 text-gray-700 py-2.5 px-6 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Reset
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* Preview Section */}
          <div className="mt-8 border rounded-xl p-6 bg-white shadow-sm">
            <h4 className="text-md font-semibold text-gray-700 mb-4">Live Preview</h4>
            <div className="border-t pt-4">
              <h1 className="text-4xl font-bold text-[#04413D] mb-3">
                {storedData?.title || "Title will appear here"}
              </h1>
              <div className="text-gray-600">
                {storedData?.description ? (
                  <div dangerouslySetInnerHTML={{ __html: storedData.description }} />
                ) : (
                  <p className="text-gray-400 italic">Description will appear here</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopSectionsCMS;