import React from 'react';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  gradient?: boolean;
}

export default function Heading({
  level = 2,
  children,
  className = '',
  align = 'left',
  gradient = false,
}: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const baseClasses = 'font-bold text-gray-900';
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  const sizeClasses = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg',
  };
  const gradientClass = gradient ? 'bg-gradient-to-r from-[#F0DF20] to-[#ffea00] bg-clip-text text-transparent' : '';

  return (
    <Tag className={`${baseClasses} ${sizeClasses[level]} ${alignClasses[align]} ${gradientClass} ${className}`}>
      {children}
    </Tag>
  );
}
