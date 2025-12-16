import React from "react";

export default function KundliReportSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="flex justify-center mb-8">
          <div className="h-10 bg-gray-300 rounded w-80"></div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-300 rounded-t-lg w-40"></div>
          ))}
        </div>

        {/* Content Card Skeleton */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Title Section */}
          <div className="mb-6">
            <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>

          {/* Grid Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Large Content Block */}
          <div className="mb-8">
            <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="grid md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="mb-8">
            <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
            <div className="border border-gray-200 rounded">
              <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
              {[1, 2, 3, 4].map((row) => (
                <div key={row} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200">
                  {[1, 2, 3, 4, 5].map((col) => (
                    <div key={col} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Astrologer Cards Skeleton */}
          <div>
            <div className="h-6 bg-gray-300 rounded w-56 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
