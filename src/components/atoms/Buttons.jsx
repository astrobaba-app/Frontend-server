"use client";
import React from 'react';

const Button = ({ 
  children, 
  className = '', 
  onClick, 
  href, 
  type = 'button', 
  ...rest 
}) => {
  const BASE_CLASSES = "font-bold text-lg py-3 px-8 rounded-xl transition duration-200 ease-in-out";
  const COLOR_CLASSES = "bg-[#F0DF20] text-gray-900 hover:bg-[#ffea00] active:shadow-none";

  const finalClasses = `${BASE_CLASSES} ${COLOR_CLASSES} ${className}`;

  if (href) {
    return (
      <a 
        href={href} 
        className={finalClasses} 
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={finalClasses} 
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;