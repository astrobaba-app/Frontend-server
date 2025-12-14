import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { colors } from "@/utils/colors";

interface DashaData {
  planet: string;
  start_date: string;
  end_date: string;
  years: number;
  is_balance?: boolean;
}

interface DashaTableProps {
  dashaData?: { dashas?: DashaData[] } | null;
}

const DashaTable: React.FC<DashaTableProps> = ({ dashaData }) => {
  const [activeTab, setActiveTab] = useState<"Mahadasha" | "Antardasha" | "Pratyantardasha" | "Sookshmadasha">("Mahadasha");
  const [selectedMahadasha, setSelectedMahadasha] = useState<DashaData | null>(null);
  const [selectedAntardasha, setSelectedAntardasha] = useState<DashaData | null>(null);
  const [selectedPratyantardasha, setSelectedPratyantardasha] = useState<DashaData | null>(null);

  const tabs = ["Mahadasha", "Antardasha", "Pratyantardasha", "Sookshmadasha"] as const;

  const mahadashaData = dashaData?.dashas || [];

  // Generate Antardasha for a given Mahadasha
  const generateAntardasha = (mahadasha: DashaData): DashaData[] => {
    const planets = ["Mercury", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn"];
    const startIdx = planets.indexOf(mahadasha.planet);
    if (startIdx === -1) return [];
    
    const orderedPlanets = [...planets.slice(startIdx), ...planets.slice(0, startIdx)];
    const startDate = new Date(mahadasha.start_date);
    const endDate = new Date(mahadasha.end_date);
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    
    const antardashaProportions: Record<string, number> = {
      "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16,
      "Saturn": 19, "Mercury": 17, "Ketu": 7, "Venus": 20
    };
    
    const totalProportion = orderedPlanets.reduce((sum, p) => sum + antardashaProportions[p], 0);
    
    return orderedPlanets.map((planet, idx) => {
      const proportion = antardashaProportions[planet] / totalProportion;
      const daysForThisPlanet = totalDays * proportion;
      
      let currentStart = new Date(startDate);
      for (let i = 0; i < idx; i++) {
        const prevProportion = antardashaProportions[orderedPlanets[i]] / totalProportion;
        currentStart = new Date(currentStart.getTime() + (totalDays * prevProportion * 24 * 60 * 60 * 1000));
      }
      
      const currentEnd = new Date(currentStart.getTime() + (daysForThisPlanet * 24 * 60 * 60 * 1000));
      
      return {
        planet: `${mahadasha.planet}-${planet}`,
        start_date: currentStart.toISOString().split('T')[0],
        end_date: currentEnd.toISOString().split('T')[0],
        years: daysForThisPlanet / 365.25
      };
    });
  };

  // Generate Pratyantardasha for a given Antardasha
  const generatePratyantardasha = (antardasha: DashaData): DashaData[] => {
    const [maha, antar] = antardasha.planet.split('-');
    const planets = ["Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu"];
    const startIdx = planets.indexOf(antar);
    if (startIdx === -1) return [];
    
    const orderedPlanets = [...planets.slice(startIdx), ...planets.slice(0, startIdx)];
    const startDate = new Date(antardasha.start_date);
    const endDate = new Date(antardasha.end_date);
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    
    const pratyantardashaProportions: Record<string, number> = {
      "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16,
      "Saturn": 19, "Mercury": 17, "Ketu": 7, "Venus": 20
    };
    
    const totalProportion = orderedPlanets.reduce((sum, p) => sum + pratyantardashaProportions[p], 0);
    
    return orderedPlanets.map((planet, idx) => {
      const proportion = pratyantardashaProportions[planet] / totalProportion;
      const daysForThisPlanet = totalDays * proportion;
      
      let currentStart = new Date(startDate);
      for (let i = 0; i < idx; i++) {
        const prevProportion = pratyantardashaProportions[orderedPlanets[i]] / totalProportion;
        currentStart = new Date(currentStart.getTime() + (totalDays * prevProportion * 24 * 60 * 60 * 1000));
      }
      
      const currentEnd = new Date(currentStart.getTime() + (daysForThisPlanet * 24 * 60 * 60 * 1000));
      
      return {
        planet: `${maha}-${antar}-${planet}`,
        start_date: currentStart.toISOString().split('T')[0],
        end_date: currentEnd.toISOString().split('T')[0],
        years: daysForThisPlanet / 365.25
      };
    });
  };

  // Generate Sookshmadasha for a given Pratyantardasha
  const generateSookshmadasha = (pratyantardasha: DashaData): DashaData[] => {
    const parts = pratyantardasha.planet.split('-');
    const pratyantar = parts[parts.length - 1];
    const planets = ["Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu", "Venus"];
    const startIdx = planets.indexOf(pratyantar);
    if (startIdx === -1) return [];
    
    const orderedPlanets = [...planets.slice(startIdx), ...planets.slice(0, startIdx)];
    const startDate = new Date(pratyantardasha.start_date);
    const endDate = new Date(pratyantardasha.end_date);
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    
    const sookshmadashaProportions: Record<string, number> = {
      "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16,
      "Saturn": 19, "Mercury": 17, "Ketu": 7, "Venus": 20
    };
    
    const totalProportion = orderedPlanets.reduce((sum, p) => sum + sookshmadashaProportions[p], 0);
    
    return orderedPlanets.map((planet, idx) => {
      const proportion = sookshmadashaProportions[planet] / totalProportion;
      const daysForThisPlanet = totalDays * proportion;
      
      let currentStart = new Date(startDate);
      for (let i = 0; i < idx; i++) {
        const prevProportion = sookshmadashaProportions[orderedPlanets[i]] / totalProportion;
        currentStart = new Date(currentStart.getTime() + (totalDays * prevProportion * 24 * 60 * 60 * 1000));
      }
      
      const currentEnd = new Date(currentStart.getTime() + (daysForThisPlanet * 24 * 60 * 60 * 1000));
      
      return {
        planet: `${pratyantardasha.planet}-${planet}`,
        start_date: currentStart.toISOString().split('T')[0],
        end_date: currentEnd.toISOString().split('T')[0],
        years: daysForThisPlanet / 365.25
      };
    });
  };

  const formatDate = (dateStr: string) => {
    if (dateStr.toLowerCase() === 'birth') return 'Birth';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full">
      <p style={{color:colors.darkGray }} className="text-xl font-semibold mb-4 text-start">Vimshottari Dasha</p>
      
      {mahadashaData.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">Dasha data is not available for this kundli.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center  mb-6 overflow-x-auto pb-2">{tabs.map((tab, index) => (
          <React.Fragment key={tab}>
            <button
              onClick={() => {
                setActiveTab(tab);
                if (tab === "Mahadasha") {
                  setSelectedMahadasha(null);
                  setSelectedAntardasha(null);
                  setSelectedPratyantardasha(null);
                } else if (tab === "Antardasha") {
                  setSelectedAntardasha(null);
                  setSelectedPratyantardasha(null);
                } else if (tab === "Pratyantardasha") {
                  setSelectedPratyantardasha(null);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab
                  ?"bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
                activeTab === tab
                  ? "bg-yellow-200 text-gray-900"
                  : "bg-gray-300 text-gray-700"
              }`}>
                {index + 1}
              </span>
              <span className="font-semibold">{tab}</span>
            </button>
            {index < tabs.length - 1 && (
              <div className="w-20 h-0.5 bg-gray-300 shrink-0"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Dasha Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-orange-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                {activeTab === "Mahadasha" ? "Mahadasha" : 
                 activeTab === "Antardasha" ? "Antardasha" :
                 activeTab === "Pratyantardasha" ? "Pratyantardasha" : "Sookshmadasha"}
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Start Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                End Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Years
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Mahadasha View */}
            {activeTab === "Mahadasha" && mahadashaData.map((mahadasha, index) => (
              <tr 
                key={index}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedMahadasha(mahadasha);
                  setActiveTab("Antardasha");
                }}
              >
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {mahadasha.planet}
                      {mahadasha.is_balance && <span className="ml-2 text-xs text-orange-500">(Balance)</span>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(mahadasha.start_date)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(mahadasha.end_date)}</td>
                <td className="border border-gray-300 px-4 py-2">{mahadasha.years.toFixed(2)}</td>
              </tr>
            ))}

            {/* Antardasha View */}
            {activeTab === "Antardasha" && selectedMahadasha && generateAntardasha(selectedMahadasha).map((antardasha, aIndex) => (
              <tr 
                key={aIndex}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedAntardasha(antardasha);
                  setActiveTab("Pratyantardasha");
                }}
              >
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span>{antardasha.planet}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(antardasha.start_date)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(antardasha.end_date)}</td>
                <td className="border border-gray-300 px-4 py-2">{antardasha.years.toFixed(2)}</td>
              </tr>
            ))}

            {/* Pratyantardasha View */}
            {activeTab === "Pratyantardasha" && selectedAntardasha && generatePratyantardasha(selectedAntardasha).map((pratyantar, pIndex) => (
              <tr 
                key={pIndex}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedPratyantardasha(pratyantar);
                  setActiveTab("Sookshmadasha");
                }}
              >
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span>{pratyantar.planet}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(pratyantar.start_date)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(pratyantar.end_date)}</td>
                <td className="border border-gray-300 px-4 py-2">{pratyantar.years.toFixed(2)}</td>
              </tr>
            ))}

            {/* Sookshmadasha View */}
            {activeTab === "Sookshmadasha" && selectedPratyantardasha && generateSookshmadasha(selectedPratyantardasha).map((sookshma, sIndex) => (
              <tr key={sIndex} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {sookshma.planet}
                </td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(sookshma.start_date)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(sookshma.end_date)}</td>
                <td className="border border-gray-300 px-4 py-2">{sookshma.years.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
};

export default DashaTable;
