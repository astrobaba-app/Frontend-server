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
          // Filter only online astrologers and limit to 3
          const onlineAstrologers = response.astrologers
            .filter((astrologer) => astrologer.isOnline)
            .slice(0, 3);
          setAstrologers(onlineAstrologers);
        }
      } catch (error) {
        console.error('Error fetching astrologers:', error);
        setAstrologers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  return (
    <div className="relative py-8 sm:py-12 md:py-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg.jpg')",
          opacity: 0.1,
          zIndex: -1,
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 tracking-tight">
          Our Astrologers
        </p>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 sm:mb-12 px-4">
          200+ Best Astrologers from India for Online Consultation
        </p>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading astrologers...</p>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">
              No online astrologers are currently available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 justify-items-center">
            {astrologers.map((astrologer) => (
              <OurAstrologerCard key={astrologer.id} astrologer={astrologer} />
            ))}
          </div>
        )}

        <Button
          href="/astrologer"
          variant="ghost"
          className="text-lg text-gray-600 border-b border-gray-400 hover:text-gray-900 transition duration-150 font-medium"
        >
          View More
        </Button>
      </div>
    </div>
  );
};

export default OurAstrologer;
