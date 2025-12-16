'use client';
import React, { useState, useEffect } from 'react';
import ProfileSidebar from '@/components/layout/UserProfileSidebar';
import { useRouter } from 'next/navigation';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile } from '@/store/api/auth/profile';
import LoginToast from '@/components/client/LoginToast';
import Toast from '@/components/atoms/Toast';
import { useToast } from '@/hooks/useToast';
import { IoIosMore } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";


export default function MyProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, loading, logout } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const { showToast, toastProps, hideToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    hour: '',
    minute: '',
    second: '',
    birthPlace: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/auth/login?redirect=/profile');
    }
  }, [loading, isLoggedIn, router]);

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn) return;
      
      try {
        setProfileLoading(true);
        const response = await getProfile();
        
        if (response.success && response.user) {
          const profileData = response.user;
          
          // Parse date of birth (YYYY-MM-DD or null)
          let day = '', month = '', year = '';
          if (profileData.dateOfbirth) {
            const dateObj = new Date(profileData.dateOfbirth);
            day = dateObj.getDate().toString().padStart(2, '0');
            month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            year = dateObj.getFullYear().toString();
          }

          // Parse time of birth (HH:MM or null)
          let hour = '', minute = '', second = '00';
          if (profileData.timeOfbirth) {
            const timeParts = profileData.timeOfbirth.split(':');
            hour = timeParts[0] || '';
            minute = timeParts[1] || '';
          }

          setFormData({
            name: profileData.fullName || '',
            gender: profileData.gender || '',
            day,
            month,
            year,
            hour,
            minute,
            second,
            birthPlace: profileData.placeOfBirth || '',
            address: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
          });
        }
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        showToast(error?.response?.data?.message || 'Failed to load profile data', 'error');
      } finally {
        setProfileLoading(false);
      }
    };

    if (isLoggedIn && !loading) {
      fetchProfile();
    }
  }, [isLoggedIn, loading]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  // Don't render if not logged in
  if (!user && !loading) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      
      let dateOfbirth = null;
      if (formData.day && formData.month && formData.year) {
        dateOfbirth = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
      }

      // Construct time string (HH:MM) if hour and minute are filled
      let timeOfbirth = null;
      if (formData.hour && formData.minute) {
        timeOfbirth = `${formData.hour.padStart(2, '0')}:${formData.minute.padStart(2, '0')}`;
      }

      const updateData = {
        fullName: formData.name || undefined,
        gender: formData.gender || undefined,
        dateOfbirth: dateOfbirth || undefined,
        timeOfbirth: timeOfbirth || undefined,
        placeOfBirth: formData.birthPlace || undefined,
      };

      const response = await updateProfile(updateData);
      
      if (response.success) {
        showToast('Profile updated successfully!', 'success');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      showToast(error?.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile header with menu button */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <IoIosMore className="w-6 h-6 text-gray-800" />
          </button>
          <span className="w-6" aria-hidden="true" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8 items-start">
          {/* Sidebar - Desktop view */}
          <div className="hidden lg:block">
            <ProfileSidebar
              userName={user?.fullName || 'User'}
              userEmail={user?.email || 'Not provided'}
              onLogout={handleLogout}
            />
          </div>

          <Card padding="lg">
              <Heading level={2} className="mb-6">Personal Details</Heading>

              <form onSubmit={handleUpdate} className="space-y-6">
              {/* Name and Gender */}
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
                <Select
                  label="Gender"
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Select>
              </div>

              {/* Birth Details */}
              <div>
                <Heading level={3} className="mb-4">Birth Details</Heading>
                <div className="grid md:grid-cols-3 gap-4">
                  <Select
                    label="Day"
                    required
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </Select>
                  <Select
                    label="Month"
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </Select>
                  <Select
                    label="Year"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  >
                    {Array.from({ length: 100 }, (_, i) => 2024 - i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Birth Time */}
              <div className="grid md:grid-cols-3 gap-4">
                <Select
                  label="Hour"
                  required
                  value={formData.hour}
                  onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                >
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour.toString().padStart(2, '0')}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Minutes"
                  required
                  value={formData.minute}
                  onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((min) => (
                    <option key={min} value={min}>
                      {min.toString().padStart(2, '0')}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Second"
                  required
                  value={formData.second}
                  onChange={(e) => setFormData({ ...formData, second: e.target.value })}
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((sec) => (
                    <option key={sec} value={sec}>
                      {sec.toString().padStart(2, '0')}
                    </option>
                  ))}
                </Select>
              </div>

              <Input
                label="Birth Place"
                required
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                placeholder="Howrah, West Bengal"
              />

              {/* Current Address */}
              <div>
                <Heading level={3} className="mb-4">Currente Address</Heading>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="IIEST Shibpur"
                  className="mb-4"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Howrah"
                  />
                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="West Bengal"
                  />
                  <Input
                    label="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder='India'
                  />
                  <Input
                    label="Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder='711103'
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" fullWidth size="lg">
                Update Profile
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="w-80 max-w-full bg-transparent h-full flex flex-col">
            <div className="bg-white shadow-xl h-full p-4 border-l border-[#FFD700] flex flex-col transition-transform duration-300 transform translate-x-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <RxCross2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <div className="overflow-y-auto">
                <ProfileSidebar
                  userName={user?.fullName || 'User'}
                  userEmail={user?.email || 'Not provided'}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastProps.isVisible && (
        <Toast
          message={toastProps.message}
          type={toastProps.type}
          onClose={hideToast}
        />
      )}
      <LoginToast/>
    </div>
  );
}
