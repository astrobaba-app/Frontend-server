"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getKundli, KundliResponse } from "@/store/api/kundli";
import { useAuth } from "@/contexts/AuthContext";
import { KundliReportSkeleton } from "@/components/skeletons";
import Toast from "@/components/atoms/Toast";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import BasicTab from "./basic/BasicTab";
import KundliTab from "./kundli/KundliTab";
import ChartsTab from "./chart/ChartsTab";
import DashaTab from "./dasha/DashaTab";
import KPTab from "./kp/KPTab";
import AshtakvargaTab from "./ashtakvarga/AshtakvargaTab";
import FreeReportTab from "./freeReport/FreeReportTab";
import AstrologerCard from "@/components/card/AstrologerCard";
import { getAllAstrologers, Astrologer as ApiAstrologer } from "@/store/api/general/astrologer";

export default function KundliReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();

  const kundliId = searchParams.get("id");
  const [kundliData, setKundliData] = useState<KundliResponse["kundli"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Basic");
  const [astrologers, setAstrologers] = useState<ApiAstrologer[]>([]);
  const [astrologersLoading, setAstrologersLoading] = useState(true);

  const tabs = [
    "Basic",
    "Kundli",
    "KP",
    "Ashtakvarga",
    "Charts",
    "Dasha",
    "Free Report",
  ];

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push(
        `/auth/login?redirect=/kundliReport${kundliId ? `?id=${kundliId}` : ""}`
      );
    }
  }, [authLoading, isLoggedIn, router, kundliId]);

  useEffect(() => {
    const fetchKundliData = async () => {
      if (!isLoggedIn || !kundliId) return;

      try {
        setLoading(true);
        const response = await getKundli(kundliId);

        if (response.success && response.kundli) {
          setKundliData(response.kundli);
        }
      } catch (error: any) {
        console.error("Failed to fetch kundli:", error);
        showToast(error?.message || "Failed to load kundli details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && !authLoading) {
      fetchKundliData();
    }
  }, [isLoggedIn, authLoading, kundliId]);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setAstrologersLoading(true);
        const response = await getAllAstrologers();

        if (response.success && response.astrologers) {
          // Get only first 3 astrologers
          setAstrologers(response.astrologers.slice(0, 3));
        }
      } catch (error: any) {
        console.error("Failed to fetch astrologers:", error);
      } finally {
        setAstrologersLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  if (authLoading) {
    return <KundliReportSkeleton />;
  }

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return <KundliReportSkeleton />;
  }

  if (!kundliData || !kundliData.userRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Kundli Not Found
          </h2>
          <Link
            href="/profile/kundli"
            className="text-blue-600 hover:underline"
          >
            Go back to Kundli page
          </Link>
        </div>
      </div>
    );
  }

  const getValue = (data: any, defaultValue: string | number | null = "--") => {
    if (
      data === null ||
      data === undefined ||
      (typeof data === "string" && data.trim() === "")
    ) {
      return defaultValue;
    }
    return data;
  };

  const getPlanetaryValue = (planetName: string, field: string) => {
    const planetaryArray = Array.isArray(kundliData.planetary)
      ? kundliData.planetary
      : [];
    const planet = planetaryArray.find((p) => p?.name === planetName);
    return getValue(planet?.[field as keyof typeof planet]);
  };

  const handleAstrologerClick = (astrologerId: string) => {
    router.push(`/astrologer/${astrologerId}?mode=chat`);
  };

  // Map API astrologer data to AstrologerCard component format
  const mapAstrologerData = (astrologer: ApiAstrologer) => ({
    name: astrologer.fullName,
    title: astrologer.skills.slice(0, 2).join(", "),
    experience: `${astrologer.yearsOfExperience} Years`,
    rating: astrologer.rating,
    topics: astrologer.skills,
    isOnline: astrologer.isOnline,
    price: parseFloat(astrologer.pricePerMinute),
    languages: astrologer.languages,
    status: astrologer.isOnline ? ("available" as const) : ("offline" as const),
    waitTime: 2,
  });

  const luckyInfo = [
    { label: "Ascendant", value: getPlanetaryValue("Ascendant", "sign") },
    { label: "Moon Sign", value: getPlanetaryValue("Moon", "sign") },
    { label: "Sun Sign", value: getPlanetaryValue("Sun", "sign") },
  ];

  return (
    <div className="py-10 min-h-screen bg-gray-50">
      <p className="text-center mb-10 font-bold text-3xl">Your Kundli Report</p>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 py-3 text-sm cursor-pointer font-semibold whitespace-nowrap text-center transition-colors duration-150
                  ${
                    isActive
                      ? "bg-[#FFD900] text-gray-900 shadow-inner"
                      : "text-gray-700 bg-white hover:bg-gray-50"
                  }
                  ${
                    index > 0 && !isActive && activeTab !== tabs[index - 1]
                      ? "border-l border-gray-300"
                      : ""
                  }
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className=" mx-auto py-8">
        {activeTab === "Basic" && <BasicTab kundliData={{ success: true, kundli: kundliData }} />}
        {activeTab === "Kundli" && <KundliTab kundliData={kundliData} />}
        {activeTab === "Charts" && <ChartsTab kundliData={kundliData} />}
        {activeTab === "Dasha" && <DashaTab kundliData={kundliData} />}
        {activeTab === "KP" && <KPTab kundliData={kundliData} />}
        {activeTab === "Ashtakvarga" && (
          <AshtakvargaTab kundliData={kundliData} />
        )}
        {activeTab === "Free Report" && (
          <FreeReportTab kundliData={kundliData} />
        )}
      </div>
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 max-w-6xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Talk with Astrologer</h2>
          <Link href="/astrologer?mode=chat" className="text-blue-600 hover:underline text-sm">
            View more
          </Link>
        </div>
        <div className="p-6">
          {astrologersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : astrologers.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No astrologers available at the moment
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {astrologers.map((astrologer) => (
                <div
                  key={astrologer.id}
                  onClick={() => handleAstrologerClick(astrologer.id)}
                  className="cursor-pointer"
                >
                  <AstrologerCard astrologer={mapAstrologerData(astrologer)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
            
      {/* Toast Notification */}
      {toastProps.isVisible && (
        <Toast
          message={toastProps.message}
          type={toastProps.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
