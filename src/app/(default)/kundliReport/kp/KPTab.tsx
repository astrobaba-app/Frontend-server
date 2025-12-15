"use client";
import React from "react";
import { KundliResponse } from "@/store/api/kundli";
import BhavChalitChart from "@/components/kundli/BhavChalitChart";

interface KPTabProps {
  kundliData: KundliResponse["kundli"];
}

interface PlanetKPData {
  name: string;
  cusp: number | string;
  sign: string;
  signLord: string;
  starLord: string;
  subLord: string;
}

interface CuspData {
  cusp: number;
  degree: number;
  sign: string;
  signLord: string;
  starLord: string;
  subLord: string;
}

const KPTab: React.FC<KPTabProps> = ({ kundliData }) => {
  const getValue = (value: any) => {
    if (value === null || value === undefined || value === "" || value === "--") return "--";
    return value;
  };

  // Helper function to get sign lord
  const getSignLord = (sign: string): string => {
    const signLords: Record<string, string> = {
      'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
      'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
      'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    };
    return signLords[sign] || '--';
  };

  // Helper function to get nakshatra lord
  const getNakshatraLord = (nakshatra: string): string => {
    const nakshatraLords: Record<string, string> = {
      'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun', 'Rohini': 'Moon',
      'Mrigashira': 'Mars', 'Ardra': 'Rahu', 'Punarvasu': 'Jupiter', 'Pushya': 'Saturn',
      'Ashlesha': 'Mercury', 'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
      'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu', 'Vishakha': 'Jupiter',
      'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury', 'Mula': 'Ketu', 'Purva Ashadha': 'Venus',
      'Uttara Ashadha': 'Sun', 'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
      'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury'
    };
    return nakshatraLords[nakshatra] || '--';
  };

  // KP star-lord and sub-lord helpers (mirroring astro-engine kp_system)
  const KP_NAKSHATRA_LORDS: string[] = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
    'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  ];

  const KP_SUB_LORD_PERIODS: Record<string, number> = {
    Ketu: 7,
    Venus: 20,
    Sun: 6,
    Moon: 10,
    Mars: 7,
    Rahu: 18,
    Jupiter: 16,
    Saturn: 19,
    Mercury: 17,
  };

  const KP_TOTAL_PERIOD = 120;

  const getKPStarLord = (longitude: number): string => {
    const nakshatraNum = Math.floor((longitude % 360) / 13.333333333333334);
    return KP_NAKSHATRA_LORDS[nakshatraNum % 9] || '--';
  };

  const getKPSubLord = (longitude: number): string => {
    const normalized = ((longitude % 360) + 360) % 360;
    const nakshatraSpan = 13.333333333333334;
    const nakshatraPosition = normalized % nakshatraSpan;
    const nakshatraNum = Math.floor(normalized / nakshatraSpan);
    const startLordIndex = nakshatraNum % 9;

    const proportion = nakshatraPosition / nakshatraSpan;
    let cumulative = 0;

    for (let i = 0; i < 9; i++) {
      const lordIndex = (startLordIndex + i) % 9;
      const lord = KP_NAKSHATRA_LORDS[lordIndex];
      const period = KP_SUB_LORD_PERIODS[lord] || 0;
      const lordProportion = period / KP_TOTAL_PERIOD;

      if (proportion < cumulative + lordProportion) {
        return lord;
      }

      cumulative += lordProportion;
    }

    return KP_NAKSHATRA_LORDS[startLordIndex] || '--';
  };

  // Helper function to calculate house from longitude
  const getHouseFromLongitude = (planetLongitude: number, ascendantLongitude: number): number => {
    let house = Math.floor((planetLongitude - ascendantLongitude + 360) % 360 / 30) + 1;
    if (house > 12) house -= 12;
    if (house < 1) house += 12;
    return house;
  };

  // Get KP data from planetary information
  const getPlanetKPData = (): PlanetKPData[] => {
    const planetary = kundliData?.planetary || {};
    const ascendantLongitude = kundliData?.basicDetails?.ascendant?.longitude || 0;
    
    if (typeof planetary !== 'object' || Array.isArray(planetary)) {
      return [];
    }
    
    return Object.values(planetary).map((planet: any) => {
      const longitude = planet.longitude || 0;
      const house = getHouseFromLongitude(longitude, ascendantLongitude);
      return {
        name: planet.planet || '--',
        cusp: house,
        sign: planet.sign || '--',
        signLord: getSignLord(planet.sign || ''),
        starLord: getKPStarLord(longitude),
        subLord: getKPSubLord(longitude),
      };
    });
  };

  // Helper function to get sign from longitude
  const getSignFromLongitude = (longitude: number): string => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor(longitude / 30) % 12;
    return signs[signIndex] || '--';
  };

  // Helper function to get nakshatra from longitude
  const getNakshatraFromLongitude = (longitude: number): string => {
    const nakshatras = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 
      'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 
      'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 
      'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 
      'Uttara Bhadrapada', 'Revati'
    ];
    const nakshatraIndex = Math.floor(longitude / 13.333333) % 27;
    return nakshatras[nakshatraIndex] || '--';
  };

  // Generate Cusp data from house cusps
  const getCuspData = (): CuspData[] => {
    const houses = (kundliData as any)?.astroDetails?.houses;
    const cusps: CuspData[] = [];
    
    if (houses && houses.cusps && Array.isArray(houses.cusps)) {
      for (let i = 0; i < 12; i++) {
        const cuspLongitude = houses.cusps[i] || 0;
        const sign = getSignFromLongitude(cuspLongitude);
        const nakshatra = getNakshatraFromLongitude(cuspLongitude);
        
        cusps.push({
          cusp: i + 1,
          degree: cuspLongitude,
          sign: sign,
          signLord: getSignLord(sign),
          starLord: getKPStarLord(cuspLongitude),
          subLord: getKPSubLord(cuspLongitude),
        });
      }
    } else {
      // Fallback if no cusp data
      for (let i = 1; i <= 12; i++) {
        cusps.push({
          cusp: i,
          degree: 0,
          sign: '--',
          signLord: '--',
          starLord: '--',
          subLord: '--',
        });
      }
    }
    
    return cusps;
  };

  // Get day lord from weekday
  const getDayLord = (): string => {
    const weekday = kundliData?.panchang?.weekday;
    const dayLords: Record<string, string> = {
      'Sunday': 'Sun', 'Monday': 'Moon', 'Tuesday': 'Mars', 'Wednesday': 'Mercury',
      'Thursday': 'Jupiter', 'Friday': 'Venus', 'Saturday': 'Saturn'
    };
    return weekday ? (dayLords[weekday] || '--') : '--';
  };

  // Get ruling planets data
  const getRulingPlanets = () => {
    const planetary = kundliData?.planetary || {};
    const ascendant = kundliData?.basicDetails?.ascendant;
    
    // Get Moon data
    const moonData = (planetary as any)?.Moon;
    const moonSign = moonData?.sign || '--';
    const moonLongitude = moonData?.longitude || 0;
    const moonNakshatra = moonData?.nakshatra || '--';
    
    // Get Ascendant data
    const ascSign = ascendant?.sign || '--';
    const ascLongitude = ascendant?.longitude || 0;
    const ascNakshatra = getNakshatraFromLongitude(ascLongitude);
    
    return {
      signLord: {
        mo: getSignLord(moonSign),
        asc: getSignLord(ascSign),
      },
      starLord: {
        mo: getNakshatraLord(moonNakshatra),
        asc: getNakshatraLord(ascNakshatra),
      },
      subLord: {
        mo: getKPSubLord(moonLongitude),
        asc: getKPSubLord(ascLongitude),
      },
      dayLord: getDayLord(),
    };
  };

  const planetKPData = getPlanetKPData();
  const cuspData = getCuspData();
  const rulingPlanets = getRulingPlanets();

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Bhav Chalit Chart and Ruling Planets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Bhav Chalit Chart */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Bhav Chalit Chart</h3>
          <BhavChalitChart 
            planets={kundliData?.planetary}
            cusps={(kundliData as any)?.astroDetails?.houses?.cusps}
            ascendantLongitude={kundliData?.basicDetails?.ascendant?.longitude}
          />
        </div>

        {/* Ruling Planets */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ruling Planets</h3>
          <div className="bg-white rounded-lg border border-gray-300">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-50">
                  <th className="border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 w-1/4">
                    Planet
                  </th>
                  <th className="border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 w-1/4">
                    Sign Lord
                  </th>
                  <th className="border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 w-1/4">
                    Star Lord
                  </th>
                  <th className="border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 w-1/4">
                    Sub Lord
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-800">
                    Mo
                  </td>
                  <td className="border border-gray-300 px-4 py-2.5 text-center text-sm text-gray-800">
                    {getValue(rulingPlanets.signLord.mo) || ' -- '}
                  </td>
                  <td className="border border-gray-300 px-4 py-2.5 text-center text-sm text-gray-800">
                    {getValue(rulingPlanets.starLord.mo) || ' -- '}
                  </td>
                  <td className="border border-gray-300 px-4 py-2.5 text-center text-sm text-gray-800">
                    {getValue(rulingPlanets.subLord.mo) || ' -- '}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-800">
                    Asc
                  </td>
                  <td className="border border-gray-300 px-4 py-2.5 text-center text-sm text-gray-800">
                    {getValue(rulingPlanets.signLord.asc) || ' -- '}
                  </td>
                  <td className="border border-gray-300 px-4 py-2.5 text-center text-sm text-gray-800">
                    {getValue(rulingPlanets.starLord.asc) || ' -- '}
                  </td>
                  <td className="border border-gray-300 px-4 py-2.5 text-center text-sm text-gray-800">
                    {getValue(rulingPlanets.subLord.asc) || ' -- '}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-t border-gray-300 p-3 bg-white">
              <div className="flex justify-between items-center px-4">
                <span className="text-sm font-semibold text-gray-700">Day Lord</span>
                <span className="text-sm text-gray-800">{getValue(rulingPlanets.dayLord) || ' -- '}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Planets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-50">
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Planets
                </th>
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Cusp
                </th>
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Sign
                </th>
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Sign Lord
                </th>
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Star Lord
                </th>
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Sub Lord
                </th>
              </tr>
            </thead>
            <tbody>
              {planetKPData.map((planet, index) => (
                <tr key={index} className="bg-white">
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {getValue(planet.name)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {getValue(planet.cusp)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {getValue(planet.sign)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {getValue(planet.signLord)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {getValue(planet.starLord)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {getValue(planet.subLord)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cusp Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Cusp</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-50">
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Cusp
                </th>
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Degree
                </th>
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Sign
                </th>
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Sign Lord
                </th>
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Star Lord
                </th>
                <th className="border border-gray-300 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                  Sub Lord
                </th>
              </tr>
            </thead>
            <tbody>
              {cuspData.map((cusp) => (
                <tr key={cusp.cusp} className="bg-white">
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {cusp.cusp}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {cusp.degree > 0 ? `${cusp.degree.toFixed(2)}°` : '--'}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {getValue(cusp.sign)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {getValue(cusp.signLord)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {getValue(cusp.starLord)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-800">
                    {getValue(cusp.subLord)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KPTab;
