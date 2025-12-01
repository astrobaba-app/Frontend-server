"use client";
import React from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

const ChatButton = () => {
  return (
    <Link 
      href="/chat"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Open chat"
    >
      <div className="
        w-14 h-14 md:w-16 md:h-16
        bg-[#FFD700] 
        rounded-full 
        flex items-center justify-center 
        shadow-lg 
        hover:shadow-2xl
        transition-all duration-300 
        hover:scale-110
        cursor-pointer
        animate-pulse hover:animate-none
      ">
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-gray-900" />
      </div>
      
      {/* Optional tooltip */}
      <div className="
        absolute bottom-full right-0 mb-2
        bg-gray-900 text-white text-sm
        px-3 py-1 rounded-lg
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        whitespace-nowrap
        pointer-events-none
      ">
        Chat with us
      </div>
    </Link>
  );
};

export default ChatButton;
