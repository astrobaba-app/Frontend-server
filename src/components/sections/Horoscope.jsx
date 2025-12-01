"use client";
import React from 'react';
import Button from '../atoms/Buttons'; 
import { FaStar } from 'react-icons/fa'; 
import { GiScorpion ,GiAries,GiTaurus  ,GiCancer,GiLeo,GiVirgo,GiSagittarius , GiLibra,GiCapricorn, GiAquarius,GiPisces } from "react-icons/gi";
import HoroscopeCard from '../card/Horoscope';

const Horoscope = () => {
  const services = [
    {
      icon: GiScorpion,
      title: "Scorpion",
   
    },
    {
      icon: GiAries,
      title: "Aries",
     
    },
    {
      icon: GiTaurus,
      title: "Taurus",
     
    },
    {
      icon: GiCancer ,
      title: "Cancer",
    
    },
    {
      icon: GiLeo,
      title: "Leo",
    },
    {
      icon: GiVirgo,
      title: "Virgo",
    },
    {
      icon: GiLibra,
      title: "Libra",
    },
    {
      icon: GiSagittarius,
      title: "Sagittarius",
    },

     {
      icon: GiCancer ,
      title: "Cancer",
    
    },
    {
      icon: GiCapricorn,
      title: "Capricorn",
    },
    {
      icon: GiAquarius,
      title: "Aquarius",
    },
    {
      icon: GiPisces,
      title: "  Pisces",
    },
    
  ];

  return (
    <section className="w-full py-16 font-inter "> 
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="font-['Poly'] text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Horoscope Forecasts
          </h2>
          <div className="flex justify-center">
           
            <img 
              src="/images/about_b.png" 
              alt="Separator" 
              className="h-10 w-auto object-contain" 
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <HoroscopeCard 
              key={index}
              icon={service.icon}
              title={service.title}
              
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Horoscope;