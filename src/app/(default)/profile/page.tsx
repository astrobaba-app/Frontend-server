"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { getProfile, updateProfile } from "@/store/api/auth/profile";
import { getStates, getCitiesByState } from "@/store/api/location";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/store/api";

export default function MyProfilePage() {
  const { user, isLoggedIn } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();

  const [formData, setFormData] = useState({
    name: "", gender: "", day: "", month: "", year: "",
    hour: "", minute: "", ampm: "AM", birthPlace: "",
    latitude: "", longitude: "",
    address: "", city: "", state: "", country: "", pincode: "",
  });

  const [placeSuggestions, setPlaceSuggestions] = useState<
    {
      description: string;
      placeId: string;
    }[]
  >([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const birthPlaceRef = React.useRef<HTMLDivElement>(null);

  // Fetch states on component mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        const response = await getStates();
        if (response.success && response.states) {
          setStates(response.states);
        }
      } catch (error) {
        console.error("Failed to load states:", error);
      }
    };
    loadStates();
  }, []);

  // Handle click outside for birth place suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (birthPlaceRef.current && !birthPlaceRef.current.contains(event.target as Node)) {
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

  // Function to fetch cities for a state
  const fetchCitiesForState = async (state: string) => {
    if (!state) {
      setCities([]);
      return;
    }
    try {
      setLoadingCities(true);
      const response = await getCitiesByState(state);
      if (response.success && response.cities) {
        setCities(response.cities);
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await getProfile();
        if (response.success && response.user) {
          const p = response.user;
          const dateObj = p.dateOfbirth ? new Date(p.dateOfbirth) : null;
          let hour = "", minute = "", ampm = "AM";
          if (p.timeOfbirth) {
            const parts = p.timeOfbirth.split(":");
            const hour24 = parseInt(parts[0] || "0");
            minute = parts[1] || "";
            
            // Convert 24-hour to 12-hour format
            if (hour24 === 0) {
              hour = "12";
              ampm = "AM";
            } else if (hour24 === 12) {
              hour = "12";
              ampm = "PM";
            } else if (hour24 > 12) {
              hour = (hour24 - 12).toString().padStart(2, "0");
              ampm = "PM";
            } else {
              hour = hour24.toString().padStart(2, "0");
              ampm = "AM";
            }
          }

          setFormData((prev) => ({
            ...prev,
            name: p.fullName || "",
            gender: p.gender || "",
            day: dateObj ? dateObj.getDate().toString().padStart(2, "0") : "",
            month: dateObj ? (dateObj.getMonth() + 1).toString().padStart(2, "0") : "",
            year: dateObj ? dateObj.getFullYear().toString() : "",
            hour, minute, ampm,
            birthPlace: p.placeOfBirth || "",
            latitude: p.latitude || "",
            longitude: p.longitude || "",
            address: p.currentAddress || "",
            city: p.city || "",
            state: p.state || "",
            country: p.country || "India",
            pincode: p.pincode || "",
          }));

          // Load cities if state is already set
          if (p.state) {
            fetchCitiesForState(p.state);
          }
        }
      } catch (error) {
        showToast("Failed to load profile", "error");
      }
    };
    fetchProfile();
  }, [isLoggedIn]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate pincode
    if (formData.pincode && !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      showToast("Invalid pincode. Must be 6 digits", "error");
      return;
    }

    try {
      // Validate and construct date of birth
      let dateOfbirth: string | undefined;
      if (formData.year && formData.month && formData.day) {
        const dateStr = `${formData.year}-${formData.month}-${formData.day}`;
        const dateObj = new Date(dateStr);
        if (!isNaN(dateObj.getTime())) {
          dateOfbirth = dateStr;
        } else {
          showToast("Invalid date of birth", "error");
          return;
        }
      }

      // Validate and construct time of birth
      let timeOfbirth: string | undefined;
      if (formData.hour && formData.minute) {
        // Convert 12-hour format to 24-hour format
        let hour24 = parseInt(formData.hour);
        if (formData.ampm === "PM" && hour24 !== 12) {
          hour24 += 12;
        } else if (formData.ampm === "AM" && hour24 === 12) {
          hour24 = 0;
        }
        timeOfbirth = `${hour24.toString().padStart(2, "0")}:${formData.minute}:00`;
      }
      
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

      if (response.success) showToast("Profile updated successfully!", "success");
    } catch (error: any) {
      showToast(error?.message || "Update failed", "error");
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setFormData({ ...formData, state: newState, city: "" });
    fetchCitiesForState(newState);
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
      } else {
        setPlaceSuggestions([]);
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
          birthPlace: description,
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

  return (
    <div className="animate-in fade-in duration-500">
      <Card padding="lg" className="shadow-sm border-gray-100">
        <Heading level={2} className="text-xl sm:text-2xl mb-6">Personal Details</Heading>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Input label="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <Select label="Gender" required value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <hr className="border-gray-100" />

          {/* Birth Details */}
          <div className="space-y-4">
            <Heading level={3} className="text-lg font-semibold text-gray-800">Birth Date & Time</Heading>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Select label="Day" required value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })}>
                {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0")).map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
              <Select label="Month" required value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })}>
                {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
              <Select label="Year" required className="col-span-2 sm:col-span-1" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}>
                {Array.from({ length: 100 }, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Select label="Hour" required value={formData.hour} onChange={(e) => setFormData({ ...formData, hour: e.target.value })}>
                <option value="">HH</option>
                {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map(h => <option key={h} value={h}>{h}</option>)}
              </Select>
              <Select label="Mins" required value={formData.minute} onChange={(e) => setFormData({ ...formData, minute: e.target.value })}>
                <option value="">MM</option>
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
              <Select label="AM/PM" required value={formData.ampm} onChange={(e) => setFormData({ ...formData, ampm: e.target.value })}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </Select>
            </div>

            <div className="relative" ref={birthPlaceRef}>
              <Input 
                label="Birth Place" 
                required 
                value={formData.birthPlace} 
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ 
                    ...formData, 
                    birthPlace: value,
                    latitude: "",
                    longitude: "",
                  });
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
                      onClick={() => handleSelectPlaceSuggestion(s.placeId, s.description)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-indigo-50 active:bg-indigo-100 border-b last:border-0 transition-colors"
                    >
                      {s.description}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Current Address */}
          <div className="space-y-4">
            <Heading level={3} className="text-lg font-semibold text-gray-800">Current Address</Heading>
            <Input label="Street Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="House no, Street" />
            
            <div className="grid grid-cols-1 gap-4">
              <Input label="Country" value="India" disabled className="bg-gray-50" />
              
              <Select 
                label="State" 
                value={formData.state} 
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </Select>

              <Select 
                label="City" 
                value={formData.city} 
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!formData.state || loadingCities}
              >
                <option value="">
                  {loadingCities ? "Loading cities..." : formData.state ? "Select City" : "Select State First"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>

              <Input 
                label="Pincode" 
                value={formData.pincode} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setFormData({ ...formData, pincode: value });
                }} 
                placeholder="6-digit pincode"
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" variant="custom" customColors={{ backgroundColor: "#facd05", textColor: "#111827" }} className="rounded-xl font-black text-lg py-4">
            Update Profile
          </Button>
        </form>
      </Card>
      {toastProps.isVisible && <Toast message={toastProps.message} type={toastProps.type} onClose={hideToast} />}
    </div>
  );
}