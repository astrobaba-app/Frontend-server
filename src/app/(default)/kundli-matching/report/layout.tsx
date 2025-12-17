"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { colors } from "@/utils/colors";
import { type KundliMatchingData } from "@/store/api/kundlimatiching";
import { getAllAstrologers } from "@/store/api/general/astrologer";
import AstrologerCard, { type Astrologer } from "@/components/card/AstrologerCard";
import {KundliReportSkeleton} from "@/components/skeletons/KundliReportSkeleton";

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [matchingData, setMatchingData] = useState<KundliMatchingData | null>(null);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem("kundliMatchingResult");
    if (storedData) {
      setMatchingData(JSON.parse(storedData));
    } else {
      router.push("/kundli-matching");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await getAllAstrologers();
        if (response.success) {
          // Transform API data to match AstrologerCard interface
          const transformedAstrologers: Astrologer[] = response.astrologers
            .slice(0, 3)
            .map((astro) => ({
              photo: astro.photo,
              name: astro.fullName,
              title: "PRO",
              experience: `${astro.yearsOfExperience} years`,
              rating: astro.rating,
              topics: astro.skills,
              languages: astro.languages,
              price: parseFloat(astro.pricePerMinute),
              status: astro.isOnline ? ("available" as const) : ("offline" as const),
            }));
          setAstrologers(transformedAstrologers);
        }
      } catch (error) {
        console.error("Failed to fetch astrologers:", error);
      }
    };

    fetchAstrologers();
  }, []);

  if (loading || !matchingData) {
    return <KundliReportSkeleton />;
  }

  const tabs = [
    { id: "basic", label: "Basic Details", href: "/kundli-matching/report/basic-details" },
    { id: "dosha", label: "Dosha", href: "/kundli-matching/report/dosha" },
    { id: "planet", label: "Planet Details", href: "/kundli-matching/report/planet-details" },
    { id: "lagna", label: "Lagna Chart", href: "/kundli-matching/report/lagna-chart" },
  ];

  const isActiveTab = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: colors.black }}>
          Kundli Matching Report
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`px-6 py-3 font-semibold rounded-t-lg whitespace-nowrap transition-colors ${
                isActiveTab(tab.href) ? "border-b-4" : "bg-white"
              }`}
              style={{
                backgroundColor: isActiveTab(tab.href) ? colors.primeYellow : colors.white,
                color: colors.black,
                borderColor: isActiveTab(tab.href) ? colors.primeYellow : "transparent",
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {children}

          

          {/* Talk With Astrologer Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
              Talk With Astrologer
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {astrologers.length > 0 ? (
                astrologers.map((astrologer, index) => (
                  <AstrologerCard key={index} astrologer={astrologer} mode="chat" />
                ))
              ) : (
                <p style={{ color: colors.gray }}>Loading astrologers...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
