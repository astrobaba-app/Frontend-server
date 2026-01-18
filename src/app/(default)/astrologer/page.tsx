"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getAllAstrologers, Astrologer } from "@/store/api/general/astrologer";
import AstrologerCard from "@/components/card/AstrologerCard";
import { AstrologersListSkeleton } from "@/components/skeletons";
import { colors } from "@/utils/colors";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import { Suspense } from "react";

const CATEGORIES = [
  { name: "All" },
  { name: "Love" },
  { name: "Relationship" },
  { name: "Education" },
  { name: "Health" },
  { name: "Career" },
  { name: "Finance" },
  { name: "Marriage" },
  { name: "Family" },
  { name: "Business" },
  { name: "Legal" },
  { name: "Travel" },
  { name: "Spiritual" },
];

const SKILLS = [
  "Vedic",
  "KP",
  "Numerology",
  "Tarot",
  "Palmistry",
  "Vastu",
  "Prashna",
  "Nadi",
  "Lal Kitab",
  "Face Reading",
];

const LANGUAGES = [
  "Hindi",
  "English",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
  "Urdu",
];

// Hardcoded AI Astrologers
const AI_ASTROLOGERS: Astrologer[] = [
  {
    id: "ai-astrologer-devansh",
    fullName: "Acharya Devansh Sharma",
    photo: "/images/devansh.jpg",
    yearsOfExperience: 12,
    pricePerMinute: "10",
    rating: "4.9",
    totalConsultations: 500,
    bio: "Acharya Devansh Sharma is a traditional AI Vedic astrologer known for logical, timing-accurate predictions. His readings focus on long-term life direction, career decisions, education choices, and resolving complex family or legal situations through precise planetary analysis.",
    skills: ["Vedic", "KP", "Nadi", "Prashna"],
    languages: [
      "Hindi",
      "English",
      "Bengali",
      "Tamil",
      "Telugu",
      "Marathi",
      "Gujarati",
      "Kannada",
      "Malayalam",
      "Punjabi",
      "Odia",
      "Urdu",
    ],
    categories: ["Career", "Education", "Family", "Legal"],
    isOnline: true,
  },
  {
    id: "ai-astrologer-ritika",
    fullName: "Ritika Mehra",
    photo: "/images/ritika.jpg",
    yearsOfExperience: 9,
    pricePerMinute: "10",
    rating: "4.8",
    totalConsultations: 450,
    bio: "Ritika Mehra is an AI relationship and tarot expert who blends intuitive insights with astrological patterns. She is widely trusted for love, marriage, and emotional clarity readings, helping people navigate confusion, attachment, and relationship decisions with compassion.",
    skills: ["Tarot", "Face Reading"],
    languages: [
      "Hindi",
      "English",
      "Bengali",
      "Tamil",
      "Telugu",
      "Marathi",
      "Gujarati",
      "Kannada",
      "Malayalam",
      "Punjabi",
      "Odia",
      "Urdu",
    ],
    categories: ["Love", "Relationship", "Marriage", "Family"],
    isOnline: true,
  },
  {
    id: "ai-astrologer-arjun",
    fullName: "Pandit Arjun Iyer",
    photo: "/images/arjun.jpg",
    yearsOfExperience: 11,
    pricePerMinute: "10",
    rating: "4.9",
    totalConsultations: 480,
    bio: "Pandit Arjun Iyer our AI astrologer specializes in wealth patterns, health indicators, and energy alignment through numerology, palmistry, and vastu. His readings are practical, solution-oriented, and focused on removing financial and energetic blockages.",
    skills: ["Numerology", "Palmistry", "Vastu"],
    languages: [
      "Hindi",
      "English",
      "Bengali",
      "Tamil",
      "Telugu",
      "Marathi",
      "Gujarati",
      "Kannada",
      "Malayalam",
      "Punjabi",
      "Odia",
      "Urdu",
    ],
    categories: ["Finance", "Health", "Business"],
    isOnline: true,
  },
];

interface TrendingAstrologerCardProps {
  astro: Astrologer;
}

const TrendingAstrologerCard: React.FC<TrendingAstrologerCardProps> = ({
  astro,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200 w-full">
      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-yellow-200">
        <div
          className="w-full h-full flex items-center justify-center"
          style={
            astro.photo
              ? {
                  backgroundImage: `url(${astro.photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  background:
                    "linear-gradient(to bottom right, #FEF3C7, #FDE68A)",
                }
          }
        >
          {!astro.photo && (
            <span className="text-xl font-bold text-gray-700">
              {astro.fullName.charAt(0)}
            </span>
          )}
        </div>
        {astro.isOnline && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-tight">
        {astro.fullName.split(" ")[0]}
      </p>
      <p className="text-xs text-gray-600 mb-2">₹ {astro.pricePerMinute}/min</p>
    </div>
  );
};

interface AstrologersPageContentProps {
  mode: "chat" | "call";
}

function AstrologersPage() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as "chat" | "call") || "chat";
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();

  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [filteredAstrologers, setFilteredAstrologers] = useState<Astrologer[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Fetch astrologers with filters applied on backend
  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        // Only show full loading on initial load, use isFiltering for filter updates
        if (astrologers.length === 0) {
          setLoading(true);
        } else {
          setIsFiltering(true);
        }

        const filters = {
          skills: selectedSkills.length > 0 ? selectedSkills : undefined,
          categories:
            selectedCategories.length > 0 ? selectedCategories : undefined,
          languages:
            selectedLanguages.length > 0 ? selectedLanguages : undefined,
          minRating,
          maxPrice,
        };

        console.log("Fetching astrologers with filters:", filters);
        const response = await getAllAstrologers(filters);
        console.log("API Response:", response);
        if (response.success && response.astrologers) {
          setAstrologers(response.astrologers);
          setFilteredAstrologers(response.astrologers);
        }
      } catch (error) {
        console.error("Error fetching astrologers:", error);
      } finally {
        setLoading(false);
        setIsFiltering(false);
      }
    };

    fetchAstrologers();
  }, [
    selectedCategories,
    selectedSkills,
    selectedLanguages,
    minRating,
    maxPrice,
  ]);

  // Client-side search filtering only (backend handles category/skills/language filters)
  useEffect(() => {
    let filtered = astrologers;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (astro) =>
          astro.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          astro.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          astro.languages.some((lang) =>
            lang.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Always add all AI astrologers at the beginning
    setFilteredAstrologers([...AI_ASTROLOGERS, ...filtered]);
  }, [searchQuery, astrologers]);

  const handleCallClick = () => {
    showToast("This feature is coming soon.", "info");
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSkills([]);
    setSelectedLanguages([]);
    setMinRating(undefined);
    setMaxPrice(undefined);
  };

  const toggleCategory = (categoryName: string) => {
    if (categoryName === "All") {
      setSelectedCategories([]);
    } else {
      if (selectedCategories.includes(categoryName)) {
        setSelectedCategories(
          selectedCategories.filter((c) => c !== categoryName)
        );
      } else {
        setSelectedCategories([...selectedCategories, categoryName]);
      }
    }
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSkills.length > 0 ||
    selectedLanguages.length > 0 ||
    minRating !== undefined ||
    maxPrice !== undefined;

  const trendingAstrologers = [...astrologers]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 5);

  // Split filtered astrologers for top and bottom sections
  const topAstrologers = filteredAstrologers.slice(0, 3);
  const remainingAstrologers = filteredAstrologers.slice(3);

  if (loading) {
    return <AstrologersListSkeleton />;
  }

  const renderAstrologerCard = (astrologer: Astrologer) => {
    // Special handling for AI Astrologers
    const isAIAstrologer = astrologer.id.startsWith("ai-astrologer-");
    
    if (isAIAstrologer) {
      return (
        <div key={astrologer.id}>
          <Link href={`/astrologer/${astrologer.id}`}>
            <AstrologerCard
              astrologer={{
                id: astrologer.id,
                name: astrologer.fullName,
                photo: astrologer.photo,
                title: astrologer.skills.join(", "),
                experience: `${astrologer.yearsOfExperience} years`,
                rating: astrologer.rating,
                topics: astrologer.skills,
                price: parseFloat(astrologer.pricePerMinute),
                languages: astrologer.languages,
                status: astrologer.isOnline ? "available" : "offline",
                isOnline: astrologer.isOnline,
                isAI: true,
              }}
              mode={mode}
              onCallClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();
                router.push(`/aichat?astrologer=${encodeURIComponent(astrologer.fullName)}&photo=${encodeURIComponent(astrologer.photo || '')}`);
              }}
              onChatClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();
                router.push(`/aichat?astrologer=${encodeURIComponent(astrologer.fullName)}&photo=${encodeURIComponent(astrologer.photo || '')}`);
              }}
            />
          </Link>
        </div>
      );
    }

    // Regular astrologer card
    return (
      <Link key={astrologer.id} href={`/astrologer/${astrologer.id}`}>
        <AstrologerCard
          astrologer={{
            id: astrologer.id,
            name: astrologer.fullName,
            photo: astrologer.photo,
            title: astrologer.skills.join(", "),
            experience: `${astrologer.yearsOfExperience} years`,
            rating: astrologer.rating,
            topics: astrologer.skills,
            price: parseFloat(astrologer.pricePerMinute),
            languages: astrologer.languages,
            status: astrologer.isOnline ? "available" : "offline",
            isOnline: astrologer.isOnline,
          }}
          mode={mode}
          onCallClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();
            handleCallClick();
          }}
          onChatClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();
            if (astrologer.id) {
              router.push(`/chat?astrologerId=${astrologer.id}&mode=chat`);
            }
          }}
        />
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search astrologer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
            />
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 sm:gap-3 px-2">
          {/* Filter Button */}
          <button
            onClick={() => setShowFiltersModal(true)}
            disabled={isFiltering}
            className={`shrink-0 px-3 cursor-pointer sm:px-4 py-1.5 sm:py-2  border-gray-500 rounded-full bg-gray-100 text-gray-900 font-semibold flex items-center gap-2 ${
              isFiltering ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className=" text-sm">Filters</span>
          </button>

          {/* Categories Scroll Area - added 'scrollbar-hide' */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 sm:gap-6 items-center">
              {CATEGORIES.map((category) => (
                <button
                  key={category.name}
                  onClick={() => toggleCategory(category.name)}
                  className={`whitespace-nowrap cursor-pointer transition-all shrink-0 text-sm sm:text-base ${
                    (category.name === "All" &&
                      selectedCategories.length === 0) ||
                    selectedCategories.includes(category.name)
                      ? "bg-yellow-400 px-3 py-1 rounded-full font-bold text-gray-900"
                      : "text-gray-600 hover:text-gray-900 font-medium"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Filters Modal */}
        {showFiltersModal && (
          <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Backdrop */}
              <div
                className="fixed inset-0 transition-opacity"
                onClick={() => setShowFiltersModal(false)}
              />

              {/* Modal */}
              <div
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white px-6 pt-6 pb-4">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFiltersModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto pr-2">
                    {/* Skills Filters */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Skills
                        </h4>
                        {selectedSkills.length > 0 && (
                          <button
                            onClick={() => setSelectedSkills([])}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SKILLS.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => {
                              if (selectedSkills.includes(skill)) {
                                setSelectedSkills(
                                  selectedSkills.filter((s) => s !== skill)
                                );
                              } else {
                                setSelectedSkills([...selectedSkills, skill]);
                              }
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              selectedSkills.includes(skill)
                                ? "bg-yellow-400 text-gray-900 shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Languages Filters */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Languages
                        </h4>
                        {selectedLanguages.length > 0 && (
                          <button
                            onClick={() => setSelectedLanguages([])}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {LANGUAGES.map((language) => (
                          <button
                            key={language}
                            onClick={() => {
                              if (selectedLanguages.includes(language)) {
                                setSelectedLanguages(
                                  selectedLanguages.filter(
                                    (l) => l !== language
                                  )
                                );
                              } else {
                                setSelectedLanguages([
                                  ...selectedLanguages,
                                  language,
                                ]);
                              }
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              selectedLanguages.includes(language)
                                ? "bg-yellow-400 text-gray-900 shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {language}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="mb-6">
                      <label className="block text-lg font-semibold text-gray-900 mb-3">
                        Minimum Rating
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() =>
                              setMinRating(
                                minRating === rating ? undefined : rating
                              )
                            }
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              minRating === rating
                                ? "bg-yellow-400 text-gray-900 shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {rating}+ ⭐
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Maximum Price */}
                    <div className="mb-4">
                      <label className="block text-lg font-semibold text-gray-900 mb-3">
                        Maximum Price (per minute)
                      </label>
                      <input
                        type="number"
                        placeholder="Enter max price"
                        value={maxPrice || ""}
                        onChange={(e) =>
                          setMaxPrice(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between gap-3">
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setShowFiltersModal(false)}
                    className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Astrologers Grid (TOP SECTION) */}
        {topAstrologers.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 transition-opacity duration-300 ${
              isFiltering ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            {topAstrologers.map(renderAstrologerCard)}
          </div>
        )}

        {/* Trending Section */}
        {trendingAstrologers.length > 0 && (
          <div
            className={`mb-8 p-6 bg-white rounded-xl shadow-md transition-opacity duration-300 ${
              isFiltering ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Trending Now
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trendingAstrologers.map((astro) => (
                <Link
                  key={astro.id}
                  href={`/astrologer/${astro.id}`}
                  className="w-full"
                >
                  <TrendingAstrologerCard astro={astro} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Astrologers Grid (BOTTOM SECTION) */}
        {remainingAstrologers.length === 0 && topAstrologers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No astrologers found</p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
              isFiltering ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            {remainingAstrologers.map(renderAstrologerCard)}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
export default function AstrologerPage() {
  return (
    <Suspense fallback={<div>Loading Astrologers...</div>}>
      <AstrologersPage />
    </Suspense>
  );
}
