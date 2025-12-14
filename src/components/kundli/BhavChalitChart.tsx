import React from "react";

interface PlanetPosition {
  name: string;
  house: number;
  longitude: number;
}

interface BhavChalitChartProps {
  planets?: Record<string, any>;
  cusps?: number[];
  ascendantLongitude?: number;
}

const BhavChalitChart: React.FC<BhavChalitChartProps> = ({ 
  planets, 
  cusps,
  ascendantLongitude = 0 
}) => {
  
  // Helper function to calculate which house a planet is in based on cusps
  const getHouseForPlanet = (planetLongitude: number): number => {
    if (!cusps || cusps.length !== 12) {
      // Fallback calculation if cusps not available
      let house = Math.floor((planetLongitude - ascendantLongitude + 360) % 360 / 30) + 1;
      if (house > 12) house -= 12;
      if (house < 1) house += 12;
      return house;
    }

    // Find which house the planet falls into based on cusp boundaries
    for (let i = 0; i < 12; i++) {
      const currentCusp = cusps[i];
      const nextCusp = cusps[(i + 1) % 12];
      
      let isInHouse = false;
      if (nextCusp > currentCusp) {
        isInHouse = planetLongitude >= currentCusp && planetLongitude < nextCusp;
      } else {
        // Handle wrap around 360 degrees
        isInHouse = planetLongitude >= currentCusp || planetLongitude < nextCusp;
      }
      
      if (isInHouse) {
        return i + 1;
      }
    }
    
    return 1; // Default to first house if no match
  };

  // Map planets to houses
  const housePlanetsMap = new Map<number, Array<{ name: string; abbr: string }>>();
  
  // Initialize all 12 houses
  for (let i = 1; i <= 12; i++) {
    housePlanetsMap.set(i, []);
  }

  // Planet abbreviations
  const abbreviations: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 
    'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl'
  };

  // Color coding for planets
  const getPlanetColor = (planetName: string): string => {
    const colors: Record<string, string> = {
      'Su': '#FF8C00', 'Mo': '#9370DB', 'Ma': '#DC143C', 'Me': '#32CD32',
      'Ju': '#DAA520', 'Ve': '#FF1493', 'Sa': '#4169E1', 'Ra': '#8B4513', 
      'Ke': '#A0522D', 'Ur': '#4682B4', 'Ne': '#20B2AA', 'Pl': '#DA70D6'
    };
    return colors[planetName] || '#333333';
  };

  // Populate houses with planets
  if (planets && typeof planets === 'object' && !Array.isArray(planets)) {
    Object.entries(planets).forEach(([planetName, planetData]: [string, any]) => {
      if (planetData && planetData.longitude !== undefined) {
        const house = getHouseForPlanet(planetData.longitude);
        const planetsInHouse = housePlanetsMap.get(house) || [];
        const abbr = abbreviations[planetName] || planetName.substring(0, 2);
        planetsInHouse.push({ name: planetName, abbr });
        housePlanetsMap.set(house, planetsInHouse);
      }
    });
  }

  // House positions for diamond chart (same as North Indian)
  const housePositions = [
    { house: 1, top: '24%', left: '50%', numberTop: '38%', numberLeft: '46%' },
    { house: 2, top: '14%', left: '65%', numberTop: '21%', numberLeft: '57%' },
    { house: 3, top: '14%', left: '80%', numberTop: '21%', numberLeft: '75%' },
    { house: 4, top: '35%', left: '50%', numberTop: '28%', numberLeft: '60%' },
    { house: 5, top: '50%', left: '80%', numberTop: '42%', numberLeft: '73%' },
    { house: 6, top: '65%', left: '80%', numberTop: '60%', numberLeft: '73%' },
    { house: 7, top: '76%', left: '50%', numberTop: '62%', numberLeft: '46%' },
    { house: 8, top: '86%', left: '65%', numberTop: '78%', numberLeft: '60%' },
    { house: 9, top: '86%', left: '35%', numberTop: '78%', numberLeft: '40%' },
    { house: 10, top: '65%', left: '20%', numberTop: '60%', numberLeft: '27%' },
    { house: 11, top: '50%', left: '20%', numberTop: '42%', numberLeft: '27%' },
    { house: 12, top: '14%', left: '35%', numberTop: '21%', numberLeft: '40%' },
  ];

  const hasData = planets && Object.keys(planets).length > 0;

  if (!hasData) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 p-6">
        <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
          --
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-[450px] aspect-square bg-[#FFF9E6] border-2 border-gray-500">
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
          const planetsInHouse = housePlanetsMap.get(house) || [];
          
          return (
            <React.Fragment key={house}>
              {/* House number */}
              <div
                className="absolute text-[10px] text-gray-500 font-medium"
                style={{ top: numberTop, left: numberLeft, transform: 'translate(-50%, -50%)' }}
              >
                {house}
              </div>
              
              {/* Planets */}
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
                {planetsInHouse.length > 0 ? (
                  <div className="flex flex-wrap gap-1 items-center justify-center">
                    {planetsInHouse.map((planet, idx) => (
                      <span 
                        key={idx}
                        style={{ color: getPlanetColor(planet.abbr) }} 
                        className="text-[11px] font-semibold whitespace-nowrap"
                      >
                        {planet.abbr}
                        {idx < planetsInHouse.length - 1 ? '' : ''}
                      </span>
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

export default BhavChalitChart;
