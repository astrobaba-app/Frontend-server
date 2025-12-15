"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { colors } from "@/utils/colors";
import { type KundliMatchingData } from "@/store/api/kundlimatiching";

export default function KundliMatchingReportPage() {
  const router = useRouter();
  const [matchingData, setMatchingData] = useState<KundliMatchingData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("kundliMatchingResult");
    if (storedData) {
      setMatchingData(JSON.parse(storedData));
      // Redirect to basic-details by default
      router.replace("/kundli-matching/report/basic-details");
    } else {
      router.push("/kundli-matching");
    }
  }, [router]);

  if (!matchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl" style={{ color: colors.gray }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic Details", href: "/kundli-matching/report/basic-details" },
    { id: "dosha", label: "Dosha", href: "/kundli-matching/report/dosha" },
    { id: "planet", label: "Planet Details", href: "/kundli-matching/report/planet-details" },
    { id: "lagna", label: "Lagna Chart", href: "/kundli-matching/report/lagna-chart" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: colors.black }}>
          Kundli Matching Report
        </h1>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className="px-6 py-3 font-semibold rounded-t-lg whitespace-nowrap transition-colors bg-white hover:opacity-80"
              style={{
                color: colors.black,
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <p className="text-xl mb-4" style={{ color: colors.gray }}>
              Please select a tab to view the matching details
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="px-6 py-3 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: colors.primeYellow,
                    color: colors.black,
                  }}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
