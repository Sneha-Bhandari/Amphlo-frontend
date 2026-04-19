"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { postData } from "@/lib/frontendApi";
import toast, { Toaster } from "react-hot-toast";

export default function PartnerForm() {
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

  return (
    <div className="w-full bg-gray-100 py-12">
      <Toaster position="top-right" />
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-4 md:px-12">
        <div className="relative md:w-11/12 w-full h-[50vh] md:h-[75vh] overflow-hidden rounded-2xl order-2 md:order-1">
          <Image
            src="/consult.jpg"
            alt="Partnership"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="order-1 md:order-2">
          <div className="max-w-5xl mx-auto p-6 md:p-6 rounded-xl navtext">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#04413D] mb-8">
              Partner With Us
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Join hands with us to create global opportunities for students worldwide.
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#04413D]">
                  <div className="flex flex-col">
                    <label className="font-medium mb-1">First Name *</label>
                    <Field
                      type="text"
                      name="firstName"
                      placeholder="Enter first name"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="firstName" />
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Last Name *</label>
                    <Field
                      type="text"
                      name="lastName"
                      placeholder="Enter last name"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="lastName" />
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Email *</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="email" />
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Phone Number *</label>
                    <Field
                      type="text"
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="phoneNumber" />
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1">WhatsApp Number</label>
                    <Field
                      type="text"
                      name="whatsappNumber"
                      placeholder="Enter WhatsApp number"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="whatsappNumber" />
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Company Name *</label>
                    <Field
                      type="text"
                      name="companyName"
                      placeholder="Enter company name"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="companyName" />
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Official Email *</label>
                    <Field
                      type="email"
                      name="officialEmail"
                      placeholder="Enter official email"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="officialEmail" />
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Country *</label>
                    <Field
                      as="select"
                      name="country"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
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
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="country" />
                    </span>
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="font-medium mb-1">Company Address *</label>
                    <Field
                      as="textarea"
                      name="companyAddress"
                      rows="3"
                      placeholder="Enter company address"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D] resize-none"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="companyAddress" />
                    </span>
                  </div>

                  <div className="md:col-span-2 flex justify-center w-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="border border-[#04413D] w-full bg-[#04413D] text-white px-5 py-2 rounded-md hover:bg-[#526e6b] cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Partnership Request"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}