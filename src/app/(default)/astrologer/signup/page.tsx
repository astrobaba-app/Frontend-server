"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Toast from "@/components/atoms/Toast";
import { useToast } from "@/hooks/useToast";
import { colors } from "@/utils/colors";
import {
  sendRegistrationOTP,
  verifyRegistrationOTP,
} from "@/store/api/astrologer/auth";

export default function AstrologerSignup() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // Check if someone is already logged in via role flag
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("auth_role");
      if (role === "astrologer") {
        router.push("/astrologer/dashboard");
        return;
      }
      if (role === "user") {
        router.push("/profile");
      }
    }
  }, [router]);

  const handleSendOTP = async () => {
    // Validate phone number
    if (!/^\d{10}$/.test(phoneNumber)) {
      showToast("Please enter a valid 10-digit phone number", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await sendRegistrationOTP({ phoneNumber });
      if (response.success) {
        showToast("OTP sent successfully!", "success");
        setStep("otp");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically focus the next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      showToast("Please enter a valid 6-digit OTP", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyRegistrationOTP({
        phoneNumber,
        otp: otpString,
      });
      if (response.success) {
        showToast("OTP verified successfully!", "success");
        setTimeout(() => {
          router.push(`/astrologer/register?phone=${phoneNumber}`);
        }, 1000);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to verify OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center p-4">
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

      {/* Signup Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{ color: colors.black }}
        >
          Signup as Astrologer
        </h1>

        {step === "phone" ? (
          <>
            {/* Phone Number Input */}
            <div className="flex gap-2 mb-6">
              <div className="w-24">
                <Input
                  type="text"
                  value="+91"
                  disabled
                  className="text-center bg-gray-100"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setPhoneNumber(value);
                    }
                  }}
                  maxLength={10}
                />
              </div>
            </div>

            {/* Button always present but hidden when mobile incomplete - maintains fixed layout */}
            <Button
              variant="custom"
              size="md"
              fullWidth={true}
              onClick={handleSendOTP}
              loading={loading}
              disabled={phoneNumber.length !== 10}
              customColors={{
                backgroundColor: colors.primeYellow,

                textColor: colors.black,
              }}
              className={`${
                phoneNumber.length === 10
                  ? "opacity-100 visible"
                  : "opacity-0 invisible"
              }`}
            >
              Send OTP
            </Button>

            <p
              className="text-xs text-center mt-6"
              style={{ color: colors.gray }}
            >
              By proceeding, you agree to our{" "}
              <span className="text-blue-600 cursor-pointer">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="text-blue-600 cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>

            <p
              className="text-center mt-6 text-sm"
              style={{ color: colors.gray }}
            >
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer font-medium"
                onClick={() => router.push("/astrologer/login")}
              >
                Login here
              </span>
            </p>
          </>
        ) : (
          <>
            {/* OTP Verification */}
            <p className="text-center mb-6" style={{ color: colors.gray }}>
              Enter the 6-digit OTP sent to +91 {phoneNumber}
            </p>

            {/* 6 Separate OTP Input Boxes */}
            <div className="flex justify-center gap-2 mb-6">
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
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none transition"
                  style={{
                    borderColor: colors.gray,
                    color: colors.black,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primeYellow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.gray;
                  }}
                  inputMode="numeric"
                  disabled={loading}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => {
                  setStep("phone");
                  setOtp(["", "", "", "", "", ""]);
                }}
                className="text-sm"
                style={{ color: colors.gray }}
              >
                Change Number
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendOTP}
                loading={loading}
                customStyles={{
                  color: colors.primeYellow,
                }}
              >
                Resend OTP
              </Button>
            </div>

            {/* Verify button always present but hidden when OTP incomplete - maintains fixed layout */}
            <Button
              variant="custom"
              size="md" 
              fullWidth={true} 
              onClick={handleVerifyOTP}
              loading={loading} 

              disabled={otp.join("").length !== 6}
              customColors={{
                backgroundColor: colors.primeYellow,

                textColor: colors.black,
              }}

              className={`${
                otp.join("").length === 6
                  ? "opacity-100 visible"
                  : "opacity-0 invisible"
              }`}
            >
              Verify OTP
            </Button>
          </>
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
