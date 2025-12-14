'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { generateOtp, verifyOtp } from '@/store/api/auth/login';
import { initiateGoogleLogin } from '@/store/api/auth/google';
import Toast from '@/components/atoms/Toast';
import { useToast } from '@/hooks/useToast';
import { FcGoogle } from 'react-icons/fc';
import { colors } from '@/utils/colors';


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'initial' | 'otp'>('initial');
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (isLoggedIn) {
      // Redirect logged in users to profile page
      router.push('/profile');
      return;
    }
    
    // Check if astrologer is logged in
    if (typeof window !== 'undefined') {
      const astrologerToken = localStorage.getItem('astrobaba_token');
      if (astrologerToken) {
        // Redirect logged in astrologers to their dashboard
        router.push('/astrologer/dashboard');
      }
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendTimer]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(value);
  };

  const handleGetOtp = async () => {
    if (mobile.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      showToast('Mobile number must start with 6, 7, 8, or 9', 'error');
      return;
    }

    setLoading(true);

    try {
      await generateOtp(mobile);
      showToast('OTP sent successfully!', 'success');
      setStep('otp');
      setResendTimer(120);
    } catch (err: any) {
      showToast(err.message || 'Failed to send OTP. Please try again.', 'error');
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

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showToast('Please enter the complete 6-digit OTP', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtp(otpString);
      
      login(response.user, response.token, response.middlewareToken);

      // Store success message in sessionStorage to show toast on home page
      sessionStorage.setItem('loginSuccess', 'true');
      
      // Redirect to home page
      const redirectPath = searchParams.get('redirect') || '/';
      router.push(redirectPath);
    } catch (err: any) {
      showToast(err.message || 'Invalid OTP. Please try again.', 'error');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      await generateOtp(mobile);
      showToast('OTP resent successfully!', 'success');
      setResendTimer(120);
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } catch (err: any) {
      showToast(err.message || 'Failed to resend OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('initial');
    setOtp(['', '', '', '', '', '']);
    setResendTimer(0);
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className=" relative flex items-center justify-center p-4 sm:p-10">
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

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center mt-10">
              <p className="text-4xl font-bold text-gray-900 mb-3">
                Login or Signup to continue
              </p>
              <p className="text-gray-600 text-md mb-2">Scan QR to download our app</p>
            </div>

        <div className="grid md:grid-cols-2 min-h-[400px]">
          <div className="bg-white p-8 flex flex-col items-center justify-center border-r border-gray-200 rounded-l-xl">
            
            <div className="bg-white p-1 rounded-xl border-2 border-gray-300 mb-4">
             <img src="/images/QR.png" alt="QR Code" className="w-50 h-50 object-contain" />
            </div>
            
            <div className="text-center">
              <p className="font-semibold text-gray-900 mb-1 text-lg">Use scanner to scan QR</p>
              <p className="text-xs text-gray-600">Download Astrobaba app for better Experience</p>
            </div>
          </div>

          <div className="bg-white p-8 flex flex-col justify-center rounded-r-xl">
            {step === 'initial' ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#F0DF20] focus-within:ring-1 focus-within:ring-[#F0DF20] transition-all">
                    <span className="text-gray-700 font-medium">+91</span>
                    <div className="h-5 w-px bg-gray-300"></div>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={handleMobileChange}
                      placeholder="Enter mobile number"
                      className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-400"
                      maxLength={10}
                      disabled={loading}
                    />
                    {mobile.length > 0 && (
                      <button
                        onClick={() => setMobile('')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Button always present but hidden when mobile incomplete - maintains fixed layout */}
                <button
                  onClick={handleGetOtp}
                  disabled={loading || mobile.length !== 10}
                  className={`w-full bg-[#F0DF20] hover:bg-[#e5d41f] text-gray-900 font-semibold py-3 rounded-lg transition-all disabled:cursor-not-allowed ${
                    mobile.length === 10 ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                >
                  {loading ? 'Sending...' : 'Get OTP'}
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-600">
                    By proceeding, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>

                {/* OR Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Google Login Button */}
                <button
                  onClick={initiateGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-all"
                >
                  <FcGoogle className="text-2xl" />
                  <span className="font-semibold text-gray-700">Continue with Google</span>
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Having Trouble in logging in?{' '}
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      Need help
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Back
                </button>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Enter OTP sent to +91 {mobile}
                  </h3>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.slice(-1))}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }}
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-[#F0DF20] focus:outline-none transition"
                      inputMode="numeric"
                      disabled={loading}
                    />
                  ))}
                </div>

                {/* Show resend button or timer */}
                {resendTimer === 0 ? (
                  <button
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="w-full bg-[#F0DF20] hover:bg-[#e5d41f] text-gray-900 font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Resend OTP'}
                  </button>
                ) : (
                  <p className="text-center text-sm text-gray-600 py-3">
                    Resend OTP in: <span className="font-semibold">{resendTimer}s</span>
                  </p>
                )}

                {/* Verify button always present but hidden when OTP incomplete - maintains fixed layout */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join('').length !== 6}
                  className={`w-full bg-[#F0DF20] hover:bg-[#e5d41f] text-gray-900 font-semibold py-3 rounded-lg transition-all disabled:cursor-not-allowed ${
                    otp.join('').length === 6 ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Having Trouble in logging in?{' '}
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      Need help
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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