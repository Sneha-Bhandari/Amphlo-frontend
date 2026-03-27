export default function EnquiryInfo() {
  const contactInfo = [
    {
      title: "Our Amphlo team is here to help",
      type: "Email",
      value: "info@amphlo.com",
    },
    {
      title: "Our Amphlo team is here to help",
      type: "Contact No",
      value: "+977 9745432207, +977 9745432207",
    },
    {
      title: "Our Amphlo team is here to help",
      type: "Location",
      value: "Santikunja, Yogikuti (next to Garima Bikash Bank)",
    },
  ];

  return (
    <div className="w-full py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {contactInfo.map((val, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center text-[#04413D] p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <h3 className="text-xl md:text-2xl font-bold">{val.type}</h3>

            <p className="text-gray-500 text-sm mt-1">{val.title}</p>

            <p className="text-sm md:text-base font-semibold mt-2 ">
              {val.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mx-13 h-96 rounded-xl overflow-hidden shadow-lg ">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1552975551726!2d83.46193627549206!3d27.697835525390897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996868a80185519%3A0xbad4eeb3b7798ee5!2sLumbini%20Provincial%20Hospital!5e0!3m2!1sen!2snp!4v1715500841056!5m2!1sen!2snp"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lumbini Provincial Hospital Location"
        />
      </div>
    </div>
  );
}
