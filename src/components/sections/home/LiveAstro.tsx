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
      className="w-full px-4 md:px-56 py-8 sm:py-12 md:py-16 font-sans"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-10 px-2">
          <div className="flex-1"></div>

         <p style={{color:colors.darkGray}} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            Live Astrologer
          </p>

          <Link
            href="/astrologers"
            style={{ color: colors.gray }}
            className="hidden sm:block text-xs sm:text-sm mt-6 sm:mt-10 hover:text-gray-900 transition duration-150 whitespace-nowrap flex-1 text-right"
          >
            View All
          </Link>
        </div>

        <div className="sm:hidden flex flex-col items-center px-2">
          <div className="w-full flex justify-center">
            <div className="max-w-[320px] w-full">
              {LIVE_ASTROLOGERS.slice(0, 1).map((astro) => (
                <LiveAstrologerCard
                  key={astro.id}
                  name={astro.name}
                  imageSrc={astro.imageSrc}
                  link={astro.link}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/astrologer"
              className="px-6 py-2 rounded-full text-sm font-semibold"
              style={{
                background: colors.primeYellow,
                color: colors.white,
              }}
            >
              View More
            </Link>
          </div>
        </div>

        <div className="hidden sm:grid grid-flow-col auto-cols-[calc(50%-theme(space.2))] xs:auto-cols-[calc(33.333%-theme(space.3)*2/3)] sm:auto-cols-[calc(25%-theme(space.4)*3/4)] md:auto-cols-[calc(25%-theme(space.8)*3/4)] lg:auto-cols-[calc(25%-theme(space.10)*3/4)] gap-2 sm:gap-4 md:gap-8 lg:gap-10 overflow-x-auto pb-4 px-2 custom-scrollbar">
          {LIVE_ASTROLOGERS.map((astro) => (
            <LiveAstrologerCard
              key={astro.id}
              name={astro.name}
              imageSrc={astro.imageSrc}
              link={astro.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveAstrologerSection;
