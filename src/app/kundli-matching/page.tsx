"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Toast from "@/components/atoms/Toast";
import { useToast } from "@/hooks/useToast";
import { colors } from "@/utils/colors";
import { createKundliMatching, type KundliMatchingRequest } from "@/store/api/kundlimatiching";
import { ChevronDown, ChevronUp } from "lucide-react";
import api from "@/store/api";

export default function KundliMatchingPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const [girlData, setGirlData] = useState({
    name: "",
    dob: "",
    birthLocation: "",
    timeOfBirth: "",
    dontKnowTime: false,
    latitude: "",
    longitude: "",
  });

  const [boyData, setBoyData] = useState({
    name: "",
    dob: "",
    birthLocation: "",
    timeOfBirth: "",
    dontKnowTime: false,
    latitude: "",
    longitude: "",
  });

  const [girlPlaceSuggestions, setGirlPlaceSuggestions] = useState<{
    description: string;
    placeId: string;
  }[]>([]);
  const [boyPlaceSuggestions, setBoyPlaceSuggestions] = useState<{
    description: string;
    placeId: string;
  }[]>([]);
  const [girlIsLoadingPlaces, setGirlIsLoadingPlaces] = useState(false);
  const [boyIsLoadingPlaces, setBoyIsLoadingPlaces] = useState(false);
  const [girlPlacesError, setGirlPlacesError] = useState<string | null>(null);
  const [boyPlacesError, setBoyPlacesError] = useState<string | null>(null);

  const savedMatches = [
    {
      name: "John Doe",
      date: "02 Nov 2002, 06:55AM",
      location: "Shilpur, Howrah, West Bengal, India",
    },
    {
      name: "John Doe",
      date: "02 Nov 2002, 06:55AM",
      location: "Shilpur, Howrah, West Bengal, India",
    },
    {
      name: "John Doe",
      date: "02 Nov 2002, 06:55AM",
      location: "Shilpur, Howrah, West Bengal, India",
    },
    {
      name: "John Doe",
      date: "02 Nov 2002, 06:55AM",
      location: "Shilpur, Howrah, West Bengal, India",
    },
    {
      name: "John Doe",
      date: "02 Nov 2002, 06:55AM",
      location: "Shilpur, Howrah, West Bengal, India",
    },
    {
      name: "John Doe",
      date: "02 Nov 2002, 06:55AM",
      location: "Shilpur, Howrah, West Bengal, India",
    },
  ];

  const faqs = [
    {
      question: "Can today's horoscope predict life-changing events for a zodiac sign?",
      answer:
        "Today's horoscope can act as a guide, shedding light on the astrological influences and energies at play for each zodiac sign. You can know how negative things may get or how positive your day will be. And yes, it can definitely predict the big events that may occur in the day.",
    },
    {
      question: "How much to plan the day around today's horoscope?",
      answer:
        "While horoscopes offer valuable insights, they should be used as guidance rather than absolute predictions. Use them to understand potential energies and make informed decisions.",
    },
    {
      question: "How much to plan the day around today's horoscope?",
      answer:
        "While horoscopes offer valuable insights, they should be used as guidance rather than absolute predictions. Use them to understand potential energies and make informed decisions.",
    },
  ];

  // Fetch location suggestions for Indian cities via backend proxy (avoids CORS)
  const fetchPlaceSuggestions = async (query: string, forWhom: "girl" | "boy") => {
    if (!query || query.trim().length < 2) {
      if (forWhom === "girl") {
        setGirlPlaceSuggestions([]);
      } else {
        setBoyPlaceSuggestions([]);
      }
      return;
    }

    try {
      if (forWhom === "girl") {
        setGirlIsLoadingPlaces(true);
        setGirlPlacesError(null);
      } else {
        setBoyIsLoadingPlaces(true);
        setBoyPlacesError(null);
      }

      const res = await api.get("/maps/autocomplete", {
        params: { input: query.trim() },
      });

      const data = res.data;
      if (data.status !== "OK") {
        console.warn("Places API returned non-OK status:", data.status, data.error_message);
        if (forWhom === "girl") {
          setGirlPlaceSuggestions([]);
        } else {
          setBoyPlaceSuggestions([]);
        }
        return;
      }

      const suggestions = (data.predictions || []).map((p: any) => {
        const terms = p.terms || [];
        const city = terms[0]?.value || "";
        const state = terms[1]?.value || "";
        const country = terms[terms.length - 1]?.value || "";
        const description = [city, state, country].filter(Boolean).join(", ");
        return {
          description: description || p.description,
          placeId: p.place_id,
        };
      });

      if (forWhom === "girl") {
        setGirlPlaceSuggestions(suggestions);
      } else {
        setBoyPlaceSuggestions(suggestions);
      }
    } catch (error: any) {
      console.error("Error fetching place suggestions:", error);
      const message = error?.message || "Failed to fetch place suggestions";
      if (forWhom === "girl") {
        setGirlPlacesError(message);
        setGirlPlaceSuggestions([]);
      } else {
        setBoyPlacesError(message);
        setBoyPlaceSuggestions([]);
      }
    } finally {
      if (forWhom === "girl") {
        setGirlIsLoadingPlaces(false);
      } else {
        setBoyIsLoadingPlaces(false);
      }
    }
  };

  // When user selects a suggestion, update birthLocation and fetch lat/lng via backend proxy
  const handleSelectPlaceSuggestion = async (
    placeId: string,
    description: string,
    forWhom: "girl" | "boy"
  ) => {
    try {
      if (forWhom === "girl") {
        setGirlIsLoadingPlaces(true);
        setGirlPlacesError(null);
      } else {
        setBoyIsLoadingPlaces(true);
        setBoyPlacesError(null);
      }

      const res = await api.get("/maps/details", {
        params: { placeId },
      });

      const data = res.data;
      const location = data.result?.geometry?.location;
      if (!location) {
        throw new Error("Location details not available for selected place");
      }

      if (forWhom === "girl") {
        setGirlData((prev) => ({
          ...prev,
          birthLocation: description,
          latitude: String(location.lat),
          longitude: String(location.lng),
        }));
        setGirlPlaceSuggestions([]);
      } else {
        setBoyData((prev) => ({
          ...prev,
          birthLocation: description,
          latitude: String(location.lat),
          longitude: String(location.lng),
        }));
        setBoyPlaceSuggestions([]);
      }
    } catch (error: any) {
      console.error("Error fetching place details:", error);
      const message = error?.message || "Failed to fetch place details";
      if (forWhom === "girl") {
        setGirlPlacesError(message);
      } else {
        setBoyPlacesError(message);
      }
    } finally {
      if (forWhom === "girl") {
        setGirlIsLoadingPlaces(false);
      } else {
        setBoyIsLoadingPlaces(false);
      }
    }
  };

  const handleMatchHoroscopes = async () => {
    // Validation
    if (!girlData.name || !girlData.dob || !girlData.birthLocation) {
      showToast("Please fill all Girl's details", "error");
      return;
    }
    if (!boyData.name || !boyData.dob || !boyData.birthLocation) {
      showToast("Please fill all Boy's details", "error");
      return;
    }

    if (!girlData.latitude || !girlData.longitude) {
      showToast("Please select a valid Girl's birth place from suggestions", "error");
      return;
    }

    if (!boyData.latitude || !boyData.longitude) {
      showToast("Please select a valid Boy's birth place from suggestions", "error");
      return;
    }

    const girlLatitude = Number(girlData.latitude);
    const girlLongitude = Number(girlData.longitude);
    const boyLatitude = Number(boyData.latitude);
    const boyLongitude = Number(boyData.longitude);

    if (
      Number.isNaN(girlLatitude) ||
      Number.isNaN(girlLongitude) ||
      Number.isNaN(boyLatitude) ||
      Number.isNaN(boyLongitude)
    ) {
      showToast("Invalid coordinates for birth locations. Please select from suggestions again.", "error");
      return;
    }

    setLoading(true);

    try {
      const requestData: KundliMatchingRequest = {
        girlName: girlData.name,
        girlDateOfBirth: girlData.dob,
        girlTimeOfBirth: girlData.dontKnowTime ? "12:00" : girlData.timeOfBirth,
        girlPlaceOfBirth: girlData.birthLocation,
        girlLatitude,
        girlLongitude,
        boyName: boyData.name,
        boyDateOfBirth: boyData.dob,
        boyTimeOfBirth: boyData.dontKnowTime ? "12:00" : boyData.timeOfBirth,
        boyPlaceOfBirth: boyData.birthLocation,
        boyLatitude,
        boyLongitude,
      };

      const response = await createKundliMatching(requestData);

      if (response.success) {
        showToast("Kundli matching completed successfully!", "success");
        // Store the result and navigate to report page
        sessionStorage.setItem("kundliMatchingResult", JSON.stringify(response.matching));
        setTimeout(() => {
          router.push("/kundli-matching/report/basic-details");
        }, 1000);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to match kundli", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.black }}>
            Kundli Matching
          </h1>
          <p className="text-lg" style={{ color: colors.gray }}>
            Find your right one, through matchmaking
          </p>
        </div>

        {/* Form Section */}
        <div className="rounded-3xl p-8 mb-12 shadow-lg relative overflow-hidden bg-white">
          <Image
            src="/images/bg5.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
            style={{ opacity: 0.1 }}
          />
          
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {/* Girl's Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
                Girl's Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                    Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Name"
                    value={girlData.name}
                    onChange={(e) => setGirlData({ ...girlData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                    DOB<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    placeholder="Enter DOB"
                    value={girlData.dob}
                    onChange={(e) => setGirlData({ ...girlData, dob: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                    Birth Location<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Birth Location"
                    value={girlData.birthLocation}
                    onChange={(e) => {
                      const value = e.target.value;
                      setGirlData({ ...girlData, birthLocation: value, latitude: "", longitude: "" });
                      fetchPlaceSuggestions(value, "girl");
                    }}
                  />
                  {girlPlacesError && (
                    <p className="mt-1 text-sm text-red-500">{girlPlacesError}</p>
                  )}
                  {girlIsLoadingPlaces && (
                    <p className="mt-1 text-sm text-gray-500">Searching places...</p>
                  )}
                  {!girlIsLoadingPlaces && girlPlaceSuggestions.length > 0 && (
                    <div className="mt-2 border rounded-md bg-white max-h-48 overflow-y-auto shadow-sm">
                      {girlPlaceSuggestions.map((s) => (
                        <button
                          key={s.placeId}
                          type="button"
                          onClick={() => handleSelectPlaceSuggestion(s.placeId, s.description, "girl")}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          {s.description}
                        </button>
                      ))}
                    </div>
                  )}
                  {girlData.birthLocation && !girlData.latitude && !girlData.longitude && (
                    <p className="mt-1 text-xs text-gray-500">
                      Please select a place from the suggestions so we can detect its exact location.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                    Time of Birth
                  </label>
                  <Input
                    type="time"
                    placeholder="Enter Time of Birth"
                    value={girlData.timeOfBirth}
                    onChange={(e) => setGirlData({ ...girlData, timeOfBirth: e.target.value })}
                    disabled={girlData.dontKnowTime}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="girl-dont-know"
                      checked={girlData.dontKnowTime}
                      onChange={(e) => setGirlData({ ...girlData, dontKnowTime: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="girl-dont-know" className="text-sm" style={{ color: colors.gray }}>
                      Don't know time of birth
                    </label>
                  </div>
                  <p className="text-xs mt-1" style={{ color: colors.gray }}>
                    Note: Without time of birth, we can still answer all queries with 80% accuracy prediction
                  </p>
                </div>
              </div>
            </div>

            {/* Boy's Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
                Boy's Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                    Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Name"
                    value={boyData.name}
                    onChange={(e) => setBoyData({ ...boyData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                    DOB<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    placeholder="Enter DOB"
                    value={boyData.dob}
                    onChange={(e) => setBoyData({ ...boyData, dob: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                    Birth Location<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Birth Location"
                    value={boyData.birthLocation}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBoyData({ ...boyData, birthLocation: value, latitude: "", longitude: "" });
                      fetchPlaceSuggestions(value, "boy");
                    }}
                  />
                  {boyPlacesError && (
                    <p className="mt-1 text-sm text-red-500">{boyPlacesError}</p>
                  )}
                  {boyIsLoadingPlaces && (
                    <p className="mt-1 text-sm text-gray-500">Searching places...</p>
                  )}
                  {!boyIsLoadingPlaces && boyPlaceSuggestions.length > 0 && (
                    <div className="mt-2 border rounded-md bg-white max-h-48 overflow-y-auto shadow-sm">
                      {boyPlaceSuggestions.map((s) => (
                        <button
                          key={s.placeId}
                          type="button"
                          onClick={() => handleSelectPlaceSuggestion(s.placeId, s.description, "boy")}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          {s.description}
                        </button>
                      ))}
                    </div>
                  )}
                  {boyData.birthLocation && !boyData.latitude && !boyData.longitude && (
                    <p className="mt-1 text-xs text-gray-500">
                      Please select a place from the suggestions so we can detect its exact location.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                    Time of Birth
                  </label>
                  <Input
                    type="time"
                    placeholder="Enter Time of Birth"
                    value={boyData.timeOfBirth}
                    onChange={(e) => setBoyData({ ...boyData, timeOfBirth: e.target.value })}
                    disabled={boyData.dontKnowTime}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="boy-dont-know"
                      checked={boyData.dontKnowTime}
                      onChange={(e) => setBoyData({ ...boyData, dontKnowTime: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="boy-dont-know" className="text-sm" style={{ color: colors.gray }}>
                      Don't know time of birth
                    </label>
                  </div>
                  <p className="text-xs mt-1" style={{ color: colors.gray }}>
                    Note: Without time of birth, we can still answer all queries with 80% accuracy prediction
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Match Button */}
          <div className="mt-8 relative z-10">
            <Button
              fullWidth
              loading={loading}
              onClick={handleMatchHoroscopes}
              customColors={{
                backgroundColor: colors.primeYellow,
                textColor: colors.black,
              }}
              className="py-4 text-lg font-bold"
            >
              Match Horoscopes
            </Button>
          </div>
        </div>

        {/* Saved Matches */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
            Saved Matchs
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {savedMatches.map((match, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                    style={{ backgroundColor: colors.primeYellow }}
                  >
                    J
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1" style={{ color: colors.black }}>
                      {match.name}
                    </h3>
                    <p className="text-sm mb-1" style={{ color: colors.gray }}>
                      {match.date}
                    </p>
                    <p className="text-xs truncate" style={{ color: colors.gray }}>
                      {match.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
            Kundli Matching FAQs
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-lg pr-4" style={{ color: colors.black }}>
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-6 h-6 shrink-0" style={{ color: colors.gray }} />
                  ) : (
                    <ChevronDown className="w-6 h-6 shrink-0" style={{ color: colors.gray }} />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-base leading-relaxed" style={{ color: colors.gray }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
