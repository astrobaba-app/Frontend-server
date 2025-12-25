import React from 'react';

const AstrologersListSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Search Bar Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Astrologers Grid Skeleton */}
        <div className="grid mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
              {/* Status Badge */}
              <div className="h-6 w-20 bg-gray-200 rounded-full mb-4 ml-auto"></div>

              {/* Profile Section */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0"></div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Rating and Price */}
              <div className="flex justify-between items-center mb-3">
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>

              {/* Chat Button */}
              <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Trending Section Skeleton */}
        <div className="mb-8 border-2 border-yellow-200 rounded-2xl p-6">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Astrologers Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
              {/* Status Badge */}
              <div className="h-6 w-20 bg-gray-200 rounded-full mb-4 ml-auto"></div>

              {/* Profile Section */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0"></div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Rating and Price */}
              <div className="flex justify-between items-center mb-3">
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>

              {/* Chat Button */}
              <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AstrologersListSkeleton;
