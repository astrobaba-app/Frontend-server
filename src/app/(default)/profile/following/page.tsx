"use client";
import React from "react";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import { Heart } from "lucide-react";

export default function FollowingPage() {
  return (
    <div className="w-full pb-12 transition-all duration-500">
       <Heading 
              level={2} 
              className="mb-4 text-2xl sm:text-4xl font-black text-gray-900  tracking-tighter"
            >
              My Following
            </Heading>
      
      <main className="w-full animate-in fade-in zoom-in-95 duration-700">
        <Card 
          padding="none" 
          className="overflow-hidden border-none shadow-2xl shadow-gray-200/40 rounded-[2rem] sm:rounded-[3rem]"
        >
          <div className="bg-white text-center py-16 px-6 sm:py-24 sm:px-10">
            
            {/* Animated Icon Section */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-yellow-200 blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative z-10 bg-yellow-50 p-6 rounded-full">
                <Heart 
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-[#F0DF20]" 
                  fill="#F0DF20" 
                />
              </div>
            </div>
            
           
            
            <div className=" flex justify-center  mb-8">
              <span className="text-[#a19514] font-bold text-[10px] sm:text-xs uppercase tracking-widest italic">
                Coming Soon!
              </span>
            </div>

            <p className="text-gray-500 max-w-sm mx-auto text-sm sm:text-lg leading-relaxed">
              Stay tuned! You will soon be able to follow your favorite astrologers and get notified when they're online.
            </p>
            
            {/* Decorative Dots */}
            <div className="mt-12 flex justify-center gap-2">
              <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full"></div>
              <div className="h-1.5 w-8 bg-gray-100 rounded-full"></div>
              <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}