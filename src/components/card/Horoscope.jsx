"use client";
import React from 'react';
import Button from '../atoms/Buttons'; 

const HoroscopeCard = ({ icon: Icon, title }) => (
  <div className="bg-white rounded-lg border border-[#F0DF20] p-6 flex flex-col items-center text-center">
    <div className="bg-[#FAF6EC] rounded-full p-4 mb-4 flex items-center justify-center w-24 h-24">
    
      {Icon && <Icon className="text-5xl text-[#C9A96E]" />} 
    </div>
    <h3 className="font-['Poly'] text-xl font-semibold text-gray-900">
      {title}
    </h3>
    <div className="flex justify-center ">
      
      <img src="/images/border.png" alt="Separator" className=" object-contain" /> 
    </div>
    
    <Button href="#" className="w-fit">Read More</Button> 
  </div>
);

export default HoroscopeCard;