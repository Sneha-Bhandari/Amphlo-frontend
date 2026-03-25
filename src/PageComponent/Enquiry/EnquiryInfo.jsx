import { HiOutlineMail } from "react-icons/hi";
import { IoMdContact } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa6";

export default function EnquiryInfo() {
  const contactInfo = [
    {
      type: "Email",
      value: "info@amphlo.com",
      title: "Our Amphlo team is here to help",
      icon: <HiOutlineMail />,
      color: "bg-blue-50",
    },
    {
      type: "Contact No",
      value: "+977 9745432207, +977 9745432207",
      title: "Available during office hours",
      icon: <IoMdContact />,
      color: "bg-green-50",
    },
    {
      type: "Location",
      value: "Santikunja, Yogikuti (next to Garima Bikash Bank)",
      title: "Visit our head office",
      icon: <FaLocationArrow />,
      color: "bg-orange-50",
    },
  ];

  return (
    <div className="w-full py-16 px-4 bg-gray-50/50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 navtext">
        {contactInfo.map((val, i) => (
          <div
            key={i}
            className="group relative flex flex-col items-center text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#FDC653]/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >

            <div className="mb-5 p-4 rounded-full bg-[#04413D]/5 text-[#04413D] text-3xl group-hover:bg-[#FDC653]  transition-colors duration-300">
              {val.icon}
            </div>

            <h3 className="text-xl font-bold text-[#04413D] mb-2">
              {val.type}
            </h3>

            <p className="text-[#FDC653] text-xs uppercase tracking-widest mb-3 font-medium">
              {val.title}
            </p>

            <p className="text-[#04413D] font-semibold text-sm md:text-base leading-relaxed  px-2">
              {val.value}
            </p>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto mt-16 rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[50vh]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8143254523!2d83.4632!3d27.6939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQxJzM4LjAiTiA4M8KwMjcnNDcuNSJF!5e0!3m2!1sen!2snp!4v1710000000000"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Amphlo Location"
          className="grayscale hover:grayscale-0 transition-all duration-700"
        />
      </div>
    </div>
  );
}