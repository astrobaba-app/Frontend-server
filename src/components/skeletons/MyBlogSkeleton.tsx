import React from 'react';
import { Skeleton } from './Skeleton';

export const MyBlogSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Skeleton */}
          <Skeleton variant="rectangular" height="250px" width="100%" />
          
          {/* Content Skeleton */}
          <div className="p-6">
            {/* Title Skeleton */}
            <Skeleton variant="text" height="24px" width="80%" className="mb-3" />
            
            {/* Meta Information Skeleton */}
            <div className="flex items-center gap-4 mb-4">
              <Skeleton variant="text" height="16px" width="100px" />
              <Skeleton variant="text" height="16px" width="80px" />
            </div>
            
            {/* Description Preview Skeleton */}
            <Skeleton variant="text" height="16px" width="100%" className="mb-2" count={2} />
            <Skeleton variant="text" height="16px" width="60%" />
          </div>
        </div>
      ))}
    </div>
  );
};
