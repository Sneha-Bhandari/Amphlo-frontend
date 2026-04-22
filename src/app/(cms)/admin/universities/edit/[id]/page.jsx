"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchData, patchData } from "@/lib/frontendApi";

const universitySchema = Yup.object().shape({
  universityName: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  ranking: Yup.string().required("Required"),
  program: Yup.string().required("Required"),
  established: Yup.string(),
  students: Yup.string(),
  stateId: Yup.string().required("State is required"),
});

export default function EditUniversityPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchData(`universities/${id}`);
        const data = res?.data || res;

        const stateId = data?.state?.id || "";
        const countryId = data?.state?.country?.id || "";

        let statesList = [];
        if (countryId) {
          const s = await fetchData(`states?countryId=${countryId}`);
          statesList = s?.data || s || [];
        }

        setStates(statesList);

        setInitialValues({
          universityName: data.universityName || "",
          location: data.location || "",
          ranking: data.ranking || "",
          program: data.program || "",
          established: data.established || "",
          students: data.students || "",
          stateId,
        });
      } catch {
        toast.error("Failed to load data");
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    const toastId = toast.loading("Updating...");

    try {
      // ✅ ONLY SEND BACKEND FIELDS (IMPORTANT FIX)
      const payload = {
        universityName: values.universityName,
        location: values.location,
        ranking: values.ranking,
        program: values.program,
        established: values.established,
        students: values.students,
        stateId: values.stateId,
      };

      await patchData(`universities/${id}`, payload);

      toast.success("Updated successfully", { id: toastId });
      router.push("/admin/universities");
    } catch (err) {
      toast.error(err?.message || "Failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!initialValues) {
    return (
      <div className="p-6 text-gray-500 animate-pulse">
        Loading university...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl">
        
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#04413D]">
            Edit University
          </h1>
          <p className="text-gray-500 text-sm">
            Update university details below
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">

          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={universitySchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-5">

                {/* STATE */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    State
                  </label>
                  <select
                    className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#04413D]"
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
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* GRID INPUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <Input label="University Name" name="universityName" />
                  <Input label="Location" name="location" />
                  <Input label="Ranking" name="ranking" />
                  <Input label="Program" name="program" />
                  <Input label="Established" name="established" />
                  <Input label="Students" name="students" />

                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#04413D] hover:bg-[#03332f] text-white py-2 rounded-lg transition"
                  >
                    {loading ? "Updating..." : "Update University"}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/admin/universities")}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
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

function Input({ label, name }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <Field
        name={name}
        className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#04413D]"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs"
      />
    </div>
  );
}