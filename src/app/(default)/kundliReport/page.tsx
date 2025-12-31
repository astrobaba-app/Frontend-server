"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getKundli, KundliResponse } from "@/store/api/kundli";
import { useAuth } from "@/contexts/AuthContext";
// import { KundliReportSkeleton } from "@/components/skeletons";
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
import {
  getAllAstrologers,
  Astrologer as ApiAstrologer,
} from "@/store/api/general/astrologer";

function KundliReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();

  const kundliId = searchParams.get("id");
  const [kundliData, setKundliData] = useState<KundliResponse["kundli"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
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
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + 5;
        });
      }, 100);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [loading]);

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
        setTimeout(() => setLoading(false), 200);
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <div className="w-full max-w-[300px] md:max-w-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Generating Report...
            </span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-100">
            <div
              className="bg-[#FFD900] h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-center text-gray-500 text-sm animate-pulse">
            Please wait while we generate your kundli report...
          </p>
        </div>
      </div>
    );
  }
  if (!isLoggedIn) return null;

  if (!kundliData || !kundliData.userRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
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

  // --- Logic Helpers ---
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
    const planetary = kundliData.planetary as any;
    if (!planetary) return getValue(undefined);
    const byKey = planetary[planetName];
    const byArray = Array.isArray(planetary)
      ? planetary.find(
          (p: any) => p?.name === planetName || p?.planet === planetName
        )
      : null;
    const planet = byKey || byArray;
    return getValue(planet?.[field as keyof typeof planet]);
  };

  const handleAstrologerClick = (astrologerId: string) => {
    router.push(`/astrologer/${astrologerId}?mode=chat`);
  };

  const mapAstrologerData = (astrologer: ApiAstrologer) => ({
    photo: astrologer.photo,
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

  return (
    <div className="py-6 md:py-10 min-h-screen bg-gray-50">
      <h1 className="text-center mb-6 md:mb-10 font-bold text-2xl md:text-3xl px-4 text-gray-900">
        Your Kundli Report
      </h1>

      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-3 sm:flex sm:flex-nowrap border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
            py-3 px-2 text-[12px] md:text-sm cursor-pointer font-bold whitespace-normal text-center transition-all border-b border-r border-gray-200 last:border-r-0
            ${
              isActive
                ? "bg-[#FFD900] text-gray-900 border-b-[#FFD900]"
                : "text-gray-600 bg-white hover:bg-gray-50"
            }
            sm:flex-1 sm:border-b-0 sm:whitespace-nowrap
          `}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content - Responsive Margins */}
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
          {activeTab === "Basic" && (
            <BasicTab kundliData={{ success: true, kundli: kundliData }} />
          )}
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
      </div>

      {/* Astrologer Section - Fixed Overflow with Responsive Grids */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="bg-white rounded-xl md:shadow-sm md:border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">
              Talk with Astrologer
            </h2>
            <Link
              href="/astrologer?mode=chat"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View more
            </Link>
          </div>

          <div className="md:p-5">
            {astrologersLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-100 h-48 rounded-lg"
                  />
                ))}
              </div>
            ) : astrologers.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No astrologers available
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {astrologers.map((astrologer) => (
                  <div
                    key={astrologer.id}
                    onClick={() => handleAstrologerClick(astrologer.id)}
                    className="cursor-pointer transform transition-transform hover:scale-[1.01]"
                  >
                    <AstrologerCard
                      astrologer={mapAstrologerData(astrologer)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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

export default function KundliReport() {
  return (
    <Suspense fallback={<div>Loading Kundli Report...</div>}>
      <KundliReportPage />
    </Suspense>
  );
}
