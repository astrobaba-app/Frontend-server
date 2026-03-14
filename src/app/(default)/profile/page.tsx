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
import { getMyChatSessions } from "@/store/api/chat";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/store/api";
import { useSearchParams } from "next/navigation";
import {
  Gift,
  Sparkles,
  MessageCircle,
  Ticket,
  Loader2,
  X,
} from "lucide-react";

interface ActiveCoupon {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number | null;
  minRechargeAmount?: number;
  canUse?: boolean;
  remainingUses?: number;
}

interface ActiveCouponsResponse {
  success: boolean;
  coupons: ActiveCoupon[];
}

const CHAT_FREE_MINUTES = 5;
const KUNDLI_GENERATED_KEY_PREFIX = "profile_kundli_generated";

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

const getCouponValueLabel = (coupon: ActiveCoupon | null) => {
  if (!coupon) return "No coupon available";

  if (coupon.discountType === "fixed") {
    return `Rs ${coupon.discountValue} off`;
  }

  const maxCap = coupon.maxDiscount ? ` (up to Rs ${coupon.maxDiscount})` : "";
  return `${coupon.discountValue}% off${maxCap}`;
};

function MyProfilePageContent() {
  const { isLoggedIn, refreshUser, user, loading: authLoading } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();
  const searchParams = useSearchParams();

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileHydrated, setProfileHydrated] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [submittingSetup, setSubmittingSetup] = useState(false);

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftRevealed, setGiftRevealed] = useState(false);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [bestCoupon, setBestCoupon] = useState<ActiveCoupon | null>(null);
  const [firstChatEligible, setFirstChatEligible] = useState<boolean | null>(
    null,
  );

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

  const rewardSubtitle = useMemo(() => {
    if (firstChatEligible === null) return "Tap to reveal your welcome rewards";
    if (firstChatEligible)
      return `Free ${CHAT_FREE_MINUTES} min first chat + coupon unlocked`;
    return "Coupon unlocked for your next wallet recharge";
  }, [firstChatEligible]);

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
      setGiftRevealed(false);
      return;
    }

    const revealTimer = setTimeout(() => {
      setGiftRevealed(true);
    }, 900);

    return () => clearTimeout(revealTimer);
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
        const forceSetup = searchParams.get("setup") === "1";

        setIsProfileComplete(forceSetup ? false : setupComplete);
        if (!setupComplete || forceSetup) {
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

  const loadRewards = async () => {
    try {
      setLoadingRewards(true);
      const [couponRes, chatRes] = await Promise.all([
        api.get<ActiveCouponsResponse>("/coupon/active"),
        getMyChatSessions({ page: 1, limit: 1 }),
      ]);

      const coupons = couponRes.data?.coupons || [];
      const usableCoupons = coupons.filter((coupon) => coupon.canUse !== false);
      const selectedCoupon = usableCoupons[0] || coupons[0] || null;
      setBestCoupon(selectedCoupon);

      const totalChats =
        chatRes.pagination?.total ?? chatRes.sessions?.length ?? 0;
      setFirstChatEligible(totalChats === 0);
    } catch {
      setBestCoupon(null);
      setFirstChatEligible(true);
    } finally {
      setLoadingRewards(false);
    }
  };

  const openGiftModal = () => {
    setShowGiftModal(true);
    if (!loadingRewards) {
      loadRewards();
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

  const renderGiftFloatingAction = () => (
    <button
      type="button"
      onClick={openGiftModal}
      aria-label="Open welcome rewards"
      className="fixed top-28 sm:top-32 md:top-44 right-3 sm:right-5 z-50 h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-linear-to-br from-amber-300 via-yellow-400 to-orange-400 text-white shadow-lg ring-2 sm:ring-4 ring-white/70 hover:scale-105 active:scale-95 transition-transform"
    >
      <Gift className="w-5 h-5 sm:w-7 sm:h-7 mx-auto drop-shadow-sm" />
      <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
        1
      </span>
    </button>
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
    <div className="animate-in fade-in duration-500">
      {renderGiftFloatingAction()}

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

      {showGiftModal && (
        <div className="fixed inset-0 z-70 bg-[#f4cc2a] overflow-y-auto">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              "top-10 left-6",
              "top-24 right-10",
              "top-40 left-1/4",
              "top-56 right-1/3",
              "top-72 left-12",
              "bottom-32 right-8",
              "bottom-20 left-1/3",
              "bottom-10 left-8",
            ].map((position, idx) => (
              <span
                key={idx}
                className={`absolute ${position} h-2 w-6 rounded-full ${idx % 2 === 0 ? "bg-white/80" : "bg-orange-400/80"} ${idx % 3 === 0 ? "rotate-45" : "-rotate-12"}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-80 p-2 rounded-full bg-white/70 hover:bg-white transition-colors"
            onClick={() => setShowGiftModal(false)}
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 sm:py-10">
            <div className="relative mb-6 sm:mb-8 h-56 sm:h-64 w-56 sm:w-72">
              <div className="absolute left-1/2 -translate-x-1/2 -top-14 sm:-top-20 h-24 sm:h-32 w-44 sm:w-56 rounded-full bg-white/45 blur-2xl animate-pulse" />
              {giftRevealed && (
                <div className="absolute left-1/2 -translate-x-1/2 top-16 sm:top-20 h-20 sm:h-24 w-32 sm:w-40 rounded-full bg-white/60 blur-xl animate-pulse" />
              )}

              <div className="relative h-full w-full flex items-center justify-center">
                <div
                  className={`absolute top-8 sm:top-22 left-1/2 z-20 -translate-x-1/2 transition-all duration-700 ${giftRevealed ? "-translate-y-10 sm:-translate-y-30 -rotate-12" : "animate-bounce"}`}
                >
                  <div className="h-10 sm:h-12 w-44 sm:w-56 rounded-md bg-emerald-400 shadow-lg border border-emerald-500/40" />
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 sm:w-7 bg-rose-500/90" />
                  <Gift className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 text-rose-600" />
                </div>

                <div
                  className={`absolute top-2 sm:top-8 left-1/2 z-10 w-40 sm:w-48 -translate-x-1/2 rounded-2xl  px-3 py-2.5 sm:px-4 sm:py-3 transition-all duration-500 ${giftRevealed && !loadingRewards ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-3"}`}
                >
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider font-black text-amber-700 text-center">
                    Rewards Revealed
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900 text-center mt-1 leading-tight">
                    {getCouponValueLabel(bestCoupon)}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-700 text-center mt-1 leading-tight">
                    {firstChatEligible === false
                      ? "First chat reward used"
                      : `${CHAT_FREE_MINUTES} min free first chat`}
                  </p>
                </div>

                <div className="absolute bottom-0 left-1/2 h-28 sm:h-32 w-44 sm:w-56 -translate-x-1/2 rounded-b-xl bg-emerald-500 shadow-2xl border border-emerald-600/40 overflow-hidden">
                  <div className="absolute inset-y-0 left-1/3 w-6 sm:w-7 bg-rose-500/95" />
                  <div className="absolute inset-y-0 right-1/4 w-6 sm:w-7 bg-rose-600/90" />
                </div>
              </div>
            </div>

            <div className="text-center mb-4 sm:mb-6">
              <p className="text-xs uppercase tracking-widest text-amber-900/80 font-black">
                Welcome Rewards
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                {giftRevealed ? "Gift Box Unlocked" : "Opening Your Gift..."}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mt-1">
                {giftRevealed ? rewardSubtitle : "Please wait while your rewards are being revealed"}
              </p>
            </div>

            <div className="w-full max-w-md space-y-3 sm:space-y-4">
              {!giftRevealed ? (
                <div className="rounded-2xl bg-white/80 border border-white p-8 sm:p-10 flex items-center justify-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-700 animate-pulse" />
                  <p className="text-sm font-semibold text-gray-700">
                    Opening your surprise reward...
                  </p>
                </div>
              ) : loadingRewards ? (
                <div className="rounded-2xl bg-white/80 border border-white p-8 sm:p-10 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-yellow-700" />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/80 bg-white/75 p-4 sm:p-5 shadow-md text-center">
                  <p className="text-sm font-bold text-gray-800">
                    Your surprise is shown inside the gift box.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">
                    {bestCoupon
                      ? `Coupon code: ${bestCoupon.code}`
                      : "No active coupon code right now"}
                  </p>
                </div>
              )}
            </div>
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
