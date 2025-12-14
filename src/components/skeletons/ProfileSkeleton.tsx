import React from 'react';


export const ProfileSkeleton: React.FC = () => {
  return (
    <>
      {/* Sidebar Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mb-4"></div>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-2 mt-6">
          <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-6"></div>
        
        {/* Form Fields Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="w-full h-12 bg-gray-200 rounded animate-pulse mt-6"></div>
      </div>
    </>
  );
};