import React from 'react';

export const LoginFormSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-200 flex items-center justify-center p-4 sm:p-10">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        <div className="text-center mt-10 space-y-4">
          <div className="w-80 h-10 bg-gray-200 rounded animate-pulse mx-auto"></div>
          <div className="w-64 h-5 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 min-h-[400px]">
          {/* Left side - QR section */}
          <div className="bg-white p-8 flex flex-col items-center justify-center border-r border-gray-200 rounded-l-xl">
            <div className="w-48 h-48 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
            <div className="space-y-2 w-full">
              <div className="w-48 h-5 bg-gray-200 rounded animate-pulse mx-auto"></div>
              <div className="w-56 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          </div>

          {/* Right side - Form section */}
          <div className="bg-white p-8 flex flex-col justify-center rounded-r-xl space-y-6">
            <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="relative">
              <div className="w-full h-px bg-gray-200"></div>
              <div className="absolute inset-0 flex justify-center">
                <div className="w-12 h-5 bg-white flex items-center justify-center">
                  <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-48 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
