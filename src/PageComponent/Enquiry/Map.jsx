"use client";

import { useEffect, useState, useRef } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function Map() {
  const [mapUrl, setMapUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent multiple API calls
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchMapData = async () => {
      try {
        const data = await fetchData("map");
        console.log("Map API Response:", data);
        
        let url = null;
        if (data && data.length > 0) {
          url = data[0].mapUrl;
        } else if (data && !Array.isArray(data)) {
          url = data.mapUrl;
        }
        
        setMapUrl(url);
      } catch (error) {
        console.error("Error fetching map data:", error);
        // Don't show error to user, just hide map
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-16 px-4 flex justify-center">
        <Loading />
      </div>
    );
  }

  if (!mapUrl) {
    return null;
  }

  return (
    <div className="pb-12 w-11/12 mx-auto h-92 rounded-xl overflow-hidden">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Location Map"
      />
    </div>
  );
}