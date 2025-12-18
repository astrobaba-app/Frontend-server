"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { getProfile, updateProfile } from "@/store/api/auth/profile";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import { useAuth } from "@/contexts/AuthContext";

export default function MyProfilePage() {
  const { user, isLoggedIn } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();

  const [formData, setFormData] = useState({
    name: "", gender: "", day: "", month: "", year: "",
    hour: "", minute: "", second: "00", birthPlace: "",
    address: "", city: "", state: "", country: "", pincode: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await getProfile();
        if (response.success && response.user) {
          const p = response.user;
          const dateObj = p.dateOfbirth ? new Date(p.dateOfbirth) : null;
          let hour = "", minute = "";
          if (p.timeOfbirth) {
            const parts = p.timeOfbirth.split(":");
            hour = parts[0] || "";
            minute = parts[1] || "";
          }

          setFormData((prev) => ({
            ...prev,
            name: p.fullName || "",
            gender: p.gender || "",
            day: dateObj ? dateObj.getDate().toString().padStart(2, "0") : "",
            month: dateObj ? (dateObj.getMonth() + 1).toString().padStart(2, "0") : "",
            year: dateObj ? dateObj.getFullYear().toString() : "",
            hour, minute,
            birthPlace: p.placeOfBirth || "",
          }));
        }
      } catch (error) {
        showToast("Failed to load profile", "error");
      }
    };
    fetchProfile();
  }, [isLoggedIn]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateOfbirth = `${formData.year}-${formData.month}-${formData.day}`;
      const timeOfbirth = `${formData.hour}:${formData.minute}`;
      
      const response = await updateProfile({
        fullName: formData.name,
        gender: formData.gender,
        dateOfbirth,
        timeOfbirth,
        placeOfBirth: formData.birthPlace,
      });

      if (response.success) showToast("Profile updated successfully!", "success");
    } catch (error) {
      showToast("Update failed", "error");
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
                {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map(h => <option key={h} value={h}>{h}</option>)}
              </Select>
              <Select label="Mins" required value={formData.minute} onChange={(e) => setFormData({ ...formData, minute: e.target.value })}>
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
              <Select label="Secs" required value={formData.second} onChange={(e) => setFormData({ ...formData, second: e.target.value })}>
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>

            <Input label="Birth Place" required value={formData.birthPlace} onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} placeholder="City, State" />
          </div>

          <hr className="border-gray-100" />

          {/* Current Address */}
          <div className="space-y-4">
            <Heading level={3} className="text-lg font-semibold text-gray-800">Current Address</Heading>
            <Input label="Street Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="House no, Street" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              <Input label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              <Input label="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              <Input label="Pincode" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
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