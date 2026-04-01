"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function HeroSection() {
  const maaaping = [
    { label: "Title", name: "title", type: "text" },
    { label: "Subtitle", name: "subtitle", type: "text" },
    { label: "Image", name: "imageid", type: "file" },
  ];

  const { getdata, postdatas, patchdata, loading } = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await getdata("hero-section");
        if (res && res.length > 0) {
          setData(res[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHero();
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    subtitle: Yup.string().required("Subtitle is required"),
    imageid: Yup.mixed().nullable(),
  });

  return (
    <div className="flex gap-52 justify-between">
      <div className="">
        <div className="text-2xl text-[#04413D] font-bold">Hero section</div>
        <div className="text-sm text-gray-500">
          title, subtitle, image
        </div>
      </div>

      <div className="bg-gray-200 rounded-2xl flex-1 p-4 w-full">
        <Formik
          enableReinitialize
          initialValues={{
            title: data?.title || "",
            subtitle: data?.subTitle || "",
            imageid: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const payload = {
                title: values.title,
                subTitle: values.subtitle,
                imageid: data?.imageid?.id,
              };

              if (data && data.id) {
                await patchdata(`hero-section/${data.id}`, payload);
                alert("Updated successfully");
              } else {
                await postdatas("hero-section", payload);
                alert("Created successfully");
              }
            } catch (err) {
              console.error("FULL ERROR:", err.response?.data || err);
            }
          }}
        >
          {({ setFieldValue }) => (
            <Form className="p-4 space-y-4">
              {maaaping.map((val) => (
                <div key={val.name}>
                  <label className="block mb-1">
                    {val.label}
                  </label>

                  {val.type === "file" ? (
                    <>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file =
                            e.target.files && e.target.files[0];
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