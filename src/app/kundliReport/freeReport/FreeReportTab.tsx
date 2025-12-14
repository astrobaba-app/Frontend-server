"use client";
import React, { useState } from "react";
import { KundliResponse } from "@/store/api/kundli";
import RemediesTabContent from "./RemediesTabContent";
import DoshaTabContent from "./DoshaTabContent";
import { colors } from "@/utils/colors";

interface FreeReportTabProps {
  kundliData: KundliResponse["kundli"];
}

const FreeReportTab: React.FC<FreeReportTabProps> = ({ kundliData }) => {
  const [activeMainTab, setActiveMainTab] = useState<"general" | "planetary" | "vimshottari" | "yoga">("general");
  const [activeSubTab, setActiveSubTab] = useState<string>("General");
  
  const { personality, basicDetails, planetary, dasha, remedies, horoscope, yogas, aiFreeReport } = kundliData as any;

  // General sub-tabs
  const generalSubTabs = ["General", "Planetary", "Vimshottari Dasha", "Yoga"];

  // Format date
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "--";
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  // Get planetary details
  const getPlanetaryDetails = (planetName: string) => {
    const planetaryData = planetary as any;
    if (!planetaryData) return null;
    return planetaryData[planetName];
  };

  // Get house number from sign_num
  const getHouseNumber = (signNum: number): number => {
    return signNum !== undefined ? signNum + 1 : 0;
  };

  // Get planetary description from backend
  const getPlanetaryConsideration = (planetName: string): { title: string; subtitle: string; description: string } => {
    // Prefer rich analysis from complete horoscope if available
    const planetaryAnalysis = horoscope?.planetary_analysis || {};
    const analysis = planetaryAnalysis[planetName];

    if (analysis) {
      const sign = analysis.position || "--";
      const description = analysis.condition || analysis.effects || "---";

      return {
        title: `${planetName} Consideration`,
        subtitle: sign,
        description,
      };
    }

    const planetaryData = planetary as any;
    const byKey = planetaryData ? planetaryData[planetName] : null;
    const byArray = Array.isArray(planetaryData)
      ? planetaryData.find((p: any) => p.name === planetName || p.planet === planetName)
      : null;
    const planet = byKey || byArray;

    if (!planet) return { title: planetName, subtitle: "--", description: "---" };

    const sign = planet.sign || "--";
    const description = planet.consideration || planet.description || "---";

    return {
      title: `${planetName} Consideration`,
      subtitle: `${planetName} in ${sign}`,
      description,
    };
  };

  // Get value helper
  const getValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "--";
    return value;
  };

  // Render General content with sub-tabs
  const renderGeneralContent = () => {
    const ascInfluence = horoscope?.personality_analysis?.ascendant_influence;
    const overallPersonality = horoscope?.personality_analysis?.overall_personality;
    const healthAnalysis = horoscope?.health_indications;
    const ascendantSign = ascInfluence?.sign || personality?.ascendant_sign || getValue(basicDetails?.ascendant?.sign) || "--";

    const aiGeneral = aiFreeReport?.general || {};

    if (activeSubTab === "General") {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ascendant Report</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {getValue(aiGeneral?.ascendant_overview) !== "--"
                ? aiGeneral.ascendant_overview
                : getValue(ascInfluence?.description) !== "--" 
                ? ascInfluence.description
                : "---"}
            </p>
            {ascendantSign !== "--" && (
              <p className="text-sm text-gray-700 leading-relaxed">
                Your ascendant is <span className="font-semibold">{ascendantSign}</span>
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Personality</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {getValue(aiGeneral?.personality) !== "--"
                ? aiGeneral.personality
                : getValue(overallPersonality) !== "--"
                ? overallPersonality
                : getValue(personality?.personality_report)
                ? personality.personality_report
                : "---"}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Physical Characteristics</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {getValue(aiGeneral?.physical) !== "--"
                ? aiGeneral.physical
                : getValue(ascInfluence?.physical_appearance) !== "--"
                ? ascInfluence.physical_appearance
                : getValue(personality?.physical_characteristics) !== "--"
                ? personality.physical_characteristics
                : "---"}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Health</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {getValue(aiGeneral?.health) !== "--"
                ? aiGeneral.health
                : getValue(healthAnalysis?.constitution) !== "--"
                ? healthAnalysis.constitution
                : getValue(personality?.health_report) !== "--"
                ? personality.health_report
                : "---"}
            </p>
          </div>
        </div>
      );
    }

    if (activeSubTab === "Planetary") {
      const planets = ["Sun", "Moon", "Venus", "Mars", "Jupiter", "Saturn", "Rahu", "Ketu"];
      
      return (
        <div className="space-y-6">
          {planets.map((planetName) => {
            const consideration = getPlanetaryConsideration(planetName);
            return (
              <div key={planetName} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{consideration.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{consideration.subtitle}</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {consideration.description}
                </p>
              </div>
            );
          })}
        </div>
      );
    }

    if (activeSubTab === "Vimshottari Dasha") {
      if (!dasha?.dashas || dasha.dashas.length === 0) {
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-center text-gray-600">No Dasha data available</p>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          {dasha.dashas.map((dashaItem: any, index: number) => {
            const description = getValue(dashaItem.description);

            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {getValue(dashaItem.planet)} Mahadasha
                  </h3>
                  <span className="text-sm text-gray-600">
                    ({formatDate(dashaItem.start_date)} - {formatDate(dashaItem.end_date)})
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      );
    }

    if (activeSubTab === "Yoga") {
      const yogaList = yogas || horoscope?.yoga_analysis || [];

      if (!yogaList || yogaList.length === 0) {
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-center text-gray-600">No Yoga data available</p>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          {yogaList.map((yoga: any, index: number) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{getValue(yoga.name)}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {getValue(yoga.condition || yoga.type || yoga.subtitle)}
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {getValue(yoga.description || yoga.effects)}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-6xl mx-auto rounded-lg p-8">
      {/* Main Tabs */}
      <div className="flex items-center gap-0 mb-8 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveMainTab("general");
            setActiveSubTab("General");
          }}
          className={`px-8 py-3 cursor-pointer font-medium text-base transition-colors relative ${
            activeMainTab === "general"
              ? "text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
          style={activeMainTab === "general" ? { color: colors.primeYellow } : {}}
        >
          General
          {activeMainTab === "general" && (
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: colors.primeYellow }}></div>
          )}
        </button>
        <button
          onClick={() => setActiveMainTab("planetary")}
          className={`px-8 py-3 cursor-pointer font-medium text-base transition-colors relative ${
            activeMainTab === "planetary"
              ? "text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
          style={activeMainTab === "planetary" ? { color: colors.primeYellow } : {}}
        >
          Remedies
          {activeMainTab === "planetary" && (
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: colors.primeYellow }}></div>
          )}
        </button>
        <button
          onClick={() => setActiveMainTab("vimshottari")}
          className={`px-8 py-3 cursor-pointer font-medium text-base transition-colors relative ${
            activeMainTab === "vimshottari"
              ? "text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
          style={activeMainTab === "vimshottari" ? { color: colors.primeYellow } : {}}
        >
          Dosha
          {activeMainTab === "vimshottari" && (
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: colors.primeYellow }}></div>
          )}
        </button>
      </div>

      {/* Sub-tabs for General */}
      {activeMainTab === "general" && (
        <div className="flex gap-4 mb-6 flex-wrap">
          {generalSubTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                activeSubTab === tab
                  ? "text-gray-900"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              style={activeSubTab === tab ? { backgroundColor: colors.primeYellow } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <div className="mt-6">
        {activeMainTab === "general" && renderGeneralContent()}
        {activeMainTab === "planetary" && (
          <RemediesTabContent
            remedies={remedies}
            basicDetails={basicDetails}
            aiNarratives={aiFreeReport?.remedies}
          />
        )}
        {activeMainTab === "vimshottari" && (
          <DoshaTabContent 
            manglikAnalysis={kundliData.manglikAnalysis}
            sadesatiData={kundliData.manglikAnalysis?.sadesati}
            kalsarpaData={kundliData.manglikAnalysis?.all_doshas?.kaal_sarp_dosha}
            aiDoshaNarratives={aiFreeReport?.dosha}
          />
        )}
      </div>
    </div>
  );
};

export default FreeReportTab;
