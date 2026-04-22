"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { postData } from "@/lib/frontendApi";
import toast, { Toaster } from "react-hot-toast";

export default function EnquiryForm() {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(2, "Name too short").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Only numbers allowed")
      .min(10, "Phone must be at least 10 digits")
      .required("Phone number is required"),
    message: Yup.string()
      .min(10, "Message too short")
      .required("Message is required"),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const toastId = toast.loading("Submitting enquiry...");
    
    try {
      // Prepare payload matching your backend
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
      };
      
      // Add date only if provided
      if (values.date) {
        payload.date = values.date;
      }
      
      console.log("Sending to /book-an-appointment:", payload);
      
      // Use correct endpoint
      const response = await postData("book-an-appointment", payload);
      console.log("Response:", response);
      
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
    <div className="w-full bg-gray-100 py-12">
      <Toaster position="top-right" />
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-4 md:px-12">
        <div>
          <div className="max-w-5xl mx-auto p-6 md:p-6 rounded-xl navtext">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#04413D] mb-8">
              Book an Appointment
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#04413D]">
                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Your Name *</label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D] text-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="name" />
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Email Address *</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="email" />
                    </span>
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="font-medium mb-1">Phone Number *</label>
                    <Field
                      type="text"
                      name="phone"
                      placeholder="Enter phone number"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="phone" />
                    </span>
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="font-medium mb-1">Preferred Date (Optional)</label>
                    <Field
                      type="date"
                      name="date"
                      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="date" />
                    </span>
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="font-medium mb-1">Enquiry Message *</label>
                    <Field
                      as="textarea"
                      name="message"
                      rows="4"
                      placeholder="Write your enquiry..."
                      className="border resize-none rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#04413D]"
                    />
                    <span className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="message" />
                    </span>
                  </div>

                  <div className="md:col-span-2 flex justify-center w-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="border border-[#04413D] w-full bg-[#04413D] text-white px-5 py-2 rounded-md hover:bg-[#526e6b] cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Enquiry"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className="relative md:w-11/12 w-full h-[50vh] md:h-[75vh] overflow-hidden rounded-2xl">
          <Image
            src="/consult.jpg"
            alt="Consultation"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}