"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors } from "@/utils/colors";
import { type KundliMatchingData } from "@/store/api/kundlimatiching";

export default function BasicDetailsPage() {
  const router = useRouter();
  const [matchingData, setMatchingData] = useState<KundliMatchingData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("kundliMatchingResult");
    if (storedData) {
      setMatchingData(JSON.parse(storedData));
    } else {
      router.push("/kundli-matching");
    }
  }, [router]);

  if (!matchingData) {
    return null;
  }

  const compatibilityCards = [
    {
      title: "Compatibility (Varna)",
      score: matchingData.ashtakootDetails?.kutas?.varna?.points ?? 0,
      maxScore: matchingData.ashtakootDetails?.kutas?.varna?.max_points ?? 0,
      description:
        matchingData.ashtakootDetails?.kutas?.varna?.enhanced_description ||
        matchingData.ashtakootDetails?.kutas?.varna?.description ||
        "--",
      bgColor: "#D3D3D3",
    },
    {
      title: "Love (Bhakut)",
      score: matchingData.ashtakootDetails?.kutas?.bhakoot?.points ?? 0,
      maxScore: matchingData.ashtakootDetails?.kutas?.bhakoot?.max_points ?? 0,
      description:
        matchingData.ashtakootDetails?.kutas?.bhakoot?.enhanced_description ||
        matchingData.ashtakootDetails?.kutas?.bhakoot?.description ||
        "--",
      bgColor: "#FCE4EC",
    },
    {
      title: "Mental Compatibility (Maitri)",
      score: matchingData.ashtakootDetails?.kutas?.graha_maitri?.points ?? 0,
      maxScore: matchingData.ashtakootDetails?.kutas?.graha_maitri?.max_points ?? 0,
      description:
        matchingData.ashtakootDetails?.kutas?.graha_maitri?.enhanced_description ||
        matchingData.ashtakootDetails?.kutas?.graha_maitri?.description ||
        "--",
      bgColor: "#FFF3E0",
    },
    {
      title: "Temperament (Gana)",
      score: matchingData.ashtakootDetails?.kutas?.gana?.points ?? 0,
      maxScore: matchingData.ashtakootDetails?.kutas?.gana?.max_points ?? 0,
      description:
        matchingData.ashtakootDetails?.kutas?.gana?.enhanced_description ||
        matchingData.ashtakootDetails?.kutas?.gana?.description ||
        "--",
      bgColor: "#F3E5F5",
    },
    {
      title: "Health (Nadi)",
      score: matchingData.ashtakootDetails?.kutas?.nadi?.points ?? 0,
      maxScore: matchingData.ashtakootDetails?.kutas?.nadi?.max_points ?? 0,
      description:
        matchingData.ashtakootDetails?.kutas?.nadi?.enhanced_description ||
        matchingData.ashtakootDetails?.kutas?.nadi?.description ||
        "--",
      bgColor: "#E0F7FA",
    },
    {
      title: "Dominance (Vashya)",
      score: matchingData.ashtakootDetails?.kutas?.vashya?.points ?? 0,
      maxScore: matchingData.ashtakootDetails?.kutas?.vashya?.max_points ?? 0,
      description:
        matchingData.ashtakootDetails?.kutas?.vashya?.enhanced_description ||
        matchingData.ashtakootDetails?.kutas?.vashya?.description ||
        "--",
      bgColor: "#E8EAF6",
    },
    {
      title: "Destiny (Tara)",
      score: matchingData.ashtakootDetails?.kutas?.tara?.points ?? 0,
      maxScore: matchingData.ashtakootDetails?.kutas?.tara?.max_points ?? 0,
      description:
        matchingData.ashtakootDetails?.kutas?.tara?.enhanced_description ||
        matchingData.ashtakootDetails?.kutas?.tara?.description ||
        "--",
      bgColor: "#FFF9C4",
    },
    {
      title: "Physical Compatibility (Yoni)",
      score: matchingData.ashtakootDetails?.kutas?.yoni?.points ?? 0,
      maxScore: matchingData.ashtakootDetails?.kutas?.yoni?.max_points ?? 0,
      description:
        matchingData.ashtakootDetails?.kutas?.yoni?.enhanced_description ||
        matchingData.ashtakootDetails?.kutas?.yoni?.description ||
        "--",
      bgColor: "#E0F2F1",
    },
  ];

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return "#4CAF50";
    if (percentage >= 40) return "#FFC107";
    return "#F44336";
  };

  const scorePercentage =
    (matchingData.ashtakootDetails?.total_points ?? 0) / (matchingData.ashtakootDetails?.max_points ?? 1) * 100;

  return (
  <>
  {/* Compatibility Score Gauge */}
  <div className="max-w-md mx-auto mb-8 border-2 border-gray-200 rounded-2xl p-8">
    <h2 className="text-2xl font-bold text-center mb-6" style={{ color: colors.black }}>
      Compatibility Score
    </h2>
    <div className="relative w-64 h-32 mx-auto mb-4">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <defs>
          {/* Define a gradient for the score path */}
          <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {/* The colors are set to match the image: Red -> Orange -> Green */}
            <stop offset="0%" style={{ stopColor: '#db3f3f' }} />
            <stop offset="35%" style={{ stopColor: '#f7931e' }} />
            <stop offset="100%" style={{ stopColor: '#5cb85c' }} />
          </linearGradient>
        </defs>

        {/* Background Path (Light Gray) */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="20"
          strokeLinecap="round"
        />
        
        {/* Foreground Path (Gradient to match image) - use the gradient ID */}
        {/* We use stroke="url(#score-gradient)" to apply the three-color look */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#score-gradient)" 
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray="251.2 0" /* Make it a full segment */
        />

        {/* The functional path that uses score percentage is still needed for actual movement,
            but we will overlay the gradient look. For static image reproduction, this one is closer: */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={getScoreColor(scorePercentage)}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${(scorePercentage / 100) * 251.2} 251.2`}
        />

        {/* Needle Line */}
        <line
          x1="100"
          y1="100"
          x2={100 + 60 * Math.cos(((180 - scorePercentage * 1.8) * Math.PI) / 180)}
          y2={100 - 60 * Math.sin(((180 - scorePercentage * 1.8) * Math.PI) / 180)}
          stroke={colors.black}
          strokeWidth="2"
        />
        {/* Pivot Circle */}
        <circle cx="100" cy="100" r="5" fill={colors.black} />
      </svg>
    </div>
    <p className="text-center text-2xl font-bold" style={{ color: colors.black }}>
      {matchingData.ashtakootDetails?.total_points ?? 0}/{matchingData.ashtakootDetails?.max_points ?? 0}
    </p>
  </div>

  {/* Compatibility Cards - Each in its own full-width row */}
  <div className="flex flex-col gap-4 mb-12">
    {compatibilityCards.map((card, index) => (
      <div key={index} className="rounded-xl p-4 shadow-md w-full" style={{ backgroundColor: card.bgColor || '#f7f7f7' }}>
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
            style={{ backgroundColor: colors.white, color: colors.black }}
          >
            {card.score ?? 0}/{card.maxScore ?? 0}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1" style={{ color: colors.black }}>
              {card.title}
            </h3>
            <p className="text-sm text-gray-700">
              {card.description || "--"}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Details Tables - Side by side */}
  <div className="grid md:grid-cols-2 gap-8 mb-12">
    <div>
      <h3 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
        Boy's Details
      </h3>
      <div className="rounded-xl overflow-hidden border border-gray-300">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-300" style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Name
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.boyName || "--"}
              </td>
            </tr>
            <tr className="border-b border-gray-300" style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Birth Date
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.boyDateOfBirth 
                  ? new Date(matchingData.boyDateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\s/g, ' ')
                  : "--"}
              </td>
            </tr>
            <tr className="border-b border-gray-300" style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Birth Time
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.boyTimeOfBirth || "--"}
              </td>
            </tr>
            <tr className="border-b border-gray-300" style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Birth Place
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.boyPlaceOfBirth || "--"}
              </td>
            </tr>
            <tr className="border-b border-gray-300" style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Janam Rashi
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.ashtakootDetails?.male_moon_sign || "--"}
              </td>
            </tr>
            <tr style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Rashi Lord
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.ashtakootDetails?.kutas?.graha_maitri?.male_lord || "--"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h3 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
        Girl's Details
      </h3>
      <div className="rounded-xl overflow-hidden border border-gray-300">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-300" style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Name
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.girlName || "--"}
              </td>
            </tr>
            <tr className="border-b border-gray-300" style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Birth Date
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.girlDateOfBirth 
                  ? new Date(matchingData.girlDateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\s/g, ' ')
                  : "--"}
              </td>
            </tr>
            <tr className="border-b border-gray-300" style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Birth Time
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.girlTimeOfBirth || "--"}
              </td>
            </tr>
            <tr className="border-b border-gray-300" style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Birth Place
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.girlPlaceOfBirth || "--"}
              </td>
            </tr>
            <tr className="border-b border-gray-300" style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Janam Rashi
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.ashtakootDetails?.female_moon_sign || "--"}
              </td>
            </tr>
            <tr style={{ backgroundColor: colors.creamyYellow || '#fffbee' }}>
              <td className="py-3 px-4 font-semibold" style={{ color: colors.darkGray }}>
                Rashi Lord
              </td>
              <td className="py-3 px-4 text-right" style={{ color: colors.black }}>
                {matchingData.ashtakootDetails?.kutas?.graha_maitri?.female_lord || "--"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {/* Additional Text Section - Manglik check */}
  <div className="max-w-4xl mx-auto rounded-xl p-4 bg-yellow-100 border border-yellow-300 text-sm text-gray-700 font-medium">
    <span className="font-bold text-gray-900">TALK WITH ASTROLOGER:</span> {matchingData.conclusion || "Please consult with an astrologer for detailed analysis."}
  </div>
</>
      );
    }
