"use client";

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import { useApi } from "@/hooks/useApi";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/Global/Loading";

const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const AboutBusinessCMS = () => {
  const editorRef = useRef(null);
  const { getdata, patchdata, postdatas, loading: apiLoading } = useApi();

  const [storedData, setStoredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const hasData = Boolean(storedData);

  // ✅ FETCH DATA (NO CACHE ISSUE)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getdata(`about-business?t=${Date.now()}`);
        console.log("Fetched About Business:", res);

        if (Array.isArray(res) && res.length > 0) {
          setStoredData(res[0]);
        } else if (res) {
          setStoredData(res);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getdata]);

  // ✅ IMAGE UPLOAD
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("images", file);

    const res = await fetch(process.env.NEXT_PUBLIC_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.id;
  };

  // ✅ SUBMIT
  const handleSubmit = async (values, { setSubmitting }) => {
    const loadingToast = toast.loading(
      hasData ? "Updating..." : "Creating..."
    );

    try {
      let imageId = storedData?.imageid?.id || null;

      if (values.imageid instanceof File) {
        imageId = await uploadImage(values.imageid);
      }

      const payload = {
        title: values.title,
        description: values.description,
      };

      if (imageId) payload.imageid = imageId;

      let response;

      if (hasData && storedData?.id) {
        response = await patchdata(
          `about-business/${storedData.id}`,
          payload
        );
        toast.success("Updated successfully", { id: loadingToast });

        setStoredData({
          ...storedData,
          ...payload,
          imageid: imageId
            ? {
                id: imageId,
                imageUrl: values.imageid
                  ? URL.createObjectURL(values.imageid)
                  : storedData?.imageid?.imageUrl,
              }
            : storedData?.imageid,
        });
      } else {
        response = await postdatas("about-business", payload);
        toast.success("Created successfully", { id: loadingToast });

        setStoredData(response);
      }

      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong", {
        id: loadingToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ LOADING
  if (loading) return <Loading />;

  return (
    <>
      <Toaster position="top-right" />

      <div className="bg-white md:my-12 flex-col flex w-full mx-auto">
        <div className="text-center mt-4">
          <h3 className="text-4xl font-semibold">
            About Our Business
          </h3>
        </div>

        <Formik
          enableReinitialize
          initialValues={{
            title: storedData?.title ?? "",
            description: storedData?.description ?? "",
            imageid: null,
          }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="flex flex-col gap-4 p-8 shadow-xl rounded-xl">

              {/* TITLE */}
              <div>
                <label>Title *</label>
                <Field
                  name="title"
                  className="border p-2 w-full"
                />
                <ErrorMessage name="title" component="div" className="text-red-500" />
              </div>

              {/* ✅ DESCRIPTION FIXED */}
              <div>
                <label>Description *</label>

                <JoditEditor
                    value={values.description}
                    onBlur={(content) => setFieldValue("description", content)}
                    onChange={() => {}}
                  />

                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500"
                />
              </div>

              {/* IMAGE */}
              <div>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("imageid", file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                {preview && (
                  <img src={preview} className="w-40 mt-2" />
                )}

                {!preview && storedData?.imageid?.imageUrl && (
                  <img
                    src={storedData.imageid.imageUrl}
                    className="w-40 mt-2"
                  />
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting || apiLoading}
                className="bg-black text-white py-2 rounded"
              >
                {isSubmitting ? "Saving..." : hasData ? "Update" : "Create"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AboutBusinessCMS;