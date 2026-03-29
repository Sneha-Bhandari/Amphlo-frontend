"use client";

import { 
    ShieldCheckIcon,
    ChevronRightIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/page";
import Loading from "@/Global/Loading";

export default function WhyPartnerWithUs() {
    const [partnerData, setPartnerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPartnerData = async () => {
            try {
                const data = await fetchData("why-partner-with-us"); 
                setPartnerData(data[0]); 
                setLoading(false);
            } catch (error) {
                console.error("Error fetching partner data:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        getPartnerData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white/20 flex items-center justify-center p-4">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white/20 flex items-center justify-center p-4">
                <div className="text-center text-red-600">
                    <p>Error loading partner benefits: {error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-[#04413D] text-white rounded-lg hover:bg-[#06665f]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const benefits = partnerData?.benefits?.length ? partnerData.benefits : [
        "Comprehensive marketing support",
        "Dedicated account management",
        "Joint research opportunities",
        "Faculty development programs",
        "Customizable program pathways",
        "24/7 technical support"
    ];

    const satisfactionPercent = partnerData?.satisfactionPercent || "98%";
    const satisfactionTitle = partnerData?.satisfactionTitle || "Partner Satisfaction";
    const title = partnerData?.title || "What You Get as a Partner";
    const subTitle = partnerData?.subTitle || "Exclusive Partner Benefits";
    const description = partnerData?.description || "Our partnership model is designed to provide comprehensive support across every aspect of your international education initiatives.";
    const imageUrl = partnerData?.imageid?.imageUrl || "/consult.jpg";

    return (
        <div className="min-h-screen bg-white/20 flex items-center justify-center p-4">
            <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className='navtext'>
                        <div className="inline-flex items-center gap-2 bg-[#FDC653]/40 rounded-full px-4 py-2 mb-6">
                            <ShieldCheckIcon className="w-5 h-5 text-[#04413D]" />
                            <span className="text-sm font-semibold text-[#04413D]">{subTitle}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#04413D] mb-6">
                            {title}
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            {description}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 mb-10">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3 group hover:translate-x-1 transition-transform">
                                    <CheckBadgeIcon className="w-5 h-5 text-[#FDC653] shrink-0" />
                                    <span className="text-gray-700">{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link 
                                href="/register?type=partner" 
                                className="inline-flex items-center gap-2 bg-[#FDC653] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#04413D] hover:text-white transition-all shadow-md hover:shadow-lg hover:scale-102 transform"
                            >
                                Become a Partner
                                <ChevronRightIcon className="w-4 h-4" />
                            </Link>
                            <Link 
                                href="/" 
                                className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all hover:shadow-md"
                            >
                                <DocumentTextIcon className="w-4 h-4" />
                                Download Brochure
                            </Link>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-0 bg-linear-to-r from-[#04413D] to-[#04413D]/20 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                            <div className="relative h-[70vh] w-full bg-linear-to-br from-indigo-100 to-blue-100"> 
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <p className="text-gray-500">Image Not Found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                                   
                        <div className="absolute -top-6 -right-6 bg-linear-to-r from-[#FDC653] to-[#04413D]/50 rounded-xl p-4 shadow-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{satisfactionPercent}</div>
                                <div className="text-xs text-blue-100">{satisfactionTitle}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}