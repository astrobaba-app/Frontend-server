import React from "react";
export const HoroscopeSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="space-y-2">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Prediction Cards Skeleton */}
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-24 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-4/6 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Lucky Elements Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="w-40 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
