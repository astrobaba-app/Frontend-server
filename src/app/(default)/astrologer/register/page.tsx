"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import Toast from "@/components/atoms/Toast";
import { useToast } from "@/hooks/useToast";
import { colors } from "@/utils/colors";
import { registerAstrologer } from "@/store/api/astrologer/auth";
import { FiUploadCloud } from "react-icons/fi";

export default function AstrologerRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast, showToast, hideToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: searchParams.get("phone") || "",
    password: "",
    dateOfBirth: "",
    yearsOfExperience: "",
    pricePerMinute: "",
    languages: "",
    skills: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Check if someone is already logged in via role flag
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('auth_role');
      if (role === 'astrologer') {
        router.push('/astrologer/dashboard');
        return;
      }
      if (role === 'user') {
        router.push('/profile');
        return;
      }
    }
    
    // Redirect if no phone number
    if (!searchParams.get("phone")) {
      router.push("/astrologer/signup");
    }
  }, [searchParams, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
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
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.languages.trim()) newErrors.languages = "Languages are required";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";
    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = "Years of experience is required";
    }
    if (!formData.pricePerMinute) {
      newErrors.pricePerMinute = "Price per minute is required";
    }
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth || undefined,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || undefined,
        pricePerMinute: parseFloat(formData.pricePerMinute) || undefined,
        languages: formData.languages,
        skills: formData.skills,
        bio: formData.bio || undefined,
        photo: profileImage || undefined,
      };

      const response = await registerAstrologer(registrationData);
      
      if (response.success) {
        showToast("Registration successful! Redirecting to login...", "success");
        // Redirect to login page
        setTimeout(() => {
          router.push("/astrologer/login");
        }, 1500);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to register", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative" >
        <div className="fixed inset-0 -z-10">
                <Image
                  src="/images/bg3.jpg"
                  alt="Background"
                  fill
                  className="object-cover"
                  priority
                  style={{ opacity: 0.3 }}
                />
              </div>
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1
            className="text-3xl font-bold text-center mb-8"
            style={{ color: colors.black }}
          >
            Register as Astrologer
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                  Full Name
                </label>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Enter your Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={errors.fullName}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                  Languages
                </label>
                <Input
                  type="text"
                  name="languages"
                  placeholder="separated by comma"
                  value={formData.languages}
                  onChange={handleInputChange}
                  error={errors.languages}
                  helperText="e.g., Hindi, English, Gujarati"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                  Skills
                </label>
                <Input
                  type="text"
                  name="skills"
                  placeholder="separated by comma"
                  value={formData.skills}
                  onChange={handleInputChange}
                  error={errors.skills}
                  helperText="e.g., Numerology, Vedic, Tarot"
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
                  error={errors.yearsOfExperience}
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
                  error={errors.pricePerMinute}
                  min="0"
                  step="0.5"
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
                //   disabled
                  className="bg-gray-100"

                  onChange={handleInputChange}
                  error={errors.phoneNumber}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="············"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
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

            {/* Profile Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                Profile Image
              </label>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ borderColor: colors.gray }}
                onClick={handleImageClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <p className="text-sm" style={{ color: colors.gray }}>
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FiUploadCloud
                      className="w-16 h-16 mb-4"
                      style={{ color: colors.gray }}
                    />
                    <p className="text-sm mb-1" style={{ color: colors.gray }}>
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs" style={{ color: colors.gray }}>
                      PNG, JPG (max. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start mb-6">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 mr-2"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm" style={{ color: colors.gray }}>
                By proceeding, you agree to our{" "}
                <span className="text-blue-600 cursor-pointer">Terms & Conditions</span> and{" "}
                <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={!termsAccepted || loading}
              customColors={{
                backgroundColor: colors.primeYellow,
                textColor: colors.black,
              }}
              className="py-3 text-lg font-semibold"
            >
              Register
            </Button>
          </form>
        </div>
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
