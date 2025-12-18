"use client";

import LiveAstrologerCard from "@/components/card/LiveAstrologerCard";

import { LIVE_ASTROLOGERS } from "@/constants/home";

import { colors } from "@/utils/colors";

import Link from "next/link";

import React from "react";

const LiveAstrologerSection: React.FC = () => {
  return (
    <section
      style={{ background: colors.offYellow }}
      className="w-full py-10 sm:py-16 md:py-20 font-sans"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}

        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 md:mb-12 gap-4">
          <div className="hidden sm:block flex-1"></div>

          <div className="flex-1 text-center">
            <h2
              style={{ color: colors.darkGray }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
            >
              Live Astrologers
            </h2>

            <div
              className="h-1 w-16 md:w-24 mx-auto mt-2 rounded-full"
              style={{ background: colors.primeYellow }}
            ></div>
          </div>

          <div className="flex-1 text-right hidden sm:block">
            <Link
              href="/astrologers"
              style={{ color: colors.gray }}
              className="text-sm font-semibold hover:text-black transition-colors"
            >
              View All &rarr;
            </Link>
          </div>
        </div>

        {/* Mobile & Tablet Carousel */}

        <div className="sm:hidden">
          <div
            /* 'box-content' removes border-box behavior by setting box-sizing: content-box.

               Decreased gap to 'gap-1' for maximum tightness.

            */

            className="flex overflow-x-auto gap-1 pb-8 snap-x snap-mandatory no-scrollbar px-4 box-content"
          >
            {LIVE_ASTROLOGERS.map((astro) => (
              <div
                key={astro.id}
                className="min-w-[90%] snap-center flex justify-center"
              >
                <div className="w-full max-w-[300px]">
                  <LiveAstrologerCard
                    name={astro.name}
                    imageSrc={astro.imageSrc}
                    link={astro.link}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <Link
              href="/astrologers"
              className="px-8 py-3 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform"
              style={{
                background: colors.primeYellow,

                color: colors.white,
              }}
            >
              View All Experts
            </Link>
          </div>
        </div>

        {/* Desktop Grid */}

        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 md:gap-4">
          {LIVE_ASTROLOGERS.map((astro) => (
            <div
              key={astro.id}
              className="hover:-translate-y-2 transition-transform duration-300"
            >
              <LiveAstrologerCard
                name={astro.name}
                imageSrc={astro.imageSrc}
                link={astro.link}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        /* Forces removal of border-box on mobile if global styles are interfering */

        @media (max-width: 639px) {
          .mobile-content-box {
            box-sizing: content-box !important;
          }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;

          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default LiveAstrologerSection;
