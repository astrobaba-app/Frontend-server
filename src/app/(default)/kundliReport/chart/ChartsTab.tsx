"use client";
import React, { useState } from "react";
import { KundliResponse } from "@/store/api/kundli";
import KundliChart from "@/components/kundli/KundliChart";

interface ChartsTabProps {
  kundliData: KundliResponse["kundli"];
}

interface ChartInfo {
  key: string;
  title: string;
  description: string;
}

const ChartsTab: React.FC<ChartsTabProps> = ({ kundliData }) => {
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");

  // Helper function to check if chart data is valid
  const isValidChartData = (data: any) => {
    return data && typeof data === 'object' && data.planets && Object.keys(data.planets).length > 0;
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const planetary = kundliData?.planetary as any;

  // Ascendant longitude (sidereal, 0-360)
  const ascLon: number = (planetary?.Ascendant?.longitude as number) ?? 0;
  // 0-indexed sign containing the ascendant (0=Aries, 11=Pisces).
  // KundliChart.normalizeSignNum() expects 0-indexed input.
  const d1AscSignNum: number = Math.floor((ascLon % 360) / 30);
  // Actual degree of Ascendant within its sign (for display like "Asc 7°41'")
  const ascDegInSign: number = ascLon % 30;

  // Create chart data for special charts (Chalit, Sun, Moon)
  const createSpecialChartData = (chartType: string) => {
    if (!kundliData?.planetary) return null;

    const d1Chart = kundliData?.charts?.D1;
    if (!d1Chart) return null;

    // ── Add Ascendant as a real planet entry so it lands in the correct
    // house and shows the actual degree (not 0°00').
    // KundliChart will skip the auto-add when it finds "Asc" in planets.
    const withAsc = (planetsObj: any) => ({
      ...planetsObj,
      Ascendant: {
        original_longitude: ascLon,
        longitude: ascLon,
        sign_num: d1AscSignNum + 1,
        degree: ascDegInSign,
      },
    });

    // ── Chalit (Bhava Chalit) ──────────────────────────────────────────────
    // Uses Placidus house cusps calculated by backend to determine which house
    // each planet occupies. Falls back to equal bhava if not available.
    if (chartType === "Chalit") {
      const bhavedPlanets: any = {};
      const houses = kundliData?.astroDetails?.houses;
      const cusps = houses?.cusps; // Array of 12 house cusp longitudes
      
      Object.entries(d1Chart.planets).forEach(([planetName, planetData]: [string, any]) => {
        const pLon: number = (planetData.original_longitude ?? planetData.longitude) as number;
        let houseNum: number;
        
        // Use Placidus cusps if available
        if (cusps && Array.isArray(cusps) && cusps.length === 12) {
          // Find which house the planet is in based on cusps
          houseNum = 1;
          for (let i = 0; i < 12; i++) {
            const currentCusp = cusps[i];
            const nextCusp = cusps[(i + 1) % 12];
            
            // Handle zodiac wrap-around
            if (nextCusp > currentCusp) {
              if (pLon >= currentCusp && pLon < nextCusp) {
                houseNum = i + 1;
                break;
              }
            } else {
              // Wraps around 0°/360°
              if (pLon >= currentCusp || pLon < nextCusp) {
                houseNum = i + 1;
                break;
              }
            }
          }
        } else {
          // Fallback: equal bhava system (±15° around each house midpoint)
          const offset = (pLon - ascLon + 360 + 15) % 360;
          houseNum = Math.floor(offset / 30) + 1; // 1-indexed
        }
        
        // Map planet to the sign corresponding to its house
        const bhava = houseNum - 1; // 0-indexed
        const targetSignIdx = (d1AscSignNum + bhava) % 12; // 0-indexed sign
        const originalDegree = pLon % 30; // keep actual degree for display
        const newLon = targetSignIdx * 30 + originalDegree;
        
        bhavedPlanets[planetName] = {
          ...planetData,
          original_longitude: newLon,
          longitude: newLon,
          sign_num: targetSignIdx + 1,
          degree: originalDegree,
        };
      });
      
      return {
        division: "Chalit",
        name: "Chalit",
        matters: "Bhava Chalit (Placidus)",
        planets: withAsc(bhavedPlanets),
      };
    }

    // ── Sun chart ─────────────────────────────────────────────────────────
    // Planets stay at their real positions; we just treat the Sun's sign as
    // House 1.  Degrees are kept as-is so Su shows its actual sign degree,
    // matching AstroTalk's rendering (Su 2.93°, not 0°00').
    if (chartType === "Sun") {
      return {
        division: "Sun",
        name: "Sun Chart",
        matters: "Relative to Sun",
        planets: withAsc(d1Chart.planets),
      };
    }

    // ── Moon chart ────────────────────────────────────────────────────────
    // Same logic as Sun chart — keep real positions, rotate houses to Moon sign.
    if (chartType === "Moon") {
      return {
        division: "Moon",
        name: "Moon Chart",
        matters: "Relative to Moon",
        planets: withAsc(d1Chart.planets),
      };
    }

    return null;
  };

  // Chart definitions with titles and descriptions
  const charts: ChartInfo[] = [
   // { key: "Chalit", title: "Chalit", description: "" },
    { key: "Sun", title: "Sun", description: "" },
    { key: "Moon", title: "Moon", description: "" },
    { key: "D1", title: "Lagna / Ascendant / Basic Birth Chart", description: "" },
    { key: "D2", title: "Hora (Wealth / Income Chart)", description: "" },
    { key: "D3", title: "Drekkana (Relationship with siblings)", description: "" },
    { key: "D4", title: "Chaturthamsa (Assets)", description: "" },
    { key: "D7", title: "Saptamsa (Progeny)", description: "" },
    { key: "D9", title: "Navamsa (Prospects of marriage)", description: "" },
    { key: "D10", title: "Dasamsa (Profession)", description: "" },
    { key: "D12", title: "Dwadasamsa (Native parents / Ancestors)", description: "" },
    { key: "D16", title: "Shodasamsa (Travel)", description: "" },
    { key: "D20", title: "Vimsamsa (Spiritual progress)", description: "" },
    { key: "D24", title: "Chaturvimsamsa (Intellectual)", description: "" },
    { key: "D27", title: "Saptavimsamsa (Strength / Protection)", description: "" },
    { key: "D30", title: "Trimsamsa (Misfortunes)", description: "" },

  ];

  const renderChart = (chartInfo: ChartInfo, index: number) => {
    let chartData: any = null;
    let chartAscSignNum: number = d1AscSignNum; // default: 0-indexed Asc sign for D1/divisional

    if (chartInfo.key === "Chalit" || chartInfo.key === "Sun" || chartInfo.key === "Moon") {
      chartData = createSpecialChartData(chartInfo.key);
      // House 1 must be the Sun's / Moon's sign for those charts; for Chalit
      // it stays as d1AscSignNum since planets are already remapped.
      if (chartInfo.key === "Sun") {
        const sunLon: number = (planetary?.Sun?.longitude as number) ?? 0;
        chartAscSignNum = Math.floor((sunLon % 360) / 30);
      } else if (chartInfo.key === "Moon") {
        const moonLon: number = (planetary?.Moon?.longitude as number) ?? 0;
        chartAscSignNum = Math.floor((moonLon % 360) / 30);
      }
      // Ascendant is already injected as a real planet via withAsc() at its
      // true longitude.  KundliChart's auto-add guard (in KundliChart.tsx) now
      // checks ALL signs before adding, so no duplicate will occur.
    } else {
      chartData = kundliData?.charts?.[chartInfo.key as keyof typeof kundliData.charts];
      // For divisional charts (D2-D60), use each chart's own Ascendant position
      // to determine which sign is House 1, so house rotation is correct.
      if (chartData && chartInfo.key !== "D1") {
        const divAsc = chartData?.planets?.Ascendant;
        // Use sign_num (1-indexed) directly — more reliable than longitude float
        if (divAsc?.sign_num !== undefined) {
          chartAscSignNum = (divAsc.sign_num - 1 + 12) % 12; // convert to 0-indexed
          console.log(`[${chartInfo.key}] Div Asc sign_num=${divAsc.sign_num} → chartAscSignNum=${chartAscSignNum} (${divAsc.sign})`);
        }
      }
    }
    
    return (
      <div key={`${chartInfo.key}-${index}`} className="flex flex-col">
        {isValidChartData(chartData) ? (
          <KundliChart
            chartData={chartData}
            chartType={chartInfo.title}
            style={chartStyle}
            ascSignNum={chartAscSignNum}
            ascDegree={ascDegInSign}
          />
        ) : (
          <div className="bg-white rounded border border-gray-300 p-6 h-64 flex items-center justify-center">
            <p className="text-sm text-gray-500">--</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Chart Style Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex  rounded-lg border border-gray-300 overflow-hidden bg-white">
          <button
            onClick={() => setChartStyle("north")}
            className={`px-8 cursor-pointer py-2 font-semibold text-sm ${
              chartStyle === "north"
                ? "bg-[#FFD900] text-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            North Indian
          </button>
          <button
            onClick={() => setChartStyle("south")}
            className={`px-8 cursor-pointer py-2 font-semibold text-sm border-l border-gray-300 ${
              chartStyle === "south"
                ? "bg-[#FFD900] text-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            South Indian
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.map((chart, index) => renderChart(chart, index))}
      </div>
    </div>
  );
};

export default ChartsTab;
