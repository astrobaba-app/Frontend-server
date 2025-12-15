"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Toast from "@/components/atoms/Toast";
import { useToast } from "@/hooks/useToast";
import { colors } from "@/utils/colors";
import { loginAstrologer } from "@/store/api/astrologer/auth";

export default function AstrologerLogin() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Check if astrologer is already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const astrologerToken = localStorage.getItem('astrobaba_token');
      if (astrologerToken) {
        // Redirect to dashboard if astrologer is logged in
        router.push('/astrologer/dashboard');
        return;
      }
      
      // Check if user is logged in
      const userToken = localStorage.getItem('astrobaba_token');
      if (userToken) {
        // Redirect to profile if user is logged in
        router.push('/profile');
      }
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!formData.email || !formData.password) {
      showToast("Please enter both email and password", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await loginAstrologer({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Store tokens with correct astrologer keys
        if (typeof window !== "undefined") {
          localStorage.setItem("astrolobaba_token", response.token);
          localStorage.setItem("astrolobaba_middleware_token", response.middlewareToken);
          localStorage.setItem("astrolobaba_profile", JSON.stringify(response.astrologer));
          
          // Notify header component that astrologer auth changed
          window.dispatchEvent(new Event('astrologer-auth-change'));
        }

        showToast("Login successful! Redirecting to dashboard...", "success");

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/astrologer/dashboard/profile");
        }, 1500);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to login", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/bg2.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          style={{ opacity: 0.3 }}
        />
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{ color: colors.black }}
        >
          Login as Astrologer
        </h1>

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4">
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <span
              className="text-sm text-blue-600 cursor-pointer hover:underline"
              onClick={() => showToast("Password reset feature coming soon", "info")}
            >
              Forgot Password?
            </span>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!formData.email || !formData.password}
            customColors={{
              backgroundColor: colors.primeYellow,
              textColor: colors.black,
            }}
          >
            Login
          </Button>

          {/* Signup Link */}
          <p className="text-center mt-6 text-sm" style={{ color: colors.gray }}>
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer font-medium"
              onClick={() => router.push("/astrologer/signup")}
            >
              Signup here
            </span>
          </p>

          {/* Terms & Conditions */}
          <p className="text-xs text-center mt-6" style={{ color: colors.gray }}>
            By logging in, you agree to our{" "}
            <span className="text-blue-600 cursor-pointer">Terms & Conditions</span> and{" "}
            <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
          </p>
        </form>
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
