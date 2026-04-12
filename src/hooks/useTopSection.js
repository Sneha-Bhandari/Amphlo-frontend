// hooks/useTopSection.js
import { useState, useEffect } from "react";
import { fetchData } from "@/lib/frontendApi";

export const useTopSection = (sectionKey) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSection = async () => {
      if (!sectionKey) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchData(`top-section/${sectionKey}`);
        console.log(`Top section data for ${sectionKey}:`, response);
        
        if (response && response.length > 0) {
          setData(response[0]);
        } else if (response && !Array.isArray(response)) {
          setData(response);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error(`Error fetching top section for ${sectionKey}:`, err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [sectionKey]);

  return { data, loading, error };
};