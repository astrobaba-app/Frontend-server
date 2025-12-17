"use client";

import React, { useState, useEffect, useRef } from "react";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import Toast from "@/components/atoms/Toast";
import { AstrologerProfileSkeleton } from "@/components/skeletons";
import { useToast } from "@/hooks/useToast";
import { colors } from "@/utils/colors";
import { getAstrologerProfile, updateAstrologerProfile } from "@/store/api/astrologer/profile";
import type { AstrologerProfile } from "@/store/api/astrologer/auth";

export default function AstrologerProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast, showToast, hideToast } = useToast();
  const [profile, setProfile] = useState<AstrologerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    yearsOfExperience: "",
    dateOfBirth: "",
    pricePerMinute: "",
    languages: [] as string[],
    skills: [] as string[],
    bio: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getAstrologerProfile();
      if (response.success) {
        setProfile(response.astrologer);
        setFormData({
          fullName: response.astrologer.fullName || "",
          phoneNumber: response.astrologer.phoneNumber || "",
          yearsOfExperience: response.astrologer.yearsOfExperience?.toString() || "",
          dateOfBirth: response.astrologer.dateOfBirth || "",
          pricePerMinute: response.astrologer.pricePerMinute?.toString() || "",
          languages: Array.isArray(response.astrologer.languages) 
            ? response.astrologer.languages 
            : [],
          skills: Array.isArray(response.astrologer.skills) 
            ? response.astrologer.skills 
            : [],
          bio: response.astrologer.bio || "",
        });
        if (response.astrologer.photo) {
          setImagePreview(response.astrologer.photo);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size should be less than 5MB", "error");
        return;
      }

      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTag = (type: "languages" | "skills", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const addTag = (type: "languages" | "skills", value: string) => {
    if (value.trim() && !formData[type].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], value.trim()],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    setUpdating(true);
    try {
      const updateData = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth || undefined,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || undefined,
        pricePerMinute: parseFloat(formData.pricePerMinute) || undefined,
        languages: formData.languages,
        skills: formData.skills,
        bio: formData.bio || undefined,
        photo: newImage || undefined,
      };

      const response = await updateAstrologerProfile(updateData);

      if (response.success) {
        setProfile(response.astrologer);
        if (response.astrologer.photo) {
          setImagePreview(response.astrologer.photo);
        }
        setNewImage(null);
        showToast("Profile updated successfully!", "success");

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("astrologer_profile_updated", {
              detail: response.astrologer,
            })
          );
        }
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8"
          style={{ color: colors.black }}
        >
          Personal Details
        </h1>

        {loading ? (
          <AstrologerProfileSkeleton />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8"
          >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                Full Name
              </label>
              <Input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                Phone Number
              </label>
              <Input
                type="tel"
                name="phoneNumber"
                placeholder="+91 9876543210"
                value={formData.phoneNumber}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Year of Experience */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                Year of Experience
              </label>
              <Input
                type="number"
                name="yearsOfExperience"
                placeholder="Year of Experience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            {/* Price Per Minute */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                Price Per Minute (₹)
              </label>
              <Input
                type="number"
                name="pricePerMinute"
                placeholder="Enter your price per minute"
                value={formData.pricePerMinute}
                onChange={handleInputChange}
                min="0"
                step="0.5"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                Date of Birth
              </label>
              <Input
                type="date"
                name="dateOfBirth"
                placeholder="DD/MM/YYYY"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                Languages
              </label>
              <div className="border rounded-lg p-3 min-h-[42px] flex flex-wrap gap-2">
                {formData.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: colors.offYellow, color: colors.black }}
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeTag("languages", index)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={formData.languages.length === 0 ? "Hindi, English" : ""}
                  className="flex-1 outline-none min-w-[100px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag("languages", e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                Skills
              </label>
              <div className="border rounded-lg p-3 min-h-[42px] flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: colors.offYellow, color: colors.black }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeTag("skills", index)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={formData.skills.length === 0 ? "Numerology, Vedic" : ""}
                  className="flex-1 outline-none min-w-[100px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag("skills", e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
              Bio
            </label>
            <Textarea
              name="bio"
              placeholder="Tell us about yourself and your expertise..."
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          {/* Profile Image Upload / Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
              Profile Image
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-400">No Image</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>
            </div>
          </div>

          {/* Update Button */}
          <Button
            type="submit"
            fullWidth
            loading={updating}
            customColors={{
              backgroundColor: colors.primeYellow,
              textColor: colors.black,
            }}
            className="py-3 text-lg font-semibold"
          >
            Update Profile
          </Button>
          </form>
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
