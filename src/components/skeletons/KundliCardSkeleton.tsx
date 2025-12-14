import React from "react";
export const KundliCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t pt-4 space-y-2">
        <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};