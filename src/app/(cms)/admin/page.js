"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  Globe,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Calendar,
  MapPin,
  BookOpen,
  Award
} from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUniversities: 156,
    totalCountries: 34,
    totalStudents: 12450,
    totalPartners: 89,
    monthlyGrowth: 12.5,
    placementRate: 87
  });

  const [recentData, setRecentData] = useState({
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
  });

  const statCards = [
    {
      title: "Total Universities",
      value: stats.totalUniversities,
      icon: GraduationCap,
      color: "bg-blue-500",
      change: "+12",
      changeType: "increase"
    },
    {
      title: "Partner Countries",
      value: stats.totalCountries,
      icon: Globe,
      color: "bg-green-500",
      change: "+5",
      changeType: "increase"
    },
    {
      title: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: "bg-purple-500",
      change: "+18%",
      changeType: "increase"
    },
    {
      title: "Placement Rate",
      value: `${stats.placementRate}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+5%",
      changeType: "increase"
    }
  ];

  return (
    <div className="min-h-screen  ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your B2B consultancy.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className=" rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color} p-2 rounded-lg text-white`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'increase' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Countries Graph */}
        <div className="bg-white rounded-lg shadow-sm p-5">
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

        {/* Monthly Placements Graph */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Monthly Student Placements</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-48 flex items-end gap-2">
            {recentData.monthlyPlacements.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-linear-to-t from-[#04413D] to-[#06665f] rounded-t"
                  style={{ height: `${(value / 140) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{['J','F','M','A','M','J','J','A','S','O','N','D'][index]}</span>
              </div>
            ))}
          </div>
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

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-6 h-6" />
            <ArrowUp className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold">87%</h3>
          <p className="text-sm opacity-90">Student Satisfaction Rate</p>
        </div>
        
        <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6" />
            <ArrowUp className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold">156</h3>
          <p className="text-sm opacity-90">Active University Partners</p>
        </div>
        
        <div className="bg-linear-to-r from-green-500 to-green-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-6 h-6" />
            <ArrowUp className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold">34</h3>
          <p className="text-sm opacity-90">Countries Worldwide</p>
        </div>
      </div>
    </div>
  );
}