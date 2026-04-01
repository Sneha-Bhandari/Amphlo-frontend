// "use client";

// import { useState } from "react";
// import { api } from "@/lib/api";

// export const useApi = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const request = async ({
//     url,
//     method = "GET",
//     data = null,
//     params = null,
//     headers = {},
//   }) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await api({ url, method, data, params, headers });
//       return res;
//     } catch (err) {
//       setError(err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     request,

//     get: (url, params) => request({ url, method: "GET", params }),
//     post: (url, data) => request({ url, method: "POST", data }),
//     patch: (url, data) => request({ url, method: "PATCH", data }),
//     del: (url) => request({ url, method: "DELETE" }),

//     loading,
//     error,
//   };
// };


"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async (config) => {
    setLoading(true);
    setError(null);

    try {
      console.log("API CALL:", config); 

      const res = await api(config);

      console.log("API SUCCESS:", res); 

      return res;
    } catch (err) {
      console.error("API ERROR:", err); 
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

    loading,
    error,
  };
};