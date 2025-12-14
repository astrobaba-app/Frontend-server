import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  className = '',
  count = 1,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const defaultHeight = () => {
    switch (variant) {
      case 'circular':
        return width;
      case 'text':
        return '1rem';
      default:
        return '3rem';
    }
  };

  const skeletonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof (height || defaultHeight()) === 'number' 
      ? `${height || defaultHeight()}px` 
      : (height || defaultHeight()),
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`animate-pulse bg-gray-300 ${getVariantClasses()} ${className} ${
        count > 1 && index < count - 1 ? 'mb-2' : ''
      }`}
      style={skeletonStyle}
    />
  ));

  return <>{skeletons}</>;
};

export default Skeleton;
