'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../../atoms/Button';
import { BANNER_SLIDES } from '@/constants/home';

const AstrologyBannerSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = BANNER_SLIDES.length;
  const slideInterval = 5000;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, slideInterval);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const currentSlide = BANNER_SLIDES[activeIndex];

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-6 sm:py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden min-h-[280px] sm:min-h-[300px] md:min-h-80">
          <div className="absolute top-0 left-0 bottom-0 w-[40%] sm:w-full md:w-[45%] overflow-hidden">
            <div className="absolute inset-0 bg-[#F0DF20] rounded-r-full"></div>
          </div>

          <div className="absolute top-0 left-0 bottom-0 w-[40%] sm:w-full md:w-[45%] flex items-center justify-center z-10">
            <div className="relative w-full h-full max-w-[180px] sm:max-w-[280px] md:max-w-[320px]">
              <Image
                src={currentSlide.imagePath}
                alt="Astrologer"
                fill
                className="object-contain object-bottom"
                key={activeIndex}
                priority={true}
                sizes="(max-width: 640px) 180px, (max-width: 768px) 280px, 320px"
              />
            </div>
          </div>

          <div className="relative z-20 flex items-center justify-end min-h-[280px] sm:min-h-[300px] md:min-h-80">
            <div className="w-[60%] sm:w-full md:w-[55%] px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-12 text-left">
              <div key={activeIndex} className="transition-opacity duration-700 ease-in-out">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight mb-2 sm:mb-3">
                  {currentSlide.question}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6">{currentSlide.subtext}</p>

                <Button>Chat Now</Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center space-x-1.5 sm:space-x-2 z-30">
            {BANNER_SLIDES.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-[#F0DF20] w-5 sm:w-6' : 'bg-gray-400 hover:bg-gray-500'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrologyBannerSlider;
