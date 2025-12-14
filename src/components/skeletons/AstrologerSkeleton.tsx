import React from 'react';
import { Skeleton } from './Skeleton';

// Astrologer Profile skeleton component
export const AstrologerProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item}>
            <Skeleton variant="text" width="100px" height="20px" className="mb-2" />
            <Skeleton variant="rounded" width="100%" height="44px" />
          </div>
        ))}
      </div>

      

      {/* Bio Section */}
      <div className="mb-6">
        <Skeleton variant="text" width="80px" height="20px" className="mb-2" />
        <Skeleton variant="rounded" width="100%" height="100px" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full">
        <Skeleton variant="rounded" width="100%" height="44px" />
      </div>
    </div>
  );
};

// Astrologer Settings skeleton component
export const AstrologerSettingsSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <Skeleton variant="text" width="150px" height="24px" className="mb-6" />
      
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center justify-between p-6 border rounded-lg">
            <div className="flex-1">
              <Skeleton variant="text" width="180px" height="20px" className="mb-2" />
              <Skeleton variant="text" width="250px" height="16px" />
            </div>
            <Skeleton variant="rounded" width="60px" height="32px" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Dashboard Card Skeleton
export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" width="120px" height="24px" />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton variant="text" width="80px" height="36px" className="mb-2" />
      <Skeleton variant="text" width="150px" height="16px" />
    </div>
  );
};

// List Item Skeleton
export const ListItemSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1">
            <Skeleton variant="text" width="60%" height="20px" className="mb-2" />
            <Skeleton variant="text" width="40%" height="16px" />
          </div>
          <Skeleton variant="rounded" width="80px" height="36px" />
        </div>
      ))}
    </div>
  );
};
