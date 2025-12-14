import React from 'react';

export const AstrologerCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      {/* Header with avatar and status */}
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Specialties */}
      <div className="flex gap-2 flex-wrap">
        <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      
      {/* Stats */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <div className="flex-1 h-9 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex-1 h-9 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};
