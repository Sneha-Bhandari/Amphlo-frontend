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
  FaCalendarAlt, 
  FaCommentDots,
  FaPaperPlane,
  FaSpinner,
  FaCheckCircle,
  FaPhoneAlt,
  FaWhatsapp
} from "react-icons/fa";

export default function EnquiryForm() {
  const [selectedCountry, setSelectedCountry] = useState("+977");

  const countryCodes = [
    { code: "+1", country: "USA/Canada" },
    { code: "+44", country: "United Kingdom" },
    { code: "+61", country: "Australia" },
    { code: "+91", country: "India" },
    { code: "+977", country: "Nepal" },
    { code: "+86", country: "China" },
    { code: "+81", country: "Japan" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+971", country: "UAE" },
    { code: "+966", country: "Saudi Arabia" },
    { code: "+65", country: "Singapore" },
    { code: "+60", country: "Malaysia" },
    { code: "+64", country: "New Zealand" },
    { code: "+82", country: "South Korea" },
    { code: "+92", country: "Pakistan" },
    { code: "+880", country: "Bangladesh" },
    { code: "+94", country: "Sri Lanka" },
    { code: "+20", country: "Egypt" },
    { code: "+27", country: "South Africa" },
  ];

  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    date: "",
    message: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(2, "Name too short").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9\s\-\(\)]+$/, "Please enter a valid phone number")
      .min(8, "Must be at least 8 digits")
      .max(15, "Phone number is too long")
      .required("Phone number is required"),
    message: Yup.string()
      .min(10, "Message too short")
      .required("Message is required"),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const toastId = toast.loading("Submitting enquiry...");
    
    try {
      const fullPhoneNumber = `${selectedCountry}${values.phoneNumber}`;
      
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: fullPhoneNumber,
        message: values.message.trim(),
      };
      
      if (values.date) {
        payload.date = values.date;
      }
      
      console.log("Sending to /book-an-appointment:", payload);
      
      await postData("book-an-appointment", payload);
      
      toast.success("Appointment booked successfully! We'll contact you soon.", { id: toastId });
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to submit. Please try again.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-linear-to-br from-gray-50 to-gray-100 py-16 md:py-20">
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
      }} />
      
      <div className="w-11/12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Side - Form */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-[#04413D] to-[#0a5c56] p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Book an Appointment
              </h2>
              <p className="text-gray-200 text-sm">
                Fill in your details and our team will reach out within 24 hours
              </p>
              <div className="h-1 w-20 bg-yellow-500 rounded-full mt-4"></div>
            </div>

            <div className="p-6 md:p-8">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    {/* Name Field */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaUser className="w-4 h-4 text-[#04413D]" />
                        Full Name *
                      </label>
                      <Field
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#04413D] focus:ring-2 focus:ring-green-100 transition-all duration-200"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaEnvelope className="w-4 h-4 text-[#04413D]" />
                        Email Address *
                      </label>
                      <Field
                        type="email"
                        name="email"
                        placeholder="john@company.com"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#04413D] focus:ring-2 focus:ring-green-100 transition-all duration-200"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>

                    {/* Phone Number with Country Code */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaPhoneAlt className="w-4 h-4 text-[#04413D]" />
                        Phone Number *
                      </label>
                      <div className="flex gap-3">
                        {/* Country Code Dropdown */}
                        <div className="relative">
                          <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="border border-gray-300 rounded-xl p-3 pr-8 focus:outline-none focus:border-[#04413D] focus:ring-2 focus:ring-green-100 appearance-none bg-white cursor-pointer font-medium min-w-[20vh]"
                          >
                            {countryCodes.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.code} ({country.country})
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Phone Number Input */}
                        <Field
                          type="text"
                          name="phoneNumber"
                          placeholder="9851234567"
                          className="flex-1 border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#04413D] focus:ring-2 focus:ring-green-100 transition-all duration-200"
                        />
                      </div>
                      <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-[#04413D]" />
                        Preferred Date (Optional)
                      </label>
                      <Field
                        type="date"
                        name="date"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#04413D] focus:ring-2 focus:ring-green-100 transition-all duration-200"
                      />
                      <ErrorMessage name="date" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaCommentDots className="w-4 h-4 text-[#04413D]" />
                        Your Message *
                      </label>
                      <Field
                        as="textarea"
                        name="message"
                        rows="4"
                        placeholder="Tell us about your enquiry..."
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#04413D] focus:ring-2 focus:ring-green-100 transition-all duration-200 resize-none"
                      />
                      <ErrorMessage name="message" component="div" className="text-red-500 text-xs mt-1 ml-1" />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-linear-to-r from-[#04413D] to-[#0a5c56] text-white font-semibold py-3.5 rounded-xl hover:from-[#0a5c56] hover:to-[#04413D] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="w-5 h-5" />
                          Submit Enquiry
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                      <FaCheckCircle className="w-3 h-3 text-green-500" />
                      We respect your privacy. Your information is secure.
                    </p>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Right Side - Image with Overlay */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-full min-h-[60vh] lg:min-h-0">
            <Image
              src="/consult.jpg"
              alt="Consultation"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-1 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Schedule a Meeting</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Let's Discuss Your Goals</h3>
              <p className="text-gray-200 text-sm">
                Our experts are ready to help you achieve your educational dreams
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}