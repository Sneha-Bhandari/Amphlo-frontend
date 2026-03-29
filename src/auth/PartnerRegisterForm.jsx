"use client";

import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PartnerRegisterSchema = yup.object().shape({
  partnerName: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters"),

  companyName: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords do not match"),

  country: yup
    .string()
    .required("Country is required")
    .notOneOf([""], "Please select a country"),

  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),

  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[\d\s\+\-\(\)]{10,}$/, "Please enter a valid phone number"),

  website: yup
    .string()
    .url("Please enter a valid URL"),

  agreeToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("You must agree to the terms and conditions"),
});

const formFields = [
  {
    name: "partnerName",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    colSpan: 1,
    required: true,
  },
  {
    name: "companyName",
    label: "Company Name",
    type: "text",
    placeholder: "Enter your company name",
    colSpan: 1,
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "partner@company.com",
    colSpan: 1,
    required: true,
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "tel",
    placeholder: "+1 234 567 8900",
    colSpan: 1,
    required: true,
  },
];

const countryOptions = [
  { value: "", label: "Select a country" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Japan", label: "Japan" },
  { value: "India", label: "India" },
  { value: "Brazil", label: "Brazil" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "UAE", label: "United Arab Emirates" },
];

const servicesList = [
  { value: "Student Counseling", label: "Student Counseling" },
  { value: "Visa Assistance", label: "Visa Assistance" },
  { value: "Test Preparation", label: "Test Preparation" },
  { value: "Application Support", label: "Application Support" },
  { value: "Scholarship Guidance", label: "Scholarship Guidance" },
  { value: "Accommodation Help", label: "Accommodation Help" },
];

export default function PartnerRegisterForm() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-white flex flex-col mx-auto py-6 px-4 rounded-2xl">
    

      <div className="w-full mx-auto flex  p-3">
        <Formik
          initialValues={{
            partnerName: "",
            companyName: "",
            email: "",
            password: "",
            confirmPassword: "",
            country: "",
            city: "",
            services: [],
            website: "",
            phoneNumber: "",
            agreeToTerms: false,
          }}
          validationSchema={PartnerRegisterSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              console.log("Partner Registration Submitted", values);

              toast.success(
                "Registration successful! Please login to continue."
              );

              resetForm();

              setTimeout(() => {
                setSubmitting(false);
                router.push("/login?type=partner&registered=true");
              }, 500);
            } catch (error) {
              console.error("Submission error:", error);
              toast.error("Registration failed. Please try again.");
              setSubmitting(false);
            }
          }}
        >
          {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col w-full gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((field, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <Field
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] focus:border-transparent transition duration-200"
                    />
                    <ErrorMessage
                      name={field.name}
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] focus:border-transparent transition duration-200"
                  >
                    {countryOptions.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="city"
                    type="text"
                    placeholder="Enter your city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] focus:border-transparent transition duration-200"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Create password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] focus:border-transparent transition duration-200"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] focus:border-transparent transition duration-200"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Services You Offer <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {servicesList.map((service, idx) => (
                    <label key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={service.value}
                        checked={values.services.includes(service.value)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const newServices = checked
                            ? [...values.services, service.value]
                            : values.services.filter((s) => s !== service.value);
                          setFieldValue("services", newServices);
                        }}
                        className="w-4 h-4 text-[#04413D] border-gray-300 rounded focus:ring-[#04413D]"
                      />
                      <span className="text-sm text-gray-700">
                        {service.label}
                      </span>
                    </label>
                  ))}
                </div>
                <ErrorMessage
                  name="services"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Website (Optional)
                </label>
                <Field
                  name="website"
                  type="url"
                  placeholder="https://company.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04413D] focus:border-transparent transition duration-200"
                />
                <ErrorMessage
                  name="website"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="agreeToTerms"
                  className="w-4 h-4 text-[#04413D] border-gray-300 rounded focus:ring-[#04413D]"
                />
                <label className="text-sm text-gray-600">
                  I agree to the Terms of Service and Privacy Policy *
                </label>
              </div>
              <ErrorMessage
                name="agreeToTerms"
                component="div"
                className="text-red-500 text-xs mt-1"
              />

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-[#04413D] text-white font-semibold rounded-lg hover:bg-white hover:text-[#04413D] focus:outline-none focus:ring-2 hover:border hover:border-[#04413D] focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed w-fit cursor-pointer duration-500"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Creating account...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login?type=partner"
                    className="text-[#04413D] font-medium hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}