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
  ForgotPasswordMethod,
  loginAstrologer,
  resetAstrologerForgotPassword,
  sendAstrologerForgotPasswordOtp,
  verifyAstrologerForgotPasswordOtp,
} from "@/store/api/astrologer/auth";
import { ArrowLeft, X } from "lucide-react";

export default function AstrologerLogin() {
  type ForgotStep = "method" | "contact" | "verify" | "reset";

  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("method");
  const [forgotMethod, setForgotMethod] = useState<ForgotPasswordMethod | "">("");
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotResendTimer, setForgotResendTimer] = useState(0);

  // Check if someone is already logged in
  useEffect(() => {
    if (!forgotOpen || forgotResendTimer <= 0) return;

    const timer = setTimeout(() => setForgotResendTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [forgotOpen, forgotResendTimer]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const astrologerToken = localStorage.getItem('token_astrologer');
      const middlewareToken = localStorage.getItem('token_middleware');
      
      if (astrologerToken) {
        router.push('/astrologer/dashboard');
        return;
      }
      if (middlewareToken) {
        router.push('/profile');
      }
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForgotState = () => {
    setForgotStep("method");
    setForgotMethod("");
    setForgotMobile("");
    setForgotEmail("");
    setForgotOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotResendTimer(0);
    setForgotLoading(false);
  };

  const openForgotPassword = () => {
    resetForgotState();
    setForgotOpen(true);
  };

  const closeForgotPassword = () => {
    setForgotOpen(false);
    resetForgotState();
  };

  const handleForgotMethodSelect = (method: ForgotPasswordMethod) => {
    setForgotMethod(method);
    setForgotStep("contact");
    setForgotOtp("");
    setResetToken("");
  };

  const buildForgotPayload = (): {
    method: ForgotPasswordMethod;
    phoneNumber?: string;
    email?: string;
  } => {
    if (!forgotMethod) {
      throw new Error("Please choose OTP method");
    }

    if (forgotMethod === "mobile") {
      return { method: "mobile", phoneNumber: forgotMobile };
    }

    return { method: "email", email: forgotEmail };
  };

  const validateForgotContact = () => {
    if (!forgotMethod) {
      showToast("Please choose OTP method", "error");
      return false;
    }

    if (forgotMethod === "mobile") {
      if (!/^[6-9]\d{9}$/.test(forgotMobile)) {
        showToast("Please enter a valid 10-digit mobile number", "error");
        return false;
      }
    }

    if (forgotMethod === "email") {
      if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
        showToast("Please enter a valid email address", "error");
        return false;
      }
    }

    return true;
  };

  const handleForgotSendOtp = async () => {
    if (!validateForgotContact()) return;

    setForgotLoading(true);
    try {
      await sendAstrologerForgotPasswordOtp(buildForgotPayload());
      showToast("OTP sent successfully", "success");
      setForgotStep("verify");
      setForgotOtp("");
      setForgotResendTimer(120);
    } catch (err: any) {
      showToast(err.message || "Failed to send OTP", "error");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotVerifyOtp = async () => {
    if (!/^\d{6}$/.test(forgotOtp)) {
      showToast("Please enter a valid 6-digit OTP", "error");
      return;
    }

    setForgotLoading(true);
    try {
      const response = await verifyAstrologerForgotPasswordOtp({
        ...buildForgotPayload(),
        otp: forgotOtp,
      });

      setResetToken(response.resetToken);
      setForgotStep("reset");
      showToast("OTP verified. Set your new password", "success");
    } catch (err: any) {
      showToast(err.message || "Invalid OTP", "error");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotResetPassword = async () => {
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Password and confirm password do not match", "error");
      return;
    }

    setForgotLoading(true);
    try {
      const response = await resetAstrologerForgotPassword({
        resetToken,
        newPassword,
        confirmPassword,
      });

      showToast(response.message || "Password reset successful", "success");
      closeForgotPassword();
    } catch (err: any) {
      showToast(err.message || "Failed to reset password", "error");
    } finally {
      setForgotLoading(false);
    }
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
        // Store astrologerToken and astrologer id in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token_astrologer", response.astrologerToken);
          localStorage.setItem("astrologer_id", response.astrologer.id.toString());
          window.dispatchEvent(new Event("auth_change"));
        }

        showToast("Login successful! Redirecting to dashboard...", "success");

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/astrologer/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to login", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
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
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

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
              onClick={openForgotPassword}
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
      {forgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={closeForgotPassword}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
            <p className="text-sm text-gray-500 mb-6">
              {forgotStep === "method" && "Choose how you want to verify your account"}
              {forgotStep === "contact" && "Enter your registered contact to receive OTP"}
              {forgotStep === "verify" && "Enter the OTP to verify your account"}
              {forgotStep === "reset" && "Set a new password for your account"}
            </p>

            {forgotStep === "method" && (
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-left hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
                  onClick={() => handleForgotMethodSelect("mobile")}
                >
                  Mobile OTP
                </button>
                <button
                  type="button"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-left hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
                  onClick={() => handleForgotMethodSelect("email")}
                >
                  Email OTP
                </button>
              </div>
            )}

            {forgotStep === "contact" && (
              <div className="space-y-4">
                {forgotMethod === "mobile" ? (
                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3">
                    <span className="font-semibold text-gray-700">+91</span>
                    <input
                      type="tel"
                      value={forgotMobile}
                      onChange={(e) => setForgotMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Enter mobile number"
                      className="w-full outline-none"
                    />
                  </div>
                ) : (
                  <Input
                    type="email"
                    placeholder="Enter registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    disabled={forgotLoading}
                  />
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => setForgotStep("method")}
                    disabled={forgotLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    loading={forgotLoading}
                    onClick={handleForgotSendOtp}
                  >
                    Send OTP
                  </Button>
                </div>
              </div>
            )}

            {forgotStep === "verify" && (
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={forgotLoading}
                />

                <div className="text-sm text-gray-600">
                  {forgotResendTimer > 0 ? (
                    <span>Resend OTP in {forgotResendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={handleForgotSendOtp}
                      disabled={forgotLoading}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => setForgotStep("contact")}
                    disabled={forgotLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    loading={forgotLoading}
                    onClick={handleForgotVerifyOtp}
                  >
                    Verify OTP
                  </Button>
                </div>
              </div>
            )}

            {forgotStep === "reset" && (
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={forgotLoading}
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={forgotLoading}
                />

                <Button
                  type="button"
                  fullWidth
                  loading={forgotLoading}
                  onClick={handleForgotResetPassword}
                >
                  Update Password
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

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
