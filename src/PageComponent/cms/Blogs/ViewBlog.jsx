"use client";

import React from "react";
import { MdClose, MdCalendarToday, MdPerson, MdCategory } from "react-icons/md";

export default function ViewBlog({ isOpen, onClose, blog }) {
  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#04413D]">Blog Details</h2>
            <p className="text-gray-600 text-sm mt-1">View blog post details</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Featured Image */}
          {blog.imageid?.imageUrl && (
            <div className="mb-6">
              <img
                src={blog.imageid.imageUrl}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
                }}
              />
            </div>
          )}

          <div className="space-y-6">
            {/* Title */}
            <div className="border-b pb-4">
              <h3 className="text-3xl font-bold text-gray-900">{blog.title}</h3>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <MdCategory className="text-[#04413D]" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium text-gray-800">{blog.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MdPerson className="text-[#04413D]" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Author</p>
                  <p className="font-medium text-gray-800">{blog.postedby || "Admin"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MdCalendarToday className="text-[#04413D]" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">{blog.date || new Date().toLocaleDateString()}</p>
                </div>
              </div>
              {blog.time && (
                <div className="flex items-center gap-2">
                  <svg className="text-[#04413D]" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-800">{blog.time}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Content</h4>
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-800 prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 bg-[#04413D] text-white py-2 rounded-lg hover:bg-[#04413D]/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}