import React from 'react';

const AstrologerDetailPageSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Card Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-gray-200 shrink-0"></div>

          {/* Info */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div className="flex-1">
                <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-64 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Rating Stats */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-12 bg-gray-200 rounded"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>

        {/* Review Cards */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
              <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AstrologerDetailPageSkeleton;
