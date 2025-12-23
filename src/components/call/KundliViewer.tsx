"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronRight, Eye, Loader2 } from "lucide-react";
import { getUserKundlisForCall, getKundliForCall } from "@/store/api/call/kundli";
import type { UserKundliListItem } from "@/store/api/call/kundli";

interface KundliViewerProps {
  callId: string;
  onClose: () => void;
}

const KundliViewer: React.FC<KundliViewerProps> = ({ callId, onClose }) => {
  const [kundliList, setKundliList] = useState<UserKundliListItem[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [selectedKundli, setSelectedKundli] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [error, setError] = useState<string | null>(null);

  // Load user's Kundli list
  useEffect(() => {
    loadKundliList();
  }, [callId]);

  const loadKundliList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserKundlisForCall(callId);
      setKundliList(response.userRequests);
      setUserName(response.userName);
    } catch (err: any) {
      console.error("Failed to load kundli list:", err);
      setError(err.message || "Failed to load user's Kundlis");
    } finally {
      setLoading(false);
    }
  };

  const loadKundliDetails = async (userRequestId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getKundliForCall(callId, userRequestId);
      setSelectedKundli(response.kundli);
      setViewMode("detail");
    } catch (err: any) {
      console.error("Failed to load kundli details:", err);
      setError(err.message || "Failed to load Kundli details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-yellow-400 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {viewMode === "list" ? "User's Kundlis" : "Kundli Details"}
          </h2>
          {userName && <p className="text-sm text-gray-700">{userName}</p>}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-yellow-500 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-900" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => (viewMode === "list" ? loadKundliList() : null)}
              className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500"
            >
              Retry
            </button>
          </div>
        ) : viewMode === "list" ? (
          <div className="p-4">
            {kundliList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No Kundli found for this user</p>
              </div>
            ) : (
              <div className="space-y-3">
                {kundliList.map((kundli) => (
                  <div
                    key={kundli.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-yellow-400 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => loadKundliDetails(kundli.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {kundli.fullName}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                          <p>📅 {formatDate(kundli.dateOfbirth)}</p>
                          <p>🕒 {formatTime(kundli.timeOfbirth)}</p>
                          <p>📍 {kundli.placeOfBirth}</p>
                          <p>
                            👤{" "}
                            {kundli.gender === "male"
                              ? "Male"
                              : kundli.gender === "female"
                              ? "Female"
                              : "Other"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <KundliDetailView
            kundli={selectedKundli}
            onBack={() => {
              setViewMode("list");
              setSelectedKundli(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Kundli Detail View Component
const KundliDetailView: React.FC<{ kundli: any; onBack: () => void }> = ({
  kundli,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<string>("basic");

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "planetary", label: "Planets" },
    { id: "panchang", label: "Panchang" },
    { id: "dasha", label: "Dasha" },
    { id: "charts", label: "Charts" },
    { id: "remedies", label: "Remedies" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Back Button */}
      <div className="p-4 border-b">
        <button
          onClick={onBack}
          className="text-yellow-500 hover:text-yellow-600 font-medium flex items-center gap-1"
        >
          ← Back to List
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b overflow-x-auto">
        <div className="flex gap-1 p-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "basic" && (
          <BasicInfoTab kundli={kundli} />
        )}
        {activeTab === "planetary" && (
          <PlanetaryTab kundli={kundli} />
        )}
        {activeTab === "panchang" && (
          <PanchangTab kundli={kundli} />
        )}
        {activeTab === "dasha" && (
          <DashaTab kundli={kundli} />
        )}
        {activeTab === "charts" && (
          <ChartsTab kundli={kundli} />
        )}
        {activeTab === "remedies" && (
          <RemediesTab kundli={kundli} />
        )}
      </div>
    </div>
  );
};

// Basic Info Tab
const BasicInfoTab: React.FC<{ kundli: any }> = ({ kundli }) => {
  const basic = kundli.basicDetails;
  const userReq = kundli.userRequest;
  const panchang = kundli.panchang;

  // Helper to safely extract value from complex objects
  const getValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "object" && value.name) return value.name;
    if (typeof value === "object" && value.sign) return value.sign;
    return "N/A";
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3">Personal Details</h3>
        <div className="space-y-2 text-sm">
          <InfoRow label="Name" value={userReq?.fullName} />
          <InfoRow label="Gender" value={userReq?.gender} />
          <InfoRow label="Date of Birth" value={userReq?.dateOfbirth} />
          <InfoRow label="Time of Birth" value={userReq?.timeOfbirth} />
          <InfoRow label="Place of Birth" value={userReq?.placeOfBirth} />
        </div>
      </div>

      {basic && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3">Astrological Details</h3>
          <div className="space-y-2 text-sm">
            <InfoRow label="Sun Sign" value={getValue(basic.sun_sign)} />
            <InfoRow label="Moon Sign" value={getValue(basic.moon_sign)} />
            <InfoRow label="Ascendant" value={getValue(basic.ascendant)} />
            <InfoRow label="Nakshatra" value={getValue(panchang?.nakshatra)} />
            <InfoRow label="Pada" value={getValue(panchang?.nakshatra?.pada || basic.pada)} />
          </div>
        </div>
      )}
    </div>
  );
};

// Planetary Tab
const PlanetaryTab: React.FC<{ kundli: any }> = ({ kundli }) => {
  // Handle planetary data - it's an object with planet names as keys
  const planetaryData = kundli.planetary || {};
  const planetaryArray: any[] = Object.values(planetaryData).filter((p: any) => 
    typeof p === 'object' && p !== null && 'planet' in p
  );

  const getValue = (value: any): string => {
    if (value === null || value === undefined || value === "" || value === "--") return "--";
    return String(value);
  };

  const getRetroStatus = (isRetro: boolean | null | undefined): string => {
    if (isRetro === null || isRetro === undefined) return "--";
    return isRetro ? "Retro" : "Direct";
  };

  const formatDegree = (planet: any): string => {
    const degree = planet.sign_degree || planet.normDegree || planet.degree;
    if (degree === null || degree === undefined) return "--";
    return `${Number(degree).toFixed(2)}°`;
  };

  // Get sign lord based on sign
  const getSignLord = (sign: string): string => {
    const signLords: Record<string, string> = {
      'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury',
      'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
      'Libra': 'Venus', 'Scorpio': 'Mars', 'Sagittarius': 'Jupiter',
      'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    };
    return signLords[sign] || '--';
  };

  // Get nakshatra lord
  const getNakshatraLord = (nakshatra: string): string => {
    const nakshatraLords: Record<string, string> = {
      'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun',
      'Rohini': 'Moon', 'Mrigashira': 'Mars', 'Ardra': 'Rahu',
      'Punarvasu': 'Jupiter', 'Pushya': 'Saturn', 'Ashlesha': 'Mercury',
      'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
      'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu',
      'Vishakha': 'Jupiter', 'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury',
      'Mula': 'Ketu', 'Purva Ashadha': 'Venus', 'Uttara Ashadha': 'Sun',
      'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
      'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury'
    };
    return nakshatraLords[nakshatra] || '--';
  };

  // Calculate house number based on ascendant and planet longitude
  const getHouseNumber = (planetLongitude: number): number => {
    const ascendantData = planetaryArray.find((p: any) => p?.planet === 'Ascendant');
    const ascendantLongitude = ascendantData?.longitude || 0;
    let house = Math.floor((planetLongitude - ascendantLongitude + 360) / 30) + 1;
    if (house > 12) house -= 12;
    if (house < 1) house += 12;
    return house;
  };

  const getStatusLabel = (planet: any): string => {
    const planetName = planet.planet?.toLowerCase();
    const sign = planet.sign?.toLowerCase();
    
    // Check for exaltation
    if (
      (planetName === "sun" && sign === "aries") ||
      (planetName === "moon" && sign === "taurus") ||
      (planetName === "mars" && sign === "capricorn") ||
      (planetName === "mercury" && sign === "virgo") ||
      (planetName === "jupiter" && sign === "cancer") ||
      (planetName === "venus" && sign === "pisces") ||
      (planetName === "saturn" && sign === "libra")
    ) {
      return "Exalted";
    }
    
    // Check for debilitation
    if (
      (planetName === "sun" && sign === "libra") ||
      (planetName === "moon" && sign === "scorpio") ||
      (planetName === "mars" && sign === "cancer") ||
      (planetName === "mercury" && sign === "pisces") ||
      (planetName === "jupiter" && sign === "capricorn") ||
      (planetName === "venus" && sign === "virgo") ||
      (planetName === "saturn" && sign === "aries")
    ) {
      return "Debilitated";
    }
    
    // Check if planet owns the sign
    const signLord = getSignLord(planet.sign);
    if (signLord.toLowerCase() === planetName) {
      return "Own Sign";
    }
    
    return "Neutral";
  };

  if (planetaryArray.length === 0) {
    return <p className="text-gray-500 text-center py-8">No planetary data available</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              Planet
            </th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              Sign
            </th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              Sign Lord
            </th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              Nakshatra
            </th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              Naksh Lord
            </th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              Degree
            </th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              Retro(R)
            </th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              Combust
            </th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              Avastha
            </th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              House
            </th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {planetaryArray.map((planet: any, index: number) => {
            const status = getStatusLabel(planet);
            const signLord = getSignLord(planet.sign);
            const nakshatraLord = getNakshatraLord(planet.nakshatra);
            const houseNumber = planet.longitude ? getHouseNumber(planet.longitude) : '--';
            
            return (
              <tr
                key={index}
                className="bg-white"
              >
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {getValue(planet.planet)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {getValue(planet.sign)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {signLord}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {getValue(planet.nakshatra)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {nakshatraLord}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {formatDegree(planet)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {getRetroStatus(planet.is_retrograde)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {planet.is_combust === true
                    ? "Yes"
                    : planet.is_combust === false
                    ? "No"
                    : "--"}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {getValue(planet.avastha)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {houseNumber}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-gray-800">
                  {status || "--"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Panchang Tab
const PanchangTab: React.FC<{ kundli: any }> = ({ kundli }) => {
  const panchang = kundli.panchang;

  const getValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "object" && value.name) return value.name;
    return "N/A";
  };

  if (!panchang) {
    return <p className="text-gray-500 text-center py-8">No panchang data available</p>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3">Panchang Details</h3>
        <div className="space-y-2 text-sm">
          <InfoRow label="Tithi" value={getValue(panchang.tithi)} />
          <InfoRow label="Nakshatra" value={getValue(panchang.nakshatra)} />
          <InfoRow label="Yoga" value={getValue(panchang.yoga)} />
          <InfoRow label="Karana" value={getValue(panchang.karana)} />
          <InfoRow label="Day" value={getValue(panchang.day || panchang.weekday)} />
        </div>
      </div>

      {panchang.nakshatra && typeof panchang.nakshatra === "object" && (
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3">Nakshatra Details</h3>
          <div className="space-y-2 text-sm">
            <InfoRow label="Name" value={getValue(panchang.nakshatra.name)} />
            <InfoRow label="Pada" value={getValue(panchang.nakshatra.pada)} />
            <InfoRow label="Lord" value={getValue(panchang.nakshatra.lord)} />
          </div>
        </div>
      )}
    </div>
  );
};

// Dasha Tab
const DashaTab: React.FC<{ kundli: any }> = ({ kundli }) => {
  const [activeTab, setActiveTab] = useState<"Mahadasha" | "Antardasha" | "Pratyantardasha" | "Sookshmadasha">("Mahadasha");
  const [selectedMahadasha, setSelectedMahadasha] = useState<any | null>(null);
  const [selectedAntardasha, setSelectedAntardasha] = useState<any | null>(null);
  const [selectedPratyantardasha, setSelectedPratyantardasha] = useState<any | null>(null);

  // Handle both array and object with dashas property
  const dashaData = kundli.dasha?.dashas || kundli.dasha || [];
  const dashas = Array.isArray(dashaData) ? dashaData : [];

  if (dashas.length === 0) {
    return <p className="text-gray-500 text-center py-8">No dasha data available</p>;
  }

  const tabs = ["Mahadasha", "Antardasha", "Pratyantardasha", "Sookshmadasha"] as const;

  // Generate Antardasha for a given Mahadasha
  const generateAntardasha = (mahadasha: any): any[] => {
    const planets = ["Mercury", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn"];
    const startIdx = planets.indexOf(mahadasha.planet);
    if (startIdx === -1) return [];
    
    const orderedPlanets = [...planets.slice(startIdx), ...planets.slice(0, startIdx)];
    const startDate = new Date(mahadasha.start || mahadasha.start_date);
    const endDate = new Date(mahadasha.end || mahadasha.end_date);
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
        start: currentStart.toISOString().split('T')[0],
        end: currentEnd.toISOString().split('T')[0],
        years: daysForThisPlanet / 365.25
      };
    });
  };

  // Generate Pratyantardasha for a given Antardasha
  const generatePratyantardasha = (antardasha: any): any[] => {
    const [maha, antar] = antardasha.planet.split('-');
    const planets = ["Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu"];
    const startIdx = planets.indexOf(antar);
    if (startIdx === -1) return [];
    
    const orderedPlanets = [...planets.slice(startIdx), ...planets.slice(0, startIdx)];
    const startDate = new Date(antardasha.start);
    const endDate = new Date(antardasha.end);
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
        start: currentStart.toISOString().split('T')[0],
        end: currentEnd.toISOString().split('T')[0],
        years: daysForThisPlanet / 365.25
      };
    });
  };

  // Generate Sookshmadasha for a given Pratyantardasha
  const generateSookshmadasha = (pratyantardasha: any): any[] => {
    const parts = pratyantardasha.planet.split('-');
    const pratyantar = parts[parts.length - 1];
    const planets = ["Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu", "Venus"];
    const startIdx = planets.indexOf(pratyantar);
    if (startIdx === -1) return [];
    
    const orderedPlanets = [...planets.slice(startIdx), ...planets.slice(0, startIdx)];
    const startDate = new Date(pratyantardasha.start);
    const endDate = new Date(pratyantardasha.end);
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
        start: currentStart.toISOString().split('T')[0],
        end: currentEnd.toISOString().split('T')[0],
        years: daysForThisPlanet / 365.25
      };
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab, index) => (
          <button
            key={tab}
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
            className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-xs ${
              activeTab === tab
                ? "bg-yellow-400 text-gray-900"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
              activeTab === tab ? "bg-yellow-200 text-gray-900" : "bg-gray-300 text-gray-700"
            }`}>
              {index + 1}
            </span>
            <span className="font-semibold">{tab}</span>
          </button>
        ))}
      </div>

      {/* Dasha Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-orange-100">
            <tr>
              <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold">
                {activeTab}
              </th>
              <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold">
                Start
              </th>
              <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold">
                End
              </th>
              <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold">
                Years
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Mahadasha View */}
            {activeTab === "Mahadasha" && dashas.map((dasha: any, index: number) => (
              <tr
                key={index}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedMahadasha(dasha);
                  setActiveTab("Antardasha");
                }}
              >
                <td className="border border-gray-300 px-2 py-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {dasha.planet}
                      {dasha.is_balance && (
                        <span className="text-[10px] text-orange-500">(Balance)</span>
                      )}
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-1.5">
                  {formatDate(dasha.start || dasha.start_date)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5">
                  {formatDate(dasha.end || dasha.end_date)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5">
                  {(dasha.years || 0).toFixed(2)}
                </td>
              </tr>
            ))}

            {/* Antardasha View */}
            {activeTab === "Antardasha" && selectedMahadasha && 
              generateAntardasha(selectedMahadasha).map((antardasha: any, index: number) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedAntardasha(antardasha);
                    setActiveTab("Pratyantardasha");
                  }}
                >
                  <td className="border border-gray-300 px-2 py-1.5">
                    <div className="flex items-center justify-between">
                      <span>{antardasha.planet}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {formatDate(antardasha.start)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {formatDate(antardasha.end)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {antardasha.years.toFixed(2)}
                  </td>
                </tr>
              ))}

            {/* Pratyantardasha View */}
            {activeTab === "Pratyantardasha" && selectedAntardasha && 
              generatePratyantardasha(selectedAntardasha).map((pratyantar: any, index: number) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedPratyantardasha(pratyantar);
                    setActiveTab("Sookshmadasha");
                  }}
                >
                  <td className="border border-gray-300 px-2 py-1.5">
                    <div className="flex items-center justify-between">
                      <span>{pratyantar.planet}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {formatDate(pratyantar.start)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {formatDate(pratyantar.end)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {pratyantar.years.toFixed(2)}
                  </td>
                </tr>
              ))}

            {/* Sookshmadasha View */}
            {activeTab === "Sookshmadasha" && selectedPratyantardasha && 
              generateSookshmadasha(selectedPratyantardasha).map((sookshma: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-1.5">
                    {sookshma.planet}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {formatDate(sookshma.start)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {formatDate(sookshma.end)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {sookshma.years.toFixed(2)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Charts Tab
const ChartsTab: React.FC<{ kundli: any }> = ({ kundli }) => {
  const [chartType, setChartType] = useState<'north' | 'south'>('north');
  const charts = kundli.charts;
  
  // Get ascendant info for D1 chart
  const ascSignNum = kundli.basicDetails?.ascendant_sign_num || 0;

  if (!charts) {
    return <p className="text-gray-500 text-center py-8">No chart data available</p>;
  }

  // Chart names mapping - check if charts is array or object
  const chartDataArray = Array.isArray(charts) ? charts : Object.values(charts);
  
  if (chartDataArray.length === 0) {
    return <p className="text-gray-500 text-center py-8">No chart data available</p>;
  }

  return (
    <div className="space-y-4">
      {/* Chart Type Toggle */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setChartType('north')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            chartType === 'north'
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          North Indian
        </button>
        <button
          onClick={() => setChartType('south')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            chartType === 'south'
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          South Indian
        </button>
      </div>

      {/* Charts Grid */}
      <div className="space-y-4">
        {chartDataArray.map((chartData: any, index: number) => {
          if (!chartData || !chartData.planets) return null;

          const chartName = chartData.name || chartData.division || `Chart ${index + 1}`;
          const isD1 = chartData.division === 'D1' || index === 0;

          return (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-bold text-gray-900 mb-2 text-center text-sm">
                {chartName}
              </h4>
              {chartData.matters && (
                <p className="text-xs text-gray-600 text-center mb-2">{chartData.matters}</p>
              )}
              <div className="bg-white p-2 rounded">
                <DivisionalChart 
                  type={chartType} 
                  chartData={chartData} 
                  ascSignNum={isD1 ? ascSignNum : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Divisional Chart Component  
const DivisionalChart: React.FC<{ 
  type: 'north' | 'south'; 
  chartData: any;
  ascSignNum?: number;
}> = ({ type, chartData, ascSignNum }) => {
  // Map to store planets by sign number with degrees
  const signPlanetsMap = new Map<number, Array<{ name: string; degree: number }>>();
  
  // Initialize all 12 signs
  for (let i = 0; i < 12; i++) {
    signPlanetsMap.set(i, []);
  }
  
  // Group planets by their sign from backend data
  if (chartData && chartData.planets) {
    Object.entries(chartData.planets).forEach(([planetName, planetData]: [string, any]) => {
      const signNum = planetData.sign_num;
      const planets = signPlanetsMap.get(signNum) || [];
      
      // Use abbreviations for planets
      const abbreviations: Record<string, string> = {
        'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
        'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 
        'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl', 'Ascendant': 'Asc'
      };
      
      planets.push({
        name: abbreviations[planetName] || planetName.substring(0, 2),
        degree: planetData.degree || 0
      });
      signPlanetsMap.set(signNum, planets);
    });
  }

  // Add Ascendant marker to the appropriate sign (for D1 charts)
  if (typeof ascSignNum === "number") {
    const existing = signPlanetsMap.get(ascSignNum) || [];
    existing.unshift({ name: "Asc", degree: 0 });
    signPlanetsMap.set(ascSignNum, existing);
  }

  const getPlanetColor = (planetName: string): string => {
    const colors: Record<string, string> = {
      'Su': '#FFA500', 'Mo': '#9370DB', 'Ma': '#DC143C', 'Me': '#32CD32',
      'Ju': '#DAA520', 'Ve': '#FF1493', 'Sa': '#4169E1', 'Ra': '#8B4513', 
      'Ke': '#A0522D', 'Ur': '#4682B4', 'Ne': '#20B2AA', 'Pl': '#DA70D6', 'Asc': '#9932CC'
    };
    return colors[planetName] || '#333333';
  };

  if (type === 'north') {
    // North Indian Diamond Chart - house positions
    const housePositions = [
      { house: 1, top: '10%', left: '50%' },      // Top
      { house: 2, top: '20%', left: '70%' },      // Top right
      { house: 3, top: '35%', left: '85%' },      // Right upper
      { house: 4, top: '50%', left: '90%' },      // Right
      { house: 5, top: '65%', left: '85%' },      // Right lower
      { house: 6, top: '80%', left: '70%' },      // Bottom right
      { house: 7, top: '90%', left: '50%' },      // Bottom
      { house: 8, top: '80%', left: '30%' },      // Bottom left
      { house: 9, top: '65%', left: '15%' },      // Left lower
      { house: 10, top: '50%', left: '10%' },     // Left
      { house: 11, top: '35%', left: '15%' },     // Left upper
      { house: 12, top: '20%', left: '30%' },     // Top left
    ];

    // House to sign mapping (rotate so house 1 = Ascendant sign)
    const asc = typeof ascSignNum === "number" ? ascSignNum : 0;
    const houseToSignMap: Record<number, number> = {};
    for (let house = 1; house <= 12; house++) {
      houseToSignMap[house] = (asc + house - 1) % 12;
    }

    return (
      <div className="relative w-full aspect-square bg-yellow-50">
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          {/* Diamond shape */}
          <rect x="0" y="0" width="200" height="200" fill="none" stroke="#999" strokeWidth="1" />
          <line x1="0" y1="0" x2="200" y2="200" stroke="#999" strokeWidth="1" />
          <line x1="200" y1="0" x2="0" y2="200" stroke="#999" strokeWidth="1" />
          <line x1="100" y1="0" x2="200" y2="100" stroke="#999" strokeWidth="1" />
          <line x1="200" y1="100" x2="100" y2="200" stroke="#999" strokeWidth="1" />
          <line x1="100" y1="200" x2="0" y2="100" stroke="#999" strokeWidth="1" />
          <line x1="0" y1="100" x2="100" y2="0" stroke="#999" strokeWidth="1" />
        </svg>

        {/* House numbers and planets */}
        {housePositions.map(({ house, top, left }) => {
          const signNum = houseToSignMap[house];
          const planets = signPlanetsMap.get(signNum) || [];

          return (
            <div
              key={house}
              className="absolute"
              style={{ 
                top, 
                left, 
                transform: 'translate(-50%, -50%)',
                width: '18%',
                maxWidth: '60px'
              }}
            >
              <div className="text-[8px] text-gray-400 font-bold mb-0.5">{house}</div>
              {planets.length > 0 ? (
                <div className="flex flex-col gap-0.5">
                  {planets.map((planet, idx) => (
                    <span
                      key={idx}
                      style={{ color: getPlanetColor(planet.name) }}
                      className="text-[7px] font-semibold whitespace-nowrap"
                    >
                      {planet.name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  // South Indian Chart (Grid)
  const signPositions = [
    { sign: 0, row: 0, col: 0 }, { sign: 1, row: 0, col: 1 }, 
    { sign: 2, row: 0, col: 2 }, { sign: 3, row: 0, col: 3 },
    { sign: 4, row: 1, col: 3 }, { sign: 5, row: 2, col: 3 }, 
    { sign: 6, row: 3, col: 3 }, { sign: 7, row: 3, col: 2 },
    { sign: 8, row: 3, col: 1 }, { sign: 9, row: 3, col: 0 }, 
    { sign: 10, row: 2, col: 0 }, { sign: 11, row: 1, col: 0 }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-0 border border-gray-600 bg-yellow-50">
        {signPositions.map(({ sign }) => {
          const planets = signPlanetsMap.get(sign) || [];

          return (
            <div
              key={sign}
              className="border border-gray-400 p-1 min-h-[50px] flex flex-col justify-center items-center"
            >
              <div className="flex flex-col gap-0.5 items-center w-full">
                {planets.length > 0 ? (
                  planets.map((planet, idx) => (
                    <span
                      key={idx}
                      style={{ color: getPlanetColor(planet.name) }}
                      className="text-[7px] font-bold whitespace-nowrap"
                    >
                      {planet.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-[8px]">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Remedies Tab
const RemediesTab: React.FC<{ kundli: any }> = ({ kundli }) => {
  const [activeSubTab, setActiveSubTab] = React.useState<"rudraksha" | "gemstone">("rudraksha");
  
  const remedies = kundli.remedies;

  const getValue = (value: any): string => {
    if (value === null || value === undefined || value === "") return "--";
    if (typeof value === "string") return value;
    if (typeof value === "object" && value.name) return value.name;
    return String(value);
  };

  if (!remedies) {
    return <p className="text-gray-500 text-center py-8">No remedies available</p>;
  }

  // Get suggested rudrakshas from backend (e.g., "4-Mukhi" or "5-Mukhi")
  const suggestedRudrakshas = Array.isArray(remedies?.rudraksha?.suggested) 
    ? remedies.rudraksha.suggested 
    : remedies?.rudraksha?.suggested 
    ? [remedies.rudraksha.suggested] 
    : ["4-Mukhi", "5-Mukhi"];
  const [activeMukhiTab, setActiveMukhiTab] = React.useState<string>(suggestedRudrakshas[0] || "4-Mukhi");

  // Get Rudraksha details from backend
  const getRudrakshaMukhiData = (mukhiType: string) => {
    const mukhiData = remedies?.rudraksha?.mukhi_details?.[mukhiType];
    return {
      details: getValue(mukhiData?.details),
      benefits: Array.isArray(mukhiData?.benefits) ? mukhiData.benefits : [],
      howToWear: getValue(mukhiData?.how_to_wear),
      precautions: Array.isArray(mukhiData?.precautions) ? mukhiData.precautions : [],
    };
  };

  const renderRudraksha = () => {
    const currentData = getRudrakshaMukhiData(activeMukhiTab);

    return (
      <div className="space-y-4">
        {/* Rudraksha Suggestion Report */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-bold text-gray-900 mb-3">Rudraksha Suggestion Report</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {getValue(remedies?.rudraksha?.suggestion_report)}
          </p>
          {getValue(remedies?.rudraksha?.importance) !== "--" && (
            <>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Rudraksha & its importance</h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {remedies.rudraksha.importance}
              </p>
            </>
          )}
          {getValue(remedies?.rudraksha?.additional_info) !== "--" && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {remedies.rudraksha.additional_info}
            </p>
          )}
        </div>

        {/* Recommendation */}
        {getValue(remedies?.rudraksha?.recommendation) !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-bold text-gray-900 mb-3">Recommendation</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {remedies.rudraksha.recommendation}
            </p>
          </div>
        )}

        {/* Mukhi Tabs - Dynamic based on backend */}
        {suggestedRudrakshas.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {suggestedRudrakshas.map((mukhi: string) => (
              <button
                key={mukhi}
                onClick={() => setActiveMukhiTab(mukhi)}
                className={`px-4 py-1.5 rounded-full font-medium text-sm transition-colors ${
                  activeMukhiTab === mukhi
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {mukhi}
              </button>
            ))}
          </div>
        )}

        {/* Details */}
        {currentData.details !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-bold text-gray-900 mb-3">Details</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {currentData.details}
            </p>
          </div>
        )}

        {/* Benefits */}
        {currentData.benefits.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-bold text-gray-900 mb-3">Benefits</h3>
            <ol className="list-decimal list-inside space-y-2">
              {currentData.benefits.map((benefit: string, index: number) => (
                <li key={index} className="text-sm text-gray-700">{benefit}</li>
              ))}
            </ol>
          </div>
        )}

        {/* How to wear */}
        {currentData.howToWear !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-bold text-gray-900 mb-3">How to wear</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {currentData.howToWear}
            </p>
          </div>
        )}

        {/* Precautions */}
        {currentData.precautions.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-bold text-gray-900 mb-3">Precautions</h3>
            <ol className="list-decimal list-inside space-y-2">
              {currentData.precautions.map((precaution: string, index: number) => (
                <li key={index} className="text-sm text-gray-700">{precaution}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  };

  const renderGemstones = () => {
    const gemstones = remedies?.gemstones || {};
    const lifeStone = gemstones.life_stone || {};
    const luckyStone = gemstones.lucky_stone || {};
    const fortuneStone = gemstones.fortune_stone || {};

    return (
      <div className="space-y-4">
        {/* Life Stone */}
        {getValue(lifeStone.description) !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-bold text-gray-900 mb-3">Life Stone</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {getValue(lifeStone.description)}
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="border-r border-b border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-sm text-gray-700">{getValue(lifeStone.title) || "Life Stone"}</p>
                </div>
                <div className="border-b border-gray-200 px-3 py-2">
                  <p className="text-sm text-gray-900 font-medium">{getValue(lifeStone.stone_name)}</p>
                </div>
                <div className="border-r border-b border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-sm text-gray-700">How to wear</p>
                </div>
                <div className="border-b border-gray-200 px-3 py-2">
                  <p className="text-sm text-gray-900">{getValue(lifeStone.how_to_wear)}</p>
                </div>
                <div className="border-r border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-sm text-gray-700">Mantra</p>
                </div>
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-900">{getValue(lifeStone.mantra)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lucky Stone */}
        {getValue(luckyStone.description) !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-bold text-gray-900 mb-3">Lucky Stone</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {getValue(luckyStone.description)}
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="border-r border-b border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-sm text-gray-700">{getValue(luckyStone.title) || "Lucky Stone"}</p>
                </div>
                <div className="border-b border-gray-200 px-3 py-2">
                  <p className="text-sm text-gray-900 font-medium">{getValue(luckyStone.stone_name)}</p>
                </div>
                <div className="border-r border-b border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-sm text-gray-700">How to wear</p>
                </div>
                <div className="border-b border-gray-200 px-3 py-2">
                  <p className="text-sm text-gray-900">{getValue(luckyStone.how_to_wear)}</p>
                </div>
                <div className="border-r border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-sm text-gray-700">Mantra</p>
                </div>
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-900">{getValue(luckyStone.mantra)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fortune Stone */}
        {getValue(fortuneStone.description) !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-bold text-gray-900 mb-3">Fortune Stone</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {getValue(fortuneStone.description)}
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="border-r border-b border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-sm text-gray-700">{getValue(fortuneStone.title) || "Fortune Stone"}</p>
                </div>
                <div className="border-b border-gray-200 px-3 py-2">
                  <p className="text-sm text-gray-900 font-medium">{getValue(fortuneStone.stone_name)}</p>
                </div>
                <div className="border-r border-b border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-sm text-gray-700">How to wear</p>
                </div>
                <div className="border-b border-gray-200 px-3 py-2">
                  <p className="text-sm text-gray-900">{getValue(fortuneStone.how_to_wear)}</p>
                </div>
                <div className="border-r border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-sm text-gray-700">Mantra</p>
                </div>
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-900">{getValue(fortuneStone.mantra)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No data available message */}
        {getValue(lifeStone.description) === "--" && getValue(luckyStone.description) === "--" && getValue(fortuneStone.description) === "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-center text-gray-600">No Gemstone data available</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Main Sub-tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveSubTab("rudraksha")}
          className={`px-4 py-1.5 rounded-full font-medium text-sm transition-colors ${
            activeSubTab === "rudraksha"
              ? "bg-yellow-400 text-gray-900"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Rudraksha
        </button>
        <button
          onClick={() => setActiveSubTab("gemstone")}
          className={`px-4 py-1.5 rounded-full font-medium text-sm transition-colors ${
            activeSubTab === "gemstone"
              ? "bg-yellow-400 text-gray-900"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Gemstones
        </button>
      </div>

      {/* Content */}
      {activeSubTab === "rudraksha" && renderRudraksha()}
      {activeSubTab === "gemstone" && renderGemstones()}
    </div>
  );
};


// Helper Component
const InfoRow: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value || "N/A"}</span>
  </div>
);

export default KundliViewer;
