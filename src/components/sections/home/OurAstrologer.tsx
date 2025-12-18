"use client";

import React, { useState, useEffect } from "react";

import OurAstrologerCard, {
  AstrologerApiData,
} from "@/components/card/OurAstrologerCard";

import Button from "@/components/atoms/Button";

import { getAllAstrologers } from "@/store/api/general/astrologer";

const OurAstrologer: React.FC = () => {
  const [astrologers, setAstrologers] = useState<AstrologerApiData[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);

        const response = await getAllAstrologers();

        if (response.success && response.astrologers) {
          const onlineAstrologers = response.astrologers

            .filter((astrologer) => astrologer.isOnline)

            .slice(0, 8); // Increased slice for better desktop filling

          setAstrologers(onlineAstrologers);
        }
      } catch (error) {
        console.error("Error fetching astrologers:", error);

        setAstrologers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  return (
    <div className="relative py-12 sm:py-20 md:py-24 overflow-hidden">
      {/* Background with subtle parallax-like feel */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg.jpg')",

          opacity: 0.05,

          zIndex: -1,
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header Section */}

        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
            Our Astrologers
          </h2>

          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Connect with 200+ of India's most trusted experts for instant online
            consultations and guidance.
          </p>

          
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>

            <p className="text-gray-500 font-medium">Finding best experts...</p>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 italic">
              No online astrologers are currently available.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View: Tight Snap Carousel */}

            <div className="sm:hidden">
              <div className="flex overflow-x-auto gap-2 pb-10 snap-x snap-mandatory no-scrollbar px-4 box-content">
                {astrologers.map((astrologer) => (
                  <div
                    key={astrologer.id}
                    className="min-w-[85%] snap-center flex justify-center"
                  >
                    <div className="w-full transform transition-all duration-300 active:scale-95">
                      <OurAstrologerCard astrologer={astrologer} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/Tablet View: Responsive Grid */}

            <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
              {astrologers.map((astrologer) => (
                <div
                  key={astrologer.id}
                  className="hover:-translate-y-2 transition-all duration-300"
                >
                  <OurAstrologerCard astrologer={astrologer} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Action Button */}

        <div className="text-center">
          <Button
            href="/astrologer"
            variant="ghost"
            className="group relative text-lg text-gray-700 font-bold px-8 py-2 transition-all"
          >
            <span>View All Experts</span>

            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500"></span>
          </Button>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;

          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default OurAstrologer;
