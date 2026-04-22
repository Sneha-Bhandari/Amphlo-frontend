"use client";

import React, { useEffect, useState } from "react";
import { MdClose, MdAdd } from "react-icons/md";
import { fetchData, postData, uploadImageData } from "@/lib/frontendApi";
import toast from "react-hot-toast";

export default function ViewCountry({
  isOpen,
  onClose,
  country,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ADD STATE
  const [showForm, setShowForm] = useState(false);
  const [stateName, setStateName] = useState("");
  const [stateImage, setStateImage] = useState(null); // NEW
  const [adding, setAdding] = useState(false);

  const id = country?.id;

  // LOAD COUNTRY DETAILS
  const loadCountry = async () => {
    try {
      setLoading(true);
      const res = await fetchData(`countries/${id}/details`);
      setData(res?.data || res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && id) loadCountry();
  }, [isOpen, id]);

  if (!isOpen) return null;

  const statesList = data?.states || [];

  // ADD STATE API (FIXED)
  const handleAddState = async () => {
    if (!stateName.trim()) {
      return toast.error("State name required");
    }

    try {
      setAdding(true);
      const toastId = toast.loading("Adding state...");

      let imageid = null;

      // ✅ upload image first if selected
      if (stateImage) {
        const uploadRes = await uploadImageData(stateImage);
        imageid = uploadRes?.id;
      }

      await postData("states", {
        name: stateName,
        countryId: id,
        imageid: imageid, // ✅ FIXED
      });

      toast.success("State added", { id: toastId });

      setStateName("");
      setStateImage(null);
      setShowForm(false);

      await loadCountry();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to add state");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">
              Country Details
            </h2>
            <p className="text-gray-600 text-sm">
              View country & states information
            </p>
          </div>

          <button onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">

          {/* LOADING */}
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading...
            </div>
          ) : (
            <>
              {/* COUNTRY INFO */}
              <div className="flex gap-8 mb-8 pb-8 border-b">
                <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 border-4 border-[#04413D]">
                  {data?.imageid?.imageUrl ? (
                    <img
                      src={data.imageid.imageUrl}
                      className="w-full h-full object-cover"
                      alt={data?.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      🌍
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-[#04413D]">
                    {data?.name}
                  </h1>

                  <p className="text-gray-600 mt-2">
                    📊 {statesList.length} States •
                    🎓 {data?.universityCount || 0} Universities
                  </p>

                  {/* ADD STATE BUTTON */}
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="mt-3 flex items-center gap-1 text-sm text-white bg-[#04413D] px-3 py-1 rounded"
                  >
                    <MdAdd /> Add State
                  </button>
                </div>
              </div>

              {/* ADD STATE FORM */}
              {showForm && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-2">Add New State</h3>

                  <input
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="State name"
                    className="w-full border px-3 py-2 rounded mb-3"
                  />

                  {/* NEW IMAGE INPUT (NO UI CHANGE STYLE SAME) */}
                  <input
                    type="file"
                    onChange={(e) => setStateImage(e.target.files[0])}
                    className="w-full border px-3 py-2 rounded mb-3"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddState}
                      disabled={adding}
                      className="bg-[#04413D] text-white px-4 py-2 rounded"
                    >
                      {adding ? "Adding..." : "Save"}
                    </button>

                    <button
                      onClick={() => setShowForm(false)}
                      className="bg-gray-200 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#04413D] mb-3">
                  Description
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data?.description,
                    }}
                  />
                </div>
              </div>

              {/* STATES */}
              <div>
                <h3 className="font-semibold text-[#04413D] mb-3">
                  States & Regions
                </h3>

                {statesList.length === 0 ? (
                  <p className="text-gray-500">No states found</p>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {statesList.map((state) => (
                      <div
                        key={state.id}
                        className="border p-4 rounded-lg hover:shadow"
                      >
                        <h4 className="font-semibold">{state.name}</h4>

                        <p className="text-xs text-gray-500 mt-1">
                          Universities: {state.universities?.length || 0}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-[#04413D] text-white py-2 rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}