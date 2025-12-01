"use client";
import React from 'react';
import Button from '../atoms/Buttons';

const Hero = () => {
    return (
        <section className="relative w-full bg-gray-50 text-gray-900 px-4 md:px-20 py-16 md:py-24 overflow-hidden">

            <div className="absolute inset-0 z-0 opacity-15">
                <img
                    src="/images/hero_bg.png"
                    alt="Zodiac Background Pattern"
                    className="w-full h-full object-cover object-center"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              
                <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
                    <p className="text-center font-serif text-4xl md:text-6xl font-extrabold text-[#B8860B] leading-tight">
                        UNPACK THE MYSTERIES OF THE UNIVERSE !
                    </p>
                    <p className="text-base md:text-lg text-center text-gray-700 max-w-md">
                        Astrologers interpret the movements of the Sun, Moon, and planets to decode their
                        influence on your life. Unlock the map of your cosmic potential and find clarity through your
                        personal birth chart.
                    </p>
                    
                    <Button href="#">
                        Read More
                    </Button>
                </div>

               
                <div className="flex justify-center lg:justify-end">
                    <img
                        src="/images/hero.png"
                        alt="Zodiac Wheel"
                        className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;