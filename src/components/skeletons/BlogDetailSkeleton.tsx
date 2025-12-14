import React from 'react';

const BlogDetailSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Back Button Skeleton */}
      <div className="mt-5 ms-10 mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
      </div>

      {/* Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Featured Image Skeleton */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full bg-gray-200"></div>

          {/* Content */}
          <div className="p-6 sm:p-8 md:p-12">
            {/* Author Info & Meta Skeleton */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {/* Avatar Skeleton */}
                <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                <div>
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Like Button Skeleton */}
              <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
            </div>

            {/* Title Skeleton */}
            <div className="mb-6">
              <div className="h-8 bg-gray-200 rounded mb-3 w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Date & Views Skeleton */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>

            {/* Description/Content Skeleton */}
            <div className="space-y-3 mb-12">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Call to Action Skeleton */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-gray-100 rounded-2xl p-8">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
                <div className="h-12 w-48 bg-gray-200 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailSkeleton;
