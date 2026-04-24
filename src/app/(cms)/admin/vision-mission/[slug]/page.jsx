"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import Loading from "@/Global/Loading";
import VisionMissionForm from "@/PageComponent/cms/missionvision/MissionVisionForm";

import {
  fetchData,
  patchData,
  postData,
  uploadImageData,
} from "@/lib/frontendApi";

const sectionsMap = {
  vision: { name: "Vision", apiPath: "vision" },
  mission: { name: "Mission", apiPath: "mission" },
};

export default function Page() {
  const { slug } = useParams();
  const router = useRouter();
  const section = sectionsMap[slug];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetchData("vision-mission");
      console.log("Vision Mission API Response:", res);
      
      const found = res.find((x) => x.path === section.apiPath);
      setData(found || null);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, actions) => {
    const toastId = toast.loading("Saving...");

    try {
      let imageId = data?.imageid?.id || null;

      if (values.imageid instanceof File) {
        const uploadRes = await uploadImageData(values.imageid);
        imageId = uploadRes?.id;
      }

      const payload = {
        title: values.title,
        subTitle: values.subTitle,
        description: values.description,
        path: section.apiPath,
      };

      if (imageId) {
        payload.imageid = imageId;
      }

      console.log("Final payload:", payload);

      if (data) {
        await patchData(`vision-mission/${section.apiPath}`, payload);
        toast.success("Updated successfully!", { id: toastId });
      } else {
        await postData("vision-mission", payload);
        toast.success("Created successfully!", { id: toastId });
      }

      load();
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (section) load();
  }, [slug]);

  if (!section) return <p>Invalid section</p>;

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl 
          hover:bg-green-50 hover:border-green-300 text-[#04413D] transition mb-4"
        >
          ← Back
        </button>
      {loading ? (
        <Loading />
      ) : (
        <VisionMissionForm
          section={section}
          data={data}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}