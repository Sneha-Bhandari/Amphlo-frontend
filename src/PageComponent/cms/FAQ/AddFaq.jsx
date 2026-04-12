"use client";

import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import toast, { Toaster } from 'react-hot-toast';
import { MdClose } from "react-icons/md";

const FaqSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question must not exceed 200 characters")
    .required("Question is required"),
  description: Yup.string()
    .min(10, "Answer must be at least 10 characters")
    .required("Answer is required"),
});

export default function AddFaq({ isOpen, onClose, onSuccess }) {
  const editor = useRef(null);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const loadingToast = toast.loading("Creating FAQ...");
    
    try {
      const payload = {
        title: values.title.trim(),
        description: values.description,
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}faq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Create failed');
      }
      
      const result = await response.json();
      toast.success("FAQ created successfully!", { id: loadingToast });
      
      resetForm();
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (error) {
      console.error("Error creating FAQ:", error);
      toast.error(error.message || "Failed to create FAQ", {
        id: loadingToast,
        duration: 4000,
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
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Add New FAQ</h2>
            <p className="text-gray-600 text-sm mt-1">Add a new frequently asked question</p>
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
            validationSchema={FaqSchema}
            validateOnMount={false}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, setTouched, isSubmitting, errors, touched, submitForm }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question *
                  </label>
                  <Field
                    as="textarea"
                    name="title"
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                      errors.title && touched.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter the frequently asked question"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer *
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
                      placeholder: 'Write your testimonial description here...',
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
                      setTouched({
                        title: true,
                        description: true,
                      });
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
                      "Create FAQ"
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