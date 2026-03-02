"use client";
import React from "react";
import { KundliResponse } from "@/store/api/kundli";
import LatestBlogsSection from "@/components/sections/home/LatestBlog";

interface BasicTabProps {
  kundliData: KundliResponse;
}

interface DisplayField {
  label: string;
  value: string | number | null | undefined;
  isGrey?: boolean;
  label2?: string;
  value2?: string | number | null | undefined;
}

const getValue = (
  data: any,
  defaultValue: string | number | null = "--"
): string | number | null => {
  if (
    data === null ||
    data === undefined ||
    (typeof data === "string" && data.trim() === "")
  ) {
    return defaultValue;
  }
  return data;
};

const getFixedValue = (
  data: number | string | null | undefined,
  fixed: number,
  defaultValue: string | number | null = "--"
): string | number | null => {
  if (
    data === null ||
    data === undefined ||
    (typeof data === "string" && data.trim() === "")
  ) {
    return defaultValue;
  }
  const num = typeof data === "string" ? parseFloat(data) : data;
  if (isNaN(num)) {
    return defaultValue;
  }
  return num.toFixed(fixed);
};

const BasicTab: React.FC<BasicTabProps> = ({ kundliData }) => {
  const { kundli } = kundliData;
  const {
    basicDetails,
    planetary,
    personality,
    panchang,
    remedies,
    userRequest,
    horoscope,
  } = kundli || {};

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "--";
    }
  };

  const birthDate = formatDate(userRequest?.dateOfbirth);
  const formatTime = (timeValue: any) => {
    if (!timeValue) return "--";
    try {
      // Accept "HH:MM:SS", "HH:MM", or Date
      if (typeof timeValue === "string") {
        const parts = timeValue.split(":");
        const h = parts[0]?.padStart(2, "0");
        const m = (parts[1] ?? "00").padStart(2, "0");
        const s = (parts[2] ?? "00").padStart(2, "0");
        return `${h}:${m}:${s}`;
      }
      if (timeValue instanceof Date) {
        return timeValue.toLocaleTimeString("en-GB", { hour12: false });
      }
      return getValue(timeValue);
    } catch {
      return getValue(timeValue);
    }
  };

  const birthTime = formatTime(userRequest?.timeOfbirth);

  const getPlanetaryValue = (planetName: string, field: string) => {
    if (!planetary || typeof planetary !== "object") return getValue(undefined);
    const byKey = (planetary as any)[planetName];
    const byProp = Object.values(planetary as any).find(
      (p: any) => p?.planet === planetName
    ) as any;
    const planet = byKey || byProp;
    return getValue(planet?.[field]);
  };

  const getBasicDetailValue = (field: string) => {
    if (basicDetails && field in basicDetails) {
      return getValue((basicDetails as any)[field]);
    }
    if (panchang) {
      if (field === "tithi") {
        const tithiName = panchang.tithi?.name;
        const paksha = panchang.tithi?.paksha;
        if (tithiName && paksha) return getValue(`${paksha}${tithiName}`);
        return getValue(tithiName);
      }
      if (field === "yog") return getValue(panchang.yoga?.name);
      if (field === "karan") return getValue(panchang.karana?.name);
      if (field === "nakshatra") return getValue(panchang.nakshatra?.name);
      if (field === "tatva") return getValue(panchang.nakshatra?.tatva);
      if (field === "paya") return getValue(panchang.nakshatra?.paya);
      if (field === "varna") return getValue(panchang.nakshatra?.varna);
      if (field === "yoni") return getValue(panchang.nakshatra?.yoni);
      if (field === "yunja") return getValue(panchang.tithi?.yunja || panchang.nakshatra?.yunja);
      if (field === "gan") return getValue(panchang.nakshatra?.gan);
      if (field === "nadi") return getValue(panchang.nakshatra?.nadi);
      if (field === "vashya") return getValue(panchang.nakshatra?.vashya);
      if (field === "charan") return getValue(panchang.nakshatra?.pada);
    }
    return getValue(undefined);
  };

  const getPersonalityValue = (field: string) => {
    if (personality && field in personality) {
      return getValue((personality as any)[field]);
    }
    return getValue(undefined);
  };

  const getNakshatraName = () => {
    const fromPanchang = panchang?.nakshatra?.name;
    const fromMoon = getPlanetaryValue("Moon", "nakshatra");
    return getValue(fromPanchang || fromMoon);
  };

  const getAscendantSign = () => {
    const fromBasic = (basicDetails as any)?.ascendant?.sign;
    const fromPersonality = personality?.ascendant_sign;
    return getValue(fromBasic || fromPersonality);
  };

  const getSignLordFromSign = (
    sign: string | null | undefined
  ): string | null => {
    if (!sign) return null;
    const map: Record<string, string> = {
      Aries: "Mars",
      Taurus: "Venus",
      Gemini: "Mercury",
      Cancer: "Moon",
      Leo: "Sun",
      Virgo: "Mercury",
      Libra: "Venus",
      Scorpio: "Mars",
      Sagittarius: "Jupiter",
      Capricorn: "Saturn",
      Aquarius: "Saturn",
      Pisces: "Jupiter",
    };
    return map[sign] || null;
  };

  const getNameAlphabet = () => {
    // Standard Vedic nakshatra syllables (akshar) by pada — used for naming convention
    // Each nakshatra has 4 padas, each mapped to a distinct syllable
    const NAKSHATRA_SYLLABLES: Record<string, string[]> = {
      'Ashwini':           ['Chu', 'Che', 'Cho', 'La'],
      'Bharani':           ['Li', 'Lu', 'Le', 'Lo'],
      'Krittika':          ['A', 'I', 'U', 'E'],
      'Rohini':            ['O', 'Va', 'Vi', 'Vu'],
      'Mrigashira':        ['Ve', 'Vo', 'Ka', 'Ki'],
      'Ardra':             ['Ku', 'Gha', 'Ing', 'Jha'],
      'Punarvasu':         ['Ke', 'Ko', 'Ha', 'Hi'],
      'Pushya':            ['Hu', 'He', 'Ho', 'Da'],
      'Ashlesha':          ['Di', 'Du', 'De', 'Do'],
      'Magha':             ['Ma', 'Mi', 'Mu', 'Me'],
      'Purva Phalguni':    ['Mo', 'Ta', 'Ti', 'Tu'],
      'Uttara Phalguni':   ['Te', 'To', 'Pa', 'Pi'],
      'Hasta':             ['Pu', 'Sha', 'Na', 'Tha'],
      'Chitra':            ['Pe', 'Po', 'Ra', 'Ri'],
      'Swati':             ['Ru', 'Re', 'Ro', 'Ta'],
      'Vishakha':          ['Ti', 'Tu', 'Te', 'To'],
      'Anuradha':          ['Na', 'Ni', 'Nu', 'Ne'],
      'Jyeshtha':          ['No', 'Ya', 'Yi', 'Yu'],
      'Mula':              ['Ye', 'Yo', 'Bha', 'Bhi'],
      'Purva Ashadha':     ['Bhu', 'Dha', 'Pha', 'Dhaa'],
      'Uttara Ashadha':    ['Bhe', 'Bho', 'Ja', 'Ji'],
      'Shravana':          ['Ju', 'Je', 'Jo', 'Gha'],
      'Dhanishta':         ['Ga', 'Gi', 'Gu', 'Ge'],
      'Shatabhisha':       ['Go', 'Sa', 'Si', 'Su'],
      'Purva Bhadrapada':  ['Se', 'So', 'Da', 'Di'],
      'Uttara Bhadrapada': ['Du', 'Tha', 'Jha', 'Na'],
      'Revati':            ['De', 'Do', 'Cha', 'Chi'],
    };

    const nakshatra = panchang?.nakshatra?.name as string;
    const pada = panchang?.nakshatra?.pada as number;

    if (nakshatra && pada && NAKSHATRA_SYLLABLES[nakshatra]) {
      const syllables = NAKSHATRA_SYLLABLES[nakshatra];
      const syllable = syllables[(pada - 1) % 4];
      if (syllable) return syllable;
    }
    return getValue(undefined);
  };

  const getNumerologyValue = (field: string) => {
    const numerology = horoscope?.numerology || personality || {};
    if (numerology && field in numerology) {
      return getValue((numerology as any)[field]);
    }
    return getPersonalityValue(field);
  };

  const basicDetailsLeft: DisplayField[] = [
    { label: "Name", value: getValue(userRequest?.fullName) },
    { label: "Date", value: birthDate, isGrey: true },
    { label: "Time", value: birthTime },
    { label: "Place", value: getValue(userRequest?.placeOfBirth), isGrey: true },
    { label: "Latitude", value: getValue(userRequest?.latitude) },
    { label: "Longitude", value: getValue(userRequest?.longitude), isGrey: true },
    { label: "Timezone", value: "GMT+5.5" },
    { label: "Sunrise", value: formatTime(panchang?.sunrise), isGrey: true },
  ];

  const basicDetailsRight: DisplayField[] = [
    { label: "Sunset", value: formatTime(panchang?.sunset) },
    {
      label: "Ayanamsha",
      value: getFixedValue((basicDetails as any)?.ayanamsha, 5),
      isGrey: true,
    },
  ];

  // Panchang Details
  const panchangDetails: DisplayField[] = [
    { label: "Tithi", value: getBasicDetailValue("tithi") },
    { label: "Karan", value: getBasicDetailValue("karan"), isGrey: true },
    { label: "Yog", value: getBasicDetailValue("yog") },
    { label: "Nakshatra", value: getNakshatraName(), isGrey: true },
  ];

  // Avakhada Details
  const avakhadaDetailsLeft: DisplayField[] = [
    { label: "Varna", value: getBasicDetailValue("varna") },
    { label: "Vashya", value: getBasicDetailValue("vashya"), isGrey: true },
    { label: "Yoni", value: getBasicDetailValue("yoni") },
    { label: "Gan", value: getBasicDetailValue("gan"), isGrey: true },
    { label: "Nadi", value: getBasicDetailValue("nadi") },
    { label: "Sign", value: getPlanetaryValue("Moon", "sign"), isGrey: true },
    {
      label: "Sign Lord",
      value: getValue(
        getSignLordFromSign(getPlanetaryValue("Moon", "sign") as string)
      ),
    },
    { label: "Nakshatra-Charan", value: getNakshatraName(), isGrey: true },
  ];

  const avakhadaDetailsRight: DisplayField[] = [
    { label: "Yog", value: getBasicDetailValue("yog") },
    { label: "Karan", value: getBasicDetailValue("karan"), isGrey: true },
    { label: "Tithi", value: getBasicDetailValue("tithi") },
    { label: "Yunja", value: getBasicDetailValue("yunja"), isGrey: true },
    { label: "Tatva", value: getBasicDetailValue("tatva") },
    { label: "Name Alphabet", value: getNameAlphabet(), isGrey: true },
    { label: "Paya", value: getBasicDetailValue("paya") },
  ];

  const favourableDetailsleft: DisplayField[] = [
    { label: "Name", value: getValue(userRequest?.fullName) },
    {
      label: "Destiny Number",
      value: getNumerologyValue("destinyNumber"),
      isGrey: true,
    },
    { label: "Evil Number", value: getNumerologyValue("evilNumber") },
    { label: "Lucky Day", value: getNumerologyValue("luckyDay"), isGrey: true },
    { label: "Lucky Mantra", value: getNumerologyValue("luckyMantra") },
    {
      label: "Lucky Stone",
      value: getNumerologyValue("luckyStone"),
      isGrey: true,
    },
    { label: "Friendly Number", value: getNumerologyValue("friendlyNumber") },
    {
      label: "Radical Number",
      value: getNumerologyValue("radicalNumber"),
      isGrey: true,
    },
  ];

  const favourableDetailsright: DisplayField[] = [
    { label: "Date", value: birthDate },
    {
      label: "Name Number",
      value: getNumerologyValue("nameNumber"),
      isGrey: true,
    },
    { label: "Lucky Color", value: getNumerologyValue("luckyColor") },
    { label: "Lucky God", value: getNumerologyValue("luckyGod"), isGrey: true },
    { label: "Lucky Metal", value: getNumerologyValue("luckyMetal") },
    {
      label: "Lucky Substone",
      value: getNumerologyValue("luckySubstone"),
      isGrey: true,
    },
    { label: "Neutral Number", value: getNumerologyValue("neutralNumber") },
    {
      label: "Radical Ruler",
      value: getNumerologyValue("radicalRuler"),
      isGrey: true,
    },
  ];

  const luckyInfo = [
    {
      label: "Lucky Number",
      value:
        (horoscope?.recommendations?.lucky_numbers &&
          Array.isArray(horoscope.recommendations.lucky_numbers) &&
          horoscope.recommendations.lucky_numbers.join(", ")) ||
        getPersonalityValue("radicalNumber"),
    },
    {
      label: "Lucky Color",
      value:
        (horoscope?.recommendations?.lucky_colors &&
          Array.isArray(horoscope.recommendations.lucky_colors) &&
          horoscope.recommendations.lucky_colors.join(", ")) ||
        getPersonalityValue("luckyColor"),
    },
    { label: "Lucky Gems", value: getValue(remedies?.gemstones?.primary) },
  ];



  return (
    <>
      

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 max-w-6xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Basic Details
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {basicDetailsLeft.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        item.isGrey ? "bg-gray-100" : ""
                      } border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-sm md:text-base text-gray-900 w-1/2">
                        {item.label}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-sm md:text-base text-gray-900 text-right">
                        {item.value ?? "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {basicDetailsRight.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        item.isGrey ? "bg-gray-100" : ""
                      } border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-sm md:text-base text-gray-900 w-1/2">
                        {item.label}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-sm md:text-base text-gray-900 text-right">
                        {item.value ?? "--"}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b border-gray-300">
                    <td colSpan={2} className="py-2 px-4 font-semibold text-sm md:text-base text-gray-900 bg-gray-50 text-center">
                      Panchang
                    </td>
                  </tr>
                  {panchangDetails.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        item.isGrey ? "bg-gray-100" : ""
                      } border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-sm md:text-base text-gray-900 w-1/2">
                        {item.label}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-sm md:text-base text-gray-900 text-right">
                        {item.value ?? "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Avakhada Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 max-w-6xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="md:text-xl text-lg font-bold text-gray-900">
            Avakhada Details
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {avakhadaDetailsLeft.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        item.isGrey ? "bg-gray-100" : ""
                      } border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-sm md:text-base text-gray-900 w-1/2">
                        {item.label}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-sm md:text-base text-gray-900 text-right">
                        {item.value ?? "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {avakhadaDetailsRight.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        item.isGrey ? "bg-gray-100" : ""
                      } border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-sm md:text-base text-gray-900 w-1/2">
                        {item.label}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-sm md:text-base text-gray-900 text-right">
                        {item.value ?? "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 max-w-6xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="md:text-xl text-lg font-bold text-gray-900">
            Favourable
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {favourableDetailsleft.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        item.isGrey ? "bg-gray-100" : ""
                      } border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-sm md:text-base text-gray-900 w-1/2">
                        {item.label}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-sm md:text-base text-gray-900 text-right">
                        {item.value ?? "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {favourableDetailsright.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        item.isGrey ? "bg-gray-100" : ""
                      } border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-sm md:text-base text-gray-900 w-1/2">
                        {item.label}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-sm md:text-base text-gray-900 text-right">
                        {item.value ?? "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <LatestBlogsSection /> */}
    </>
  );
};

export default BasicTab;
