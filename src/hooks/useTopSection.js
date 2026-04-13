import { useState, useEffect } from "react";
import { fetchData } from "@/lib/frontendApi";

export const useTopSection = (sectionPath) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        setLoading(true);

        // ✅ fetch ALL top sections
        const response = await fetchData("top-section");

        console.log("ALL TOP SECTIONS:", response);

        if (Array.isArray(response)) {
          // ✅ filter by backend "path"
          const matched = response.find(
            (item) => item.path === sectionPath
          );

          setData(matched || null);
        } else {
          // if API returns single object
          setData(response?.path === sectionPath ? response : null);
        }
      } catch (err) {
        console.error("TopSection error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (sectionPath) fetchSection();
  }, [sectionPath]);

  return { data, loading };
};