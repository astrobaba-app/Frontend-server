"use client";

import React from "react";
import { IoChatbubblesSharp } from "react-icons/io5";
import { FaStar, FaPhoneAlt } from "react-icons/fa";
import Button from "@/components/atoms/Button";
import { colors } from "@/utils/colors";
import Link from "next/link";
const customGradientStyle = {
  background:
    "linear-gradient(to bottom right, #FCFBF2, #FCF3C4, #FCF5CC, #FFF6E5, #FBFAF8)",
};
const Hero: React.FC = () => {
  return (
    <section
      style={customGradientStyle}
      className="relative w-full text-gray-900 px-4 py-8 sm:py-12 md:py-16 md:px-8 lg:px-56 lg:py-32 overflow-hidden min-h-[450px] sm:min-h-[500px] md:min-h-[600px]"
    >
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <p className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tighter">
            Get Instant Answer to your
            <span style={{ color: colors.primeYellow }}>
              {" "}
              Life's Biggest Questions
            </span>
          </p>

          <p
            style={{ color: colors.gray }}
            className="text-sm sm:text-base md:text-lg max-w-lg"
          >
            Connect with verified astrologers in minutes. Get personalized
            guidance on career, love, health & wealth - anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4">
            <Button
              href="/astrologer?mode=chat"
              variant="custom"
              size="md"
              className="shadow-xl"
              customColors={{
                backgroundColor: colors.primeYellow,
                textColor: colors.white,
              }}
              customStyles={{
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                }}
                icon={
                  <span
                    role="img"
                    aria-label="chat"
                    className="text-2xl text-white"
                  >
                    <IoChatbubblesSharp />
                  </span>
                }
              >
                Chat With Astrologer
              </Button>
          
            <Button
              href="/profile/kundli"
              variant="custom"
              size="md"
              className="shadow-lg"
              customColors={{
                backgroundColor: colors.white,
                textColor: colors.darkGray,
              }}
              customStyles={{
                border: `0.5px solid ${colors.gray}`,
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
              }}
              icon={
                <span role="img" aria-label="star" className="">
                  <FaStar />
                </span>
              }
            >
              Get Free Kundli
            </Button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end relative mt-6 lg:mt-0">
          <img
            src="/images/hero.png"
            alt="An open, illuminated book with a zodiac wheel"
            className="w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain rounded-xl shadow-2xl"
            style={{ filter: "brightness(1.1)" }}
          />

          <div
            className="hidden md:flex absolute cursor-pointer py-1.5 sm:py-2 pl-1.5 sm:pl-2 pr-3 sm:pr-4 bg-white rounded-lg sm:rounded-xl shadow-xl items-center text-xs sm:text-sm font-semibold text-gray-900 
            transition duration-300 ease-in-out hover:-translate-y-2 "
            style={{
              bottom: "-5%",
              left: "5%",
              transform: "translate(-50%, 0)",
            }}
          >
            <div style={{background:colors.primeYellow}} className=" rounded-full p-1.5 sm:p-2  items-center justify-center mr-1.5 sm:mr-2 shadow-md">
              <FaPhoneAlt className="text-white text-sm sm:text-lg" />
            </div>
            <div>
              <p className="font-bold text-xs leading-none">1000+</p>
              <p className="text-gray-500 text-[9px] sm:text-[10px] whitespace-nowrap">
                Consultations Today
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
