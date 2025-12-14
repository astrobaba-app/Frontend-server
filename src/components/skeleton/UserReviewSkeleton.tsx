import React from "react";
import { colors } from "@/utils/colors";

export default function UserReviewSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 animate-pulse">
      {/* Astrologer Info Skeleton */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gray-300 shrink-0"></div>
        <div className="flex-1">
          {/* Name */}
          <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
          {/* Date */}
          <div className="h-3 bg-gray-200 rounded w-40"></div>
        </div>
        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* Review Text Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Reply Section Skeleton */}
      <div className="rounded-lg p-4" style={{ backgroundColor: colors.offYellow }}>
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}
