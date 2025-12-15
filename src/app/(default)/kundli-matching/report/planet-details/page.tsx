"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors } from "@/utils/colors";
import { type KundliMatchingData } from "@/store/api/kundlimatiching";

export default function PlanetDetailsPage() {
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

  // Define planets structure
  const planets = [
    { symbol: "☉", name: "SUN", color: "#FFA500" },
    { symbol: "☽", name: "MOON", color: "#F0E68C" },
    { symbol: "♂", name: "MARS", color: "#FF0000" },
    { symbol: "☿", name: "MERCURY", color: "#FFA500" },
    { symbol: "♃", name: "JUPITER", color: "#FFB6C1" },
    { symbol: "♀", name: "VENUS", color: "#FF69B4" },
    { symbol: "♄", name: "SATURN", color: "#FFD700" },
    { symbol: "☊", name: "RAHU", color: "#90EE90" },
    { symbol: "☋", name: "KETU", color: "#D3D3D3" },
    { symbol: "⊕", name: "ASCENDANT", color: "#FFD700" },
  ];

  // Get planet data from matchingData (if available)
  const boyPlanetData = (matchingData as any)?.boyPlanetDetails || [];
  const girlPlanetData = (matchingData as any)?.girlPlanetDetails || [];

  return (
    <>
      {/* Boy's Planet Details */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
          Boy's Planet Details
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-300">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: colors.primeYellow }}>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Symbols
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Planets
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Sign
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Sign Lord
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Degree
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Nakshatra
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Nakshatra Lord
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  House
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Planet Avastha
                </th>
              </tr>
            </thead>
            <tbody>
              {planets.map((planet, index) => {
                const planetInfo = boyPlanetData.find((p: any) => p?.name?.toUpperCase() === planet.name) || {};
                return (
                  <tr
                    key={index}
                    className="border-b border-gray-300"
                    style={{ backgroundColor: index % 2 === 0 ? colors.white : colors.offYellow }}
                  >
                    <td className="py-3 px-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: planet.color }}
                      >
                        {planet.symbol}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold" style={{ color: "blue" }}>
                      {planet.name}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.sign || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.signLord || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.degree || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.nakshatra || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.nakshatraLord || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.house || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.avastha || "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Girl's Planet Details */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
          Girl's Planet Details
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-300">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: colors.primeYellow }}>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Symbols
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Planets
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Sign
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Sign Lord
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Degree
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Nakshatra
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Nakshatra Lord
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  House
                </th>
                <th className="py-3 px-4 text-left font-bold" style={{ color: colors.black }}>
                  Planet Avastha
                </th>
              </tr>
            </thead>
            <tbody>
              {planets.map((planet, index) => {
                const planetInfo = girlPlanetData.find((p: any) => p?.name?.toUpperCase() === planet.name) || {};
                return (
                  <tr
                    key={index}
                    className="border-b border-gray-300"
                    style={{ backgroundColor: index % 2 === 0 ? colors.white : colors.offYellow }}
                  >
                    <td className="py-3 px-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: planet.color }}
                      >
                        {planet.symbol}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold" style={{ color: "blue" }}>
                      {planet.name}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.sign || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.signLord || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.degree || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.nakshatra || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.nakshatraLord || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.house || "--"}
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.black }}>
                      {planetInfo.avastha || "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
