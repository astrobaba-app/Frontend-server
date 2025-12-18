'use client';

import React, { useState, useEffect } from 'react';
import HoroscopeZodiacCard from '@/components/card/HoroscopeZodiacCard';
import TodaysHoroscopeCard from '@/components/card/TodaysHoroscopeCard';
import { ZODIAC_SIGNS, TODAYS_HOROSCOPE_INTRO, HOROSCOPE_FAQS } from '@/constants/horoscope';
import { getDailyHoroscope, ZodiacSign } from '@/store/api/horoscope';

interface HoroscopeOverview {
  slug: string;
  summary: string;
  dateDisplay: string;
}

export default function HoroscopePage() {
  const [horoscopeOverviews, setHoroscopeOverviews] = useState<HoroscopeOverview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllHoroscopes = async () => {
      try {
        // Use Promise.all for faster parallel fetching instead of a for-loop
        const promises = ZODIAC_SIGNS.map(async (sign) => {
          try {
            const data = await getDailyHoroscope(sign.slug as ZodiacSign);
            const h = data?.horoscope;

            // Mapping the dynamic response structure
            const summary = 
              h?.ai_enhanced?.overview || 
              h?.predictions?.overall?.summary ||
              `Discover what the stars have in store for ${sign.name} today.`;
            
            return {
              slug: sign.slug,
              summary: summary,
              dateDisplay: h ? `${h.day}, ${h.date}` : "Today",
            };
          } catch (error) {
            return {
              slug: sign.slug,
              summary: `Check your ${sign.name} daily horoscope for insights on love, career, and health.`,
              dateDisplay: "Today",
            };
          }
        });

        const results = await Promise.all(promises);
        setHoroscopeOverviews(results);
      } catch (error) {
        console.error('Error fetching horoscopes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHoroscopes();
  }, []);

  // Helper function to get data for a specific sign
  const getSignData = (slug: string) => {
    return horoscopeOverviews.find(h => h.slug === slug);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Hero Section */}
      <section className="bg-white py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Background Image and Description */}
            <div className="bg-yellow-50 rounded-2xl p-3 md:p-8">
              <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden shadow-inner">
                <img 
                  src="/images/bg.jpg" 
                  alt="Zodiac Background" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 md:mb-4">Daily Horoscope</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your horoscope is like a helpful daily map based on your birth chart. It gives you simple predictions for your personal Zodiac sign. Reading it gives you smart ideas for the day, helping you make good choices and feel better.
              </p>
            </div>

            {/* Right: Zodiac Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ZODIAC_SIGNS.map((sign) => (
                <HoroscopeZodiacCard key={sign.slug} sign={sign} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Today's Horoscope Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 md:mb-4">{TODAYS_HOROSCOPE_INTRO.title}</h2>
            <p className="text-sm md:text-lg text-gray-600 max-w-3xl mx-auto">
              {TODAYS_HOROSCOPE_INTRO.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              // Skeleton Loading State
              ZODIAC_SIGNS.map((sign) => (
                <div key={sign.slug} className="bg-white rounded-lg p-6 shadow-md animate-pulse border border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))
            ) : (
              ZODIAC_SIGNS.map((sign) => {
                const dynamicData = getSignData(sign.slug);
                return (
                  <TodaysHoroscopeCard
                    key={sign.slug}
                    sign={sign.name}
                    signSlug={sign.slug}
                    // Uses dynamic date from API, falls back to constant dateRange if API is slow
                    dateRange={dynamicData?.dateDisplay || sign.dateRange}
                    description={dynamicData?.summary || ""}
                  />
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 text-center mb-12">FAQs on Today's Horoscope</h2>
          <div className="space-y-4">
            {HOROSCOPE_FAQS.map((faq, index) => (
              <details
                key={index}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
              >
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 list-none">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-8">{faq.question}</h3>
                  <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 animate-fadeIn">
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}