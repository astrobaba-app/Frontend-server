"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  discount: string;
  buttonText: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 1,
    image: "/images/banner1.png",
    title: "Siddh Rudrakhas",
    subtitle: "from Kedareshwar Mahadev Mandir, Kashi",
    discount: "Extra 20% OFF",
    buttonText: "SHOP NOW",
  },
  {
    id: 2,
    image: "/images/banner2.png",
    title: "Sacred Gemstones",
    subtitle: "Authentic & Certified for Your Spiritual Path",
    discount: "Extra 20% OFF",
    buttonText: "SHOP NOW",
  },
  {
    id: 3,
    image: "/images/banner3.png",
    title: "Spiritual Yantras",
    subtitle: "Authentic Yantras for Divine Blessings",
    discount: "Extra 20% OFF",
    buttonText: "SHOP NOW",
  },
];

const BannerCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? BANNER_SLIDES.length - 1 : prev - 1
    );
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const slide = BANNER_SLIDES[currentSlide];

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg">
      {/* Banner Images */}
      <div className="relative w-full h-full">
        {BANNER_SLIDES.map((bannerSlide, index) => (
          <div
            key={bannerSlide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={bannerSlide.image}
              alt={bannerSlide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

      
      </div>


      {/* Previous Button */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 cursor-pointer hover:bg-yellow-400 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 cursor-pointer hover:bg-yellow-400 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {BANNER_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-yellow-400 w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

     
    </div>
  );
};

export default BannerCarousel;
