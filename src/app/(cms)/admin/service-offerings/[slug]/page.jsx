"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import Loading from "@/Global/Loading";
import ServiceForm from "@/PageComponent/cms/serviceoffering/ServiceForm";

import {
  fetchData,
  patchData,
  postData,
  uploadImageData,
} from "@/lib/frontendApi";

const sectionsMap = {
  partner: { name: "Partner", apiPath: "partner" },
  university: { name: "University", apiPath: "university" },
};

export default function Page() {
  const { slug } = useParams();
  const router = useRouter();
  const section = sectionsMap[slug];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetchData("service-offerings");
      const found = res.find((x) => x.path === section.apiPath);
      setData(found || null);
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
        description: values.description,
        features: values.features.filter(Boolean),
        path: section.apiPath,
        imageid: imageId,
      };

      if (data) {
        await patchData(`service-offerings/${data.path}`, payload);
        toast.success("Updated", { id: toastId });
      } else {
        await postData("service-offerings", payload);
        toast.success("Created", { id: toastId });
      }

      load();
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (section) load();
  }, [slug]);

  if (!section) return <p>Invalid</p>;

  return (
    <div className="p-6">
      <Toaster />
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
        <ServiceForm
          section={section}
          data={data}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}