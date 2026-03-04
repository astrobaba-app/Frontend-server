import { colors } from "@/utils/colors";
import React, { useEffect, useRef } from "react";

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

const KundliChart: React.FC<
  KundliChartProps & { ascSignNum?: number; ascDegree?: number }
> = ({ chartData, chartType, style = "north", ascSignNum, ascDegree }) => {

  const normalizeSignNum = (value: unknown): number => {
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return 1;
    const mod = ((Math.round(n) % 12) + 12) % 12;
    return mod + 1;
  };

  // Map to store planets by sign number (1..12) with degrees
  const signPlanetsMap = new Map<
    number,
    Array<{ name: string; degree: number }>
  >();

  // Initialize all 12 signs (1..12)
  for (let i = 1; i <= 12; i++) {
    signPlanetsMap.set(i, []);
  }

  // Function to get sign number from longitude
  const getSignFromLongitude = (longitude: number) => {
    if (!Number.isFinite(longitude)) return 1;
    return (Math.floor(longitude / 30) % 12) + 1;
  };

  // Planet name abbreviations
  const abbreviations: Record<string, string> = {
    Sun: "Su",
    Moon: "Mo",
    Mars: "Ma",
    Mercury: "Me",
    Jupiter: "Ju",
    Venus: "Ve",
    Saturn: "Sa",
    Rahu: "Ra",
    Ketu: "Ke",
    Uranus: "Ur",
    Neptune: "Ne",
    Pluto: "Pl",
    Ascendant: "Asc",
  };

  // Group planets by their sign
  if (chartData && chartData.planets) {
    Object.entries(chartData.planets).forEach(([planetName, planetData]) => {
      const longitude = planetData.original_longitude ?? planetData.longitude;

      const signNum = getSignFromLongitude(longitude);

      const planets = signPlanetsMap.get(signNum) || [];

      planets.push({
        name: abbreviations[planetName] || planetName.substring(0, 2),
        degree: longitude % 30, // <- ALWAYS correct inside sign
      });

      signPlanetsMap.set(signNum, planets);
    });
    // Sort planets within each sign by degree 
    signPlanetsMap.forEach((planets, sign) => {
      planets.sort((a, b) => a.degree - b.degree);
    });
  }

  // Add Ascendant marker to the appropriate sign (for D1 charts)
  if (typeof ascSignNum === "number") {
    const ascSign = normalizeSignNum(ascSignNum);
    const existing = signPlanetsMap.get(ascSign) || [];
    const ascDeg = typeof ascDegree === "number" ? ascDegree : 0;
    // Check ALL signs — if Asc is already present anywhere (e.g. injected as a
    // real planet with its true longitude for Sun/Moon/Chalit charts), skip.
    const ascAlreadyPresent = Array.from(signPlanetsMap.values()).some((arr) =>
      arr.some((p) => p.name === "Asc")
    );
    if (!ascAlreadyPresent) {
      existing.unshift({ name: "Asc", degree: ascDeg });
      signPlanetsMap.set(ascSign, existing);
    }
  }

  const getSignName = (signNum: number): string => {
    const signs = [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ];
    const idx = normalizeSignNum(signNum) - 1;
    return signs[idx] || "";
  };

  const getPlanetColor = (planetName: string): string => {
    const colors: Record<string, string> = {
      Su: "#FFA500",
      Mo: "#9370DB",
      Ma: "#DC143C",
      Me: "#32CD32",
      Ju: "#DAA520",
      Ve: "#FF1493",
      Sa: "#4169E1",
      Ra: "#8B4513",
      Ke: "#A0522D",
      Ur: "#4682B4",
      Ne: "#20B2AA",
      Pl: "#DA70D6",
      Asc: "#9932CC",
    };
    return colors[planetName] || "#333333";
  };

  if (style === "south") {
    return (
      <SouthIndianChart
        signPlanetsMap={signPlanetsMap}
        chartType={chartType}
        getSignName={getSignName}
        getPlanetColor={getPlanetColor}
      />
    );
  }

  const normalizedAscSignNum =
    typeof ascSignNum === "number" ? normalizeSignNum(ascSignNum) : undefined;
  return (
    <NorthIndianChart
      signPlanetsMap={signPlanetsMap}
      chartType={chartType}
      getSignName={getSignName}
      getPlanetColor={getPlanetColor}
      ascSignNum={normalizedAscSignNum}
    />
  );
};

// North Indian Chart Component - Canvas Based
const NorthIndianChart: React.FC<{
  signPlanetsMap: Map<number, Array<{ name: string; degree: number }>>;
  chartType: string;
  getSignName: (signNum: number) => string;
  getPlanetColor: (planetName: string) => string;
  ascSignNum?: number;
}> = ({
  signPlanetsMap,
  chartType,
  getSignName,
  getPlanetColor,
  ascSignNum,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Diamond positions for North Indian style - 12 houses in triangular sections
  const housePositions = [
    { house: 1, x: 0.5, y: 0.25, numX: 0.5, numY: 0.42 }, // Center (Asc)
    { house: 2, x: 0.25, y: 0.1, numX: 0.25, numY: 0.2 }, // Top-right of center
    { house: 3, x: 0.12, y: 0.25, numX: 0.2, numY: 0.25 }, // Top-right corner
    { house: 4, x: 0.25, y: 0.5, numX: 0.42, numY: 0.5 }, // Right upper
    { house: 5, x: 0.12, y: 0.75, numX: 0.2, numY: 0.75 }, // Right lower
    { house: 6, x: 0.25, y: 0.9, numX: 0.25, numY: 0.79 }, // Bottom-right of center
    { house: 7, x: 0.5, y: 0.75, numX: 0.5, numY: 0.57 }, // Bottom center
    { house: 8, x: 0.75, y: 0.9, numX: 0.75, numY: 0.8 }, // Bottom-left of center
    { house: 9, x: 0.9, y: 0.75, numX: 0.8, numY: 0.75 }, // Bottom-left corner
    { house: 10, x: 0.75, y: 0.5, numX: 0.58, numY: 0.5 }, // Left lower
    { house: 11, x: 0.9, y: 0.25, numX: 0.8, numY: 0.25 }, // Left upper
    { house: 12, x: 0.75, y: 0.1, numX: 0.75, numY: 0.2 }, // Top-left of center
  ];

  // North Indian house-to-sign mapping
  const asc = typeof ascSignNum === "number" ? ascSignNum : 1;
  const houseToSignMap: Record<number, number> = {};
  for (let house = 1; house <= 12; house++) {
    houseToSignMap[house] = ((asc - 1 + (house - 1)) % 12) + 1;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#FCF8E3";
    ctx.fillRect(0, 0, width, height);

    // Draw border
    ctx.strokeStyle = "#4C4C4C";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Draw diagonal lines (X shape)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    // Draw diamond (rotated square with vertices at edge midpoints)
    const midX = width / 2;
    const midY = height / 2;
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(width, midY);
    ctx.lineTo(midX, height);
    ctx.lineTo(0, midY);
    ctx.closePath();
    ctx.stroke();

    // Convert decimal degrees to degrees and minutes format like Astrotalk (e.g., 17°52')
    const formatDegree = (decimalDegree: number): string => {
      const degrees = Math.floor(decimalDegree);
      const minutes = Math.floor((decimalDegree - degrees) * 60);
      return `${degrees}°${minutes.toString().padStart(2, "0")}'`;
    };

    // Draw house numbers and planets
    housePositions.forEach(({ house, x, y, numX, numY }) => {
      const signNum = houseToSignMap[house];
      const planets = signPlanetsMap.get(signNum) || [];
      // Draw sign number - small gray text in corners
      ctx.fillStyle = "#999999";
      ctx.font = "9px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(signNum), numX * width, numY * height);

      // Draw planets
      if (planets.length > 0) {
        let offsetY = -(planets.length - 1) * 6; // Center vertically when multiple planets
        planets.forEach((planet) => {
          ctx.fillStyle = getPlanetColor(planet.name);
          ctx.font = "10px Arial"; // Smaller font like Astrotalk
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const text = `${planet.name} ${formatDegree(planet.degree)}`; // Space instead of dash
          ctx.fillText(text, x * width, y * height + offsetY);
          offsetY += 12; // Tighter spacing
        });
      }
    });
  }, [signPlanetsMap, houseToSignMap, getPlanetColor]);

  return (
    <div className="flex flex-col items-center w-full">
      <h3
        style={{ color: colors.darkGray }}
        className="text-sm font-semibold mb-3 text-start"
      >
        {chartType}
      </h3>
      <div className="relative w-full max-w-[500px] aspect-square">
        <canvas
          ref={canvasRef}
          width={393}
          height={393}
          style={{
            width: "auto",
            height: "auto",
            border: "0px solid #4C4C4C",
            borderRadius: "0px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            maxWidth: "100%",
            margin: "0 auto",
            backgroundColor: "#FCF8E3",
          }}
        />
      </div>
    </div>
  );

  /* ===== OLD SVG IMPLEMENTATION (COMMENTED) =====
  return (
    <div className="flex flex-col items-center w-full">
      <h3 style={{color:colors.darkGray }} className="text-sm font-semibold mb-3 text-start">{chartType}</h3>
      <div className="relative w-full max-w-[500px] aspect-square bg-[#FFF9E6] border-2 border-gray-500">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
          <rect x="0" y="0" width="400" height="400" fill="none" stroke="#999" strokeWidth="2" />
          <line x1="0" y1="0" x2="400" y2="400" stroke="#999" strokeWidth="2" />
          <line x1="400" y1="0" x2="0" y2="400" stroke="#999" strokeWidth="2" />
          <line x1="200" y1="0" x2="400" y2="200" stroke="#999" strokeWidth="2" />
          <line x1="400" y1="200" x2="200" y2="400" stroke="#999" strokeWidth="2" />
          <line x1="200" y1="400" x2="0" y2="200" stroke="#999" strokeWidth="2" />
          <line x1="0" y1="200" x2="200" y2="0" stroke="#999" strokeWidth="2" />
        </svg>

        {housePositions.map(({ house, top, left, numberTop, numberLeft }) => {
          const signNum = houseToSignMap[house];
          const planets = signPlanetsMap.get(signNum) || [];
          
          return (
            <React.Fragment key={house}>
              <div
                className="absolute text-[10px] text-gray-500 font-medium"
                style={{ top: numberTop, left: numberLeft, transform: 'translate(-50%, -50%)' }}
              >
                {signNum}
              </div>
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
  ===== END OLD SVG IMPLEMENTATION ===== */
};

// South Indian Chart Component - Canvas Based
const SouthIndianChart: React.FC<{
  signPlanetsMap: Map<number, Array<{ name: string; degree: number }>>;
  chartType: string;
  getSignName: (signNum: number) => string;
  getPlanetColor: (planetName: string) => string;
}> = ({ signPlanetsMap, chartType, getSignName, getPlanetColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const signPositions = [
    { sign: 1, row: 0, col: 1 },
    { sign: 2, row: 0, col: 2 },
    { sign: 3, row: 0, col: 3 },
    { sign: 4, row: 1, col: 3 },
    { sign: 5, row: 2, col: 3 },
    { sign: 6, row: 3, col: 3 },
    { sign: 7, row: 3, col: 2 },
    { sign: 8, row: 3, col: 1 },
    { sign: 9, row: 3, col: 0 },
    { sign: 10, row: 2, col: 0 },
    { sign: 11, row: 1, col: 0 },
    { sign: 12, row: 0, col: 0 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellWidth = width / 4;
    const cellHeight = height / 4;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#FCF8E3";
    ctx.fillRect(0, 0, width, height);

    // Draw outer border
    ctx.strokeStyle = "#4C4C4C";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#6B7280";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, height);
      ctx.stroke();

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(width, i * cellHeight);
      ctx.stroke();
    }

    // Draw planets in each cell
    signPositions.forEach(({ sign, row, col }) => {
      const planets = signPlanetsMap.get(sign) || [];
      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;

      if (planets.length > 0) {
        let offsetY = -(planets.length - 1) * 7;
        planets.forEach((planet) => {
          ctx.fillStyle = getPlanetColor(planet.name);
          ctx.font = "bold 12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const text = `${planet.name}-${planet.degree.toFixed(2)}°`;
          ctx.fillText(text, x, y + offsetY);
          offsetY += 14;
        });
      } else {
        ctx.fillStyle = "#D1D5DB";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("-", x, y);
      }
    });
  }, [signPlanetsMap, getPlanetColor]);

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
        {chartType}
      </h3>
      <div className="w-full max-w-[500px]">
        <canvas
          ref={canvasRef}
          width={393}
          height={393}
          style={{
            width: "auto",
            height: "auto",
            border: "0px solid #4C4C4C",
            borderRadius: "0px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            maxWidth: "100%",
            margin: "0 auto",
            backgroundColor: "#FCF8E3",
          }}
        />
      </div>
    </div>
  );

  /* ===== OLD SVG IMPLEMENTATION (COMMENTED) =====
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
  ===== END OLD SVG IMPLEMENTATION ===== */
};

export default KundliChart;
