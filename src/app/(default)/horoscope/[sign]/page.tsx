"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ZODIAC_SIGNS } from "@/constants/horoscope";
import {
  FaStar,
  FaHeart,
  FaBriefcase,
  FaHeartbeat,
  FaBrain,
  FaLeaf,
  FaPlane,
  FaPrayingHands,
  FaHashtag,
  FaPalette,
  FaClock,
  FaCompass,
  FaGem,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import { BsStars } from "react-icons/bs";

import {
  getDailyHoroscope,
  getWeeklyHoroscope,
  getMonthlyHoroscope,
  getYearlyHoroscope,
  DailyHoroscopeResponse,
  WeeklyHoroscopeResponse,
  MonthlyHoroscopeResponse,
  YearlyHoroscopeResponse,
  ZodiacSign,
} from "@/store/api/horoscope";
import {
  DailyHoroscopeSkeleton,
  WeeklyHoroscopeSkeleton,
  MonthlyHoroscopeSkeleton,
  YearlyHoroscopeSkeleton,
} from "@/components/skeletons";

type HoroscopeData =
  | DailyHoroscopeResponse
  | WeeklyHoroscopeResponse
  | MonthlyHoroscopeResponse
  | YearlyHoroscopeResponse
  | null;

// Helper function to safely get values with fallback
const getValue = (value: any, fallback: string = "--"): string => {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
};

// Time periods configuration
const TIME_PERIODS = [
  { id: "today", label: "Today", icon: FaCalendarAlt },
  { id: "weekly", label: "Weekly", icon: FaCalendarAlt },
  { id: "monthly", label: "Monthly", icon: FaCalendarAlt },
  { id: "yearly", label: "Yearly", icon: FaChartLine },
];

export default function HoroscopeDetailPage() {
  const params = useParams();
  const signSlug = params?.sign as string;
  const [activeTab, setActiveTab] = useState("today");
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentSign =
    ZODIAC_SIGNS.find((s) => s.slug === signSlug) || ZODIAC_SIGNS[0];

  // Fetch horoscope data based on active tab
  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!signSlug) return;

      setLoading(true);
      setError(null);

      try {
        let data: HoroscopeData;
        const zodiacSign = signSlug as ZodiacSign;

        switch (activeTab) {
          case "today":
            data = await getDailyHoroscope(zodiacSign);
            break;
          case "weekly":
            data = await getWeeklyHoroscope(zodiacSign);
            break;
          case "monthly":
            data = await getMonthlyHoroscope(zodiacSign);
            break;
          case "yearly":
            data = await getYearlyHoroscope(zodiacSign);
            break;
          default:
            data = await getDailyHoroscope(zodiacSign);
        }

        setHoroscopeData(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load horoscope data");
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, [signSlug, activeTab]);

  // Get date display based on period
  const getDateDisplay = () => {
    if (!horoscopeData || !horoscopeData.horoscope) return "--";

    const { horoscope } = horoscopeData;

    if ("date" in horoscope && horoscope.date) {
      return getValue(horoscope.date);
    } else if ("start_date" in horoscope && horoscope.start_date) {
      if ("end_date" in horoscope && horoscope.end_date) {
        return `${getValue(horoscope.start_date)} - ${getValue(
          horoscope.end_date
        )}`;
      }
      return getValue(horoscope.start_date);
    } else if ("month" in horoscope && horoscope.month) {
      return getValue(horoscope.month);
    } else if ("year" in horoscope && horoscope.year) {
      return getValue(horoscope.year);
    }

    return "--";
  };

  // Get lucky elements for display
  const getLuckyElements = () => {
    if (!horoscopeData || !horoscopeData.horoscope) return [];

    const elements = [];
    const horoscope = horoscopeData.horoscope as any; // Type assertion for flexible access
    const luckyData = horoscope.lucky_elements;

    if (!luckyData) return [];

    // Number
    if (luckyData.number !== undefined && luckyData.number !== null) {
      elements.push({
        type: "Lucky Number",
        value: String(luckyData.number),
        Icon: FaHashtag,
        gradient: "from-purple-500 to-pink-500",
      });
    }

    // Color(s)
    const colorValue =
      luckyData.color || (luckyData.colors && luckyData.colors.join(", "));
    if (colorValue) {
      elements.push({
        type: "Lucky Color",
        value: getValue(colorValue),
        Icon: FaPalette,
        gradient: "from-pink-500 to-rose-500",
      });
    }

    // Time
    if (luckyData.time) {
      elements.push({
        type: "Lucky Time",
        value: getValue(luckyData.time),
        Icon: FaClock,
        gradient: "from-blue-500 to-cyan-500",
      });
    }

    // Direction
    if (luckyData.direction) {
      elements.push({
        type: "Lucky Direction",
        value: getValue(luckyData.direction),
        Icon: FaCompass,
        gradient: "from-green-500 to-emerald-500",
      });
    }

    // Gemstone
    if (luckyData.gemstone) {
      elements.push({
        type: "Lucky Gemstone",
        value: getValue(luckyData.gemstone),
        Icon: FaGem,
        gradient: "from-amber-500 to-orange-500",
      });
    }

    // Day Quality
    if (luckyData.day_quality) {
      elements.push({
        type: "Day Quality",
        value: getValue(luckyData.day_quality),
        Icon: BsStars,
        gradient: "from-yellow-400 to-yellow-600",
      });
    }

    return elements;
  };

  // Get all detailed sections for display
  const getDetailedSections = () => {
    if (!horoscopeData || !horoscopeData.horoscope) return [];

    const horoscope = horoscopeData.horoscope as any;
    const predictions = horoscope.predictions;
    const aiEnhanced = horoscope.ai_enhanced; // AI-generated enhanced content
    if (!predictions) return [];

    const sections = [];
    const period = activeTab; // 'today', 'weekly', 'monthly', 'yearly'

    // 1. Overview - ALL PERIODS (AI Enhanced)
    const overviewData = predictions.overall || predictions.overview;
    sections.push({
      id: "overview",
      title: "Overview",
      Icon: FaStar,
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      content: getValue(aiEnhanced?.overview, overviewData?.summary),
      rating: overviewData?.rating || 0,
      details:
        overviewData?.key_factors ||
        (overviewData?.key_theme
          ? [` Theme: ${overviewData.key_theme}`]
          : []),
    });

    // 2. Love & Relationships - ALL PERIODS (AI Enhanced)
    const loveData = predictions.love || predictions.love_relationships;
    const loveDetails = [];
    if (loveData) {
      if (loveData.prediction) loveDetails.push(loveData.prediction);
      if (loveData.summary) loveDetails.push(loveData.summary);
      if (loveData.advice) loveDetails.push(` Advice: ${loveData.advice}`);
      if (loveData.best_days)
        loveDetails.push(` Best Days: ${loveData.best_days}`);
      if (loveData.best_dates)
        loveDetails.push(` Best Dates: ${loveData.best_dates}`);
      if (loveData.best_months && Array.isArray(loveData.best_months)) {
        loveDetails.push(` Best Months: ${loveData.best_months.join(", ")}`);
      }
      if (loveData.singles) loveDetails.push(` Singles: ${loveData.singles}`);
      if (loveData.committed)
        loveDetails.push(` Committed: ${loveData.committed}`);
      if (loveData.challenges && Array.isArray(loveData.challenges)) {
        loveDetails.push(` Challenges: ${loveData.challenges.join(", ")}`);
      }
    }
    sections.push({
      id: "love",
      title: "Love & Relationships",
      Icon: FaHeart,
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      content: getValue(
        aiEnhanced?.love_relationships,
        loveData?.prediction || loveData?.summary
      ),
      rating: loveData?.rating || 0,
      details: loveDetails.length > 0 ? loveDetails : ["--"],
    });

    // 3. Personal Life (AI Enhanced)
    const personalData = predictions.spiritual_growth;
    const personalDetails = [];
    if (personalData) {
      if (personalData.focus && Array.isArray(personalData.focus)) {
        personalDetails.push(...personalData.focus);
      }
      if (personalData.benefits)
        personalDetails.push(`✨ Benefits: ${personalData.benefits}`);
      if (personalData.practices && Array.isArray(personalData.practices)) {
        personalDetails.push(...personalData.practices);
      }
    }
    sections.push({
      id: "personal",
      title: "Personal Life",
      Icon: FaStar,
      bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
      borderColor: "border-indigo-200",
      content: getValue(aiEnhanced?.personal_life || personalData?.summary),
      rating: 0,
      details: personalDetails.length > 0 ? personalDetails : ["--"],
    });

    // 4. Career & Finance - ALL PERIODS (AI Enhanced)
    const careerData = predictions.career || predictions.career_business;
    const financeData = predictions.finance || predictions.finance_wealth;
    const careerFinanceDetails = [];
    let careerFinanceContent = "";
    let careerFinanceRating = 0;

    if (careerData) {
      careerFinanceContent = getValue(
        careerData.prediction || careerData.summary
      );
      careerFinanceRating = careerData.rating || 0;
      if (careerData.best_days)
        careerFinanceDetails.push(` Best Days: ${careerData.best_days}`);
      if (careerData.best_period)
        careerFinanceDetails.push(` Best Period: ${careerData.best_period}`);
      if (careerData.best_months && Array.isArray(careerData.best_months)) {
        careerFinanceDetails.push(
          ` Best Months: ${careerData.best_months.join(", ")}`
        );
      }
      if (careerData.opportunities) {
        const opps = Array.isArray(careerData.opportunities)
          ? careerData.opportunities.join(", ")
          : careerData.opportunities;
        careerFinanceDetails.push(` Opportunities: ${opps}`);
      }
      if (careerData.action_items && Array.isArray(careerData.action_items)) {
        careerFinanceDetails.push(
          ...careerData.action_items.map((item: string) => `✓ ${item}`)
        );
      }
      if (careerData.challenges && Array.isArray(careerData.challenges)) {
        careerFinanceDetails.push(
          ` Challenges: ${careerData.challenges.join(", ")}`
        );
      }
      if (careerData.advice)
        careerFinanceDetails.push(` ${careerData.advice}`);
    }

    if (financeData) {
      if (financeData.opportunities) {
        const opps = Array.isArray(financeData.opportunities)
          ? financeData.opportunities.join(", ")
          : financeData.opportunities;
        careerFinanceDetails.push(` Opportunities: ${opps}`);
      }
      if (financeData.best_investment_period) {
        careerFinanceDetails.push(
          ` Best Investment: ${financeData.best_investment_period}`
        );
      }
      if (financeData.best_months && Array.isArray(financeData.best_months)) {
        careerFinanceDetails.push(
          ` Best Months: ${financeData.best_months.join(", ")}`
        );
      }
      if (financeData.cautions && Array.isArray(financeData.cautions)) {
        careerFinanceDetails.push(
          ...financeData.cautions.map((c: string) => ` Caution: ${c}`)
        );
      }
      if (financeData.caution)
        careerFinanceDetails.push(` Caution: ${financeData.caution}`);
    }

    sections.push({
      id: "career-finance",
      title: "Career & Finance",
      Icon: FaBriefcase,
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      content: getValue(aiEnhanced?.career_finance, careerFinanceContent),
      rating: careerFinanceRating,
      details: careerFinanceDetails.length > 0 ? careerFinanceDetails : ["--"],
    });

    // 5. Health & Wellness - ALL PERIODS (AI Enhanced)
    const healthData = predictions.health || predictions.health_wellness;
    const healthDetails = [];
    if (healthData) {
      if (healthData.focus_areas && Array.isArray(healthData.focus_areas)) {
        healthDetails.push(` Focus: ${healthData.focus_areas.join(", ")}`);
      }
      if (healthData.recommendation)
        healthDetails.push(` ${healthData.recommendation}`);
      if (healthData.mental_health)
        healthDetails.push(` Mental Health: ${healthData.mental_health}`);
      if (
        healthData.vulnerable_periods &&
        Array.isArray(healthData.vulnerable_periods)
      ) {
        healthDetails.push(
          ` Caution: ${healthData.vulnerable_periods.join(", ")}`
        );
      }
      if (
        healthData.recommended_practices &&
        Array.isArray(healthData.recommended_practices)
      ) {
        healthDetails.push(
          ...healthData.recommended_practices.map((p: string) => `✓ ${p}`)
        );
      }
      if (healthData.advice) healthDetails.push(` ${healthData.advice}`);
    }
    sections.push({
      id: "health",
      title: "Health & Wellness",
      Icon: FaHeartbeat,
      bgColor: "bg-gradient-to-br from-red-50 to-orange-50",
      borderColor: "border-red-200",
      content: getValue(
        aiEnhanced?.health_wellness,
        healthData?.prediction || healthData?.summary
      ),
      rating: healthData?.rating || 0,
      details: healthDetails.length > 0 ? healthDetails : ["--"],
    });

    // 6. Emotions & Mind (AI Enhanced)
    const emotionsData = predictions.emotions_mind;
    const emotionsDetails = [];
    if (emotionsData) {
      if (emotionsData.moon_phase)
        emotionsDetails.push(` Moon Phase: ${emotionsData.moon_phase}`);
      if (emotionsData.moon_nakshatra)
        emotionsDetails.push(` Nakshatra: ${emotionsData.moon_nakshatra}`);
      if (emotionsData.advice)
        emotionsDetails.push(` ${emotionsData.advice}`);
    }

    sections.push({
      id: "emotions",
      title: "Emotions & Mind",
      Icon: FaBrain,
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
      borderColor: "border-purple-200",
      content: getValue(aiEnhanced?.emotions_mind, emotionsData?.summary),
      rating: emotionsData?.rating || 0,
      details:
        emotionsDetails.length > 0
          ? emotionsDetails
          : [
              "Practice mindfulness",
              "Maintain emotional balance",
              "Stay positive",
            ],
    });

    // 7. Lucky Insights - ALL PERIODS (AI Enhanced)
    const luckyData = horoscope.lucky_elements;
    const luckyDetails = [];
    let hasLuckyData = false;

    if (luckyData) {
      hasLuckyData = true;
      if (luckyData.color) luckyDetails.push(` Color: ${luckyData.color}`);
      if (luckyData.colors)
        luckyDetails.push(` Colors: ${luckyData.colors.join(", ")}`);
      if (luckyData.number) luckyDetails.push(` Number: ${luckyData.number}`);
      if (luckyData.time) luckyDetails.push(` Time: ${luckyData.time}`);
      if (luckyData.direction)
        luckyDetails.push(`Direction: ${luckyData.direction}`);
      if (luckyData.gemstone)
        luckyDetails.push(` Gemstone: ${luckyData.gemstone}`);
      if (luckyData.day_quality)
        luckyDetails.push(` Day Quality: ${luckyData.day_quality}`);
    }

    // Add lucky days for weekly/monthly
    if (horoscope.lucky_days && Array.isArray(horoscope.lucky_days)) {
      hasLuckyData = true;
      horoscope.lucky_days.forEach((day: any) => {
        luckyDetails.push(` ${day.day}: ${day.reason}`);
      });
    }

    // Add best dates for monthly
    if (horoscope.best_dates && Array.isArray(horoscope.best_dates)) {
      hasLuckyData = true;
      horoscope.best_dates.slice(0, 3).forEach((dateInfo: any) => {
        luckyDetails.push(
          ` ${dateInfo.date} (${dateInfo.day}): ${dateInfo.reason}`
        );
      });
    }

    // Add best months for yearly
    if (horoscope.best_months && Array.isArray(horoscope.best_months)) {
      hasLuckyData = true;
      horoscope.best_months.forEach((monthInfo: any) => {
        luckyDetails.push(
          `${monthInfo.month}: ${
            monthInfo.reasons?.join(", ") ||
            monthInfo.reason ||
            "Favorable period"
          }`
        );
      });
    }

    sections.push({
      id: "lucky-insights",
      title: "Lucky Insights",
      Icon: FaLeaf,
      bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
      content: getValue(aiEnhanced?.lucky_insights),
      rating: 0,
      details: luckyDetails.length > 0 ? luckyDetails : ["--"],
    });

    // 8. Travel & Movement (AI Enhanced)
    const travelData = predictions.travel_movement;
    const travelDetails = [];
    if (travelData) {
      if (travelData.favorable_direction)
        travelDetails.push(` Direction: ${travelData.favorable_direction}`);
      if (travelData.best_travel_days)
        travelDetails.push(` Best Days: ${travelData.best_travel_days}`);
      if (travelData.best_travel_period)
        travelDetails.push(` Best Period: ${travelData.best_travel_period}`);
      if (travelData.advice) travelDetails.push(` ${travelData.advice}`);
    }

    sections.push({
      id: "travel",
      title: "Travel & Movement",
      Icon: FaPlane,
      bgColor: "bg-gradient-to-br from-cyan-50 to-sky-50",
      borderColor: "border-cyan-200",
      content: getValue(aiEnhanced?.travel_movement, travelData?.summary),
      rating: travelData?.rating || 0,
      details: travelDetails.length > 0 ? travelDetails : ["--"],
    });

    // 9. Remedies - For all periods (AI Enhanced)
    const remedies = horoscope.remedies;
    const remedyDetails = [];

    if (remedies && Array.isArray(remedies) && remedies.length > 0) {
      remedies.forEach((remedy: any) => {
        let detail = `${remedy.type || "Remedy"}`;
        if (remedy.mantra) detail += `: ${remedy.mantra}`;
        if (remedy.mantra_count) detail += ` (${remedy.mantra_count})`;
        if (remedy.action) detail += ` - ${remedy.action}`;
        if (remedy.charity) detail += ` | Charity: ${remedy.charity}`;
        if (remedy.benefit) detail += ` | Benefit: ${remedy.benefit}`;
        remedyDetails.push(detail);
      });
    }

    sections.push({
      id: "remedies",
      title: "Remedies",
      Icon: FaPrayingHands,
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      content: getValue(aiEnhanced?.remedies),
      rating: 0,
      details: remedyDetails.length > 0 ? remedyDetails : ["--"],
    });

    return sections;
  };

  // Get appropriate skeleton based on active tab
  const renderSkeleton = () => {
    switch (activeTab) {
      case "today":
        return <DailyHoroscopeSkeleton />;
      case "weekly":
        return <WeeklyHoroscopeSkeleton />;
      case "monthly":
        return <MonthlyHoroscopeSkeleton />;
      case "yearly":
        return <YearlyHoroscopeSkeleton />;
      default:
        return <DailyHoroscopeSkeleton />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
        {/* Header */}
        <section className="bg-white py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
              {currentSign.name}{" "}
              {activeTab === "today"
                ? "Today's"
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
              Horoscope
            </h1>
            <p className="text-center text-gray-600">{getDateDisplay()}</p>

            {/* Zodiac Icon */}
            <div className="flex justify-center mt-6">
              <div className="w-20 h-20 bg-[#F0DF20] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-5xl">{currentSign.icon}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Time Period Tabs */}
        <section className="bg-white py-6 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center gap-2 flex-wrap">
              {TIME_PERIODS.map((period) => {
                const PeriodIcon = period.icon;
                return (
                  <button
                    key={period.id}
                    onClick={() => setActiveTab(period.id)}
                    className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                      activeTab === period.id
                        ? "bg-[#F0DF20] text-gray-900 shadow-md"
                        : "bg-white border border-gray-300 text-gray-700 hover:border-[#F0DF20]"
                    }`}
                  >
                    <PeriodIcon />
                    {period.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Render appropriate skeleton */}
        {renderSkeleton()}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#F0DF20] text-gray-900 rounded-lg hover:bg-yellow-400"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const luckyElements = getLuckyElements();
  const detailedSections = getDetailedSections();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Header */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 text-center mb-2">
            {currentSign.name}{" "}
            {activeTab === "today"
              ? "Today's"
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
            Horoscope
          </h1>
          <p className="text-center text-sm md:text-base text-gray-600">
            {getDateDisplay()}
          </p>

          {/* Zodiac Icon */}
          <div className="flex justify-center mt-6">
            <div className="w-20 h-20 bg-[#F0DF20] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-5xl">{currentSign.icon}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Time Period Tabs */}
      <section className="bg-white py-6 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center gap-2 flex-wrap">
            {TIME_PERIODS.map((period) => {
              const PeriodIcon = period.icon;
              return (
                <button
                  key={period.id}
                  onClick={() => setActiveTab(period.id)}
                  className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    activeTab === period.id
                      ? "bg-[#F0DF20] text-gray-900 shadow-md"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-[#F0DF20]"
                  }`}
                >
                  <PeriodIcon />
                  {period.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lucky Elements - Enhanced Display */}
      {luckyElements.length > 0 && (
        <section className="py-4 md:py-12 bg-gradient-to-b from-white via-yellow-50/30 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header with Sparkles */}
            <div className="flex items-center justify-center gap-3 mb-4 md:mb-10">
              <BsStars className="text-yellow-500 text-xl animate-bounce" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Lucky Insights
              </h2>
              <BsStars
                className="text-yellow-500 text-xl animate-bounce"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {luckyElements.map((element, index) => {
                const IconComponent = element.Icon;
                return (
                  <div key={index} className="group perspective">
                    <div
                      className={`
                relative h-full overflow-hidden
                bg-gradient-to-br ${element.gradient} 
                rounded-2xl p-4 md:p-6 
                shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                hover:shadow-2xl 
                transition-all duration-500 ease-out 
                transform group-hover:-translate-y-2
              `}
                    >
                      {/* Background Decor */}
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />

                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md mb-4 group-hover:rotate-12 transition-transform duration-300">
                          <IconComponent className="text-2xl md:text-3xl text-white drop-shadow-md" />
                        </div>

                        <div className="text-lg md:text-xl font-bold text-white mb-1 truncate w-full px-1">
                          {element.value}
                        </div>

                        <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80">
                          {element.type}
                        </div>
                      </div>

                      {/* Subtle Shine Effect on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Horoscope Sections */}
      {detailedSections.length > 0 && (
        <section className="py-8">
          <div className="max-w-5xl mx-auto px-6 space-y-4">
            {detailedSections.map((section) => {
              const SectionIcon = section.Icon;
              return (
                <div
                  key={section.id}
                  className={`${section.bgColor} rounded-xl p-6 border-2 ${section.borderColor} shadow-md hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden md:block text-4xl flex-shrink-0 text-gray-700">
                      <SectionIcon />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {section.title}
                        </h3>
                        {section.rating > 0 && (
                          <div className="flex items-center gap-1 bg-white/70 px-3 py-1 rounded-full">
                            <FaStar className="text-yellow-500" />
                            <span className="text-sm font-semibold text-gray-800">
                              {section.rating}/5
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {section.content}
                      </p>
                      {section.details && section.details.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {section.details.map(
                            (detail: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>{detail}</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
