"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors } from "@/utils/colors";
import { type KundliMatchingData } from "@/store/api/kundlimatiching";
import KundliChart from "@/components/kundli/KundliChart";

export default function LagnaChartPage() {
  const router = useRouter();
  const [matchingData, setMatchingData] = useState<KundliMatchingData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("kundliMatchingResult");
    if (storedData) {
      setMatchingData(JSON.parse(storedData));
    } else {
      router.push("/kundli-matching");
    }
  }, [router]);

  if (!matchingData) {
    return null;
  }

  // Get chart data from matchingData
  const boyChartData = (matchingData as any)?.boyLagnaChart || null;
  const girlChartData = (matchingData as any)?.girlLagnaChart || null;

  // Create default empty chart structure if data is missing
  const createEmptyChart = () => ({
    division: "D1",
    name: "Lagna Chart",
    matters: "General",
    planets: {}
  });

  return (
    <>
      {/* Lagna Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Male Manglik Details */}
        <div>
          <div className="mb-6">
            {boyChartData ? (
              <KundliChart 
                chartData={boyChartData} 
                chartType="Male Lagna Chart" 
                style="north" 
              />
            ) : (
              <KundliChart 
                chartData={createEmptyChart()} 
                chartType="Male Lagna Chart" 
                style="north" 
              />
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
            Male Manglik Details
          </h3>
          
          {/* Based on Aspects */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <h4 className="font-bold mb-2" style={{ color: colors.black }}>
              Based on Aspects
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: colors.darkGray }}>
              {matchingData.manglikDetails?.male_manglik_details?.aspects ? (
                matchingData.manglikDetails.male_manglik_details.aspects.map((aspect: string, idx: number) => (
                  <li key={idx}>{aspect}</li>
                ))
              ) : (
                <>
                  <li>--</li>
                </>
              )}
            </ul>
          </div>

          {/* Based on house */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <h4 className="font-bold mb-2" style={{ color: colors.black }}>
              Based on house
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: colors.darkGray }}>
              {matchingData.manglikDetails?.male_manglik_details?.houses ? (
                matchingData.manglikDetails.male_manglik_details.houses.map((house: string, idx: number) => (
                  <li key={idx}>{house}</li>
                ))
              ) : (
                <>
                  <li>--</li>
                </>
              )}
            </ul>
          </div>

          {/* Manglik Effect */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <h4 className="font-bold mb-2" style={{ color: colors.black }}>
              Manglik Effect
            </h4>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              {matchingData.manglikDetails?.male_manglik_details?.present 
                ? "Manglik dosha is EFFECTIVE" 
                : "Manglik dosha is INEFFECTIVE"}
            </p>
          </div>

          {/* Manglik Analysis */}
          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
            <h4 className="font-bold mb-2" style={{ color: colors.black }}>
              Manglik Analysis
            </h4>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              {matchingData.manglikDetails?.male_manglik_details?.description || "--"}
            </p>
          </div>
        </div>

        {/* Female Manglik Details */}
        <div>
          <div className="mb-6">
            {girlChartData ? (
              <KundliChart 
                chartData={girlChartData} 
                chartType="Female Lagna Chart" 
                style="north" 
              />
            ) : (
              <KundliChart 
                chartData={createEmptyChart()} 
                chartType="Female Lagna Chart" 
                style="north" 
              />
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
            Female Manglik Details
          </h3>
          
          {/* Based on Aspects */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <h4 className="font-bold mb-2" style={{ color: colors.black }}>
              Based on Aspects
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: colors.darkGray }}>
              {matchingData.manglikDetails?.female_manglik_details?.aspects ? (
                matchingData.manglikDetails.female_manglik_details.aspects.map((aspect: string, idx: number) => (
                  <li key={idx}>{aspect}</li>
                ))
              ) : (
                <>
                  <li>--</li>
                </>
              )}
            </ul>
          </div>

          {/* Based on house */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <h4 className="font-bold mb-2" style={{ color: colors.black }}>
              Based on house
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: colors.darkGray }}>
              {matchingData.manglikDetails?.female_manglik_details?.houses ? (
                matchingData.manglikDetails.female_manglik_details.houses.map((house: string, idx: number) => (
                  <li key={idx}>{house}</li>
                ))
              ) : (
                <>
                  <li>--</li>
                </>
              )}
            </ul>
          </div>

          {/* Manglik Effect */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <h4 className="font-bold mb-2" style={{ color: colors.black }}>
              Manglik Effect
            </h4>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              {matchingData.manglikDetails?.female_manglik_details?.present 
                ? "Manglik dosha is EFFECTIVE" 
                : "Manglik dosha is INEFFECTIVE"}
            </p>
          </div>

          {/* Manglik Analysis */}
          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
            <h4 className="font-bold mb-2" style={{ color: colors.black }}>
              Manglik Analysis
            </h4>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              {matchingData.manglikDetails?.female_manglik_details?.description || "--"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
