import React from "react";

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Image */}
      <div className="relative w-full h-44 bg-gray-300">
        {/* Wishlist icon */}
        <div className="absolute top-3 right-3 w-7 h-7 bg-gray-200 rounded-full" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-3 w-20 bg-gray-300 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="h-5 w-20 bg-gray-300 rounded" />

          {/* Add button */}
          <div className="h-7 w-16 bg-gray-300 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
