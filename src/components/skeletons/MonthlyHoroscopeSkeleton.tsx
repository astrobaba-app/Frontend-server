import React from "react";

export const MonthlyHoroscopeSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Monthly Overview Skeleton */}
      <section className="py-8 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Month Title */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-8 w-56 bg-gray-200 rounded"></div>
          </div>
          
          {/* Monthly Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl p-6 h-36"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Breakdown Skeleton */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-5 border-2 border-gray-200">
                <div className="space-y-3">
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best & Challenging Dates */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="space-y-4">
                  <div className="h-6 w-40 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
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
                    <div className="h-6 w-40 bg-gray-200 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
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
