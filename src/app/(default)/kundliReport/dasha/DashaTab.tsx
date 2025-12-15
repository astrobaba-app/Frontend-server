"use client";
import React, { useState, useMemo } from "react";
import { KundliResponse } from "@/store/api/kundli";
import { FiChevronRight } from "react-icons/fi";

interface DashaTabProps {
  kundliData: KundliResponse["kundli"];
}

interface DashaData {
  planet: string;
  startDate: string;
  endDate: string;
  subDashas?: DashaData[];
}

interface MahadashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  description: string;
  sign?: string;
  house?: number;
}

const getMahadashaDescription = (planet: string): string => {
  const key = (planet || "").trim();
  const baseDescriptions: Record<string, string> = {
    Ketu:
      "Ketu Mahadasha often brings detachment, spiritual growth, sudden separations, and strong inner experiences. It can disconnect you from material attachments so that you focus more on inner peace, intuition, and past‑life karmas.",
    Venus:
      "Venus Mahadasha is a period of relationships, comforts, luxuries, beauty and creativity. It can enhance love life, partnerships and artistic talents, but may also increase indulgence or attachment to pleasure if Venus is weak.",
    Sun:
      "Sun Mahadasha highlights authority, self‑expression, ego, father figures and career recognition. It can bring leadership opportunities and visibility, but also ego clashes or health strain if the Sun is afflicted.",
    Moon:
      "Moon Mahadasha is strongly emotional and mental. It influences peace of mind, mother, home, fluids and public popularity. This period can make you more sensitive and intuitive, but also prone to mood swings if Moon is weak.",
    Mars:
      "Mars Mahadasha activates courage, energy, ambition, competition and aggression. It can support bold actions, sports and technical pursuits, yet may also bring conflicts, injuries or impulsive decisions when not handled wisely.",
    Rahu:
      "Rahu Mahadasha often brings sudden events, foreign connections, unconventional paths and strong material desires. It can give rapid rise and worldly gains, but also confusion, obsessions or scandals if not guided properly.",
    Jupiter:
      "Jupiter Mahadasha is usually considered highly benefic, supporting wisdom, education, wealth, children, dharma and protection. It can open doors for growth and blessings, depending on Jupiter's strength and house placement.",
    Saturn:
      "Saturn Mahadasha emphasizes discipline, responsibilities, hard work, delays and karmic lessons. It can be demanding but ultimately stabilizing, rewarding consistent effort and maturity over time.",
    Mercury:
      "Mercury Mahadasha focuses on intellect, communication, business, networking and analytical ability. It supports studies, trade, writing and negotiations, but may bring restlessness or overthinking if Mercury is weak.",
  };

  if (baseDescriptions[key]) return baseDescriptions[key];

  if (!key) {
    return "This Mahadasha period brings results according to the planet's strength, sign and house placement in your birth chart.";
  }

  return `This Mahadasha period is governed by ${key}, and its results will depend on how ${key} is placed and aspected in your horoscope.`;
};

const DashaTab: React.FC<DashaTabProps> = ({ kundliData }) => {
  const [dashaType, setDashaType] = useState<"vimshottari" | "yogini">(
    "vimshottari"
  );
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState<DashaData[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<string>("");

  const getValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "--";
    return value;
  };

  // Format date from YYYY-MM-DD to DD-MM-YYYY
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

  // Get Vimshottari Dasha data from API
  const vimshottariMahadashas: DashaData[] = useMemo(() => {
    if (!kundliData?.dasha?.dashas || !Array.isArray(kundliData.dasha.dashas)) return [];
    return kundliData.dasha.dashas.map((dasha: any) => ({
      planet: dasha.planet || "--",
      startDate: formatDate(dasha.start_date),
      endDate: formatDate(dasha.end_date),
      subDashas: dasha.sub_dashas && Array.isArray(dasha.sub_dashas) 
        ? dasha.sub_dashas.map((sub: any) => ({
            planet: sub.planet || "--",
            startDate: formatDate(sub.start_date),
            endDate: formatDate(sub.end_date),
            subDashas: sub.sub_dashas && Array.isArray(sub.sub_dashas)
              ? sub.sub_dashas.map((subsub: any) => ({
                  planet: subsub.planet || "--",
                  startDate: formatDate(subsub.start_date),
                  endDate: formatDate(subsub.end_date),
                  subDashas: subsub.sub_dashas && Array.isArray(subsub.sub_dashas)
                    ? subsub.sub_dashas.map((subsubsub: any) => ({
                        planet: subsubsub.planet || "--",
                        startDate: formatDate(subsubsub.start_date),
                        endDate: formatDate(subsubsub.end_date),
                      }))
                    : undefined,
                }))
              : undefined,
          }))
        : undefined,
    }));
  }, [kundliData]);

  // Get Yogini Dasha data from API
  const yoginiDashas: DashaData[] = useMemo(() => {
    if (!kundliData?.yogini?.dashas || !Array.isArray(kundliData.yogini.dashas)) return [];
    return kundliData.yogini.dashas.map((dasha: any) => ({
      planet: dasha.planet || "--",
      startDate: formatDate(dasha.start_date),
      endDate: formatDate(dasha.end_date),
      subDashas: dasha.sub_dashas && Array.isArray(dasha.sub_dashas)
        ? dasha.sub_dashas.map((sub: any) => ({
            planet: sub.planet || "--",
            startDate: formatDate(sub.start_date),
            endDate: formatDate(sub.end_date),
            subDashas: sub.sub_dashas && Array.isArray(sub.sub_dashas)
              ? sub.sub_dashas.map((subsub: any) => ({
                  planet: subsub.planet || "--",
                  startDate: formatDate(subsub.start_date),
                  endDate: formatDate(subsub.end_date),
                  subDashas: subsub.sub_dashas && Array.isArray(subsub.sub_dashas)
                    ? subsub.sub_dashas.map((subsubsub: any) => ({
                        planet: subsubsub.planet || "--",
                        startDate: formatDate(subsubsub.start_date),
                        endDate: formatDate(subsubsub.end_date),
                      }))
                    : undefined,
                }))
              : undefined,
          }))
        : undefined,
    }));
  }, [kundliData]);



  // Get Mahadasha periods with descriptions from backend
  const mahadashaPeriods: MahadashaPeriod[] = useMemo(() => {
    if (!kundliData?.dasha?.dashas) return [];
    
    return kundliData.dasha.dashas.map((dasha: any) => ({
      planet: `${dasha.planet || "--"} Mahadasha`,
      startDate: `(${formatDate(dasha.start_date)} - ${formatDate(dasha.end_date)})`,
      endDate: formatDate(dasha.end_date),
      description: dasha.description || getMahadashaDescription(dasha.planet),
      sign: dasha.sign || "--",
      house: dasha.house || 0,
    }));
  }, [kundliData]);



  const handleDashaClick = (dasha: DashaData) => {
    // Only show data if sub-dashas are available from API
    if (dasha.subDashas && dasha.subDashas.length > 0) {
      const newBreadcrumb = [...breadcrumb, dasha.planet];
      setBreadcrumb(newBreadcrumb);
      setSelectedPlanet(dasha.planet);
      setCurrentLevel(dasha.subDashas);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Go back to main level
      setBreadcrumb([]);
      setCurrentLevel([]);
      setSelectedPlanet("");
    } else {
      // Navigate to specific breadcrumb level
      const newBreadcrumb = breadcrumb.slice(0, index + 1);
      setBreadcrumb(newBreadcrumb);

      // Rebuild the current level by navigating through the hierarchy
      const mainDashas = dashaType === "vimshottari" ? vimshottariMahadashas : yoginiDashas;
      let currentData: DashaData[] = mainDashas;

      for (let i = 0; i < newBreadcrumb.length; i++) {
        const planetName = newBreadcrumb[i];
        const found = currentData.find(d => d.planet === planetName);
        
        if (found && i === newBreadcrumb.length - 1) {
          // Last breadcrumb - show its subDashas
          setCurrentLevel(found.subDashas || []);
          return;
        } else if (found && found.subDashas) {
          // Continue navigation
          currentData = found.subDashas;
        } else {
          // Data not found, reset to main
          setBreadcrumb([]);
          setCurrentLevel([]);
          setSelectedPlanet("");
          return;
        }
      }
    }
  };

  const getCurrentData = (): DashaData[] => {
    if (breadcrumb.length === 0) {
      return dashaType === "vimshottari" ? vimshottariMahadashas : yoginiDashas;
    }
    return currentLevel;
  };

  const hasData = (): boolean => {
    return dashaType === "vimshottari" ? vimshottariMahadashas.length > 0 : yoginiDashas.length > 0;
  };

  const getCurrentTitle = (): string => {
    if (dashaType === "yogini") {
      // Get the first planet from yogini dashas for dynamic title
      return kundliData?.yogini?.birth_nakshatra || "Yogini Dasha";
    }
    return "Understanding your dasha";
  };

  const renderBreadcrumb = () => {
    if (breadcrumb.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => handleBreadcrumbClick(-1)}
            className="text-gray-700 hover:text-gray-900"
          >
            {getCurrentTitle()}
          </button>
          {breadcrumb.map((crumb, index) => (
            <React.Fragment key={index}>
              <span className="text-gray-400">&gt;</span>
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={
                  index === breadcrumb.length - 1
                    ? "text-[#FFD900] font-semibold"
                    : "text-gray-700 hover:text-gray-900"
                }
              >
                {crumb}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderTable = () => {
    const data = getCurrentData();
    
    // Show no data message if data is not available
    if (data.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-6">
          <p className="text-gray-500 text-sm">
            {dashaType === "vimshottari" ? "Vimshottari Dasha" : "Yogini Dasha"} data is not available for this kundli.
          </p>
        </div>
      );
    }

    // Check if any dasha in current data has subDashas
    const hasAnySubDashas = data.some(d => d.subDashas && d.subDashas.length > 0);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="border-r border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Planet
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Start Date
                </th>
                <th
                  className={`px-4 py-3 text-center text-sm font-semibold text-gray-700 ${
                    hasAnySubDashas ? "border-r border-gray-300" : ""
                  }`}
                >
                  End Date
                </th>
                {hasAnySubDashas && <th className="w-12"></th>}
              </tr>
            </thead>
            <tbody>
              {data.map((dasha, index) => {
                const hasSubDashas = dasha.subDashas && dasha.subDashas.length > 0;
                return (
                  <tr
                    key={index}
                    className="bg-white border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="border-r border-gray-300 px-4 py-3 text-center text-sm text-gray-800">
                      {getValue(dasha.planet)}
                    </td>
                    <td className="border-r border-gray-300 px-4 py-3 text-center text-sm text-gray-800">
                      {getValue(dasha.startDate)}
                    </td>
                    <td
                      className={`px-4 py-3 text-center text-sm text-gray-800 ${
                        hasAnySubDashas ? "border-r border-gray-300" : ""
                      }`}
                    >
                      {getValue(dasha.endDate)}
                    </td>
                    {hasAnySubDashas && (
                      <td className="px-4 py-3 text-center">
                        {hasSubDashas ? (
                          <button
                            onClick={() => handleDashaClick(dasha)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiChevronRight className="w-5 h-5" />
                          </button>
                        ) : (
                          <span className="w-5 h-5 inline-block"></span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderNote = () => {
    if (dashaType !== "yogini") return null;

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-800">
          <span className="font-semibold">Note:</span> MAN: Mangala, PIN:
          Pingala, DHA: Dhanya, BHR: Bhramari, BHA: Bhadrika, ULK: Ulka, SID:
          Siddha, SAN: Sankata
        </p>
      </div>
    );
  };

  const renderMahadashaPeriods = () => {
    if (dashaType !== "vimshottari" || breadcrumb.length > 0) return null;

    return (
      <div className="space-y-6 mb-6">
        {mahadashaPeriods.map((period, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {period.planet}
              </h3>
              <span className="text-sm text-gray-600">{period.startDate}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {period.description}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Dasha Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden bg-white">
          <button
            onClick={() => {
              setDashaType("vimshottari");
              setBreadcrumb([]);
              setCurrentLevel([]);
            }}
            className={`px-8 py-2 font-semibold text-sm ${
              dashaType === "vimshottari"
                ? "bg-[#FFD900] text-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Vimshottari
          </button>
          <button
            onClick={() => {
              setDashaType("yogini");
              setBreadcrumb([]);
              setCurrentLevel([]);
            }}
            className={`px-8 py-2 font-semibold text-sm border-l border-gray-300 ${
              dashaType === "yogini"
                ? "bg-[#FFD900] text-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Yogini
          </button>
        </div>
      </div>

      {/* Title */}
      {breadcrumb.length === 0 && hasData() && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {getCurrentTitle()}
        </h2>
      )}

      {/* Breadcrumb */}
      {renderBreadcrumb()}

      {/* Main Table - Only for Yogini */}
      {dashaType === "yogini" && renderTable()}

      {/* Note for Yogini - Only show if data exists */}
      {hasData() && renderNote()}

      {/* Mahadasha Period Descriptions - Only for Vimshottari */}
      {hasData() && renderMahadashaPeriods()}

      {/* Show message for Vimshottari when no data */}
      {dashaType === "vimshottari" && !hasData() && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">Vimshottari Dasha data is not available for this kundli.</p>
        </div>
      )}
    </div>
  );
};

export default DashaTab;
