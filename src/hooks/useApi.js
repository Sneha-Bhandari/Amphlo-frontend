"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { uploadImageData } from "@/lib/frontendApi"; // ✅ ADD THIS

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async (config) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api(config);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getdata: (url, params) =>
      handleRequest({ url, method: "GET", params }),

    postdatas: (url, data) =>
      handleRequest({ url, method: "POST", data }),

    patchdata: (url, data) =>
      handleRequest({ url, method: "PATCH", data }),

    deletedata: (url) =>
      handleRequest({ url, method: "DELETE" }),

    // ✅ ADD THIS (IMPORTANT FIX)
    uploadImageData,

    loading,
    error,
  };
};