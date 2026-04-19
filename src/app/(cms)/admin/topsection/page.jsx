"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import { fetchData } from "@/lib/frontendApi";
// import { useApi } from "@/hooks/useApi";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";

const sections = [
  { id: "our-core-strength", label: "Our Core Strength", apiPath: "CoreStrength" },
  { id: "services-offerings", label: "Services & Offerings", apiPath: "service-offerings" },
  { id: "testimonials", label: "Testimonials", apiPath: "testimonials" },
  { id: "partners", label: "Partners", apiPath: "partners" },
  { id: "faq", label: "FAQ", apiPath: "faq" },
  { id: "our-features", label: "Our Features", apiPath: "our-features" },
  { id: "our-teams", label: "Our Teams", apiPath: "our-team" },
  { id: "countries", label: "Connected Countries", apiPath: "countries" },
  { id: "become-partner", label: "Become a Partner", apiPath: "become-a-partner" },
];

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(100).required("Title is required"),
  description: Yup.string().min(10).required("Description is required"),
});

const TopSectionsCMS = () => {
  const { patchdata, postdatas, loading: apiLoading } = useApi();

  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [allSectionsData, setAllSectionsData] = useState({});
  const [storedData, setStoredData] = useState(null);

  useEffect(() => {
    fetchAllSections();
  }, []);

  const fetchAllSections = async () => {
    try {
      setLoading(true);

      const response = await fetchData("top-section");
      console.log("ALL TOP SECTIONS:", response);

      const mapped = {};

      if (Array.isArray(response)) {
        sections.forEach((section) => {
          mapped[section.apiPath] =
            response.find((item) => item.path === section.apiPath) || null;
        });
      }

      setAllSectionsData(mapped);

      const current = mapped[selectedSection.apiPath];
      setStoredData(current || null);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (id) => {
    const section = sections.find((s) => s.id === id);
    setSelectedSection(section);

    const data = allSectionsData[section.apiPath];
    setStoredData(data || null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const toastId = toast.loading("Saving...");

    try {
      const payload = {
        path: selectedSection.apiPath, 
        title: values.title.trim(),
        description: values.description,
      };

      if (storedData?.id) {
        await patchdata(`top-section/${selectedSection.apiPath}`, payload);
        toast.success("Updated successfully", { id: toastId });
      } else {
        await postdatas("top-section", payload);
        toast.success("Created successfully", { id: toastId });
      }

      await fetchAllSections(); 

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Toaster position="top-right" />

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Top Sections CMS</h2>

        <select
          value={selectedSection.id}
          onChange={(e) => handleSectionChange(e.target.value)}
          className="border p-2 rounded mb-6"
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <Formik
          enableReinitialize
          initialValues={{
            title: storedData?.title || "",
            description: storedData?.description || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">

              <div>
                <label>Title</label>
                <Field name="title" className="border w-full p-2 rounded" />
                <ErrorMessage name="title" component="div" className="text-red-500" />
              </div>

              <div>
                <label>Description</label>
                <JoditEditor
                  value={values.description}
                  onBlur={(content) => setFieldValue("description", content)}
                />
                <ErrorMessage name="description" component="div" className="text-red-500" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || apiLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                {storedData ? "Update" : "Create"}
              </button>

            </Form>
          )}
        </Formik>

        <div className="mt-10 border-t pt-6">
          <h3 className="text-2xl font-bold">
            {storedData?.title || "No Title"}
          </h3>

          <div
            dangerouslySetInnerHTML={{
              __html: storedData?.description || "",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TopSectionsCMS;