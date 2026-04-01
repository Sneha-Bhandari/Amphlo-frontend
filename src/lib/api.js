import apiClient from "./apiClient";

export const api = async ({
  url,
  method = "GET",
  data = null,
  params = null,
  headers = {},
}) => {
  try {
    const res = await apiClient({
      url,
      method,
      data,
      params,
      headers,
    });

    return res.data;
  } catch (error) {
    console.error("API ERROR:", error.response || error);
    throw error;
  }
};