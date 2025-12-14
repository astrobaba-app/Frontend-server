import React from 'react';

export const KundliFormSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
        <div className="w-80 h-5 bg-gray-200 rounded animate-pulse mx-auto"></div>
      </div>

      {/* Step Indicator Skeleton */}
      <div className="flex items-center justify-between px-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>
            {i < 6 && (
              <div className="flex-1 h-1 bg-gray-200 animate-pulse mx-2"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content Skeleton */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-56 h-7 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
        
        <div className="space-y-2">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
