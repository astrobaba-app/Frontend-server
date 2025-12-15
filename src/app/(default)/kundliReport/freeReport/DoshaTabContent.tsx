"use client";
import React, { useState } from "react";
import YesNoIndicator from "@/components/kundli/YesNoIndicator";
import { colors } from "@/utils/colors";

interface DoshaTabContentProps {
  manglikAnalysis: any;
  sadesatiData?: any;
  kalsarpaData?: any;
  aiDoshaNarratives?: any;
}

const DoshaTabContent: React.FC<DoshaTabContentProps> = ({ 
  manglikAnalysis, 
  sadesatiData, 
  kalsarpaData,
  aiDoshaNarratives,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"manglik" | "kalsarpa" | "sadesati">("manglik");

  const getValue = (value: any): string => {
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
      return "--";
    }
    return String(value);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return "--";
    }
  };

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveSubTab("manglik")}
          className={`px-6 py-2 cursor-pointer rounded-full font-medium text-sm transition-colors ${
            activeSubTab === "manglik"
              ? "text-gray-900"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={activeSubTab === "manglik" ? { backgroundColor: colors.creamyYellow } : {}}
        >
          Manglik
        </button>
        <button
          onClick={() => setActiveSubTab("kalsarpa")}
          className={`px-6 py-2 cursor-pointer rounded-full font-medium text-sm transition-colors ${
            activeSubTab === "kalsarpa"
              ? "text-gray-900"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={activeSubTab === "kalsarpa" ? { backgroundColor: colors.creamyYellow } : {}}
        >
          Kalsarpa
        </button>
        <button
          onClick={() => setActiveSubTab("sadesati")}
          className={`px-6 py-2 cursor-pointer rounded-full font-medium text-sm transition-colors ${
            activeSubTab === "sadesati"
              ? "text-gray-900"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={activeSubTab === "sadesati" ? { backgroundColor: colors.creamyYellow } : {}}
        >
          Sadesati
        </button>
      </div>

      {/* Manglik Content */}
      {activeSubTab === "manglik" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Manglik Analysis</h3>
            <div className="flex items-start gap-4">
              <YesNoIndicator value={manglikAnalysis?.is_manglik || false} />
              <div className="flex-1">
                {manglikAnalysis?.mangal_dosha && (
                  <p className="text-gray-900 font-medium mb-2">
                    {getValue(manglikAnalysis.mangal_dosha.description)}
                  </p>
                )}
                <p className="text-gray-700 text-sm">
                  {getValue(aiDoshaNarratives?.manglik) !== "--"
                    ? getValue(aiDoshaNarratives?.manglik)
                    : getValue(manglikAnalysis?.description)} 
                </p>
                <p className="text-gray-500 text-xs mt-2 italic">
                  [This is a computer generated result. Please consult an Astrologer to confirm & understand this in detail.]
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kalsarpa Content */}
      {activeSubTab === "kalsarpa" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2" style={{ borderColor: colors.primeGreen }}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kalsarpa Analysis</h3>
              <div className="flex items-start gap-4">
                <YesNoIndicator value={kalsarpaData?.is_kalsarpa ?? kalsarpaData?.present ?? false} />
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">
                    {getValue(aiDoshaNarratives?.kalsarpa) !== "--"
                      ? getValue(aiDoshaNarratives?.kalsarpa)
                      : getValue(kalsarpaData?.description)}
                  </p>
                  {kalsarpaData?.type && (
                    <p className="text-gray-700 text-sm mt-2">
                      <span className="font-medium">Type:</span> {getValue(kalsarpaData.type)}
                    </p>
                  )}
                  {kalsarpaData?.severity && (
                    <p className="text-gray-700 text-sm mt-1">
                      <span className="font-medium">Severity:</span> {getValue(kalsarpaData.severity)}
                    </p>
                  )}
                  {kalsarpaData?.effects && getValue(kalsarpaData.effects) !== "--" && (
                    <p className="text-gray-700 text-sm mt-1">
                      <span className="font-medium">Effects:</span> {getValue(kalsarpaData.effects)}
                    </p>
                  )}
                  {Array.isArray(kalsarpaData?.remedies) && kalsarpaData.remedies.length > 0 && (
                    <div className="mt-3">
                      <p className="text-gray-900 font-medium text-sm mb-1">Suggested Remedies</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {kalsarpaData.remedies.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sadesati Content */}
      {activeSubTab === "sadesati" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2" style={{ borderColor: colors.primeRed }}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sadesati Analysis</h3>
              <div className="flex items-start gap-4">
                <YesNoIndicator value={sadesatiData?.is_sadesati || false} />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-2">Current Sadesati Status</p>
                  <p className="text-gray-700 text-sm mb-2">
                    {getValue(aiDoshaNarratives?.sadesati) !== "--"
                      ? getValue(aiDoshaNarratives?.sadesati)
                      : getValue(sadesatiData?.status)}
                  </p>
                  {sadesatiData?.current_phase && (
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Phase:</span> {getValue(sadesatiData.current_phase)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sadesati Periods Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4" style={{ backgroundColor: colors.offYellow }}>
              <div className="grid grid-cols-4 gap-4 font-bold text-gray-900 text-sm">
                <div>Start</div>
                <div>End</div>
                <div>Sign Name</div>
                <div>Type</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {sadesatiData?.periods && sadesatiData.periods.length > 0 ? (
                sadesatiData.periods.map((period: any, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 p-4 text-gray-700 text-sm hover:bg-gray-50"
                  >
                    <div>{formatDate(period.start_date)}</div>
                    <div>{formatDate(period.end_date)}</div>
                    <div>{getValue(period.sign_name)}</div>
                    <div>{getValue(period.type)}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No Sadesati periods data available
                </div>
              )}
            </div>
          </div>

          {/* Shani Sade Sati Phase Descriptions */}
          {sadesatiData?.rising_phase_description && getValue(sadesatiData.rising_phase_description) !== "--" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shani Sade Sati: Rising Phase</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {sadesatiData.rising_phase_description}
              </p>
            </div>
          )}

          {sadesatiData?.peak_phase_description && getValue(sadesatiData.peak_phase_description) !== "--" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shani Sade Sati: Peak Phase</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {sadesatiData.peak_phase_description}
              </p>
            </div>
          )}

          {sadesatiData?.setting_phase_description && getValue(sadesatiData.setting_phase_description) !== "--" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shani Sade Sati: Setting Phase</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {sadesatiData.setting_phase_description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoshaTabContent;
