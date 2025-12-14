"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors } from "@/utils/colors";
import { type KundliMatchingData } from "@/store/api/kundlimatiching";

export default function DoshaPage() {
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

  return (
    <>
      {/* Couple's Basic Details */}
      <h2 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
            Couple's basic details
          </h2>
          <div className="grid grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-3"
                style={{ backgroundColor: colors.primeYellow }}
              ></div>
              <p className="font-semibold" style={{ color: colors.black }}>
                Ashtakoot
              </p>
              <p className="text-sm" style={{ color: colors.gray }}>
                {matchingData.dashakootDetails.ashtakoot_score}/{matchingData.ashtakootDetails.max_points}
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-3"
                style={{ backgroundColor: colors.primeYellow }}
              ></div>
              <p className="font-semibold" style={{ color: colors.black }}>
                Rajjoo Dosha
              </p>
              <p className="text-sm" style={{ color: colors.gray }}>
                No
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-3"
                style={{ backgroundColor: colors.primeYellow }}
              ></div>
              <p className="font-semibold" style={{ color: colors.black }}>
                Vedha Dosha
              </p>
              <p className="text-sm" style={{ color: colors.gray }}>
                No
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-3"
                style={{ backgroundColor: colors.primeYellow }}
              ></div>
              <p className="font-semibold" style={{ color: colors.black }}>
                Manglik Match
              </p>
              <p className="text-sm" style={{ color: colors.gray }}>
                {matchingData.manglikDetails.male_manglik === matchingData.manglikDetails.female_manglik
                  ? "Yes"
                  : "No"}
              </p>
            </div>
          </div>

          {/* Ashtakoot Points Table */}
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
            Match Ashtakoot Points
          </h3>
          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: colors.offYellow }}>
                  <th className="border p-3 text-left font-semibold" style={{ color: colors.black }}>
                    Attribute
                  </th>
                  <th className="border p-3 text-left font-semibold" style={{ color: colors.black }}>
                    Male
                  </th>
                  <th className="border p-3 text-left font-semibold" style={{ color: colors.black }}>
                    Female
                  </th>
                  <th className="border p-3 text-left font-semibold" style={{ color: colors.black }}>
                    Out of
                  </th>
                  <th className="border p-3 text-left font-semibold" style={{ color: colors.black }}>
                    Received
                  </th>
                  <th className="border p-3 text-left font-semibold" style={{ color: colors.black }}>
                    Area Of Life
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(matchingData.ashtakootDetails.kutas).map(([key, kuta]) => (
                  <tr key={key}>
                    <td className="border p-3" style={{ color: colors.black }}>
                      {kuta.name}
                    </td>
                    <td className="border p-3" style={{ color: colors.black }}>
                      {kuta.male || kuta.male_lord || "-"}
                    </td>
                    <td className="border p-3" style={{ color: colors.black }}>
                      {kuta.female || kuta.female_lord || "-"}
                    </td>
                    <td className="border p-3" style={{ color: colors.black }}>
                      {kuta.max_points}
                    </td>
                    <td className="border p-3" style={{ color: colors.black }}>
                      {kuta.points}
                    </td>
                    <td className="border p-3" style={{ color: colors.darkGray }}>
                      {kuta.description}
                    </td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: colors.offYellow }}>
                  <td className="border p-3 font-bold" style={{ color: colors.black }}>
                    Total
                  </td>
                  <td className="border p-3">-</td>
                  <td className="border p-3">-</td>
                  <td className="border p-3 font-bold" style={{ color: colors.black }}>
                    {matchingData.ashtakootDetails.max_points}
                  </td>
                  <td className="border p-3 font-bold" style={{ color: colors.black }}>
                    {matchingData.ashtakootDetails.total_points}
                  </td>
                  <td className="border p-3">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      );
    }
