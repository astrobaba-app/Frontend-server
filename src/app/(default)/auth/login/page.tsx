"use client";

import React, { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { generateOtp, verifyOtp } from "@/store/api/auth/login";
import { initiateGoogleLogin } from "@/store/api/auth/google";
import Toast from "@/components/atoms/Toast";
import { useToast } from "@/hooks/useToast";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/atoms";
import { Suspense } from "react";
import { setCookie, getCookie } from "@/utils/cookies";
function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"initial" | "otp">("initial");
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/profile");
      return;
    }
    const astrologerToken = getCookie("token_astrologer");
    const middlewareToken = getCookie("token_middleware");
    
    if (astrologerToken) {
      router.push("/astrologer/dashboard");
      return;
    }
    if (middlewareToken) {
      router.push("/profile");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendTimer]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(value);
  };

  const handleGetOtp = async () => {
    if (mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
      showToast("Please enter a valid 10-digit mobile number", "error");
      return;
    }
    setLoading(true);
    try {
      await generateOtp(mobile);
      showToast("OTP sent successfully!", "success");
      setStep("otp");
      setResendTimer(120);
    } catch (err: any) {
      showToast(err.message || "Failed to send OTP.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      showToast("Please enter the complete 6-digit OTP", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOtp(otpString);
      
      setCookie("token_middleware", response.middlewareToken, 30);
      setCookie("user_id", response.user.id.toString(), 30);
      window.dispatchEvent(new Event("auth_change"));
      
      login(response.user, response.token, response.middlewareToken);
      sessionStorage.setItem("loginSuccess", "true");
      const redirectPath = searchParams.get("redirect") || "/";
      router.push(redirectPath);
    } catch (err: any) {
      showToast(err.message || "Invalid OTP.", "error");
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await generateOtp(mobile);
      showToast("OTP resent successfully!", "success");
      setResendTimer(120);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } catch (err: any) {
      showToast(err.message || "Failed to resend OTP.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/bg2.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          style={{ opacity: 0.15 }}
        />
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-20 p-2"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Responsive Grid: Stacks on mobile, Side-by-side on desktop */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Left Column (Branding & QR) - Now visible on all devices */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Astrobaba
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Scan to download our app
              </p>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-2xl shadow-md border border-gray-200 mb-4 md:mb-6">
              <img
                src="/images/QR.png"
                alt="QR Code"
                className="w-32 h-32 md:w-48 md:h-48 object-contain"
              />
            </div>

            <div className="text-center">
              <p className="font-semibold text-gray-900 text-sm md:text-base">
                Better Experience on App
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Available on Play Store & App Store
              </p>
            </div>
          </div>

          {/* Right Column (Login Form) */}
          <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center min-h-[450px] md:min-h-[500px]">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {step === "initial" ? "Login or Signup" : "Verify OTP"}
              </h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                {step === "initial"
                  ? "Enter your mobile number to continue"
                  : `Enter the code sent to +91 ${mobile}`}
              </p>
            </div>

            {step === "initial" ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 md:py-4 focus-within:border-yellow-500 focus-within:ring-2 focus-within:ring-yellow-100 transition-all">
                  <span className="text-gray-700 font-bold text-lg">+91</span>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="Enter mobile number"
                    className="flex-1 bg-transparent focus:outline-none text-gray-900 font-medium text-lg w-full"
                    maxLength={10}
                  />
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleGetOtp}
                  loading={loading}
                  disabled={mobile.length !== 10}
                  className="py-3 md:py-4 text-md font-bold shadow-lg shadow-yellow-100"
                >
                  Get OTP
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400 font-medium">
                      OR
                    </span>
                  </div>
                </div>

                <button
                  onClick={initiateGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 md:py-4 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-gray-700"
                >
                  <FcGoogle className="text-2xl" />
                  <span className="text-sm sm:text-base">
                    Continue with Google
                  </span>
                </button>

                <p className="text-[11px] sm:text-xs text-center text-gray-500 leading-relaxed px-2">
                  By proceeding, you agree to our{" "}
                  <a
                    href="#"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Terms
                  </a>{" "}
                  &{" "}
                  <a
                    href="#"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={() => setStep("initial")}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium mb-4 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit Number
                </button>

                <div className="flex justify-between gap-1 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(index, e.target.value.slice(-1))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-all"
                      inputMode="numeric"
                    />
                  ))}
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleVerifyOtp}
                  loading={loading}
                  className="py-3 md:py-4 font-bold"
                >
                  Verify & Proceed
                </Button>

                <div className="text-center pt-2">
                  {resendTimer === 0 ? (
                    <button
                      onClick={handleResendOtp}
                      className="text-blue-600 font-bold hover:underline text-sm"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500">
                      Resend code in{" "}
                      <span className="font-bold text-gray-900">
                        {resendTimer}s
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <p className="mt-8 md:mt-10 text-center text-xs sm:text-sm text-gray-500">
              Having trouble?{" "}
              <a href="#" className="text-blue-600 font-medium hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}


export default function Login() {
  return (
    <Suspense fallback={<div>Loading Astrologers...</div>}>
      <LoginPage />
    </Suspense>
  );
} 