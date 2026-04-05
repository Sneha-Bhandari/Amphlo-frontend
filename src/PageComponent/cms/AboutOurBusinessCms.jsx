"use client";

import { useEffect, useState, useRef } from "react";
import { useApi } from "@/hooks/useApi";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";

export default function AboutBusinessCMS() {
  const editor = useRef(null);
  const maaaping = [
    { label: "Title", name: "title", type: "text" },
    { label: "Description", name: "description", type: "editor" },
    { label: "Image", name: "imageid", type: "file" },
  ];

  const { getdata, postdatas, patchdata, loading } = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAboutBusiness = async () => {
      try {
        const res = await getdata("about-business");
        if (res && res.length > 0) {
          setData(res[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAboutBusiness();
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required").min(50, "Description should be at least 50 characters"),
    imageid: Yup.mixed().nullable(),
  });

  const config = {
    readonly: false,
    placeholder: "Enter detailed description...",
    height: 400,
    uploader: {
      insertImageAsBase64URI: true,
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'],
    },
    toolbar: true,
    spellcheck: true,
    language: 'en',
    toolbarButtonSize: 'medium',
    toolbarAdaptive: false,
    showXPathInStatusbar: false,
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize',
    ],
    buttonsMD: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'image', 'link', '|',
      'align', 'undo', 'redo',
    ],
    buttonsXS: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'image', 'link', '|',
      'undo', 'redo',
    ],
  };

  return (
    <div className="flex flex-col gap-8 mx-auto md:w-11/13 w-full ">
      <div className="flex flex-col mx-auto md:items-center md:justify-center items-start  w-full justify-start">
        <div className="text-3xl text-[#04413D] font-bold">About Our Business</div>
        <div className="text-sm text-gray-500">
          title, description, image
        </div>
      </div>

      <div className="border border-gray-300 rounded-2xl flex p-4 w-full">
        <Formik
          enableReinitialize
          initialValues={{
            title: data?.title || "",
            description: data?.description || "",
            imageid: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const payload = {
                title: values.title,
                description: values.description,
                imageid: data?.imageid?.id,
              };

              if (data && data.id) {
                await patchdata(`about-business/${data.id}`, payload);
                alert("Updated successfully");
              } else {
                await postdatas("about-business", payload);
                alert("Created successfully");
              }
            } catch (err) {
              console.error("FULL ERROR:", err.response?.data || err);
            }
          }}
        >
          {({ setFieldValue, values, setFieldTouched }) => (
            <Form className="p-4 space-y-4">
              {maaaping.map((val) => (
                <div key={val.name} >
                  <label className="block mb-2 text-lg text-gray-600">
                    {val.label}
                  </label>

                  {val.type === "file" ? (
                    <>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          setFieldValue(val.name, file);
                        }}
                      />

                      {data?.imageid?.imageUrl && (
                        <img
                          src={data.imageid.imageUrl}
                          alt="preview"
                          className="mt-2 w-68 h-32 object-cover"
                        />
                      )}
                    </>
                  ) : val.type === "editor" ? (
                    <div className="border rounded">
                      <JoditEditor
                        ref={editor}
                        value={values.description}
                        config={config}
                        onBlur={(newContent) => {
                          setFieldValue(val.name, newContent);
                          setFieldTouched(val.name, true);
                        }}
                        onChange={(newContent) => {
                          setFieldValue(val.name, newContent);
                        }}
                      />
                    </div>
                  ) : (
                    <Field
                      name={val.name}
                      type={val.type}
                      className="w-full border p-2 rounded"
                    />
                  )}

                  <ErrorMessage
                    name={val.name}
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                {data ? "Update" : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}