"use client";

import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import toast, { Toaster } from 'react-hot-toast';
import { MdClose } from "react-icons/md";
import { postData } from "@/lib/frontendApi";

const ServiceSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(5, "Description must be at least 5 characters")
    .required("Description is required"),
});

export default function AddService({ isOpen, onClose, onSuccess }) {
  const editor = useRef(null);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const loadingToast = toast.loading("Creating service...");
    
    try {
      const cleanTitle = values.title.trim().replace(/\s+/g, ' ');
      
      // Clean the description - remove empty paragraphs
      let cleanDescription = values.description;
      if (cleanDescription === "<p><br></p>") {
        cleanDescription = "";
      }
      
      const payload = {
        title: cleanTitle,
        description: cleanDescription,
      };
      
      console.log("Sending payload:", JSON.stringify(payload, null, 2));
      
      await postData("our-services", payload);
      
      toast.success("Service created successfully!", { id: loadingToast });
      
      resetForm();
      
      if (onSuccess) {
        await onSuccess();
      }
      
      onClose();
      
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(error.message || "Failed to create service", {
        id: loadingToast,
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Add New Service</h2>
            <p className="text-gray-600 text-sm mt-1">Add a new service with title and description</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            initialValues={{
              title: "",
              description: "",
            }}
            validationSchema={ServiceSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched, submitForm, setTouched }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title *
                  </label>
                  <Field
                    name="title"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                      errors.title && touched.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter service title"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <JoditEditor
                    ref={editor}
                    value={values.description}
                    onBlur={(content) => {
                      setFieldValue("description", content);
                      if (content && touched.description === undefined) {
                        setTouched({ description: true });
                      }
                    }}
                    config={{
                      height: 300,
                      placeholder: 'Enter service description...',
                      removeButtons: ['source', 'about'],
                      toolbarAdaptive: false,
                    }}
                  />
                  {touched.description && errors.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      if (!values.title.trim()) {
                        toast.error("Please enter a title");
                        setTouched({ title: true });
                        return;
                      }
                      
                      if (!values.description || values.description === "<p><br></p>") {
                        toast.error("Please enter a description");
                        setTouched({ description: true });
                        return;
                      }
                      
                      submitForm();
                    }}
                    disabled={isSubmitting}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-[#FDC653] to-yellow-500 hover:from-yellow-600 hover:to-yellow-700 text-white"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      "Create Service"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}