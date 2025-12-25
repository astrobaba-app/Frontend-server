import React from 'react';
export const CartSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      {/* Skeleton Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {[1, 2].map((i) => (
            <div key={i} className="border-b border-gray-200 p-6 flex gap-4">
              {/* Image Skeleton */}
              <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0" />
              
              {/* Details Skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
                
                <div className="flex gap-3 pt-2">
                  <div className="h-8 bg-gray-100 rounded-lg w-24" />
                  <div className="h-8 bg-gray-100 rounded w-16" />
                </div>
              </div>

              {/* Subtotal Skeleton */}
              <div className="hidden sm:flex flex-col items-end justify-center space-y-2">
                <div className="h-3 bg-gray-100 rounded w-12" />
                <div className="h-6 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
        {/* Continue Shopping Button Skeleton */}
        <div className="h-10 bg-gray-200 rounded-md w-40 mt-6" />
      </div>

      {/* Skeleton Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
          
          <div className="space-y-4 pb-6 border-b border-gray-100">
            <div className="flex justify-between"><div className="h-4 bg-gray-100 rounded w-24"/><div className="h-4 bg-gray-200 rounded w-16"/></div>
            <div className="flex justify-between"><div className="h-4 bg-gray-100 rounded w-20"/><div className="h-4 bg-gray-200 rounded w-12"/></div>
            <div className="flex justify-between"><div className="h-4 bg-gray-100 rounded w-28"/><div className="h-4 bg-gray-200 rounded w-16"/></div>
          </div>

          <div className="flex justify-between pt-2">
            <div className="h-6 bg-gray-200 rounded w-16" />
            <div className="h-8 bg-gray-300 rounded w-24" />
          </div>

          <div className="h-12 bg-gray-200 rounded-xl w-full" />
          <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto" />
        </div>
        
        {/* Review Box Skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-20 bg-gray-100 rounded-lg w-full" />
        </div>
      </div>
    </div>
  );
};