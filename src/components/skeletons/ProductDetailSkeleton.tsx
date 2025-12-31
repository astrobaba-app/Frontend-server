import React from "react";
 const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10">
        
        {/* LEFT: Image Skeleton */}
        <div>
          <div className="relative aspect-square rounded-lg md:rounded-xl animate-skeleton" />
        </div>

        {/* RIGHT: Info Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-skeleton rounded-md" />
          
          <div className="flex gap-4 mb-6">
            <div className="h-6 w-20 animate-skeleton rounded-md" />
            <div className="h-6 w-24 animate-skeleton rounded-md" />
          </div>

          <div className="flex items-center gap-3 md:gap-6 mb-8">
            <div className="h-10 w-24 animate-skeleton rounded-md" />
            <div className="h-10 w-40 animate-skeleton rounded-md" />
          </div>

          <div className="space-y-3 mt-10">
            <div className="h-4 w-full animate-skeleton rounded-md" />
            <div className="h-4 w-full animate-skeleton rounded-md" />
            <div className="h-4 w-2/3 animate-skeleton rounded-md" />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-1/2 animate-skeleton rounded-md" />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div className="mt-16 space-y-6">
        <div className="h-6 w-32 animate-skeleton rounded-md mb-4" />
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-10 h-10 rounded-full animate-skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 animate-skeleton rounded-md" />
              <div className="h-3 w-full animate-skeleton rounded-md" />
              <div className="h-3 w-5/6 animate-skeleton rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;