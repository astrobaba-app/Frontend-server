'use client';
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
}

export default function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  const defaultSteps = ['Personal', 'Gender', 'Birth Date', 'Birth Time', 'Birth Place', 'Location'];
  const stepLabels = steps || defaultSteps;

  return (
    <div className="w-full mb-6 sm:mb-8 px-1">
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (  
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all ${
                  isCompleted
                    ? 'bg-[#F0DF20] text-gray-900'
                    : isCurrent
                    ? 'bg-[#F0DF20] text-gray-900'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              {stepLabels[index] && (
                <span className="text-xs mt-1 text-gray-600 hidden sm:block">
                  {stepLabels[index]}
                </span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`h-0.5 flex-1 min-w-3 sm:min-w-6 transition-all ${
                  isCompleted ? 'bg-[#F0DF20]' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
      </div>
    </div>
  );
}
