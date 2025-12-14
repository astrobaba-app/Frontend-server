'use client';
import React, { useState } from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
}

export default function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  const defaultSteps = ['Personal', 'Gender', 'Birth Date', 'Birth Time', 'Birth Place', 'Location'];
  const stepLabels = steps || defaultSteps;

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (  
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
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
                className={`h-0.5 w-8 sm:w-12 transition-all ${
                  isCompleted ? 'bg-[#F0DF20]' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
