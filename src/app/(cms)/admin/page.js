"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  Globe,
  TrendingUp,
  ArrowUp,
  MapPin,
  BookOpen,
  Award,
  LogOut
} from "lucide-react";
import ProtectedRoute from "@/app/(cms)/ProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";
import { fetchData } from "@/lib/frontendApi";
import Loading from "@/Global/Loading";

export default function AdminPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [coreStrengthData, setCoreStrengthData] = useState(null);

  useEffect(() => {
    const getCoreStrengthData = async () => {
      try {
        setLoading(true);
        const data = await fetchData("core-strengths");
        setCoreStrengthData(data[0] || null);
      } catch (error) {
        console.error("Error fetching core strengths data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCoreStrengthData();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Transform stats from core-strength CMS
  const transformStats = () => {
    if (coreStrengthData?.stats && Array.isArray(coreStrengthData.stats)) {
      return coreStrengthData.stats.map(stat => ({
        label: stat.label,
        value: stat.count,
        originalCount: stat.count
      }));
    }
    return [];
  };

  const stats = transformStats();
  
  // Map stats to dashboard cards
  const getStatValue = (label) => {
    const stat = stats.find(s => s.label === label);
    return stat ? stat.originalCount : '0';
  };

  const statCards = [
    {
      title: "Total Universities",
      value: getStatValue("Universities"),
      icon: GraduationCap,
      color: "bg-blue-500",
      change: "+12",
      changeType: "increase"
    },
    {
      title: "Partner Countries",
      value: getStatValue("Countries"),
      icon: Globe,
      color: "bg-green-500",
      change: "+5",
      changeType: "increase"
    },
    {
      title: "Total Students",
      value: getStatValue("Students"),
      icon: Users,
      color: "bg-purple-500",
      change: "+18%",
      changeType: "increase"
    },
    {
      title: "Success Rate",
      value: getStatValue("Success Rate"),
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+5%",
      changeType: "increase"
    }
  ];

  const recentData = {
    topCountries: [
      { name: "United States", count: 45, percentage: 28 },
      { name: "United Kingdom", count: 32, percentage: 20 },
      { name: "Canada", count: 28, percentage: 18 },
      { name: "Australia", count: 24, percentage: 15 },
      { name: "Germany", count: 19, percentage: 12 },
    ],
    topUniversities: [
      { name: "Harvard University", students: 234, country: "USA" },
      { name: "Oxford University", students: 198, country: "UK" },
      { name: "University of Toronto", students: 167, country: "Canada" },
      { name: "Australian National", students: 145, country: "Australia" },
      { name: "TU Munich", students: 123, country: "Germany" },
    ],
    monthlyPlacements: [85, 92, 88, 95, 102, 98, 110, 115, 108, 120, 125, 130]
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
       
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {user?.email || "Admin"}! Here's what's happening with your B2B consultancy.
            </p>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Overviews</h2>
              <Award className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-xl p-8 bg-linear-to-r from-[#04413D] to-[#06665f]  text-white shadow-md shadow-[#e4c88a] cursor-pointer hover:scale-105 transition-all ease-in-out duration-500"
                >
                  <div className="text-xl sm:text-2xl font-bold ">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-200 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts Section */}
      
          {/* Top Countries Graph */}
          <div className="bg-white rounded-lg shadow-sm p-5 mb-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Top Partner Countries</h2>
              <Globe className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentData.topCountries.map((country, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{country.name}</span>
                    <span className="text-gray-500">{country.count} Universities</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-linear-to-r from-[#04413D] to-[#06665f] h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* Top Universities Table */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Top Performing Universities</h2>
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">University Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Country</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Students Placed</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentData.topUniversities.map((uni, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800">{uni.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {uni.country}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{uni.students}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}