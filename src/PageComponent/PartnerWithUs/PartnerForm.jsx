"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { postData } from "@/lib/frontendApi";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaWhatsapp, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaGlobe,
  FaCheckCircle,
  FaArrowRight,
  FaPaperPlane,
  FaSpinner
} from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";

export default function PartnerForm() {
  const [isFocused, setIsFocused] = useState({});

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    companyName: "",
    officialEmail: "",
    companyAddress: "",
    country: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().min(2, "Too short").required("First name is required"),
    lastName: Yup.string().min(2, "Too short").required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number")
      .min(8, "Must be at least 8 digits")
      .max(20, "Phone number is too long")
      .required("Phone number is required"),
    whatsappNumber: Yup.string()
      .matches(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number")
      .min(8, "Must be at least 8 digits")
      .max(20, "Phone number is too long")
      .nullable(),
    companyName: Yup.string().min(2, "Too short").required("Company name is required"),
    officialEmail: Yup.string().email("Invalid email").required("Official email is required"),
    companyAddress: Yup.string().min(5, "Too short").required("Company address is required"),
    country: Yup.string().required("Country is required"),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const toastId = toast.loading("Submitting partnership request...");
    
    try {
      const payload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        whatsappNumber: values.whatsappNumber?.trim() || "",
        companyName: values.companyName.trim(),
        officialEmail: values.officialEmail.trim(),
        companyAddress: values.companyAddress.trim(),
        country: values.country.trim(),
      };
      
      console.log("Sending to /partner-with-us:", payload);
      await postData("partner-with-us", payload);
      
      toast.success("Partnership request submitted successfully! We'll contact you soon.", { id: toastId });
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to submit. Please try again.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFocus = (fieldName) => {
    setIsFocused(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setIsFocused(prev => ({ ...prev, [fieldName]: false }));
  };

  return (
    <div className="w-full bg-white py-16 overflow-hidden">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          borderRadius: '12px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }} />
      
      <div className="w-11/12 mx-auto navtext">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#04413D] mb-4">
            Join Our Global Network
          </h1>
          <p className="text-lg text-[#04413D]/80 max-w-2xl mx-auto">
            Partner with us to create transformative educational opportunities worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-[#04413D]/20 rounded-3xl shadow-xl p-6 md:p-8 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Fill in your details
              </h2>
              <p className="text-gray-500 text-sm">
                Complete the form below and our partnership team will reach out within 24 hours.
              </p>
              <div className="h-1 w-32 bg-linear-to-r from-[#04413D] to-teal-500 rounded-full mt-4"></div>
            </div>
            
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        First Name <span className="text-[#04413D] text-lg">*</span>
                      </label>
                      <div className={`relative transition-all duration-200 ${isFocused.firstName ? 'transform scale-[1.01]' : ''}`}>
                        <Field
                          type="text"
                          name="firstName"
                          placeholder="John"
                          onFocus={() => handleFocus('firstName')}
                          onBlur={() => handleBlur('firstName')}
                          className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:border-[#04413D] focus:ring-1 focus:ring-[#04413D] transition-all duration-200 bg-white"
                        />
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        Last Name <span className="text-[#04413D] text-lg">*</span>
                      </label>
                      <div className={`relative transition-all duration-200 ${isFocused.lastName ? 'transform scale-[1.01]' : ''}`}>
                        <Field
                          type="text"
                          name="lastName"
                          placeholder="Doe"
                          onFocus={() => handleFocus('lastName')}
                          onBlur={() => handleBlur('lastName')}
                          className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:border-[#04413D] focus:ring-1 focus:ring-[#04413D] transition-all duration-200 bg-white"
                        />
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        Email <span className="text-[#04413D] text-lg">*</span>
                      </label>
                      <div className={`relative transition-all duration-200 ${isFocused.email ? 'transform scale-[1.01]' : ''}`}>
                        <Field
                          type="email"
                          name="email"
                          placeholder="john@company.com"
                          onFocus={() => handleFocus('email')}
                          onBlur={() => handleBlur('email')}
                          className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:border-[#04413D] focus:ring-1 focus:ring-[#04413D] transition-all duration-200 bg-white"
                        />
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        Phone Number <span className="text-[#04413D] text-lg">*</span>
                      </label>
                      <div className={`relative transition-all duration-200 ${isFocused.phoneNumber ? 'transform scale-[1.01]' : ''}`}>
                        <Field
                          type="text"
                          name="phoneNumber"
                          placeholder="+977 9856122323"
                          onFocus={() => handleFocus('phoneNumber')}
                          onBlur={() => handleBlur('phoneNumber')}
                          className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:border-[#04413D] focus:ring-1 focus:ring-[#04413D] transition-all duration-200 bg-white"
                        />
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-4">
                        WhatsApp Number
                      </label>
                      <div className={`relative transition-all duration-200 ${isFocused.whatsappNumber ? 'transform scale-[1.01]' : ''}`}>
                        <Field
                          type="text"
                          name="whatsappNumber"
                          placeholder="+977 9856122323"
                          onFocus={() => handleFocus('whatsappNumber')}
                          onBlur={() => handleBlur('whatsappNumber')}
                          className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:border-[#04413D] focus:ring-1 focus:ring-[#04413D] transition-all duration-200 bg-white"
                        />
                        <FaWhatsapp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      </div>
                      <ErrorMessage name="whatsappNumber" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        Company Name <span className="text-[#04413D] text-lg">*</span>
                      </label>
                      <div className={`relative transition-all duration-200 ${isFocused.companyName ? 'transform scale-[1.01]' : ''}`}>
                        <Field
                          type="text"
                          name="companyName"
                          placeholder="Acme Inc."
                          onFocus={() => handleFocus('companyName')}
                          onBlur={() => handleBlur('companyName')}
                          className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:border-[#04413D] focus:ring-1 focus:ring-[#04413D] transition-all duration-200 bg-white"
                        />
                        <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <ErrorMessage name="companyName" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        Official Email <span className="text-[#04413D] text-lg">*</span>
                      </label>
                      <div className={`relative transition-all duration-200 ${isFocused.officialEmail ? 'transform scale-[1.01]' : ''}`}>
                        <Field
                          type="email"
                          name="officialEmail"
                          placeholder="contact@acme.com"
                          onFocus={() => handleFocus('officialEmail')}
                          onBlur={() => handleBlur('officialEmail')}
                          className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:border-[#04413D] focus:ring-1 focus:ring-[#04413D] transition-all duration-200 bg-white"
                        />
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <ErrorMessage name="officialEmail" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        Country <span className="text-[#04413D] text-lg">*</span>
                      </label>
                      <div className={`relative transition-all duration-200 ${isFocused.country ? 'transform scale-[1.01]' : ''}`}>
                        <Field
                          as="select"
                          name="country"
                          onFocus={() => handleFocus('country')}
                          onBlur={() => handleBlur('country')}
                          className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:border-[#04413D] focus:ring-1 focus:ring-[#04413D] transition-all duration-200 bg-white appearance-none cursor-pointer"
                        >
                          <option value="">Select Country</option>
                          <option value="USA">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Japan">Japan</option>
                          <option value="India">India</option>
                          <option value="Nepal">Nepal</option>
                          <option value="Other">Other</option>
                        </Field>
                        <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <ErrorMessage name="country" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      Company Address <span className="text-[#04413D] text-lg">*</span>
                    </label>
                    <div className={`relative transition-all duration-200 ${isFocused.companyAddress ? 'transform scale-[1.01]' : ''}`}>
                      <Field
                        as="textarea"
                        name="companyAddress"
                        rows="3"
                        placeholder="123 Business Ave, Suite 100, City, Country"
                        onFocus={() => handleFocus('companyAddress')}
                        onBlur={() => handleBlur('companyAddress')}
                        className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:border-[#04413D] focus:ring-1 focus:ring-[#04413D] transition-all duration-200 bg-white resize-none"
                      />
                      <FaMapMarkerAlt className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                    </div>
                    <ErrorMessage name="companyAddress" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full bg-[#04413D] text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-[#0a5c56] cursor-pointer transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl overflow-hidden group mt-4"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          Request Partnership
                          <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <FaCheckCircle className="w-3 h-3 text-[#04413D]" />
                    By submitting this form, you agree to our partnership terms and privacy policy.
                  </p>
                </Form>
              )}
            </Formik>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl h-full min-h-[60vh] lg:min-h-0">
            <Image
              src="/consult.jpg"
              alt="Global Partnership"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/60 to-transparent">
              <div className="flex flex-wrap gap-6 text-white">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium">Trusted Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGlobe className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium">50+ Countries</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}