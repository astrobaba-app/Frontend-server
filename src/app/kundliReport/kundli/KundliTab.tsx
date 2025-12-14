"use client";
import React, { useState } from "react";
import { KundliResponse } from "@/store/api/kundli";
import KundliChart from "@/components/kundli/KundliChart";
import DashaTable from "@/components/kundli/DashaTable";
import { colors } from "@/utils/colors";

interface KundliTabProps {
  kundliData: KundliResponse["kundli"];
}

interface PlanetData {
  planet: string;
  longitude: number;
  sign: string;
  sign_num: number;
  sign_degree: number;
  degrees: number;
  minutes: number;
  seconds: number;
  nakshatra: string;
  nakshatra_num: number;
  nakshatra_pada: number;
  is_retrograde: boolean;
}

const KundliTab: React.FC<KundliTabProps> = ({ kundliData }) => {
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");
  
  // Extract planetary data from the new API response structure
  const planetaryData = kundliData?.planetary || {};
  const planetaryArray: PlanetData[] = Object.values(planetaryData).filter((p): p is PlanetData => 
    typeof p === 'object' && p !== null && 'planet' in p
  );

  const getValue = (value: any) => {
    if (value === null || value === undefined || value === "" || value === "--") return "--";
    return value;
  };

  const getRetroStatus = (isRetro: boolean | null | undefined) => {
    if (isRetro === null || isRetro === undefined) return "--";
    return isRetro ? "Retro" : "Direct";
  };

  const formatDegree = (planet: PlanetData) => {
    if (!planet || planet.sign_degree === null || planet.sign_degree === undefined) return "--";
    return `${planet.sign_degree.toFixed(2)}°`;
  };

  // Get sign lord based on sign
  const getSignLord = (sign: string): string => {
    const signLords: Record<string, string> = {
      'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury',
      'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
      'Libra': 'Venus', 'Scorpio': 'Mars', 'Sagittarius': 'Jupiter',
      'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    };
    return signLords[sign] || '--';
  };

  // Get nakshatra lord
  const getNakshatraLord = (nakshatra: string): string => {
    const nakshatraLords: Record<string, string> = {
      'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun',
      'Rohini': 'Moon', 'Mrigashira': 'Mars', 'Ardra': 'Rahu',
      'Punarvasu': 'Jupiter', 'Pushya': 'Saturn', 'Ashlesha': 'Mercury',
      'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
      'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu',
      'Vishakha': 'Jupiter', 'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury',
      'Mula': 'Ketu', 'Purva Ashadha': 'Venus', 'Uttara Ashadha': 'Sun',
      'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
      'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury'
    };
    return nakshatraLords[nakshatra] || '--';
  };

  // Calculate house number based on ascendant and planet longitude
  const getHouseNumber = (planetLongitude: number): number => {
    // Get ascendant from planetary data if available
    const ascendantData = Object.values(planetaryData).find((p: any) => p?.planet === 'Ascendant');
    const ascendantLongitude = ascendantData?.longitude || 0;
    let house = Math.floor((planetLongitude - ascendantLongitude + 360) / 30) + 1;
    if (house > 12) house -= 12;
    if (house < 1) house += 12;
    return house;
  };

  const getStatusLabel = (planet: PlanetData) => {
    const planetName = planet.planet?.toLowerCase();
    const sign = planet.sign?.toLowerCase();
    
    // Check for exaltation
    if (
      (planetName === "sun" && sign === "aries") ||
      (planetName === "moon" && sign === "taurus") ||
      (planetName === "mars" && sign === "capricorn") ||
      (planetName === "mercury" && sign === "virgo") ||
      (planetName === "jupiter" && sign === "cancer") ||
      (planetName === "venus" && sign === "pisces") ||
      (planetName === "saturn" && sign === "libra")
    ) {
      return "Exalted";
    }
    
    // Check for debilitation
    if (
      (planetName === "sun" && sign === "libra") ||
      (planetName === "moon" && sign === "scorpio") ||
      (planetName === "mars" && sign === "cancer") ||
      (planetName === "mercury" && sign === "pisces") ||
      (planetName === "jupiter" && sign === "capricorn") ||
      (planetName === "venus" && sign === "virgo") ||
      (planetName === "saturn" && sign === "aries")
    ) {
      return "Debilitated";
    }
    
    // Check if planet owns the sign
    const signLord = getSignLord(planet.sign);
    if (signLord.toLowerCase() === planetName) {
      return "Own Sign";
    }
    
    // Default status
    return "Neutral";
  };

  // Check if chart data is valid
  const isValidChartData = (chartData: any) => {
    return chartData && chartData.planets && typeof chartData.planets === 'object';
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Chart Style Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden bg-white">
          <button
            onClick={() => setChartStyle("north")}
            className={`px-8 py-2 font-semibold text-sm ${
              chartStyle === "north"
                ? "bg-[#FFD900] text-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            North Indian
          </button>
          <button
            onClick={() => setChartStyle("south")}
            className={`px-8 py-2 font-semibold text-sm border-l border-gray-300 ${
              chartStyle === "south"
                ? "bg-[#FFD900] text-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            South Indian
          </button>
        </div>
      </div>

      {/* Charts Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* D1 Chart - Lagna/Ascendant */}
        <div className="">
          {isValidChartData(kundliData.charts?.D1) ? (
            <KundliChart chartData={kundliData.charts.D1} chartType="Lagna / Ascendant / Basic Birth Chart" style={chartStyle} />
          ) : (
            <>
              <p style={{color:colors.darkGray }} className="text-sm font-semibold  mb-4 text-start">
                Lagna / Ascendant / Basic Birth Chart
              </p>
              <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
                Insufficient data to display chart
              </div>
            </>
          )}
        </div>

        {/* D9 Chart - Navamsa */}
        <div className="">
          {isValidChartData(kundliData.charts?.D9) ? (
            <KundliChart chartData={kundliData.charts.D9} chartType="Navamsa" style={chartStyle} />
          ) : (
            <>
              <p style={{color:colors.darkGray }} className="text-sm font-semibold  mb-4 text-start">
                Navamsa
              </p>
              <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
                Insufficient data to display chart
              </div>
            </>
          )}
        </div>
      </div>

      {/* Planets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Planets</h2>
        </div>
        {planetaryArray.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    Planet
                  </th>
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    Sign
                  </th>
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    Sign Lord
                  </th>
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    Nakshatra
                  </th>
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    Naksh Lord
                  </th>
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    Degree
                  </th>
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    Retro(R)
                  </th>
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    Combust
                  </th>
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    Avastha
                  </th>
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    House
                  </th>
                  <th className="border border-gray-300 px-3 py-2.5 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {planetaryArray.map((planet, index) => {
                  const status = getStatusLabel(planet);
                  const signLord = getSignLord(planet.sign);
                  const nakshatraLord = getNakshatraLord(planet.nakshatra);
                  const houseNumber = getHouseNumber(planet.longitude);
                  
                  return (
                    <tr
                      key={index}
                      className="bg-white"
                    >
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        {getValue(planet.planet)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        {getValue(planet.sign)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        {signLord}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        {getValue(planet.nakshatra)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        {nakshatraLord}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        {formatDegree(planet)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        {getRetroStatus(planet.is_retrograde)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        --
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        --
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        {houseNumber}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        {status || "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No planetary data available
          </div>
        )}
      </div>

      {/* Vimshottari Dasha */}
      <DashaTable dashaData={kundliData.dasha} />
    </div>
  );
};

export default KundliTab;
