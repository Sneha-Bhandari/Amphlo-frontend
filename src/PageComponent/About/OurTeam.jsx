"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function OurTeam() {
  const [teamData, setTeamData] = useState([]);
  const [teamSectionData, setTeamSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [teamResponse, topSectionResponse] = await Promise.all([
          fetchData("our-team"),
          fetchData("top-section/ourTeam")
        ]);
        
        console.log("Team Response:", teamResponse);
        console.log("Top Section Response:", topSectionResponse);
        
        if (Array.isArray(teamResponse)) {
          setTeamData(teamResponse);
        } else if (teamResponse && typeof teamResponse === "object") {
          setTeamData([teamResponse]);
        } else {
          setTeamData([]);
        }
        
        setTeamSectionData(topSectionResponse || null);
        
      } catch (error) {
        console.error("Error fetching team data:", error);
        setError("Failed to load team members. Please try again later.");
        setTeamData([]);
        setTeamSectionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#04413D] text-white rounded-lg hover:bg-[#04413D]/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!teamSectionData) {
    return null;
  }

  return (
    <section className="w-full md:py-16 py-6 bg-[#04413D]/20">
      <div className="max-w-6xl mx-auto px-6 navtext">
        <div className="text-center md:mb-16 mb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#04413D] tracking-tight mb-4">
            {teamSectionData.title}
          </h2>
          {teamSectionData.description && (
            <div 
              className="text-lg text-gray-600 font-medium"
              dangerouslySetInnerHTML={{ __html: teamSectionData.description }}
            />
          )}
        </div>

        {teamData.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {teamData.map((member, index) => (
              <motion.div
                key={member.id || index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group flex flex-col items-center text-center p-3 transition-all duration-500 hover:bg-white hover:rounded-2xl hover:shadow-xl hover:shadow-[#c8ecea]/30 cursor-pointer"
              >
                <div className="relative h-32 w-32 mb-6">
                  <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#d7eeec] transition-colors duration-500">
                    {member.imageid?.imageUrl ? (
                      <Image
                        src={member.imageid.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200  flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold text-[#04413D] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#04413D]/70 mb-2 uppercase tracking-wider">
                    {member.position}
                  </p>
                  
                  <div className="space-y-1 flex flex-col items-center border-t border-gray-200 pt-2 w-full">
                    <a 
                      href={`mailto:${member.email}`} 
                      className="flex items-center text-gray-500 hover:text-[#04413D] transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {member.email}
                    </a>
                    <a 
                      href={`tel:${member.phone}`} 
                      className="flex items-center text-gray-500 hover:text-[#04413D] transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {member.phone}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No team members available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}