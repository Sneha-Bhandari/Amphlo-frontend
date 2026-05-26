// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Field, Form, Formik } from "formik";
// import toast, { Toaster } from "react-hot-toast";
// import Loading from "@/Global/Loading";
// import Image from "next/image";

// import {
//   fetchData,
//   patchData,
//   postData,
//   uploadImageData,
// } from "@/lib/frontendApi";

// const sectionsMap = {
//   aboutus: { name: "About Us", apiPath: "aboutus" },
//   partnerWithUs: { name: "Partner With Us", apiPath: "partnerWithUs" },
//   bookAnAppointment: { name: "Book Appointment", apiPath: "bookAnAppointment" },
// };

// function Input(props) {
//   return (
//     <Field
//       {...props}
//       className="w-full px-4 py-3 rounded-xl border border-gray-200 
//       focus:border-[#04413D] focus:ring-2 focus:ring-green-100 
//       outline-none transition"
//     />
//   );
// }

// function DynamicForm({ section, data, onSuccess }) {
//   const [preview, setPreview] = useState(null);
//   const [liveTitle, setLiveTitle] = useState(data?.title || "");
//   const [liveSubtitle, setLiveSubtitle] = useState(data?.subTitle || "");

//   const handleSubmit = async (values, { setSubmitting }) => {
//     const toastId = toast.loading("Saving changes...");

//     try {
//       let imageId = data?.imageid?.id || null;

//       if (values.imageid instanceof File) {
//         const uploadRes = await uploadImageData(values.imageid);
//         imageId = uploadRes?.id;
//       }

//       const payload = {
//         title: values.title,
//         subTitle: values.subtitle,
//         path: section.apiPath,
//         ...(imageId && { imageid: imageId }),
//       };

//       if (data) {
//         await patchData(`banner/${section.apiPath}`, payload);
//         toast.success("Banner updated successfully", { id: toastId });
//       } else {
//         await postData("banner", payload);
//         toast.success("Banner created successfully", { id: toastId });
//       }

//       setPreview(null);
//       onSuccess();
//     } catch (err) {
//       toast.error(err?.message || "Something went wrong", { id: toastId });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Formik
//       enableReinitialize
//       initialValues={{
//         title: data?.title || "",
//         subtitle: data?.subTitle || "",
//         imageid: null,
//         path: section.apiPath,
//       }}
//       onSubmit={handleSubmit}
//     >
//       {({ setFieldValue, isSubmitting, values }) => (
//         <Form className="space-y-6">
//           <div className=" p-6 space-y-4">


//             <div>
//               <label className="text-sm text-gray-600">Title</label>
//               <Input
//                 name="title"
//                 placeholder="Enter title"
//                 onChange={(e) => {
//                   setLiveTitle(e.target.value);
//                   setFieldValue("title", e.target.value);
//                 }}
//               />
//             </div>

//             <div>
//               <label className="text-sm text-gray-600">Subtitle</label>
//               <Input
//                 name="subtitle"
//                 placeholder="Enter subtitle"
//                 onChange={(e) => {
//                   setLiveSubtitle(e.target.value);
//                   setFieldValue("subtitle", e.target.value);
//                 }}
//               />
//             </div>
//             <div>
//               <label className="text-sm text-gray-600">Path</label>

//               <Input
//                 name="path"
//                 disabled
//                 value={section.apiPath}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-200 
//       bg-gray-100 cursor-not-allowed outline-none"
//               />
//             </div>

//             <div>
//               <label className="text-sm text-gray-600">Banner Image</label>

//               {/* Hidden file input */}
//               <input
//                 type="file"
//                 id="image-upload"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) {
//                     setFieldValue("imageid", file);
//                     setPreview(URL.createObjectURL(file));
//                   }
//                 }}
//               />

//               {/* Clickable image preview area */}
//               <div
//                 className="mt-2 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#04413D] transition-colors duration-200"
//                 onClick={() => document.getElementById('image-upload').click()}
//               >
//                 {(preview || data?.imageid?.imageUrl) ? (
//                   <div className="relative w-full p-4">
//                     <Image
//                       height={1000}
//                       width={3000}
//                       src={preview || data?.imageid?.imageUrl}
//                       alt="Preview"
//                       unoptimized
//                       className="w-full h-48 object-contain"
//                     />
//                     <p className="text-center text-sm text-gray-500 mt-2">
//                       Click to change image
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="py-12 text-center">
//                     <svg
//                       className="mx-auto h-12 w-12 text-gray-400"
//                       stroke="currentColor"
//                       fill="none"
//                       viewBox="0 0 48 48"
//                       aria-hidden="true"
//                     >
//                       <path
//                         d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                         strokeWidth={2}
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                     <p className="mt-2 text-sm text-gray-500">
//                       Click to upload image
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       PNG, JPG, GIF up to 10MB
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>



//             {/* Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-fit px-4 bg-[#04413D] hover:bg-[#04413D]/90 cursor-pointer text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
//             >
//               {data ? "Update Banner" : "Create Banner"}
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// }

// export default function Page() {
//   const { slug } = useParams();
//   const section = sectionsMap[slug];
//   const router = useRouter();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const res = await fetchData("banner");
//       const found = res.find((b) => b.path === section.apiPath);
//       setData(found || null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (section) load();
//   }, [slug]);

//   if (!section) return <p className="p-6">Invalid section</p>;

//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
//       <Toaster />

//       {/* Top Bar */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-[#04413D]">
//             {section.name}
//           </h1>
//           <p className="text-gray-500 text-sm">
//             Manage banner content for this section
//           </p>
//         </div>

//         <button
//           onClick={() => router.back()}
//           className="px-4 py-2 bg-white border border-gray-200 rounded-xl 
//           hover:bg-green-50 hover:border-green-300 text-[#04413D] transition"
//         >
//           ← Back
//         </button>
//       </div>

//       {/* Content */}
//       {loading ? (
//         <Loading />
//       ) : (
//         <DynamicForm section={section} data={data} onSuccess={load} />
//       )}
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";
import Image from "next/image";
import { 
  IoArrowBackOutline, 
  IoCloudUploadOutline, 
  IoInformationCircleOutline,
  IoEyeOutline,
  IoSettingsOutline,
  IoCheckmarkCircleOutline
} from "react-icons/io5";

import {
  fetchData,
  patchData,
  postData,
  uploadImageData,
} from "@/lib/frontendApi";

const sectionsMap = {
  aboutus: { name: "About Us", apiPath: "aboutus" },
  partnerWithUs: { name: "Partner With Us", apiPath: "partnerWithUs" },
  bookAnAppointment: { name: "Book Appointment", apiPath: "bookAnAppointment" },
};

function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold tracking-wide text-slate-600 uppercase block">
        {label}
      </label>
      <Field
        {...props}
        className="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:border-[#04413D] focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all duration-200 placeholder:text-slate-400"
      />
    </div>
  );
}

function DynamicForm({ section, data, onSuccess }) {
  const [preview, setPreview] = useState(null);
  const [liveTitle, setLiveTitle] = useState(data?.title || "");
  const [liveSubtitle, setLiveSubtitle] = useState(data?.subTitle || "");

  useEffect(() => {
    setLiveTitle(data?.title || "");
    setLiveSubtitle(data?.subTitle || "");
  }, [data]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const toastId = toast.loading("Syncing configuration to global clusters...");

    try {
      let imageId = data?.imageid?.id || null;

      if (values.imageid instanceof File) {
        const uploadRes = await uploadImageData(values.imageid);
        imageId = uploadRes?.id;
      }

      const payload = {
        title: values.title,
        subTitle: values.subtitle,
        path: section.apiPath,
        ...(imageId && { imageid: imageId }),
      };

      if (data) {
        await patchData(`banner/${section.apiPath}`, payload);
        toast.success("Banner state updated across systems.", { id: toastId });
      } else {
        await postData("banner", payload);
        toast.success("New banner node deployed successfully.", { id: toastId });
      }

      setPreview(null);
      onSuccess();
    } catch (err) {
      toast.error(err?.message || "Operational cluster deployment aborted.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: data?.title || "",
        subtitle: data?.subTitle || "",
        imageid: null,
        path: section.apiPath,
      }}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: CONTROL & MANAGEMENT PANEL */}
          <div className="xl:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <IoSettingsOutline className="text-slate-400 text-lg" />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Parameters Control</h3>
            </div>

            <Input
              label="Banner Header Title"
              name="title"
              placeholder="e.g., Transforming Digital Ecosystems"
              onChange={(e) => {
                setLiveTitle(e.target.value);
                setFieldValue("title", e.target.value);
              }}
            />

            <Input
              label="Sub-Header / Contextual Line"
              name="subtitle"
              placeholder="e.g., Deploy core services in under five minutes."
              onChange={(e) => {
                setLiveSubtitle(e.target.value);
                setFieldValue("subtitle", e.target.value);
              }}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-slate-400 uppercase block">
                Target Endpoint Endpoint Path (Immutable)
              </label>
              <Field
                name="path"
                disabled
                value={section.apiPath}
                className="w-full px-4 py-3 text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed font-mono outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wide text-slate-600 uppercase block">
                Asset Payload Delivery
              </label>

              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFieldValue("imageid", file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />

              <div
                onClick={() => document.getElementById("image-upload").click()}
                className="group relative border-2 border-dashed border-slate-200 hover:border-[#04413D] rounded-xl flex flex-col items-center justify-center p-6 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all duration-200"
              >
                {preview || data?.imageid?.imageUrl ? (
                  <div className="w-full text-center space-y-3">
                    <div className="relative h-32 w-full rounded-lg overflow-hidden border border-slate-100 bg-white">
                      <Image
                        fill
                        src={preview || data?.imageid?.imageUrl}
                        alt="Target Platform Payload"
                        unoptimized
                        className="object-contain p-2"
                      />
                    </div>
                    <p className="text-xs font-medium text-slate-500 group-hover:text-[#04413D] transition-colors">
                      Click bounding box to replace image payload
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <div className="w-10 h-10 bg-white border border-slate-200 shadow-xs rounded-lg flex items-center justify-center mx-auto text-slate-400 group-hover:text-[#04413D] transition-colors">
                      <IoCloudUploadOutline size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Upload high-resolution asset</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Drag-and-drop or select file (Max 10MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-3 bg-[#04413D] hover:bg-[#03302D] text-white text-xs font-bold tracking-wide uppercase rounded-xl transition-all shadow-sm shadow-[#04413D]/20 disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {data ? "Commit Dynamic Changes" : "Deploy Production Node"}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: RECHART STYLE REAL-TIME GRAPHICAL PREVIEW */}
          <div className="xl:col-span-7 space-y-4 sticky top-24">
            <div className="flex items-center gap-2 px-2 text-slate-400">
              <IoEyeOutline className="text-base" />
              <span className="text-[10px] font-black uppercase tracking-wider">Live Viewport Emulation</span>
            </div>

            <div className="w-full bg-[#0F172A] rounded-2xl overflow-hidden shadow-xl border border-slate-800">
              {/* Fake Desktop Browser Controls */}
              <div className="bg-[#1E293B] px-4 py-3 flex items-center justify-between border-b border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                </div>
                <div className="bg-[#0F172A] text-[10px] font-mono text-slate-500 px-4 py-1 rounded-md border border-slate-800 w-1/2 text-center truncate">
                  https://enterprise.app/preview/{section.apiPath}
                </div>
                <div className="w-8" />
              </div>

              {/* Emulated Viewport Canvas Area */}
              <div className="relative min-h-[340px] bg-gradient-to-br from-[#02211E] to-[#054E49] p-8 md:p-12 flex flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-center">
                  <div className="lg:col-span-7 space-y-4 text-left">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      Dynamic Render
                    </span>
                    <h1 className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight break-words">
                      {liveTitle || <span className="text-white/30 italic font-normal">Undefined Header Text Object</span>}
                    </h1>
                    <p className="text-xs md:text-sm text-slate-300 font-medium max-w-md leading-relaxed break-words">
                      {liveSubtitle || <span className="text-slate-400/40 italic font-normal">Contextual description layer field empty.</span>}
                    </p>
                  </div>

                  <div className="lg:col-span-5 flex items-center justify-center">
                    {preview || data?.imageid?.imageUrl ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden backdrop-blur-xs bg-white/5 border border-white/10 p-2 shadow-2xl">
                        <Image
                          fill
                          src={preview || data?.imageid?.imageUrl}
                          alt="Asset Payload"
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 border border-dashed border-white/10 bg-white/5 rounded-xl flex flex-col items-center justify-center text-center p-4">
                        <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">No Media Matrix</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200/70 rounded-xl flex items-start gap-3 text-amber-800 text-xs">
              <IoInformationCircleOutline className="text-lg shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold block">Production Pipeline Note:</span>
                <p className="text-amber-700/90 mt-0.5">Committing changes clears global edge caches and forces continuous mutations instantly down the client asset pipelines.</p>
              </div>
            </div>
          </div>

        </Form>
      )}
    </Formik>
  );
}

export default function Page() {
  const { slug } = useParams();
  const section = sectionsMap[slug];
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchData("banner");
      const found = res.find((b) => b.path === section.apiPath);
      setData(found || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (section) load();
  }, [slug]);

  if (!section) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="space-y-2">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500">Routing Exception</p>
          <h3 className="text-sm font-black text-slate-800">Invalid Context Section Segment</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      {/* CORE CONTROL HEADER AREA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
              Dynamic CMS Node
            </span>
            {data && (
              <span className="flex items-center gap-1 text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                <IoCheckmarkCircleOutline /> ALIVE
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {section.name} Management
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Modify and adjust metadata strings and media payloads for the production workspace.
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <IoArrowBackOutline /> Return
        </button>
      </div>

      {/* RENDER BODY CONSOLE */}
      {loading ? (
        <div className="py-24 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <DynamicForm section={section} data={data} onSuccess={load} />
      )}
    </div>
  );
}