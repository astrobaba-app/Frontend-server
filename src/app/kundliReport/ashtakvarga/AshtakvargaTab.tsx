"use client";
import React from "react";
import { KundliResponse } from "@/store/api/kundli";

interface AshtakvargaTabProps {
  kundliData: KundliResponse["kundli"];
}

interface AshtakvargaChartProps {
  title: string;
  data?: number[]; // Array of 12 house values
}

const AshtakvargaChart: React.FC<AshtakvargaChartProps> = ({ title, data }) => {
  // Get house values or default to "--"
  const getHouseValue = (index: number): string => {
    if (!data || data[index] === undefined || data[index] === null) return "--";
    return data[index].toString();
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">{title}</h3>
      <div className="">
        {/* Square chart with 12 sections - exact match to reference image */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background - cream/beige color */}
          <rect x="0" y="0" width="200" height="200" fill="#F5F5DC" />
          
          {/* Outer square border */}
          <rect x="0" y="0" width="200" height="200" fill="none" stroke="#999" strokeWidth="2" />
          
          {/* First set: Diagonal lines from corner to corner (X shape) */}
          <line x1="0" y1="0" x2="200" y2="200" stroke="#999" strokeWidth="1.5" />
          <line x1="200" y1="0" x2="0" y2="200" stroke="#999" strokeWidth="1.5" />
          
          {/* Second set: Diamond/rotated square with vertices at edge midpoints */}
          {/* Top vertex (100, 0) to Right vertex (200, 100) */}
          <line x1="100" y1="0" x2="200" y2="100" stroke="#999" strokeWidth="1.5" />
          {/* Right vertex (200, 100) to Bottom vertex (100, 200) */}
          <line x1="200" y1="100" x2="100" y2="200" stroke="#999" strokeWidth="1.5" />
          {/* Bottom vertex (100, 200) to Left vertex (0, 100) */}
          <line x1="100" y1="200" x2="0" y2="100" stroke="#999" strokeWidth="1.5" />
          {/* Left vertex (0, 100) to Top vertex (100, 0) */}
          <line x1="0" y1="100" x2="100" y2="0" stroke="#999" strokeWidth="1.5" />
          <text x="50" y="30" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(11)}</text>
          
          {/* Top-right triangle (House 1) */}
          <text x="150" y="30" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(0)}</text>

          {/* Upper-middle section - 3 values */}
          {/* Left triangle (House 11) */}
          <text x="30" y="70" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(10)}</text>
          
          {/* Center diamond (House 2) */}
          <text x="100" y="60" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(1)}</text>
          
          {/* Right triangle (House 3) */}
          <text x="170" y="70" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(2)}</text>

          {/* Middle section - 2 values */}
          {/* Left side (House 10) */}
          <text x="50" y="100" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(9)}</text>
          
          {/* Right side (House 4) */}
          <text x="150" y="100" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(3)}</text>

          {/* Lower-middle section - 3 values */}
          {/* Left triangle (House 9) */}
          <text x="30" y="130" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(8)}</text>
          
          {/* Center diamond (House 5) */}
          <text x="100" y="140" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(4)}</text>
          
          {/* Right triangle (House 6) */}
          <text x="170" y="130" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(5)}</text>

          {/* Bottom section - 2 values */}
          {/* Bottom-left triangle (House 8) */}
          <text x="50" y="170" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(7)}</text>
          
          {/* Bottom-right triangle (House 7) */}
          <text x="150" y="170" className="text-base font-medium" fill="#333" textAnchor="middle" dominantBaseline="middle">{getHouseValue(6)}</text>
        </svg>
      </div>
    </div>
  );
};

const AshtakvargaTab: React.FC<AshtakvargaTabProps> = ({ kundliData }) => {
  // Extract ashtakvarga data from API response if available
  // Since the API response doesn't include ashtakvarga field, we check if it exists
  const ashtakvargaData = (kundliData as any)?.ashtakvarga;

  // Planets to display - matching the image order
  const planets = [
    { key: "sav", label: "Sav" },
    { key: "asc", label: "Asc" },
    { key: "jupiter", label: "Jupiter" },
    { key: "mars", label: "Mars" },
    { key: "mercury", label: "Mercury" },
    { key: "moon", label: "Moon" },
    { key: "saturn", label: "Saturn" },
    { key: "sun", label: "Sun" },
    { key: "venus", label: "Venus" },
  ];

  // Helper function to get planet data
  const getPlanetData = (planetKey: string): number[] | undefined => {
    if (!ashtakvargaData || !ashtakvargaData[planetKey]) {
      return undefined;
    }
    return ashtakvargaData[planetKey];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ashtakvarga Chart</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Ashtakvarga is used to assess the strength and patterns that are present in a birth chart. The Ashtakvarga or 
          Ashtakavarga is a numerical quantification or score of a planet placed in the chart with reference to the 
          other 7 planets and the Lagna. In Sarva Ashtaka Varga the total scores of all the BAVs are overlaid and then 
          totalled. This makes the SAV of the chart. The total of all the scores should be 337.
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {planets.map((planet) => {
          const data = getPlanetData(planet.key);
          if (!data) return null;
          return (
            <AshtakvargaChart
              key={planet.key}
              title={planet.label}
              data={data}
            />
          );
        })}
      </div>

     
      
    </div>
  );
};

export default AshtakvargaTab;
