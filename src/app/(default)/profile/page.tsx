"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import StepIndicator from "@/components/userprofile/StepIndicator";
import { getProfile, updateProfile } from "@/store/api/auth/profile";
import { createKundli } from "@/store/api/kundli";
import { getTransactionHistory } from "@/utils/wallet";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/store/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Gift, Loader2, MessageCircle, X } from "lucide-react";
const KUNDLI_GENERATED_KEY_PREFIX = "profile_kundli_generated";
const CELEBRATION_PARTICLES = [
  { left: "8%", size: "7px", color: "bg-yellow-300", delay: "0ms", duration: "900ms" },
  { left: "18%", size: "6px", color: "bg-rose-400", delay: "80ms", duration: "1000ms" },
  { left: "27%", size: "8px", color: "bg-amber-300", delay: "130ms", duration: "1100ms" },
  { left: "38%", size: "6px", color: "bg-emerald-300", delay: "170ms", duration: "950ms" },
  { left: "49%", size: "7px", color: "bg-sky-300", delay: "220ms", duration: "1050ms" },
  { left: "60%", size: "6px", color: "bg-fuchsia-300", delay: "260ms", duration: "980ms" },
  { left: "71%", size: "8px", color: "bg-orange-300", delay: "320ms", duration: "1150ms" },
  { left: "82%", size: "6px", color: "bg-lime-300", delay: "360ms", duration: "1000ms" },
  { left: "92%", size: "7px", color: "bg-pink-300", delay: "420ms", duration: "1080ms" },
];

const getSetupStepFromProfile = (profile: {
  fullName?: string | null;
  gender?: string | null;
  dateOfbirth?: string | null;
  timeOfbirth?: string | null;
  placeOfBirth?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}) => {
  if (!profile.fullName) return 1;
  if (!profile.gender) return 2;
  if (!profile.dateOfbirth) return 3;
  if (!profile.timeOfbirth) return 4;
  if (!profile.placeOfBirth || !profile.latitude || !profile.longitude)
    return 5;
  return 5;
};

const isProfileFullyComplete = (profile: {
  fullName?: string | null;
  gender?: string | null;
  dateOfbirth?: string | null;
  timeOfbirth?: string | null;
  placeOfBirth?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}) => {
  return Boolean(
    profile.fullName &&
    profile.gender &&
    profile.dateOfbirth &&
    profile.timeOfbirth &&
    profile.placeOfBirth &&
    profile.latitude &&
    profile.longitude,
  );
};

const parseTimeForForm = (timeOfBirth?: string | null) => {
  if (!timeOfBirth) {
    return { hour: "", minute: "", ampm: "AM" as "AM" | "PM" };
  }

  const [hourPart = "0", minutePart = "00"] = timeOfBirth.split(":");
  const hour24 = Number(hourPart);
  const minute = minutePart.padStart(2, "0");

  if (Number.isNaN(hour24)) {
    return { hour: "", minute: "", ampm: "AM" as "AM" | "PM" };
  }

  if (hour24 === 0) {
    return { hour: "12", minute, ampm: "AM" as "AM" | "PM" };
  }
  if (hour24 === 12) {
    return { hour: "12", minute, ampm: "PM" as "AM" | "PM" };
  }
  if (hour24 > 12) {
    return {
      hour: String(hour24 - 12).padStart(2, "0"),
      minute,
      ampm: "PM" as "AM" | "PM",
    };
  }

  return {
    hour: String(hour24).padStart(2, "0"),
    minute,
    ampm: "AM" as "AM" | "PM",
  };
};

const toKundliTime = (
  hour: string,
  minute: string,
  ampm: string,
  dontKnowTime: boolean,
) => {
  if (dontKnowTime) return "00:00";
  if (!hour || !minute) return "";

  let hour24 = Number(hour);
  if (Number.isNaN(hour24)) return "";

  if (ampm === "PM" && hour24 !== 12) hour24 += 12;
  if (ampm === "AM" && hour24 === 12) hour24 = 0;

  return `${String(hour24).padStart(2, "0")}:${minute}`;
};

const toProfileTime = (
  hour: string,
  minute: string,
  ampm: string,
  dontKnowTime: boolean,
) => {
  const kundliTime = toKundliTime(hour, minute, ampm, dontKnowTime);
  if (!kundliTime) return undefined;
  return `${kundliTime}:00`;
};

function MyProfilePageContent() {
  const { isLoggedIn, refreshUser, user, loading: authLoading } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileHydrated, setProfileHydrated] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [submittingSetup, setSubmittingSetup] = useState(false);

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [signupBonusAmount, setSignupBonusAmount] = useState(0);
  const [isGiftOpening, setIsGiftOpening] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    day: "",
    month: "",
    year: "",
    hour: "",
    minute: "",
    ampm: "AM",
    dontKnowTime: false,
    birthPlace: "",
    latitude: "",
    longitude: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const [placeSuggestions, setPlaceSuggestions] = useState<
    {
      description: string;
      placeId: string;
    }[]
  >([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const birthPlaceRef = useRef<HTMLDivElement>(null);

  const freeChatMinutes = useMemo(() => {
    const minutes = signupBonusAmount / 10;
    if (!Number.isFinite(minutes) || minutes <= 0) return "0";
    return Number.isInteger(minutes) ? String(minutes) : minutes.toFixed(1);
  }, [signupBonusAmount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        birthPlaceRef.current &&
        !birthPlaceRef.current.contains(event.target as Node)
      ) {
        setPlaceSuggestions([]);
      }
    };

    if (placeSuggestions.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [placeSuggestions]);

  useEffect(() => {
    if (!showGiftModal) {
      setIsGiftOpening(false);
      setGiftOpened(false);
      return;
    }

    const openStartTimer = setTimeout(() => {
      setIsGiftOpening(true);
    }, 350);

    const openCompleteTimer = setTimeout(() => {
      setGiftOpened(true);
    }, 1400);

    return () => {
      clearTimeout(openStartTimer);
      clearTimeout(openCompleteTimer);
    };
  }, [showGiftModal]);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (authLoading) return;

      if (!isLoggedIn) {
        setProfileHydrated(true);
        return;
      }

      if (!isLoggedIn) return;

      try {
        setProfileHydrated(false);
        const response = await getProfile();
        if (!response.success || !response.user) return;

        const p = response.user;
        const dateObj = p.dateOfbirth ? new Date(p.dateOfbirth) : null;
        const parsedTime = parseTimeForForm(p.timeOfbirth);
        const setupComplete = isProfileFullyComplete(p);
        const shouldShowSetup = !setupComplete;

        setIsProfileComplete(!shouldShowSetup);
        if (shouldShowSetup) {
          setSetupStep(getSetupStepFromProfile(p));
        }

        setFormData((prev) => ({
          ...prev,
          name: p.fullName || "",
          gender: p.gender || "",
          day: dateObj ? String(dateObj.getDate()).padStart(2, "0") : "",
          month: dateObj ? String(dateObj.getMonth() + 1).padStart(2, "0") : "",
          year: dateObj ? String(dateObj.getFullYear()) : "",
          hour: parsedTime.hour,
          minute: parsedTime.minute,
          ampm: parsedTime.ampm,
          dontKnowTime: p.timeOfbirth
            ? p.timeOfbirth.startsWith("00:00")
            : false,
          birthPlace: p.placeOfBirth || "",
          latitude: p.latitude || "",
          longitude: p.longitude || "",
          address: p.currentAddress || "",
          city: p.city || "",
          state: p.state || "",
          country: p.country || "India",
          pincode: p.pincode || "",
        }));
      } catch {
        showToast("Failed to load profile", "error");
      } finally {
        setProfileHydrated(true);
      }
    };

    fetchProfileDetails();
  }, [authLoading, isLoggedIn, searchParams, showToast]);

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
      } else {
        setPlaceSuggestions([]);
      }
    } catch {
      setPlaceSuggestions([]);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const handleSelectPlaceSuggestion = async (
    placeId: string,
    description: string,
  ) => {
    try {
      setIsLoadingPlaces(true);
      const res = await api.get("/maps/details", { params: { placeId } });
      const location = res.data.result?.geometry?.location;
      if (location) {
        setFormData((prev) => ({
          ...prev,
          birthPlace: description,
          latitude: String(location.lat),
          longitude: String(location.lng),
        }));
      }
      setPlaceSuggestions([]);
    } catch {
      showToast("Failed to fetch place details", "error");
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const maybeGenerateKundli = async (force = false) => {
    const kundliTime = toKundliTime(
      formData.hour,
      formData.minute,
      formData.ampm,
      formData.dontKnowTime,
    );

    if (
      !formData.name ||
      !formData.gender ||
      !formData.year ||
      !formData.month ||
      !formData.day ||
      !kundliTime ||
      !formData.birthPlace ||
      !formData.latitude ||
      !formData.longitude
    ) {
      return false;
    }

    const storageKey = `${KUNDLI_GENERATED_KEY_PREFIX}_${user?.id || "user"}`;
    if (
      !force &&
      typeof window !== "undefined" &&
      localStorage.getItem(storageKey) === "1"
    ) {
      return false;
    }

    try {
      const requestData = {
        fullName: formData.name,
        gender: formData.gender,
        dateOfbirth: `${formData.year}-${formData.month}-${formData.day}`,
        timeOfbirth: kundliTime,
        placeOfBirth: formData.birthPlace,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      const response = await createKundli(requestData);
      if (response.success && typeof window !== "undefined") {
        localStorage.setItem(storageKey, "1");
      }
      return response.success;
    } catch {
      return false;
    }
  };

  const fetchSignupBonusAmount = async () => {
    try {
      const history = await getTransactionHistory(1, 100, "credit", "completed");
      const signupBonusTransaction = history.transactions.find(
        (transaction) =>
          transaction.paymentMethod === "signup_bonus" ||
          /signup bonus/i.test(transaction.description || ""),
      );
      const creditedBonus = signupBonusTransaction
        ? Number(signupBonusTransaction.amount)
        : 0;
      return Number.isFinite(creditedBonus) ? creditedBonus : 0;
    } catch {
      return 0;
    }
  };

  const handleSetupSubmit = async () => {
    if (
      !formData.name ||
      !formData.gender ||
      !formData.year ||
      !formData.month ||
      !formData.day ||
      (!formData.dontKnowTime && (!formData.hour || !formData.minute)) ||
      !formData.birthPlace ||
      !formData.latitude ||
      !formData.longitude
    ) {
      showToast("Please complete all profile steps", "error");
      return;
    }

    if (formData.pincode && !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      showToast("Invalid pincode. Must be 6 digits", "error");
      return;
    }

    setSubmittingSetup(true);
    try {
      const dateOfbirth = `${formData.year}-${formData.month}-${formData.day}`;
      const timeOfbirth = toProfileTime(
        formData.hour,
        formData.minute,
        formData.ampm,
        formData.dontKnowTime,
      );

      const profileResponse = await updateProfile({
        fullName: formData.name,
        gender: formData.gender,
        dateOfbirth,
        timeOfbirth,
        placeOfBirth: formData.birthPlace,
        latitude: formData.latitude,
        longitude: formData.longitude,
        currentAddress: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      });

      if (!profileResponse.success) {
        showToast("Failed to update profile", "error");
        return;
      }

      const kundliCreated = await maybeGenerateKundli(true);
      await refreshUser();
      setIsProfileComplete(true);
      const creditedBonus = await fetchSignupBonusAmount();
      setSignupBonusAmount(creditedBonus);
      setShowGiftModal(true);
      if (searchParams.get("setup") === "1") {
        router.replace(pathname, { scroll: false });
      }
      showToast(
        kundliCreated
          ? "Profile updated and your Kundli has been generated"
          : "Profile updated. Kundli generation will retry on next update",
        "success",
      );
    } catch (error: any) {
      showToast(error?.message || "Failed to complete profile", "error");
    } finally {
      setSubmittingSetup(false);
    }
  };

  const handleRegularProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.pincode && !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      showToast("Invalid pincode. Must be 6 digits", "error");
      return;
    }

    try {
      let dateOfbirth: string | undefined;
      if (formData.year && formData.month && formData.day) {
        const dateStr = `${formData.year}-${formData.month}-${formData.day}`;
        const dateObj = new Date(dateStr);
        if (!Number.isNaN(dateObj.getTime())) {
          dateOfbirth = dateStr;
        } else {
          showToast("Invalid date of birth", "error");
          return;
        }
      }

      const timeOfbirth = toProfileTime(
        formData.hour,
        formData.minute,
        formData.ampm,
        formData.dontKnowTime,
      );

      const response = await updateProfile({
        fullName: formData.name,
        gender: formData.gender,
        dateOfbirth,
        timeOfbirth,
        placeOfBirth: formData.birthPlace,
        latitude: formData.latitude,
        longitude: formData.longitude,
        currentAddress: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      });

      if (response.success) {
        await refreshUser();
        const kundliCreated = await maybeGenerateKundli(false);
        showToast(
          kundliCreated
            ? "Profile updated and Kundli generated"
            : "Profile updated successfully",
          "success",
        );
      }
    } catch (error: any) {
      showToast(error?.message || "Update failed", "error");
    }
  };

  const renderBirthPlaceInput = () => (
    <div className="relative" ref={birthPlaceRef}>
      <Input
        label="Birth Place"
        required
        value={formData.birthPlace}
        onChange={(e) => {
          const value = e.target.value;
          setFormData((prev) => ({
            ...prev,
            birthPlace: value,
            latitude: "",
            longitude: "",
          }));
          fetchPlaceSuggestions(value);
        }}
        placeholder="Mumbai, India"
      />
      {placeSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-60 overflow-auto">
          {placeSuggestions.map((s) => (
            <button
              key={s.placeId}
              type="button"
              onClick={() =>
                handleSelectPlaceSuggestion(s.placeId, s.description)
              }
              className="w-full text-left px-4 py-3 text-sm hover:bg-indigo-50 active:bg-indigo-100 border-b last:border-0 transition-colors"
            >
              {s.description}
            </button>
          ))}
        </div>
      )}
      {isLoadingPlaces && (
        <p className="mt-2 text-xs text-gray-500">Loading places...</p>
      )}
    </div>
  );

  const renderSetupStep = () => {
    const sharedClass = "space-y-5 sm:space-y-6";

    if (setupStep === 1) {
      return (
        <div className={sharedClass}>
          <div className="text-center">
            <Heading level={2} className="text-xl sm:text-2xl font-bold mb-2">
              Welcome
            </Heading>
            <p className="text-sm text-gray-600">
              Let us complete your profile in 5 quick steps.
            </p>
          </div>
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Button
            onClick={() => setSetupStep(2)}
            disabled={!formData.name}
            fullWidth
            size="lg"
          >
            Next
          </Button>
        </div>
      );
    }

    if (setupStep === 2) {
      return (
        <div className={sharedClass}>
          <Heading level={3} className="text-base sm:text-lg text-center">
            Select Your Gender
          </Heading>
          <Select
            label="Gender"
            required
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gender: e.target.value }))
            }
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => setSetupStep(1)}
              variant="secondary"
              fullWidth
            >
              Back
            </Button>
            <Button
              onClick={() => setSetupStep(3)}
              disabled={!formData.gender}
              fullWidth
            >
              Next
            </Button>
          </div>
        </div>
      );
    }

    if (setupStep === 3) {
      return (
        <div className={sharedClass}>
          <Heading level={3} className="text-base sm:text-lg text-center">
            Enter Birth Date
          </Heading>
          <Input
            label="Date of Birth"
            type="date"
            required
            value={
              formData.year && formData.month && formData.day
                ? `${formData.year}-${formData.month}-${formData.day}`
                : ""
            }
            onChange={(e) => {
              const dateValue = e.target.value;
              if (!dateValue) {
                setFormData((prev) => ({
                  ...prev,
                  day: "",
                  month: "",
                  year: "",
                }));
                return;
              }

              const [year, month, day] = dateValue.split("-");
              setFormData((prev) => ({ ...prev, day, month, year }));
            }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => setSetupStep(2)}
              variant="secondary"
              fullWidth
            >
              Back
            </Button>
            <Button
              onClick={() => setSetupStep(4)}
              disabled={!formData.year || !formData.month || !formData.day}
              fullWidth
            >
              Next
            </Button>
          </div>
        </div>
      );
    }

    if (setupStep === 4) {
      return (
        <div className={sharedClass}>
          <Heading level={3} className="text-base sm:text-lg text-center">
            Enter Birth Time
          </Heading>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Hour"
              value={formData.hour}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, hour: e.target.value }))
              }
              disabled={formData.dontKnowTime}
            >
              <option value="">HH</option>
              {Array.from({ length: 12 }, (_, i) =>
                String(i + 1).padStart(2, "0"),
              ).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </Select>
            <Select
              label="Minutes"
              value={formData.minute}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, minute: e.target.value }))
              }
              disabled={formData.dontKnowTime}
            >
              <option value="">MM</option>
              {Array.from({ length: 60 }, (_, i) =>
                String(i).padStart(2, "0"),
              ).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
            <Select
              label="AM/PM"
              value={formData.ampm}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, ampm: e.target.value }))
              }
              disabled={formData.dontKnowTime}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </Select>
          </div>
          <label className="inline-flex items-start gap-2 text-sm text-gray-700 leading-snug">
            <input
              type="checkbox"
              checked={formData.dontKnowTime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dontKnowTime: e.target.checked,
                  hour: e.target.checked ? "" : prev.hour,
                  minute: e.target.checked ? "" : prev.minute,
                }))
              }
              className="w-4 h-4 mt-0.5"
            />
            I do not know my birth time
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => setSetupStep(3)}
              variant="secondary"
              fullWidth
            >
              Back
            </Button>
            <Button
              onClick={() => setSetupStep(5)}
              disabled={
                !formData.dontKnowTime && (!formData.hour || !formData.minute)
              }
              fullWidth
            >
              Next
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className={sharedClass}>
        <Heading level={3} className="text-base sm:text-lg text-center">
          Select Birth Place
        </Heading>
        {renderBirthPlaceInput()}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button onClick={() => setSetupStep(4)} variant="secondary" fullWidth>
            Back
          </Button>
          <Button
            onClick={handleSetupSubmit}
            disabled={
              submittingSetup ||
              !formData.birthPlace ||
              !formData.latitude ||
              !formData.longitude
            }
            fullWidth
          >
            {submittingSetup ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Finish & Generate Kundli"
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 relative">
      <div className={showGiftModal ? "pointer-events-none blur-sm select-none" : ""}>

      {(authLoading || (isLoggedIn && !profileHydrated)) && (
        <div className="space-y-6">
          <Card padding="lg" className="shadow-sm border-gray-100">
            <div className="animate-pulse space-y-4 sm:space-y-6">
              <div className="h-8 w-40 rounded bg-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="h-12 rounded-xl bg-gray-200" />
                <div className="h-12 rounded-xl bg-gray-200" />
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-3 sm:p-4 space-y-4">
                <div className="h-6 w-44 rounded bg-gray-200" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="h-12 rounded-xl bg-gray-200" />
                  <div className="h-12 rounded-xl bg-gray-200" />
                  <div className="h-12 rounded-xl bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="h-12 rounded-xl bg-gray-200" />
                  <div className="h-12 rounded-xl bg-gray-200" />
                  <div className="h-12 rounded-xl bg-gray-200" />
                </div>
                <div className="h-12 rounded-xl bg-gray-200" />
              </div>
              <div className="h-12 rounded-xl bg-gray-200" />
            </div>
          </Card>
        </div>
      )}

      {!authLoading && profileHydrated && !isProfileComplete ? (
        <Card
          padding="lg"
          className="shadow-sm border-gray-100 overflow-hidden"
        >
          <StepIndicator
            currentStep={setupStep}
            totalSteps={5}
            steps={[
              "Name",
              "Gender",
              "Birth Date",
              "Birth Time",
              "Birth Place",
            ]}
          />
          {renderSetupStep()}
        </Card>
      ) : !authLoading && profileHydrated ? (
        <Card padding="lg" className="shadow-sm border-gray-100">
          <Heading level={2} className="text-lg sm:text-2xl mb-5 sm:mb-6">
            Personal Details
          </Heading>

          <form
            onSubmit={handleRegularProfileUpdate}
            className="space-y-5 sm:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Full Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Select
                label="Gender"
                required
                value={formData.gender}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-4 sm:space-y-5 rounded-xl border border-gray-100 bg-gray-50/40 p-3 sm:p-4">
              <Heading
                level={3}
                className="text-base sm:text-lg font-semibold text-gray-800"
              >
                Birth Date & Time
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  label="Day"
                  required
                  value={formData.day}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, day: e.target.value }))
                  }
                >
                  {Array.from({ length: 31 }, (_, i) =>
                    String(i + 1).padStart(2, "0"),
                  ).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Month"
                  required
                  value={formData.month}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, month: e.target.value }))
                  }
                >
                  {[
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Year"
                  required
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, year: e.target.value }))
                  }
                >
                  {Array.from({ length: 100 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  label="Hour"
                  value={formData.hour}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hour: e.target.value }))
                  }
                  disabled={formData.dontKnowTime}
                >
                  <option value="">HH</option>
                  {Array.from({ length: 12 }, (_, i) =>
                    String(i + 1).padStart(2, "0"),
                  ).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Mins"
                  value={formData.minute}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, minute: e.target.value }))
                  }
                  disabled={formData.dontKnowTime}
                >
                  <option value="">MM</option>
                  {Array.from({ length: 60 }, (_, i) =>
                    String(i).padStart(2, "0"),
                  ).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
                <Select
                  label="AM/PM"
                  value={formData.ampm}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ampm: e.target.value }))
                  }
                  disabled={formData.dontKnowTime}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Select>
              </div>

              <label className="inline-flex items-start gap-2 text-sm text-gray-700 leading-snug">
                <input
                  type="checkbox"
                  checked={formData.dontKnowTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dontKnowTime: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 mt-0.5"
                />
                I do not know my birth time
              </label>

              {renderBirthPlaceInput()}
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              variant="custom"
              customColors={{
                backgroundColor: "#facd05",
                textColor: "#111827",
              }}
              className="rounded-xl font-black text-base sm:text-lg py-3.5 sm:py-4"
            >
              Update Profile
            </Button>
          </form>
        </Card>
      ) : null}
      </div>

      {showGiftModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/35 px-4">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-amber-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              onClick={() => setShowGiftModal(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pointer-events-none absolute inset-0">
              {CELEBRATION_PARTICLES.map((particle, idx) => (
                <span
                  key={idx}
                  className={`absolute top-3 rounded-full ${particle.color} transition-all ease-out ${giftOpened ? "opacity-100 translate-y-72 rotate-180" : "opacity-0 -translate-y-6"}`}
                  style={{
                    left: particle.left,
                    width: particle.size,
                    height: particle.size,
                    transitionDelay: giftOpened ? particle.delay : "0ms",
                    transitionDuration: particle.duration,
                  }}
                />
              ))}
            </div>

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Gift className="h-8 w-8" />
            </div>

            <p className="text-center text-xs font-semibold tracking-[0.2em] text-amber-600">
              BOOM! WELCOME GIFT UNLOCKED
            </p>
            <h3 className="mt-2 text-center text-xl font-extrabold text-gray-900 sm:text-2xl">
              {giftOpened ? "Your rewards are ready " : "Opening your welcome gift..."}
            </h3>

            <div className="mt-5 flex justify-center">
              <div className="relative h-28 w-40">
                <div className="absolute bottom-0 left-0 right-0 h-16 rounded-b-xl bg-amber-500 shadow-md" />
                <div
                  className={`absolute left-0 right-0 top-9 h-8 origin-bottom rounded-t-xl bg-amber-400 shadow transition-transform duration-700 ${isGiftOpening ? "-rotate-[22deg] -translate-y-5" : "rotate-0 translate-y-0"}`}
                />
                <div className="absolute left-1/2 top-7 h-16 w-3 -translate-x-1/2 rounded bg-rose-500" />
                <div
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 text-2xl transition-all duration-500 ${giftOpened ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                >
                  
                </div>
              </div>
            </div>

            {giftOpened ? (
              <>
                <div className="mt-4 space-y-3 rounded-xl border border-amber-100 bg-amber-50 p-4 sm:p-5">
                  <p className="text-sm font-semibold text-gray-800 sm:text-base">
                    Rs {signupBonusAmount} is credited to your wallet.
                  </p>
                  <p className="text-sm font-semibold text-gray-800 sm:text-base">
                    {freeChatMinutes} min chat is free to talk with any astrologer.
                  </p>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  className="mt-6"
                  onClick={() => {
                    setShowGiftModal(false);
                    router.push(
                      `/aichat?id=${encodeURIComponent("ai-astrologer-devansh")}&astrologer=${encodeURIComponent("Acharya Devansh Sharma")}&photo=${encodeURIComponent("/images/devanshv1.jpeg")}`,
                    );
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Talk to Astrologer
                  </span>
                </Button>
              </>
            ) : (
              <p className="mt-4 text-center text-sm font-medium text-gray-600">
                Please wait, opening your gift...
              </p>
            )}
          </div>
        </div>
      )}

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

export default function MyProfilePage() {
  return (
    <Suspense fallback={<div className="animate-in fade-in duration-500" />}>
      <MyProfilePageContent />
    </Suspense>
  );
}
