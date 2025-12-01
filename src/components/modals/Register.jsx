'use client'
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ChevronDown } from 'lucide-react';

const COUNTRIES = [
  { code: '+93', flag: '🇦🇫', name: 'Afghanistan' },
  { code: '+355', flag: '🇦🇱', name: 'Albania' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+376', flag: '🇦🇩', name: 'Andorra' },
  { code: '+244', flag: '🇦🇴', name: 'Angola' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+374', flag: '🇦🇲', name: 'Armenia' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: '+994', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+375', flag: '🇧🇾', name: 'Belarus' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+501', flag: '🇧🇿', name: 'Belize' },
  { code: '+229', flag: '🇧🇯', name: 'Benin' },
  { code: '+975', flag: '🇧🇹', name: 'Bhutan' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+387', flag: '🇧🇦', name: 'Bosnia' },
  { code: '+267', flag: '🇧🇼', name: 'Botswana' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+673', flag: '🇧🇳', name: 'Brunei' },
  { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: '+855', flag: '🇰🇭', name: 'Cambodia' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+385', flag: '🇭🇷', name: 'Croatia' },
  { code: '+53', flag: '🇨🇺', name: 'Cuba' },
  { code: '+357', flag: '🇨🇾', name: 'Cyprus' },
  { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+372', flag: '🇪🇪', name: 'Estonia' },
  { code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '+358', flag: '🇫🇮', name: 'Finland' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+995', flag: '🇬🇪', name: 'Georgia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+30', flag: '🇬🇷', name: 'Greece' },
  { code: '+852', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '+36', flag: '🇭🇺', name: 'Hungary' },
  { code: '+354', flag: '🇮🇸', name: 'Iceland' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: '+98', flag: '🇮🇷', name: 'Iran' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+7', flag: '🇰🇿', name: 'Kazakhstan' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+371', flag: '🇱🇻', name: 'Latvia' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+370', flag: '🇱🇹', name: 'Lithuania' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+960', flag: '🇲🇻', name: 'Maldives' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+47', flag: '🇳🇴', name: 'Norway' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+507', flag: '🇵🇦', name: 'Panama' },
  { code: '+51', flag: '🇵🇪', name: 'Peru' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: '+48', flag: '🇵🇱', name: 'Poland' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+40', flag: '🇷🇴', name: 'Romania' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
  { code: '+66', flag: '🇹🇭', name: 'Thailand' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
];

const Register = ({ isOpen, setIsOpen }) => {
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(44);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === '+91') || COUNTRIES[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (otpSent && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpSent, resendTimer]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    
    if (mobile.length < 10 || isNaN(mobile)) {
      setError('Please enter a valid mobile number.');
      return;
    }
    
    console.log(`Sending OTP to: ${selectedCountry.code} ${mobile}`);
    setOtpSent(true);
    setResendTimer(44);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };
  
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter the 4-digit OTP.');
      return;
    }
    
    console.log(`Verifying OTP: ${otpString}`);
    alert('Registration Successful!');
    closeModal();
  };
  
  const closeModal = () => {
    setIsOpen(false);
    setMobile('');
    setOtp(['', '', '', '']);
    setOtpSent(false);
    setError('');
    setResendTimer(44);
    setShowCountryDropdown(false);
    setSearchQuery('');
  };

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  );

  const Modal = () => (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300"
      onClick={closeModal}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform transition-all duration-300 scale-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Yellow Header */}
        <div className="bg-[#F0DF20] px-6 py-4 relative">
          <h2 className="text-xl font-bold text-gray-900 text-center">
            {otpSent ? 'Verify Phone' : 'Continue with Phone'}
          </h2>
          <button 
            onClick={closeModal}
            className="absolute right-4 top-4 text-gray-700 hover:text-gray-900 transition"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {!otpSent ? (
            // Phone Number Stage
            <form onSubmit={handleSendOtp}>
              <p className="text-center text-gray-600 mb-6">
                You will receive a 4 digit code<br />for verification
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter your phone number
                </label>
                <div className="relative">
                  <div className="flex items-center bg-gray-100 rounded-lg px-2 py-3 border border-gray-300 focus-within:border-[#F0DF20]">
                    {/* Country Code Dropdown */}
                    <div 
                      className="flex items-center gap-2 px-2 cursor-pointer group relative"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    >
                      <span className="text-2xl">{selectedCountry.flag}</span>
                      <span className="text-gray-900 font-medium">{selectedCountry.code}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition" />
                    </div>
                    
                    {/* Separator */}
                    <div className="h-6 w-px bg-gray-300 mx-2" />
                    
                    {/* Mobile Number Input */}
                    <input
                      type="text"
                      inputMode="numeric"
                      value={mobile}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setMobile(value);
                      }}
                      placeholder="Enter mobile no."
                      className="flex-1 bg-transparent px-2 focus:outline-none text-gray-900 text-lg"
                      autoComplete="tel"
                      required
                    />
                  </div>

                  {/* Country Dropdown Menu with Search */}
                  {showCountryDropdown && (
                    <div 
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-20 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Search Input */}
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-3">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search Country..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F0DF20] focus:border-transparent text-sm"
                          autoFocus
                        />
                      </div>

                      {/* Country List */}
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country, index) => (
                            <div
                              key={`${country.code}-${index}`}
                              onClick={() => {
                                setSelectedCountry(country);
                                setShowCountryDropdown(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
                            >
                              <span className="text-xl">{country.flag}</span>
                              <span className="flex-1 text-gray-900 text-sm">{country.name}</span>
                              <span className="text-gray-600 font-medium text-sm">{country.code}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500 text-sm">
                            No countries found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#F0DF20] hover:bg-[#ffea00] text-gray-900 font-bold py-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 group"
              >
                GET OTP
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-xs text-center text-gray-500 mt-6">
                By Signing up, you agree to our{' '}
                <a href="#" className="text-blue-600 underline">Terms of Use</a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 underline">Privacy Policy</a>
              </p>
            </form>
          ) : (
            // OTP Verification Stage (no changes needed here)
            <form onSubmit={handleVerifyOtp}>
              <p className="text-center text-gray-600 mb-8">
                OTP sent to <span className="font-semibold">{selectedCountry.code}-{mobile}</span>
                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)} 
                  className="text-sm text-blue-600 ml-2 hover:underline"
                >
                  (Change)
                </button>
              </p>

              <div className="flex justify-center gap-3 mb-8">
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
                    maxLength="1"
                    className="w-16 h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-[#F0DF20] focus:outline-none transition"
                    inputMode="numeric" // Helps mobile keyboards show numbers
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={otp.join('').length !== 4}
                className={`w-full font-bold py-4 rounded-lg transition duration-200 ${
                  otp.join('').length === 4 
                    ? 'bg-[#F0DF20] text-gray-900 hover:bg-[#ffea00]' 
                    : 'bg-gray-300 text-gray-600 disabled:cursor-not-allowed'
                }`}
              >
                LOGIN
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                {resendTimer > 0 ? (
                  <>
                    Resend OTP available in{' '}
                    <span className="text-red-500 font-semibold">{resendTimer}s</span>
                  </>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleSendOtp} 
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return <Modal />;
};

export default Register;