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

  // Create chart data for special charts (Chalit, Sun, Moon)
  const createSpecialChartData = (chartType: string) => {
    if (!kundliData?.planetary) return null;

    const d1Chart = kundliData?.charts?.D1;
    if (!d1Chart) return null;

    // For Chalit chart - use cusp-based house positions
    if (chartType === "Chalit") {
      return {
        division: "Chalit",
        name: "Chalit",
        matters: "Cusp based houses",
        planets: d1Chart.planets
      };
    }

    // For Sun chart - planets positioned relative to Sun
    if (chartType === "Sun") {
      const planetary = kundliData.planetary as any;
      const sunLongitude = planetary?.Sun?.longitude || 0;
      const adjustedPlanets: any = {};
      
      Object.entries(d1Chart.planets).forEach(([planetName, planetData]: [string, any]) => {
        const adjustedLongitude = (planetData.original_longitude - sunLongitude + 360) % 360;
        const adjustedSignNum = Math.floor(adjustedLongitude / 30);
        const adjustedDegree = adjustedLongitude % 30;
        
        adjustedPlanets[planetName] = {
          ...planetData,
          longitude: adjustedLongitude,
          sign_num: adjustedSignNum,
          degree: adjustedDegree
        };
      });

      return {
        division: "Sun",
        name: "Sun Chart",
        matters: "Relative to Sun",
        planets: adjustedPlanets
      };
    }

    // For Moon chart - planets positioned relative to Moon
    if (chartType === "Moon") {
      const planetary = kundliData.planetary as any;
      const moonLongitude = planetary?.Moon?.longitude || 0;
      const adjustedPlanets: any = {};
      
      Object.entries(d1Chart.planets).forEach(([planetName, planetData]: [string, any]) => {
        const adjustedLongitude = (planetData.original_longitude - moonLongitude + 360) % 360;
        const adjustedSignNum = Math.floor(adjustedLongitude / 30);
        const adjustedDegree = adjustedLongitude % 30;
        
        adjustedPlanets[planetName] = {
          ...planetData,
          longitude: adjustedLongitude,
          sign_num: adjustedSignNum,
          degree: adjustedDegree
        };
      });

      return {
        division: "Moon",
        name: "Moon Chart",
        matters: "Relative to Moon",
        planets: adjustedPlanets
      };
    }

    return null;
  };

  // Chart definitions with titles and descriptions
  const charts: ChartInfo[] = [
    { key: "Chalit", title: "Chalit", description: "" },
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
    { key: "D40", title: "Khavedamsa (Auspicious time)", description: "" },
    { key: "D45", title: "Akshavedamsa (General issues)", description: "" },
    { key: "D60", title: "Shastiamsa (Summary of charts)", description: "" },
  ];

  const renderChart = (chartInfo: ChartInfo, index: number) => {
    let chartData: any = null;

    // Check if it's a special chart (Chalit, Sun, Moon)
    if (chartInfo.key === "Chalit" || chartInfo.key === "Sun" || chartInfo.key === "Moon") {
      chartData = createSpecialChartData(chartInfo.key);
    } else {
      // Regular divisional chart
      chartData = kundliData?.charts?.[chartInfo.key as keyof typeof kundliData.charts];
    }
    
    return (
      <div key={`${chartInfo.key}-${index}`} className="flex flex-col">
        {isValidChartData(chartData) ? (
          <KundliChart chartData={chartData} chartType={chartInfo.title} style={chartStyle} />
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
