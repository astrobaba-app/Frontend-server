import React from 'react';
import Link from 'next/link';
import { ZodiacSign } from '@/constants/horoscope';

interface HoroscopeZodiacCardProps {
  sign: ZodiacSign;
}

const HoroscopeZodiacCard: React.FC<HoroscopeZodiacCardProps> = ({ sign }) => {
  return (
    <Link
      href={`/horoscope/${sign.slug}`}
      className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-[#F0DF20] hover:shadow-lg transition-all duration-300 group"
    >
      <div className="w-16 h-16 mb-2 flex items-center justify-center bg-yellow-50 rounded-lg">
        <span className="text-4xl opacity-60 group-hover:opacity-100 transition-opacity">{sign.icon}</span>
      </div>
      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{sign.name}</h3>
      <p className="text-xs text-gray-500 mt-1">{sign.dateRange}</p>
    </Link>
  );
};

export default HoroscopeZodiacCard;
