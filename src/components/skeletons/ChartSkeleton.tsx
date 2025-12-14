import React from "react";
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="aspect-square w-full max-w-md mx-auto bg-gray-200 rounded animate-pulse"></div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
