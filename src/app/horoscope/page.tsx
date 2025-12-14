'use client';

import React, { useState, useEffect } from 'react';
import HoroscopeZodiacCard from '@/components/card/HoroscopeZodiacCard';
import TodaysHoroscopeCard from '@/components/card/TodaysHoroscopeCard';
import { ZODIAC_SIGNS, TODAYS_HOROSCOPE_INTRO, HOROSCOPE_FAQS } from '@/constants/horoscope';
import { FaStar } from 'react-icons/fa';
import { getDailyHoroscope, ZodiacSign } from '@/store/api/horoscope';

interface HoroscopeOverview {
  slug: string;
  summary: string;
}

export default function HoroscopePage() {
  const [horoscopeOverviews, setHoroscopeOverviews] = useState<HoroscopeOverview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllHoroscopes = async () => {
      try {
        const overviews: HoroscopeOverview[] = [];
        
        // Fetch horoscope data for all zodiac signs
        for (const sign of ZODIAC_SIGNS) {
          try {
            const data = await getDailyHoroscope(sign.slug as ZodiacSign);
            const summary = 
              (data?.horoscope?.predictions as any)?.overall?.summary || 
              (data?.horoscope?.predictions as any)?.overview?.summary ||
              `Discover what the stars have in store for ${sign.name} today. Check your daily horoscope for insights on love, career, health, and more.`;
            
            overviews.push({
              slug: sign.slug,
              summary: summary,
            });
          } catch (error) {
            // Fallback description if API fails for a specific sign
            overviews.push({
              slug: sign.slug,
              summary: `Discover what the stars have in store for ${sign.name} today. Check your daily horoscope for insights on love, career, health, and more.`,
            });
          }
        }
        
        setHoroscopeOverviews(overviews);
      } catch (error) {
        console.error('Error fetching horoscopes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHoroscopes();
  }, []);

  // Helper function to get overview for a specific sign
  const getSignOverview = (slug: string): string => {
    const overview = horoscopeOverviews.find(h => h.slug === slug);
    return overview?.summary || `Discover what the stars have in store for you today.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image and Description */}
            <div className="bg-yellow-50 rounded-2xl p-8">
              <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                <FaStar className="w-48 h-48 text-yellow-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Horoscope</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your horoscope is like a helpful daily map based on your birth chart. It gives you simple predictions for your personal Zodiac sign (like Aries, Taurus, Gemini, etc.). You can quickly find out what might happen in love, work, friendships, health, and money. Reading it gives you smart ideas for the day, week, or month ahead, helping you make good choices and feel better.
              </p>
            </div>

            {/* Right: Zodiac Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{TODAYS_HOROSCOPE_INTRO.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {TODAYS_HOROSCOPE_INTRO.subtitle}
            </p>
          </div>

          {/* Horoscope Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              // Loading state
              ZODIAC_SIGNS.map((sign) => (
                <div key={sign.slug} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))
            ) : (
              ZODIAC_SIGNS.map((sign) => (
                <TodaysHoroscopeCard
                  key={sign.slug}
                  sign={sign.name}
                  signSlug={sign.slug}
                  dateRange={sign.dateRange}
                  description={getSignOverview(sign.slug)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">FAQs on Today's Horoscope</h2>
          <div className="space-y-4">
            {HOROSCOPE_FAQS.map((faq, index) => (
              <details
                key={index}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 pr-8">{faq.question}</h3>
                  <span className="text-2xl text-gray-500 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
