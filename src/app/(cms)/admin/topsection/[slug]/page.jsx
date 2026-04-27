"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import Loading from "@/Global/Loading";
import TopSectionForm from "../../../../../PageComponent/cms/Topsection/TopSectionForm";

import {
    fetchData,
    patchData,
    postData,
} from "@/lib/frontendApi";

const sectionsMap = {
    CoreStrength: { name: "Core Strength", apiPath: "CoreStrength" },
    servicesAndOfferings: { name: "Services & Offerings", apiPath: "servicesAndOfferings" },
    testimonials: { name: "Testimonials", apiPath: "testimonials" },
    partners: { name: "Partners", apiPath: "partners" },
    faq: { name: "FAQ", apiPath: "faq" },
    ourFeatures: { name: "Our Features", apiPath: "ourFeatures" },
    ourTeam: { name: "Our Team", apiPath: "ourTeam" },
    countries: { name: "Countries", apiPath: "countries" },
    becomeAPartner: { name: "Become Partner", apiPath: "becomeAPartner" },
};

export default function Page() {
    const { slug } = useParams();
    const router = useRouter();
    const section = sectionsMap[slug];

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const res = await fetchData("top-section");
            const found = res.find((x) => x.path === section.apiPath);
            setData(found || null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values, actions) => {
        const toastId = toast.loading("Saving...");

        try {
            const payload = {
                title: values.title,
                description: values.description,
                path: section.apiPath,
            };

            if (data) {
                await patchData(`top-section/${data.path}`, payload);
                toast.success("Updated", { id: toastId });
            } else {
                await postData("top-section", payload);
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
        <div className="min-h-screen bg-[#f8fafc] p-8">
            <Toaster />

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-end mb-8">
                   
                        <button
                            onClick={() => router.back()}
                            className="text-sm px-3 py-2 rounded-2xl bg-[#04413D] text-white hover:text-gray-100 hover:bg-[#04413D]/70 cursor-pointer"
                        >
                            ← Back
                        </button>

                    
                </div>
                       
                {loading ? (
                    <Loading />
                ) : (
                    <TopSectionForm
                        section={section}
                        data={data}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}