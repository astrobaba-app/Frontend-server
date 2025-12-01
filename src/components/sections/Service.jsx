"use client";
import React from 'react';
import Image from 'next/image';
import { Sun, BookOpen, Star } from 'lucide-react';

const featureServices = [
  {
    icon: Sun,
    title: "Daily Horoscope",
    href: "/daily-horoscope",
    color: "text-gray-900",
  },
  {
    icon: '/images/kundli.png', 
    title: "Free Kundli",
    href: "/free-kundli",
    color: "text-gray-900",
  },
  
  {
    icon: '/images/scan_face.png', 
    title: "Face reading",
    href: "/face-reading",
    color: "text-gray-900",
  },
  {
    icon: BookOpen, 
    title: "Astrology Blog",
    href: "/astrology-blog",
    color: "text-gray-900",
  },
];

const FeatureCard = ({ icon, title, href, color }) => {
  
  const isImage = typeof icon === 'string';
  const IconComponent = isImage ? null : icon;

  return (
    <a 
      href={href} 
      className="flex flex-col items-center text-center group p-4 hover:shadow-lg rounded-xl transition-all duration-300"
    >
     
      <div className={`
          w-24 h-24 md:w-20 md:h-20
          bg-[#FFD700] 
          rounded-full 
          flex items-center justify-center 
          mb-4 md:mb-6 
          shadow-md 
          transition-transform duration-300 group-hover:scale-105
      `}>
        {isImage ? (
          
          <Image 
            src={icon} 
            alt={title} 
            width={40}
            height={40}
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
        ) : (
          // RENDER LUCIDE ICON COMPONENT
          <IconComponent className={`w-10 h-10 md:w-12 md:h-12 ${color}`} />
        )}
      </div>
      
      <h3 className="text-lg md:text-xl font-medium text-gray-800">
        {title}
      </h3>
    </a>
  );
};

const FeatureServiceSection = () => {
  return (
    <section className="w-full py-12 md:py-16 font-inter">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-10">
           <p className="font-['Poly'] text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
           Our Services
          </p>

          <div className="flex justify-center">
            <img 
              src="/images/about_b.png" 
              alt="Separator" 
              className="h-8 w-full object-contain" 
            />
          </div>
        </div>
        

        {/* Feature Grid: 4 columns for the 4 services */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {featureServices.map((service, index) => (
            <FeatureCard 
              key={index}
              icon={service.icon}
              title={service.title}
              href={service.href}
              color={service.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureServiceSection;