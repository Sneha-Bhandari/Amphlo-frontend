"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchData, postData } from "@/lib/frontendApi";
import { ChevronLeft } from "lucide-react";

/* ---------------- VALIDATION ---------------- */
const universitySchema = Yup.object().shape({
  universityName: Yup.string().required("University name is required"),
  location: Yup.string().required("Location is required"),
  ranking: Yup.string().required("Ranking is required"),
  program: Yup.string().required("Program is required"),
  established: Yup.string().optional(),
  students: Yup.string().optional(),
  stateId: Yup.string().required("State is required"),
});

/* ---------------- INPUT STYLE ---------------- */
const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#04413D]/30";

export default function AddUniversityPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetchData("countries/");
        setCountries(res?.data || res || []);
      } catch {
        toast.error("Failed to load countries");
      }
    };
    loadCountries();
  }, []);

  const handleCountryChange = async (countryId, setFieldValue) => {
    setFieldValue("stateId", "");

    try {
      const res = await fetchData(`states?countryId=${countryId}`);
      setStates(res?.data || res || []);
    } catch {
      setStates([]);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    const toastId = toast.loading("Creating university...");

    try {
      const payload = {
        universityName: values.universityName,
        location: values.location,
        ranking: values.ranking,
        program: values.program,
        established: values.established,
        students: values.students,
        stateId: values.stateId,
      };

      await postData("universities", payload);

      toast.success("University created successfully!", {
        id: toastId,
      });

      resetForm();
      router.push("/admin/universities");
    } catch (err) {
      toast.error(err.message || "Failed to create university", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl">
      <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#04413D] mb-4 font-semibold hover:gap-3 transition-all group bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow-md"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Universities
        </button>

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#04413D]">
            Add New University
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details to create a new university entry
          </p>
        </div>

        <Formik
          initialValues={{
            universityName: "",
            location: "",
            ranking: "",
            program: "",
            established: "",
            students: "",
            stateId: "",
          }}
          validationSchema={universitySchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

              {/* LOCATION SECTION */}
              <div>
                <h2 className="text-sm font-semibold text-gray-600 mb-3">
                  Location Info
                </h2>

                {/* COUNTRY */}
                <div className="mb-4">
                  <label className="text-sm text-gray-600">Country</label>
                  <select
                    className={inputClass}
                    onChange={(e) =>
                      handleCountryChange(e.target.value, setFieldValue)
                    }
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STATE */}
                <div>
                  <label className="text-sm text-gray-600">State *</label>
                  <select
                    className={inputClass}
                    value={values.stateId}
                    onChange={(e) =>
                      setFieldValue("stateId", e.target.value)
                    }
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    name="stateId"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* UNIVERSITY INFO */}
              <div>
                <h2 className="text-sm font-semibold text-gray-600 mb-3">
                  University Info
                </h2>

                <div className="grid grid-cols-1 gap-4">

                  <div>
                    <label className="text-sm text-gray-600">University Name *</label>
                    <Field name="universityName" className={inputClass} />
                    <ErrorMessage name="universityName" className="text-red-500 text-xs" component="div" />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Location *</label>
                    <Field name="location" className={inputClass} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Ranking *</label>
                      <Field name="ranking" className={inputClass} />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Program *</label>
                      <Field name="program" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Established</label>
                      <Field name="established" className={inputClass} />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Students</label>
                      <Field name="students" className={inputClass} />
                    </div>
                  </div>

                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#04413D] hover:bg-[#03332f] text-white font-medium py-3 rounded-xl transition"
              >
                {loading ? "Creating University..." : "Create University"}
              </button>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}