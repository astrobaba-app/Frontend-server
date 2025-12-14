"use client";
import React, { useState } from "react";
import { colors } from "@/utils/colors";

interface RemediesTabContentProps {
  remedies: any;
  basicDetails?: any;
}

const RemediesTabContent: React.FC<RemediesTabContentProps> = ({ remedies, basicDetails }) => {
  const [activeSubTab, setActiveSubTab] = useState<"rudraksha" | "gemstone">("rudraksha");
  
  // Get suggested rudrakshas from backend (e.g., "4-Mukhi" or "5-Mukhi")
  const suggestedRudrakshas = Array.isArray(remedies?.rudraksha?.suggested) 
    ? remedies.rudraksha.suggested 
    : remedies?.rudraksha?.suggested 
    ? [remedies.rudraksha.suggested] 
    : ["4-Mukhi", "5-Mukhi"];
  const [activeMukhiTab, setActiveMukhiTab] = useState<string>(suggestedRudrakshas[0] || "4-Mukhi");

  const getValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "--";
    return value;
  };

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
      <div className="space-y-6">
        {/* Rudraksha Suggestion Report */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Rudraksha Suggestion Report</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            {getValue(remedies?.rudraksha?.suggestion_report)}
          </p>
          {getValue(remedies?.rudraksha?.importance) !== "--" && (
            <>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Rudraksha & its importance</h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recommendation</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {remedies.rudraksha.recommendation}
            </p>
          </div>
        )}

        {/* Mukhi Tabs - Dynamic based on backend */}
        {suggestedRudrakshas.length > 1 && (
          <div className="flex gap-3">
            {suggestedRudrakshas.map((mukhi: string) => (
              <button
                key={mukhi}
                onClick={() => setActiveMukhiTab(mukhi)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                  activeMukhiTab === mukhi
                    ? "text-gray-900"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                style={activeMukhiTab === mukhi ? { backgroundColor: colors.primeYellow } : {}}
              >
                {mukhi}
              </button>
            ))}
          </div>
        )}

        {/* Details */}
        {currentData.details !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {currentData.details}
            </p>
          </div>
        )}

        {/* Benefits */}
        {currentData.benefits.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits</h3>
            <ol className="list-decimal list-inside space-y-2">
              {currentData.benefits.map((benefit: string, index: number) => (
                <li key={index} className="text-sm text-gray-700">{benefit}</li>
              ))}
            </ol>
          </div>
        )}

        {/* How to wear */}
        {currentData.howToWear !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">How to wear</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {currentData.howToWear}
            </p>
          </div>
        )}

        {/* Precautions */}
        {currentData.precautions.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Precautions</h3>
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
      <div className="space-y-6">
        {/* Life Stone */}
        {getValue(lifeStone.description) !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Life Stone</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              {getValue(lifeStone.description)}
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="border-r border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-700">{getValue(lifeStone.title) || "Life Stone"}</p>
                </div>
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-sm text-gray-900 font-medium">{getValue(lifeStone.stone_name)}</p>
                </div>
                <div className="border-r border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-700">How to wear</p>
                </div>
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-sm text-gray-900">{getValue(lifeStone.how_to_wear)}</p>
                </div>
                <div className="border-r border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-700">Mantra</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-900">{getValue(lifeStone.mantra)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lucky Stone */}
        {getValue(luckyStone.description) !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Lucky Stone</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              {getValue(luckyStone.description)}
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="border-r border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-700">{getValue(luckyStone.title) || "Lucky Stone"}</p>
                </div>
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-sm text-gray-900 font-medium">{getValue(luckyStone.stone_name)}</p>
                </div>
                <div className="border-r border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-700">How to wear</p>
                </div>
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-sm text-gray-900">{getValue(luckyStone.how_to_wear)}</p>
                </div>
                <div className="border-r border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-700">Mantra</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-900">{getValue(luckyStone.mantra)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fortune Stone */}
        {getValue(fortuneStone.description) !== "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Fortune Stone</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              {getValue(fortuneStone.description)}
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="border-r border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-700">{getValue(fortuneStone.title) || "Fortune Stone"}</p>
                </div>
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-sm text-gray-900 font-medium">{getValue(fortuneStone.stone_name)}</p>
                </div>
                <div className="border-r border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-700">How to wear</p>
                </div>
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-sm text-gray-900">{getValue(fortuneStone.how_to_wear)}</p>
                </div>
                <div className="border-r border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-700">Mantra</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-900">{getValue(fortuneStone.mantra)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No data available message */}
        {getValue(lifeStone.description) === "--" && getValue(luckyStone.description) === "--" && getValue(fortuneStone.description) === "--" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-center text-gray-600">No Gemstone data available</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Main Sub-tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveSubTab("rudraksha")}
          className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
            activeSubTab === "rudraksha"
              ? "text-gray-900"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={activeSubTab === "rudraksha" ? { backgroundColor: colors.primeYellow } : {}}
        >
          Rudraksha
        </button>
        <button
          onClick={() => setActiveSubTab("gemstone")}
          className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
            activeSubTab === "gemstone"
              ? "text-gray-900"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={activeSubTab === "gemstone" ? { backgroundColor: colors.primeYellow } : {}}
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

export default RemediesTabContent;
