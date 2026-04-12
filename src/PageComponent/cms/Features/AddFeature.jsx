"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from 'react-hot-toast';
import { MdClose, MdAdd, MdDelete } from "react-icons/md";

const FeatureSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Title is required"),
  points: Yup.array()
    .of(Yup.string().min(1, "Point cannot be empty").required("Point is required"))
    .min(1, "At least one point is required"),
});

export default function AddFeature({ isOpen, onClose, onSuccess }) {
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const loadingToast = toast.loading("Creating feature...");
    
    try {
      const payload = {
        title: values.title.trim(),
        points: values.points.filter(p => p && p.trim() !== ""),
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}our-features`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Create failed');
      }
      
      const result = await response.json();
      toast.success("Feature created successfully!", { id: loadingToast });
      
      resetForm();
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (error) {
      console.error("Error creating feature:", error);
      toast.error(error.message || "Failed to create feature", {
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
            <h2 className="text-2xl font-bold text-[#04413D]">Add New Feature</h2>
            <p className="text-gray-600 text-sm mt-1">Add a new feature with title and points</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            initialValues={{
              title: "",
              points: [""],
            }}
            validationSchema={FeatureSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, errors, touched, submitForm, setTouched }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feature Title *
                  </label>
                  <Field
                    name="title"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                      errors.title && touched.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter feature title"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points *
                  </label>
                  <FieldArray name="points">
                    {({ push, remove, form }) => (
                      <div className="space-y-3">
                        {form.values.points.map((_, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <Field
                                name={`points.${index}`}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                placeholder={`Point ${index + 1}`}
                              />
                              {errors.points?.[index] && touched.points?.[index] && (
                                <div className="text-red-500 text-sm mt-1">{errors.points[index]}</div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                              disabled={form.values.points.length === 1}
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="flex items-center gap-2 text-[#04413D] hover:text-[#04413D]/80 transition-colors"
                        >
                          <MdAdd size={20} /> Add Point
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage name="points" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setTouched({
                        title: true,
                        points: [true],
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
                      "Create Feature"
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