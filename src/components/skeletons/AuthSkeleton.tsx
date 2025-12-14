import React from 'react';

export const AuthSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center space-y-4">
          {/* Logo skeleton */}
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          
          {/* Title skeleton */}
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mx-auto"></div>
          
          {/* Subtitle skeleton */}
          <div className="w-64 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
          
          {/* Loading bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-[#F0DF20] animate-[shimmer_1.5s_ease-in-out_infinite]" 
                 style={{ width: '40%', animation: 'shimmer 1.5s ease-in-out infinite' }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
