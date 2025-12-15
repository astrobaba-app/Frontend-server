'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ZODIAC_SIGNS, COMPATIBILITY_INTRO } from '@/constants/horoscope';

export default function CompatibilityPage() {
  const searchParams = useSearchParams();
  const sign1Param = searchParams?.get('sign1');
  const sign2Param = searchParams?.get('sign2');

  const [selectedSign1, setSelectedSign1] = useState(sign1Param || '');
  const [selectedSign2, setSelectedSign2] = useState(sign2Param || '');

  const getZodiacIcon = (slug: string) => {
    const sign = ZODIAC_SIGNS.find((s) => s.slug === slug);
    return sign?.icon || '♈';
  };

  return (
    <div className="">
      {/* Hero Section */}
      <section className=" py-5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-4xl font-bold text-gray-900 mb-2">{COMPATIBILITY_INTRO.title}</p>
          <p className="text-lg text-gray-600 mb-5">{COMPATIBILITY_INTRO.subtitle}</p>

          {/* Zodiac Icon Display */}
          <div className="flex justify-center items-center gap-4 mb-5">
            <div className="w-24 h-24 bg-[#F0DF20] rounded-full flex items-center justify-center">
              <span className="text-5xl">{selectedSign1 ? getZodiacIcon(selectedSign1) : '?'}</span>
            </div>
            <span className="text-3xl text-gray-400">+</span>
            <div className="w-24 h-24 bg-[#F0DF20] rounded-full flex items-center justify-center">
              <span className="text-5xl">{selectedSign2 ? getZodiacIcon(selectedSign2) : '?'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
            <div className="prose prose-gray max-w-none">
              {COMPATIBILITY_INTRO.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4 text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Sign */}
      <section className="py-16 bg-[#FCF5CC">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Choose Your Sign</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {ZODIAC_SIGNS.map((sign) => (
              <button
                key={sign.slug}
                onClick={() => {
                  if (!selectedSign1) {
                    setSelectedSign1(sign.slug);
                  } else if (!selectedSign2) {
                    setSelectedSign2(sign.slug);
                  } else {
                    // Reset and start over
                    setSelectedSign1(sign.slug);
                    setSelectedSign2('');
                  }
                }}
                className={`flex flex-col items-center p-6 bg-white border-2 rounded-xl transition-all hover:scale-105 ${
                  selectedSign1 === sign.slug || selectedSign2 === sign.slug
                    ? 'border-[#F0DF20] shadow-lg'
                    : 'border-gray-200 hover:border-[#F0DF20]'
                }`}
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
                    selectedSign1 === sign.slug || selectedSign2 === sign.slug
                      ? 'bg-[#F0DF20]'
                      : 'bg-gray-900'
                  }`}
                >
                  <span className="text-4xl">{sign.icon}</span>
                </div>
                <p className="font-bold text-gray-900">{sign.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
