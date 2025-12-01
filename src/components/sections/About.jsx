"use client";
import React from 'react';
import Button from '../atoms/Buttons'; 

const AboutAstrologers = () => {
  return (
    <section className="w-full py-16 md:py-2 font-inter">
      <div className="max-w-7xl mx-auto px-6">

        
        <div className="text-center mb-12 md:mb-16">
          <p className="font-['Poly'] text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            About Astrologers
          </p>

          <div className="flex justify-center">
            <img 
              src="/images/about_b.png" 
              alt="Separator" 
              className="h-8 w-full object-contain" 
            />
          </div>
          <p className="text-md text-gray-700 max-w-2xl mx-auto">
            It is a long established fact that a reader will be distracted by the readable content
            of a page when looking at its layout. The point of using Lorem Ipsum .
          </p>
        </div>

      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          
          <div className="w-full h-80 md:h-96 bg-gray-300 rounded-lg shadow-md flex items-center justify-center">
            <img src="/images/astrologer_placeholder.jpg" alt="Astrologer" className="w-full h-full object-cover rounded-lg" />
          </div>

          
          <div className="flex flex-col space-y-6">
            <h3 className="font-['Poly'] text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              The Astrologer: Celestial Interpreter
            </h3>
            
            <div className="border-l-4 border-[#F0DF20] pl-4 py-2"> 
              <p className="text-sm text-gray-700">
                An astrologer studies the positions of celestial bodies (Sun, Moon,
                planets). They interpret these cosmic patterns to understand their
                influence on human affairs and life events. The practitioner creates a natal
                chart (horoscope), which maps the heavens at a birth moment. Ultimately,
                they act as an interpreter of the cosmic calendar, offering guidance and
                predictions based on these cycles
              </p>
            </div>
            
            <div className="w-fit"> 
              <Button href="#">
                Read More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAstrologers;