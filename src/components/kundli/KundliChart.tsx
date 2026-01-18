import { colors } from "@/utils/colors";
import React from "react";

interface PlanetPosition {
  original_longitude: number;
  sign: string;
  sign_num: number;
  degree: number;
  longitude: number;
}

interface ChartData {
  division: string;
  name: string;
  matters: string;
  planets: Record<string, PlanetPosition>;
}

interface KundliChartProps {
  chartData: ChartData;
  chartType: string;
  style?: "north" | "south";
}

const KundliChart: React.FC<KundliChartProps & { ascSignNum?: number; ascDegree?: number }> = ({ chartData, chartType, style = "north", ascSignNum, ascDegree }) => {
  // Normalize sign numbers to a consistent 1..12 range.
  // (Some sources use 0..11, others use 1..12; the backend here typically uses 1..12.)
  const normalizeSignNum = (value: unknown): number => {
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return 1;
    if (n >= 1 && n <= 12) return n;
    if (n >= 0 && n <= 11) return n + 1;
    const mod = ((Math.round(n) % 12) + 12) % 12;
    return mod + 1;
  };

  // Map to store planets by sign number (1..12) with degrees
  const signPlanetsMap = new Map<number, Array<{ name: string; degree: number }>>();

  // Initialize all 12 signs (1..12)
  for (let i = 1; i <= 12; i++) {
    signPlanetsMap.set(i, []);
  }
  
  // Group planets by their sign
  if (chartData && chartData.planets) {
    Object.entries(chartData.planets).forEach(([planetName, planetData]) => {
      const signNum = normalizeSignNum(planetData.sign_num);
      const planets = signPlanetsMap.get(signNum) || [];
      // Use abbreviations for planets matching reference images
      const abbreviations: Record<string, string> = {
        'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
        'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 
        'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl', 'Ascendant': 'Asc'
      };
      planets.push({
        name: abbreviations[planetName] || planetName.substring(0, 2),
        degree: planetData.degree
      });
      signPlanetsMap.set(signNum, planets);
    });
  }

  // Add Ascendant marker to the appropriate sign (for D1 charts)
  if (typeof ascSignNum === "number") {
    const ascSign = normalizeSignNum(ascSignNum);
    const existing = signPlanetsMap.get(ascSign) || [];
    const ascDeg = typeof ascDegree === "number" ? ascDegree : 0;
    // Avoid duplicating Asc if it's already present in the divisional data.
    if (!existing.some((p) => p.name === "Asc")) {
      existing.unshift({ name: "Asc", degree: ascDeg });
    }
    signPlanetsMap.set(ascSign, existing);
  }

  const getSignName = (signNum: number): string => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const idx = normalizeSignNum(signNum) - 1;
    return signs[idx] || '';
  };

  const getPlanetColor = (planetName: string): string => {
    const colors: Record<string, string> = {
      'Su': '#FFA500', 'Mo': '#9370DB', 'Ma': '#DC143C', 'Me': '#32CD32',
      'Ju': '#DAA520', 'Ve': '#FF1493', 'Sa': '#4169E1', 'Ra': '#8B4513', 
      'Ke': '#A0522D', 'Ur': '#4682B4', 'Ne': '#20B2AA', 'Pl': '#DA70D6', 'Asc': '#9932CC'
    };
    return colors[planetName] || '#333333';
  };

  if (style === "south") {
    return <SouthIndianChart signPlanetsMap={signPlanetsMap} chartType={chartType} getSignName={getSignName} getPlanetColor={getPlanetColor} />;
  }

  const normalizedAscSignNum = typeof ascSignNum === "number" ? normalizeSignNum(ascSignNum) : undefined;
  return <NorthIndianChart signPlanetsMap={signPlanetsMap} chartType={chartType} getSignName={getSignName} getPlanetColor={getPlanetColor} ascSignNum={normalizedAscSignNum} />;
};

// North Indian Chart Component
const NorthIndianChart: React.FC<{
  signPlanetsMap: Map<number, Array<{ name: string; degree: number }>>;
  chartType: string;
  getSignName: (signNum: number) => string;
  getPlanetColor: (planetName: string) => string;
  ascSignNum?: number;
}> = ({ signPlanetsMap, chartType, getSignName, getPlanetColor, ascSignNum }) => {

  // Diamond positions for North Indian style - 12 houses in triangular sections
  // Standard North Indian layout matching AstroTalk:
  // - House 1 (Asc) in center diamond
  // - Houses 2-12 arranged counter-clockwise around center starting from top
  const housePositions = [
    { house: 1, top: '25%', left: '63%', numberTop: '42%', numberLeft: '50%' },      // Center (Asc)
    { house: 2, top: '9%', left: '28%', numberTop: '20%', numberLeft: '25%' },      // Top-right of center
    { house: 3, top: '10%', left: '80%', numberTop: '25%', numberLeft: '20%' },      // Top-right corner
    { house: 4, top: '5%', left: '80%', numberTop: '50%', numberLeft: '42%' },      // Right upper
    { house: 5, top: '65%', left: '80%', numberTop: '75%', numberLeft: '20%' },      // Right lower
    { house: 6, top: '76%', left: '68%', numberTop: '79%', numberLeft: '25%' },      // Bottom-right of center
    { house: 7, top: '90%', left: '29%', numberTop: '57%', numberLeft: '50%' },      // Bottom center
    { house: 8, top: '90%', left: '32%', numberTop: '80%', numberLeft: '75%' },      // Bottom-left of center
    { house: 9, top: '75%', left: '96%', numberTop: '75%', numberLeft: '80%' },      // Bottom-left corner
    { house: 10, top: '50%', left: '77%', numberTop: '50%', numberLeft: '58%' },     // Left lower
    { house: 11, top: '25%', left: '95%', numberTop: '25%', numberLeft: '80%' },     // Left upper
    { house: 12, top: '8%', left: '80%', numberTop: '20%', numberLeft: '75%' },     // Top-left of center
  ];

  // North Indian house-to-sign mapping (rotate so house 1 = Ascendant sign).
  // House 1 = Asc sign, House 2 = Asc+1, House 3 = Asc+2, etc.
  const asc = typeof ascSignNum === "number" ? ascSignNum : 1;
  const houseToSignMap: Record<number, number> = {};
  for (let house = 1; house <= 12; house++) {
    // Standard Vedic: signs advance with house numbers (H1=Asc, H2=Asc+1, etc.)
    houseToSignMap[house] = (((asc - 1) + (house - 1)) % 12) + 1;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h3 style={{color:colors.darkGray }} className="text-sm font-semibold mb-3 text-start">{chartType}</h3>
      <div className="relative w-full max-w-[500px] aspect-square bg-[#FFF9E6] border-2 border-gray-500">
        {/* SVG for diamond structure - matching Ashtakvarga design */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
          {/* Outer square border */}
          <rect x="0" y="0" width="400" height="400" fill="none" stroke="#999" strokeWidth="2" />
          
          {/* First set: Diagonal lines from corner to corner (X shape) */}
          <line x1="0" y1="0" x2="400" y2="400" stroke="#999" strokeWidth="2" />
          <line x1="400" y1="0" x2="0" y2="400" stroke="#999" strokeWidth="2" />
          
          {/* Second set: Diamond/rotated square with vertices at edge midpoints */}
          <line x1="200" y1="0" x2="400" y2="200" stroke="#999" strokeWidth="2" />
          <line x1="400" y1="200" x2="200" y2="400" stroke="#999" strokeWidth="2" />
          <line x1="200" y1="400" x2="0" y2="200" stroke="#999" strokeWidth="2" />
          <line x1="0" y1="200" x2="200" y2="0" stroke="#999" strokeWidth="2" />
        </svg>

        {/* House numbers and planet positions */}
        {housePositions.map(({ house, top, left, numberTop, numberLeft }) => {
          const signNum = houseToSignMap[house];
          const planets = signPlanetsMap.get(signNum) || [];
          
          return (
            <React.Fragment key={house}>
              {/* Sign number (matches reference layouts) */}
              <div
                className="absolute text-[10px] text-gray-500 font-medium"
                style={{ top: numberTop, left: numberLeft, transform: 'translate(-50%, -50%)' }}
              >
                {signNum}
              </div>
              
              {/* Planets or -- if empty */}
              <div
                className="absolute"
                style={{ 
                  top, 
                  left, 
                  transform: 'translate(-50%, -50%)',
                  width: '18%',
                  maxWidth: '90px'
                }}
              >
                {planets.length > 0 ? (
                  <div className="flex flex-col gap-0.5 items-start">
                    {planets.map((planet, idx) => (
                      <div key={idx} className="leading-tight">
                        <span 
                          style={{ color: getPlanetColor(planet.name) }} 
                          className="text-[11px] font-semibold whitespace-nowrap"
                        >
                          {planet.name}-{planet.degree.toFixed(2)}°
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// South Indian Chart Component
const SouthIndianChart: React.FC<{
  signPlanetsMap: Map<number, Array<{ name: string; degree: number }>>;
  chartType: string;
  getSignName: (signNum: number) => string;
  getPlanetColor: (planetName: string) => string;
}> = ({ signPlanetsMap, chartType, getSignName, getPlanetColor }) => {
  const signPositions = [
    { sign: 1, row: 0, col: 0 }, { sign: 2, row: 0, col: 1 }, { sign: 3, row: 0, col: 2 }, { sign: 4, row: 0, col: 3 },
    { sign: 5, row: 1, col: 3 }, { sign: 6, row: 2, col: 3 }, { sign: 7, row: 3, col: 3 }, { sign: 8, row: 3, col: 2 },
    { sign: 9, row: 3, col: 1 }, { sign: 10, row: 3, col: 0 }, { sign: 11, row: 2, col: 0 }, { sign: 12, row: 1, col: 0 }
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">{chartType}</h3>
      <div className="w-full max-w-[500px]">
        <div className="grid grid-cols-4 gap-0 border-2 border-gray-600 bg-[#FFF9E6]">
          {signPositions.map(({ sign, row, col }) => {
            const planets = signPlanetsMap.get(sign) || [];
            
            return (
              <div
                key={`${row}-${col}`}
                className="border border-gray-500 p-3 min-h-[110px] flex flex-col justify-center items-center relative bg-[#FFFEF0]"
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1
                }}
              >
                {/* Planets */}
                <div className="flex flex-col gap-1 items-center justify-center w-full">
                  {planets.length > 0 ? planets.map((planet, idx) => (
                    <div key={idx} className="text-center leading-tight">
                      <span style={{ color: getPlanetColor(planet.name) }} className="text-xs font-bold whitespace-nowrap">
                        {planet.name}-{planet.degree.toFixed(2)}°
                      </span>
                    </div>
                  )) : (
                    <div className="text-gray-400 text-xs">-</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KundliChart;
