"use client";
import React, { useState, useEffect } from "react";
import StepIndicator from "@/components/userprofile/StepIndicator";
import { useRouter } from "next/navigation";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import KundliCard from "@/components/card/KundliCard";
import Toast from "@/components/atoms/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { getAllKundlis, createKundli } from "@/store/api/kundli";
import api from "@/store/api";
import { getProfile } from "@/store/api/auth/profile";
import { KundliCardSkeleton } from "@/components/skeletons/KundliCardSkeleton";
import { ProfileSkeleton } from "@/components/skeletons/ProfileSkeleton";
import { Loader2, ArrowLeft, Plus } from "lucide-react";

export default function FreeKundliPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fetchFromProfile, setFetchFromProfile] = useState(false);
  const [kundliHistory, setKundliHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileFetching, setProfileFetching] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "Male",
    dateOfbirth: "",
    timeOfbirth: "",
    placeOfBirth: "",
    latitude: "",
    longitude: "",
  });

  const [placeSuggestions, setPlaceSuggestions] = useState<
    {
      description: string;
      placeId: string;
    }[]
  >([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/auth/login?redirect=/profile/kundli");
    }
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    const fetchKundliHistory = async () => {
      if (!isLoggedIn) return;
      try {
        setHistoryLoading(true);
        const response = await getAllKundlis();
        if (response.success && response.userRequests) {
          setKundliHistory(response.userRequests);
        }
      } catch (error: any) {
        console.error("Failed to fetch kundli history:", error);
        showToast(error?.message || "Failed to load kundli history", "error");
      } finally {
        setHistoryLoading(false);
      }
    };

    if (isLoggedIn && !loading) {
      fetchKundliHistory();
    }
  }, [isLoggedIn, loading]);

  const handleFetchFromProfile = async () => {
    try {
      setProfileFetching(true);
      const response = await getProfile();
      if (response.success && response.user) {
        const profileUser = response.user;
        setFormData({
          fullName: profileUser.fullName || "",
          gender: profileUser.gender || "Male",
          dateOfbirth: profileUser.dateOfbirth || "",
          timeOfbirth: profileUser.timeOfbirth || "",
          placeOfBirth: profileUser.placeOfBirth || "",
          latitude: "",
          longitude: "",
        });
        setFetchFromProfile(true);
        setShowForm(true);
        if (!profileUser.fullName) setCurrentStep(1);
        else if (!profileUser.gender) setCurrentStep(2);
        else if (!profileUser.dateOfbirth) setCurrentStep(3);
        else if (!profileUser.timeOfbirth) setCurrentStep(4);
        else setCurrentStep(5);
      }
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      showToast("Failed to load profile data", "error");
    } finally {
      setProfileFetching(false);
    }
  };

  const handleNext = () => currentStep < 5 && setCurrentStep(currentStep + 1);
  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleGenerate = async () => {
    if (
      !formData.fullName ||
      !formData.gender ||
      !formData.dateOfbirth ||
      !formData.timeOfbirth ||
      !formData.placeOfBirth ||
      !formData.latitude
    ) {
      showToast(
        "Please fill in all required fields and select a valid location",
        "error"
      );
      return;
    }

    try {
      setSubmitting(true);
      const requestData = {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      const response = await createKundli(requestData);

      if (response.success) {
        showToast("Kundli generated successfully!", "success");
        setShowForm(false);
        setCurrentStep(1);
        setFetchFromProfile(false);
        setFormData({
          fullName: "",
          gender: "Male",
          dateOfbirth: "",
          timeOfbirth: "",
          placeOfBirth: "",
          latitude: "",
          longitude: "",
        });

        const historyResponse = await getAllKundlis();
        if (historyResponse.success)
          setKundliHistory(historyResponse.userRequests);

        setTimeout(() => {
          router.push(`/kundliReport?id=${response.kundli.requestId}`);
        }, 1500);
      }
    } catch (error: any) {
      showToast(error?.message || "Failed to generate Kundli", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchPlaceSuggestions = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setPlaceSuggestions([]);
      return;
    }
    try {
      setIsLoadingPlaces(true);
      const res = await api.get("/maps/autocomplete", {
        params: { input: query.trim() },
      });
      const data = res.data;
      if (data.status === "OK") {
        const suggestions = data.predictions.map((p: any) => ({
          description: p.description,
          placeId: p.place_id,
        }));
        setPlaceSuggestions(suggestions);
      }
    } catch (error) {
      setPlaceSuggestions([]);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const handleSelectPlaceSuggestion = async (
    placeId: string,
    description: string
  ) => {
    try {
      setIsLoadingPlaces(true);
      const res = await api.get("/maps/details", { params: { placeId } });
      const location = res.data.result?.geometry?.location;
      if (location) {
        setFormData((prev) => ({
          ...prev,
          placeOfBirth: description,
          latitude: String(location.lat),
          longitude: String(location.lng),
        }));
      }
      setPlaceSuggestions([]);
    } catch (error) {
      showToast("Failed to fetch place details", "error");
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-yellow-500" />
      </div>
    );
  if (!isLoggedIn) return null;

 const renderStepContent = () => {
  // Shared responsive spacing class
  const stackClass = "space-y-6 sm:space-y-8";

  switch (currentStep) {
    case 1:
      return (
        <div className={stackClass}>
          <div className="text-center">
            <Heading level={2} className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
              Hey There!
            </Heading>
            <Heading level={3} className="text-gray-600 text-sm sm:text-base md:text-lg">
              What is your name?
            </Heading>
          </div>
          <Input
            label="Full Name"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            placeholder="John Doe"
          />
          <Button
            onClick={handleNext}
            disabled={!formData.fullName}
            fullWidth
            size="lg"
            className="h-11 sm:h-12 md:h-14 text-base sm:text-lg"
          >
            Next
          </Button>
        </div>
      );

    case 2:
      return (
        <div className={stackClass}>
          <div className="text-center">
            <Heading level={3} className="text-lg sm:text-xl md:text-2xl">
              What is your Gender?
            </Heading>
          </div>
          <Select
            label="Gender"
            required
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          {/* Grid stays 2 cols, but gap is smaller on mobile */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Button
              onClick={handleBack}
              variant="secondary"
              fullWidth
              size="lg"
            >
              Back
            </Button>
            <Button onClick={handleNext} fullWidth size="lg">
              Next
            </Button>
          </div>
        </div>
      );

    case 3:
    case 4:
      const isStep3 = currentStep === 3;
      return (
        <div className={stackClass}>
          <div className="text-center">
            <Heading level={3} className="text-lg sm:text-xl md:text-2xl">
              {isStep3 ? "Enter your Birth Date" : "Enter your Birth Time"}
            </Heading>
          </div>
          <Input
            label={isStep3 ? "Date of Birth" : "Birth Time"}
            type={isStep3 ? "date" : "time"}
            required
            value={isStep3 ? formData.dateOfbirth : formData.timeOfbirth}
            onChange={(e) =>
              setFormData({ 
                ...formData, 
                [isStep3 ? "dateOfbirth" : "timeOfbirth"]: e.target.value 
              })
            }
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Button onClick={handleBack} variant="secondary" fullWidth size="lg">
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isStep3 ? !formData.dateOfbirth : !formData.timeOfbirth}
              fullWidth
              size="lg"
            >
              Next
            </Button>
          </div>
        </div>
      );

    case 5:
      return (
        <div className={stackClass}>
          <div className="text-center">
            <Heading level={3} className="text-lg sm:text-xl md:text-2xl">
              What is your Birth Place?
            </Heading>
          </div>
          <div className="relative">
            <Input
              label="Birth Place"
              required
              value={formData.placeOfBirth}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  placeOfBirth: e.target.value,
                  latitude: "",
                  longitude: "",
                });
                fetchPlaceSuggestions(e.target.value);
              }}
              placeholder="Mumbai, India"
            />
            {placeSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg sm:rounded-xl shadow-xl max-h-48 sm:max-h-60 overflow-auto">
                {placeSuggestions.map((s) => (
                  <button
                    key={s.placeId}
                    type="button"
                    onClick={() => handleSelectPlaceSuggestion(s.placeId, s.description)}
                    className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm hover:bg-indigo-50 active:bg-indigo-100 border-b last:border-0 transition-colors"
                  >
                    {s.description}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Button onClick={handleBack} variant="secondary" fullWidth size="lg">
              Back
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!formData.latitude || submitting}
              fullWidth
              size="lg"
            >
              {submitting ? (
                <Loader2 className="animate-spin mx-auto" size={20} />
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
};

  return (
    <div className="bg-gray-50 pb-20 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <main className={!showForm ? "max-w-4xl mx-auto" : "mx-auto"}>
        {!showForm ? (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-lg md:text-2xl font-black text-gray-900 ">
                Janam Kundli
              </h2>
              <p className="text-sm md:text-base text-gray-500 font-medium">
                Get your instant and accurate Vedic birth chart
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button
                onClick={() => setShowForm(true)}
                className="rounded-xl text-xs md:text-sm py-2 md:py-3 h-auto" // Smaller text and padding on mobile
                variant="primary"
              >
                <Plus className="w-4 h-4 mr-2" /> Create New Kundli
              </Button>

              <Button
                onClick={handleFetchFromProfile}
                variant="secondary"
                className="rounded-xl text-xs md:text-sm py-2 md:py-3 h-auto" // Matching size
                disabled={profileFetching}
              >
                {profileFetching ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  "Use My Profile Details"
                )}
              </Button>
            </div>

            <div className="space-y-4 px-2 sm:px-0">
              <h3 className="text-xs sm:text-sm font-black text-gray-400 uppercase tracking-widest">
                Recently Generated
              </h3>
              {historyLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[1, 2, 3].map((i) => (
                    <KundliCardSkeleton key={i} />
                  ))}
                </div>
              ) : kundliHistory.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">
                  <p className="text-sm sm:text-base text-gray-400 font-bold">
                    No saved Kundlis found.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {kundliHistory.map((kundli) => (
                    <KundliCard
                      key={kundli.id}
                      name={kundli.fullName}
                      dob={new Date(kundli.dateOfbirth).toLocaleDateString()}
                      birthPlace={kundli.placeOfBirth}
                      onClick={() =>
                        router.push(`/kundliReport?id=${kundli.id}`)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
         
  <div className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
    <Card className="rounded-lg sm:rounded-xl shadow-sm border-0 overflow-hidden bg-white">
      <div className="p-3 sm:p-5 md:p-6 lg:p-8">
        <StepIndicator currentStep={currentStep} totalSteps={5} />
        
        <div className="mt-6 sm:mt-8">
          {renderStepContent()}
        </div>
      </div>
    </Card>
</div>
        )}
      </main>

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
