"use client";
import React from "react";
import { KundliResponse } from "@/store/api/kundli";
import LatestBlogsSection from "@/components/sections/home/LatestBlog";
import CompatibilityCheck from "@/components/sections/kundli/compatibilityCheck";

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
  const { basicDetails, planetary, personality, panchang, remedies, userRequest } = kundli || {};

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
  const birthTime = getValue(userRequest?.timeOfbirth);

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
      if (field === "tithi") return getValue(panchang.tithi?.name);
      if (field === "yog") return getValue(panchang.yoga?.name);
      if (field === "karan") return getValue(panchang.karana?.name);
      if (field === "nakshatra") return getValue(panchang.nakshatra?.name);
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

  const basicDetailsLeft: DisplayField[] = [
    { label: "Name", value: getValue(userRequest?.fullName), isGrey: true },
    { label: "Birth Date", value: birthDate },
    { label: "Birth Time", value: birthTime, isGrey: true },
    { label: "Birth Place", value: getValue(userRequest?.placeOfBirth) },
  ];

  const basicDetailsRight: DisplayField[] = [
    { label: "Nakshatra", value: getNakshatraName() },
    { label: "Ascendant", value: getAscendantSign(), isGrey: true },
    { label: "Sign", value: getPlanetaryValue("Moon", "sign") },
    { label: "Ayanamsha", value: getFixedValue((basicDetails as any)?.ayanamsha, 2), isGrey: true },
  ];

  const kundliDetailsLeft: DisplayField[] = [
    { label: "Nakshatra Lord", value: getValue(panchang?.nakshatra?.lord) },
    { label: "Yog", value: getBasicDetailValue("yog"), isGrey: true },
    { label: "Tithi", value: getBasicDetailValue("tithi") },
    { label: "Tatva", value: getBasicDetailValue("tatva"), isGrey: true },
    { label: "Paya", value: getBasicDetailValue("paya") },
    { label: "Varna", value: getBasicDetailValue("varna"), isGrey: true },
    { label: "Sign Lord", value: getValue(undefined) },
    { label: "Yoni", value: getBasicDetailValue("yoni"), isGrey: true },
  ];

  const kundliDetailsRight: DisplayField[] = [
    { label: "Charan", value: getBasicDetailValue("charan") },
    { label: "Karan", value: getBasicDetailValue("karan"), isGrey: true },
    { label: "Yunja", value: getBasicDetailValue("yunja") },
    { label: "Name Alphabet", value: getBasicDetailValue("nameAlphabet"), isGrey: true },
    { label: "Gan", value: getBasicDetailValue("gan") },
    { label: "Nadi", value: getBasicDetailValue("nadi"), isGrey: true },
    { label: "Vashya", value: getBasicDetailValue("vashya") },
    { label: "Nakshatra", value: getNakshatraName(), isGrey: true },
  ];

  const favourableDetailsleft: DisplayField[] = [
    { label: "Name", value: getValue(userRequest?.fullName) },
    { label: "Destiny Number", value: getPersonalityValue("destinyNumber"), isGrey: true },
    { label: "Evil Number", value: getPersonalityValue("evilNumber") },
    { label: "Lucky Day", value: getPersonalityValue("luckyDay"), isGrey: true },
    { label: "Lucky Mantra", value: getPersonalityValue("luckyMantra") },
    { label: "Lucky Stone", value: getPersonalityValue("luckyStone"), isGrey: true },
    { label: "Friendly Number", value: getPersonalityValue("friendlyNumber") },
    { label: "Radical Number", value: getPersonalityValue("radicalNumber"), isGrey: true },
  ];

  const favourableDetailsright: DisplayField[] = [
    { label: "Date", value: birthDate },
    { label: "Name Number", value: getPersonalityValue("nameNumber"), isGrey: true },
    { label: "Lucky Color", value: getPersonalityValue("luckyColor") },
    { label: "Lucky God", value: getPersonalityValue("luckyGod"), isGrey: true },
    { label: "Lucky Metal", value: getPersonalityValue("luckyMetal") },
    { label: "Lucky Substone", value: getPersonalityValue("luckySubstone"), isGrey: true },
    { label: "Neutral Number", value: getPersonalityValue("neutralNumber") },
    { label: "Radical Ruler", value: getPersonalityValue("radicalRuler"), isGrey: true },
  ];

  const luckyInfo = [
    { label: "Lucky Number", value: getPersonalityValue("radicalNumber") },
    { label: "Lucky Color", value: getPersonalityValue("luckyColor") },
    { label: "Lucky Gems", value: getValue(remedies?.gemstones?.primary) },
  ];

  return (
    <>
      <div className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center gap-8">
            {luckyInfo.map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold text-white mb-2 mx-auto ${
                    index % 3 === 0 ? "bg-[#FDB022]" : index % 3 === 1 ? "bg-red-500 text-sm" : "bg-[#FDB022] text-sm"
                  }`}
                >
                  <p>{item.value ?? "--"}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 max-w-6xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Basic Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {basicDetailsLeft.map((item, index) => (
                    <tr
                      key={index}
                      className={`${item.isGrey ? "bg-gray-100" : ""} border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-gray-900 w-1/2">{item.label}</td>
                      <td className="py-2.5 px-4 font-semibold text-gray-900 text-right">{item.value ?? "--"}</td>
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
                      className={`${item.isGrey ? "bg-gray-100" : ""} border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-gray-900 w-1/2">{item.label}</td>
                      <td className="py-2.5 px-4 font-semibold text-gray-900 text-right">{item.value ?? "--"}</td>
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
          <h2 className="text-xl font-bold text-gray-900">Kundli Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {kundliDetailsLeft.map((item, index) => (
                    <tr
                      key={index}
                      className={`${item.isGrey ? "bg-gray-100" : ""} border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-gray-900 w-1/2">{item.label}</td>
                      <td className="py-2.5 px-4 font-semibold text-gray-900 text-right">{item.value ?? "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {kundliDetailsRight.map((item, index) => (
                    <tr
                      key={index}
                      className={`${item.isGrey ? "bg-gray-100" : ""} border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-gray-900 w-1/2">{item.label}</td>
                      <td className="py-2.5 px-4 font-semibold text-gray-900 text-right">{item.value ?? "--"}</td>
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
          <h2 className="text-xl font-bold text-gray-900">Favourable</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {favourableDetailsleft.map((item, index) => (
                    <tr
                      key={index}
                      className={`${item.isGrey ? "bg-gray-100" : ""} border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-gray-900 w-1/2">{item.label}</td>
                      <td className="py-2.5 px-4 font-semibold text-gray-900 text-right">{item.value ?? "--"}</td>
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
                      className={`${item.isGrey ? "bg-gray-100" : ""} border-b border-gray-300 last:border-b-0`}
                    >
                      <td className="py-2.5 px-4 font-normal text-gray-900 w-1/2">{item.label}</td>
                      <td className="py-2.5 px-4 font-semibold text-gray-900 text-right">{item.value ?? "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CompatibilityCheck />
      <LatestBlogsSection />
    </>
  );
};

export default BasicTab;
