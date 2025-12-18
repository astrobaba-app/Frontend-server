"use client";

import React from "react";
import Skeleton from "./Skeleton";

interface OrdersSkeletonProps {
  count?: number;
}

const OrdersSkeleton: React.FC<OrdersSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white"
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="40%" className="bg-gray-200" />
              <div className="flex items-center gap-4 text-sm">
                <Skeleton variant="text" width="30%" className="bg-gray-200" />
                <Skeleton variant="text" width="20%" className="bg-gray-200" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton
                variant="rounded"
                width={100}
                height={32}
                className="bg-gray-200"
              />
              <Skeleton
                variant="rounded"
                width={90}
                height={32}
                className="bg-gray-200 hidden sm:block"
              />
            </div>
          </div>

          {/* Items row */}
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton
                  variant="rounded"
                  width={64}
                  height={64}
                  className="bg-gray-200 shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="70%" className="bg-gray-200" />
                  <Skeleton variant="text" width="40%" className="bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersSkeleton;
