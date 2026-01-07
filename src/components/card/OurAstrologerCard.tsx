import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { IoChatbubblesSharp } from "react-icons/io5";

import { FaUserAstronaut } from "react-icons/fa";

import { colors } from "@/utils/colors";

import Button from "../atoms/Button"; // Assuming Button is now imported as default

// New interface based on API response structure

export interface AstrologerApiData {
  id: string;

  fullName: string;

  photo: string | null;

  skills: string[];

  languages: string[];

  yearsOfExperience: number;

  rating: string; // The API returns it as a string (e.g., "4.00")

  pricePerMinute: string; // The API returns it as a string (e.g., "0.00")

  totalConsultations: number;

  bio: string;

  isOnline: boolean;
}

// Interface for props passed to the Card (simplified for component use)

interface OurAstrologerCardProps {
  astrologer: AstrologerApiData;
}

const OurAstrologerCard: React.FC<OurAstrologerCardProps> = ({
  astrologer,
}) => {
  const {
    fullName,
    photo,
    yearsOfExperience,
    rating,
    skills,
    pricePerMinute,
    isOnline,
  } = astrologer;

  const specialties = Array.isArray(skills) ? skills : [];

  const displayRating = parseFloat(rating).toFixed(2);

  const displayPrice =
    parseFloat(pricePerMinute) > 0
      ? `₹${parseFloat(pricePerMinute).toFixed(2)}/min`
      : "Free";

  // Use photo if available, otherwise use the default icon style

  const photoStyle = photo
    ? {
        backgroundImage: `url(${photo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { background: colors.primeYellow };

  return (
    <Link href={`/astrologer/${astrologer.id}`} className="block">
      <div className="relative w-full max-w-[280px] sm:w-64 rounded-2xl shadow-lg overflow-hidden bg-white mx-auto hover:shadow-xl transition-shadow cursor-pointer">
        <div className="py-0 px-0">
          <div
            style={{
              ...photoStyle,
              backgroundSize: "contain", // Ensures image is fully visible
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            className="h-28 w-28 sm:h-40 sm:w-40 mx-auto flex flex-col items-center justify-center relative"
          >
            {/* Online Status Badge */}
            {isOnline && (
              <div
                style={{ background: colors.primeGreen }}
                className="absolute top-3 -right-8 px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full text-white"
              >
                Online
              </div>
            )}

            {/* Default Icon if no photo */}
            {!photo && (
              <FaUserAstronaut
                style={{ color: "white" }}
                /* Reduced icon size to fit smaller container */
                className="w-8 h-8 sm:w-12 sm:h-12"
              />
            )}
          </div>
        </div>

        <div className="bg-white px-3 sm:px-4 pb-3 sm:pb-4 pt-2 sm:pt-3">
          <div className="flex items-start justify-between mb-1.5">
            <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
              {fullName}
            </p>

            <div
              style={{ color: colors.primeYellow }}
              className="flex items-center gap-1 flex-shrink-0 ml-2"
            >
              <span className="text-xs sm:text-sm font-semibold">
                {displayRating}
              </span>

              <Star
                style={{ color: colors.primeYellow }}
                className="w-3 h-3 sm:w-4 sm:h-4 fill-[#FFC107]"
              />
            </div>
          </div>

          <p style={{ color: colors.gray }} className="text-xs text-start">
            {displayPrice}

            <span className="mx-1">•</span>

            <span className="font-semibold text-gray-900">
              {yearsOfExperience} Years Exp
            </span>
          </p>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 mb-3 sm:mb-4">
            {specialties.slice(0, 3).map(
              (
                topic,
                index // Show max 3 topics
              ) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-100 text-amber-700 border border-amber-200"
                >
                  {topic}
                </span>
              )
            )}
          </div>

          <Button
            variant="custom"
            size="md"
            className="w-full"
            customColors={{
              backgroundColor: colors.primeYellow,

              textColor: colors.white,
            }}
            customStyles={{
              paddingTop: "0.50rem",

              paddingBottom: "0.50rem",
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
            Chat Now
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default OurAstrologerCard;
