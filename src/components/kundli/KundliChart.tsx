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

const KundliChart: React.FC<KundliChartProps> = ({ chartData, chartType, style = "north" }) => {
  // Map to store planets by sign number with degrees
  const signPlanetsMap = new Map<number, Array<{ name: string; degree: number }>>();
  
  // Initialize all 12 signs
  for (let i = 0; i < 12; i++) {
    signPlanetsMap.set(i, []);
  }
  
  // Group planets by their sign
  if (chartData && chartData.planets) {
    Object.entries(chartData.planets).forEach(([planetName, planetData]) => {
      const signNum = planetData.sign_num;
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

  const getSignName = (signNum: number): string => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[signNum] || '';
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

  return <NorthIndianChart signPlanetsMap={signPlanetsMap} chartType={chartType} getSignName={getSignName} getPlanetColor={getPlanetColor} />;
};

// North Indian Chart Component
const NorthIndianChart: React.FC<{
  signPlanetsMap: Map<number, Array<{ name: string; degree: number }>>;
  chartType: string;
  getSignName: (signNum: number) => string;
  getPlanetColor: (planetName: string) => string;
}> = ({ signPlanetsMap, chartType, getSignName, getPlanetColor }) => {

  // Diamond positions for North Indian style - 12 houses in triangular sections
  // Based on reference image: house numbers in corners, planets in center of each section
  const housePositions = [
    { house: 1, top: '24%', left: '50%', numberTop: '38%', numberLeft: '46%' },      // Center top
    { house: 2, top: '14%', left: '65%', numberTop: '21%', numberLeft: '57%' },      // Top right upper
    { house: 3, top: '14%', left: '80%', numberTop: '21%', numberLeft: '75%' },      // Top right
    { house: 4, top: '35%', left: '50%', numberTop: '28%', numberLeft: '60%' },      // Upper center
    { house: 5, top: '50%', left: '80%', numberTop: '42%', numberLeft: '73%' },      // Right
    { house: 6, top: '65%', left: '80%', numberTop: '60%', numberLeft: '73%' },      // Right lower
    { house: 7, top: '76%', left: '50%', numberTop: '62%', numberLeft: '46%' },      // Center bottom
    { house: 8, top: '86%', left: '65%', numberTop: '78%', numberLeft: '60%' },      // Bottom right
    { house: 9, top: '86%', left: '35%', numberTop: '78%', numberLeft: '40%' },      // Bottom left
    { house: 10, top: '65%', left: '20%', numberTop: '60%', numberLeft: '27%' },     // Left lower
    { house: 11, top: '50%', left: '20%', numberTop: '42%', numberLeft: '27%' },     // Left
    { house: 12, top: '14%', left: '35%', numberTop: '21%', numberLeft: '40%' },     // Top left
  ];

  // North Indian house to sign mapping (based on Ascendant in house 1)
  const houseToSignMap: Record<number, number> = {
    1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9, 11: 10, 12: 11
  };

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
              {/* House number */}
              <div
                className="absolute text-[10px] text-gray-500 font-medium"
                style={{ top: numberTop, left: numberLeft, transform: 'translate(-50%, -50%)' }}
              >
                {house}
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
    { sign: 0, row: 0, col: 0 }, { sign: 1, row: 0, col: 1 }, { sign: 2, row: 0, col: 2 }, { sign: 3, row: 0, col: 3 },
    { sign: 4, row: 1, col: 3 }, { sign: 5, row: 2, col: 3 }, { sign: 6, row: 3, col: 3 }, { sign: 7, row: 3, col: 2 },
    { sign: 8, row: 3, col: 1 }, { sign: 9, row: 3, col: 0 }, { sign: 10, row: 2, col: 0 }, { sign: 11, row: 1, col: 0 }
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
