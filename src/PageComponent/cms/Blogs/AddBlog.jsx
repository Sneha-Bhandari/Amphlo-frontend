// "use client";

// import React, { useState, useRef } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import toast, { Toaster } from "react-hot-toast";
// import { MdCloudUpload, MdClose } from "react-icons/md";
// import { postData, uploadImageData } from "@/lib/frontendApi";
// import JoditEditor from "jodit-react";

// const BlogSchema = Yup.object().shape({
//   title: Yup.string().min(3).max(200).required("Title is required"),
//   category: Yup.string().min(2).max(100).required("Category is required"),
//   postedby: Yup.string().min(2).max(100).required("Author name is required"),
//   description: Yup.string().min(10).required("Description is required"),
//   date: Yup.string().required("Date is required"),
//   time: Yup.string(),
// });

// export default function AddBlog({ isOpen, onClose, onSuccess }) {
//   const [imagePreview, setImagePreview] = useState(null);
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const editor = useRef(null);

//   const handleImageUpload = async (file, setFieldValue, setTouched) => {
//     if (!file) return;

//     const previewUrl = URL.createObjectURL(file);
//     setImagePreview(previewUrl);
//     setUploadingImage(true);
    
//     try {
//       const res = await uploadImageData(file);
//       setFieldValue("imageid", res?.id);
//       setTouched({ imageid: true });
//       toast.success("Image uploaded");
//     } catch (err) {
//       toast.error("Upload failed");
//       setImagePreview(null);
//       setFieldValue("imageid", null);
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleSubmit = async (values, { resetForm, setSubmitting }) => {
//     if (!values.imageid) {
//       toast.error("Please upload an image");
//       setSubmitting(false);
//       return;
//     }

//     const t = toast.loading("Adding blog...");

//     try {
//       const payload = {
//         title: values.title.trim(),
//         category: values.category.trim(),
//         postedby: values.postedby.trim(),
//         description: values.description,
//         date: values.date,
//         time: values.time || "",
//         imageid: values.imageid,
//       };

//       await postData("blogsection/", payload);

//       toast.success("Blog added successfully!", { id: t });
//       resetForm();
//       setImagePreview(null);
//       onSuccess?.();
//       onClose();
//     } catch (e) {
//       console.error("Error:", e);
//       toast.error("Failed to add blog", { id: t });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   const config = {
//     readonly: false,
//     height: 300,
//     placeholder: "Write your blog content here...",
//     toolbarButtonSize: "medium",
//     uploader: {
//       insertImageAsBase64URI: true,
//     },
//   };

//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 4000,
//             style: {
//               background: '#363636',
//               color: '#fff',
//             },
//             success: {
//               duration: 3000,
//               iconTheme: {
//                 primary: '#10B981',
//                 secondary: '#fff',
//               },
//             },
//             error: {
//               duration: 4000,
//               iconTheme: {
//                 primary: '#EF4444',
//                 secondary: '#fff',
//               },
//             },
//           }}
//         />
        
//         <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
//           <div>
//             <h2 className="text-2xl font-bold text-[#04413D]">Add Blog</h2>
//             <p className="text-gray-600 text-sm mt-1">Create a new blog post</p>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <MdClose size={24} />
//           </button>
//         </div>

//         <div className="p-6">
//           <Formik
//             initialValues={{
//               title: "",
//               category: "",
//               postedby: "",
//               description: "",
//               date: new Date().toISOString().split('T')[0],
//               time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
//               imageid: null,
//             }}
//             validationSchema={BlogSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ values, setFieldValue, setTouched, isSubmitting, errors, touched, submitForm }) => (
//               <Form className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Featured Image *
//                   </label>
//                   {imagePreview ? (
//                     <div className="flex items-center gap-4 p-4 border rounded-lg">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-24 h-24 rounded-lg object-cover border-2 border-[#04413D]"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setImagePreview(null);
//                           setFieldValue("imageid", null);
//                           setTouched({ imageid: false });
//                         }}
//                         className="text-red-600 flex items-center gap-1 hover:text-red-700"
//                       >
//                         <MdClose /> Remove Image
//                       </button>
//                     </div>
//                   ) : (
//                     <label className="border-2 border-dashed rounded-lg p-8 block text-center cursor-pointer hover:border-[#04413D] transition-colors border-gray-300">
//                       <MdCloudUpload size={48} className="mx-auto mb-2 text-gray-400" />
//                       <p className="text-gray-600">Click to upload image</p>
//                       <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         hidden
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           if (file) {
//                             handleImageUpload(file, setFieldValue, setTouched);
//                           }
//                         }}
//                       />
//                     </label>
//                   )}
//                   {uploadingImage && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
//                   {errors.imageid && touched.imageid && <div className="text-red-500 text-sm mt-1">{errors.imageid}</div>}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Title *
//                     </label>
//                     <Field
//                       name="title"
//                       className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
//                         errors.title && touched.title ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="Enter blog title"
//                     />
//                     <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Category *
//                     </label>
//                     <Field
//                       name="category"
//                       className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
//                         errors.category && touched.category ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="Enter category"
//                     />
//                     <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Author Name *
//                     </label>
//                     <Field
//                       name="postedby"
//                       className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
//                         errors.postedby && touched.postedby ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="Enter author name"
//                     />
//                     <ErrorMessage name="postedby" component="div" className="text-red-500 text-sm mt-1" />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Date *
//                       </label>
//                       <Field
//                         name="date"
//                         type="date"
//                         className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
//                           errors.date && touched.date ? "border-red-500" : "border-gray-300"
//                         }`}
//                       />
//                       <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-1" />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Time
//                       </label>
//                       <Field
//                         name="time"
//                         type="time"
//                         className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
//                           errors.time && touched.time ? "border-red-500" : "border-gray-300"
//                         }`}
//                       />
//                       <ErrorMessage name="time" component="div" className="text-red-500 text-sm mt-1" />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description *
//                   </label>
//                   <JoditEditor
//                     ref={editor}
//                     value={values.description}
//                     config={config}
//                     tabIndex={1}
//                     onBlur={(newContent) => setFieldValue("description", newContent)}
//                     onChange={(newContent) => {}}
//                   />
//                   <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
//                 </div>

//                 <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setTouched({
//                         title: true,
//                         category: true,
//                         postedby: true,
//                         description: true,
//                         date: true,
//                         imageid: true,
//                       });
//                       submitForm();
//                     }}
//                     disabled={isSubmitting || uploadingImage}
//                     className={`flex-1 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
//                       isSubmitting || uploadingImage
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-linear-to-r from-[#FDC653] to-yellow-500 hover:from-yellow-600 hover:to-yellow-700 text-white"
//                     }`}
//                   >
//                     {isSubmitting || uploadingImage ? (
//                       <span className="flex items-center justify-center gap-2">
//                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         {uploadingImage ? "Uploading Image..." : "Adding Blog..."}
//                       </span>
//                     ) : (
//                       "Add Blog"
//                     )}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={onClose}
//                     className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { postData, uploadImageData } from "@/lib/frontendApi";
import JoditEditor from "jodit-react";

const BlogSchema = Yup.object().shape({
  title: Yup.string().min(3).max(200).required("Title is required"),
  category: Yup.string().min(2).max(100).required("Category is required"),
  postedby: Yup.string().min(2).max(100).required("Author name is required"),
  description: Yup.string().min(10).required("Description is required"),
  date: Yup.string().required("Date is required"),
  time: Yup.string().required("Time is required"),
});

export default function AddBlog({ isOpen, onClose, onSuccess }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageId, setImageId] = useState(null);
  const editor = useRef(null);

  const handleImageUpload = async (file, setFieldValue, setTouched) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploadingImage(true);
    
    try {
      const res = await uploadImageData(file);
      console.log("Upload response:", res); // Debug log
      
      // Get the image ID from response
      const id = res?.id || res?.imageId || res?.data?.id || null;
      
      if (id) {
        setImageId(id);
        setFieldValue("imageid", id);
        setTouched({ imageid: true });
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("No image ID returned");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload failed");
      setImagePreview(null);
      setImageId(null);
      setFieldValue("imageid", null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (!values.imageid) {
      toast.error("Please upload an image");
      setSubmitting(false);
      return;
    }

    const t = toast.loading("Adding blog...");

    try {
      // Format the date properly
      const formattedDate = values.date; // Already in YYYY-MM-DD format
      
      // Format time properly (ensure it's in HH:MM format)
      const formattedTime = values.time || new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });

      // Create payload matching the schema exactly
      const payload = {
        category: values.category.trim(),
        imageid: values.imageid, // This should be a UUID string
        postedby: values.postedby.trim(),
        title: values.title.trim(),
        description: values.description,
        date: formattedDate,
        time: formattedTime
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      const response = await postData("blogsection", payload);
      console.log("Response:", response);

      toast.success("Blog added successfully!", { id: t });
      resetForm();
      setImagePreview(null);
      setImageId(null);
      onSuccess?.();
      onClose();
    } catch (e) {
      console.error("Error:", e);
      toast.error(e.message || "Failed to add blog", { id: t });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const config = {
    readonly: false,
    height: 300,
    placeholder: "Write your blog content here...",
    toolbarButtonSize: "medium",
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Add Blog</h2>
            <p className="text-gray-600 text-sm mt-1">Create a new blog post</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <Formik
            initialValues={{
              title: "",
              category: "",
              postedby: "",
              description: "",
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
              imageid: null,
            }}
            validationSchema={BlogSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, setTouched, isSubmitting, errors, touched, submitForm }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image *
                  </label>
                  {imagePreview ? (
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-[#04413D]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageId(null);
                          setFieldValue("imageid", null);
                          setTouched({ imageid: false });
                        }}
                        className="text-red-600 flex items-center gap-1 hover:text-red-700"
                      >
                        <MdClose /> Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-lg p-8 block text-center cursor-pointer hover:border-[#04413D] transition-colors border-gray-300">
                      <MdCloudUpload size={48} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(file, setFieldValue, setTouched);
                          }
                        }}
                      />
                    </label>
                  )}
                  {uploadingImage && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
                  {errors.imageid && touched.imageid && <div className="text-red-500 text-sm mt-1">{errors.imageid}</div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <Field
                      name="title"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                        errors.title && touched.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter blog title"
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <Field
                      name="category"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                        errors.category && touched.category ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter category"
                    />
                    <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Name *
                    </label>
                    <Field
                      name="postedby"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                        errors.postedby && touched.postedby ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter author name"
                    />
                    <ErrorMessage name="postedby" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <Field
                        name="date"
                        type="date"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                          errors.date && touched.date ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time *
                      </label>
                      <Field
                        name="time"
                        type="time"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                          errors.time && touched.time ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <ErrorMessage name="time" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <JoditEditor
                    ref={editor}
                    value={values.description}
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => setFieldValue("description", newContent)}
                    onChange={(newContent) => {}}
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setTouched({
                        title: true,
                        category: true,
                        postedby: true,
                        description: true,
                        date: true,
                        time: true,
                        imageid: true,
                      });
                      submitForm();
                    }}
                    disabled={isSubmitting || uploadingImage}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                      isSubmitting || uploadingImage
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-[#FDC653] to-yellow-500 hover:from-yellow-600 hover:to-yellow-700 text-white"
                    }`}
                  >
                    {isSubmitting || uploadingImage ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {uploadingImage ? "Uploading Image..." : "Adding Blog..."}
                      </span>
                    ) : (
                      "Add Blog"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}