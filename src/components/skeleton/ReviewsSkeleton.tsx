import React from "react";
import { colors } from "@/utils/colors";

export default function ReviewsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          {/* Review Text Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* User Info and Rating Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              <div>
                {/* Name */}
                <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
              </div>
            </div>
            {/* Stars */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-5 h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
