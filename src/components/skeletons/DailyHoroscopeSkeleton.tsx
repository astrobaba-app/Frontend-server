import React from "react";

export const DailyHoroscopeSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Lucky Elements Skeleton */}
      <section className="py-8 bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-40 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
          
          {/* Lucky Elements Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl p-6 h-32"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections Skeleton */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-40 bg-gray-200 rounded"></div>
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                      <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
