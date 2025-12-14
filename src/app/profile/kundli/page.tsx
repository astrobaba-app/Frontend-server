'use client';
import React, { useState, useEffect } from 'react';
import ProfileSidebar from '@/components/layout/UserProfileSidebar';
import StepIndicator from '@/components/userprofile/StepIndicator';
import { useRouter } from 'next/navigation';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import KundliCard from '@/components/card/KundliCard';
import Toast from '@/components/atoms/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { getAllKundlis, createKundli } from '@/store/api/kundli';
import { getProfile } from '@/store/api/auth/profile';
import { KundliCardSkeleton } from '@/components/skeletons/KundliCardSkeleton';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';
import { Loader2 } from 'lucide-react';

export default function FreeKundliPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading, logout } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fetchFromProfile, setFetchFromProfile] = useState(false);
  const [kundliHistory, setKundliHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileFetching, setProfileFetching] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    dateOfbirth: '',
    timeOfbirth: '',
    placeOfBirth: '',
  });

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/auth/login?redirect=/profile/kundli');
    }
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    const fetchKundliHistory = async () => {
      if (!isLoggedIn) return;
      
      try {
        setHistoryLoading(true);
        const response = await getAllKundlis();
        
        if (response.success && response.userRequests) {
          setKundliHistory(response.userRequests);
        }
      } catch (error: any) {
        console.error('Failed to fetch kundli history:', error);
        showToast(error?.message || 'Failed to load kundli history', 'error');
      } finally {
        setHistoryLoading(false);
      }
    };

    if (isLoggedIn && !loading) {
      fetchKundliHistory();
    }
  }, [isLoggedIn, loading]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleFetchFromProfile = async () => {
    try {
      setProfileFetching(true);
      const response = await getProfile();
      
      if (response.success && response.user) {
        const profileUser = response.user;
        
        setFormData({
          fullName: profileUser.fullName || '',
          gender: profileUser.gender || 'Male',
          dateOfbirth: profileUser.dateOfbirth || '',
          timeOfbirth: profileUser.timeOfbirth || '',
          placeOfBirth: profileUser.placeOfBirth || '',
        });
        
        setFetchFromProfile(true);
        setShowForm(true);
        
        // Jump to first empty field or last step if all filled
        if (!profileUser.fullName) setCurrentStep(1);
        else if (!profileUser.gender) setCurrentStep(2);
        else if (!profileUser.dateOfbirth) setCurrentStep(3);
        else if (!profileUser.timeOfbirth) setCurrentStep(4);
        else setCurrentStep(5);
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      showToast('Failed to load profile data', 'error');
    } finally {
      setProfileFetching(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!formData.fullName || !formData.gender || !formData.dateOfbirth || 
        !formData.timeOfbirth || !formData.placeOfBirth) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      const requestData = {
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfbirth: formData.dateOfbirth,
        timeOfbirth: formData.timeOfbirth,
        placeOfBirth: formData.placeOfBirth,
        latitude: 0,
        longitude: 0,
      };

      console.log('Sending kundli request:', requestData);
      
      const response = await createKundli(requestData);

      if (response.success) {
        showToast('Kundli generated successfully!', 'success');
        setShowForm(false);
        setCurrentStep(1);
        setFetchFromProfile(false);
        setFormData({
          fullName: '',
          gender: 'Male',
          dateOfbirth: '',
          timeOfbirth: '',
          placeOfBirth: '',
        });
        
        // Refresh kundli history
        const historyResponse = await getAllKundlis();
        if (historyResponse.success && historyResponse.userRequests) {
          setKundliHistory(historyResponse.userRequests);
        }
        
        // Redirect to kundli report
        setTimeout(() => {
          router.push(`/kundliReport?id=${response.kundli.requestId}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Failed to create kundli:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to generate Kundli';
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewKundli = (id: string) => {
    router.push(`/kundliReport?id=${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            <ProfileSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heading level={2} align="center" className="mb-2">Hey There !</Heading>
              <Heading level={3} align="center">What is your name ?</Heading>
            </div>
            <Input
              label="Full Name"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
            />
            <Button
              onClick={handleNext}
              disabled={!formData.fullName}
              fullWidth
              size="lg"
            >
              Next
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heading level={3} align="center">What is your Gender ?</Heading>
            </div>
            <Select
              label="Gender"
              required
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleBack} variant="secondary" fullWidth size="lg">
                Back
              </Button>
              <Button onClick={handleNext} fullWidth size="lg">
                Next
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heading level={3} align="center">Enter your Birth Date ?</Heading>
            </div>
            <Input
              label="Date of Birth"
              type="date"
              required
              value={formData.dateOfbirth}
              onChange={(e) => setFormData({ ...formData, dateOfbirth: e.target.value })}
              placeholder="YYYY-MM-DD"
            />
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleBack} variant="secondary" fullWidth size="lg">
                Previous
              </Button>
              <Button onClick={handleNext} disabled={!formData.dateOfbirth} fullWidth size="lg">
                Next
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heading level={3} align="center">Enter your Birth Time ?</Heading>
            </div>
            <Input
              label="Birth Time"
              type="time"
              required
              value={formData.timeOfbirth}
              onChange={(e) => setFormData({ ...formData, timeOfbirth: e.target.value })}
              placeholder="HH:MM"
            />
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleBack} variant="secondary" fullWidth size="lg">
                Previous
              </Button>
              <Button onClick={handleNext} disabled={!formData.timeOfbirth} fullWidth size="lg">
                Next
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heading level={3} align="center">What is your Birth Place ?</Heading>
            </div>
            <Input
              label="Birth Place"
              required
              value={formData.placeOfBirth}
              onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
              placeholder="Mumbai, Maharashtra, India"
            />
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleBack} variant="secondary" fullWidth size="lg">
                Previous
              </Button>
              <Button onClick={handleGenerate} disabled={!formData.placeOfBirth || submitting} fullWidth size="lg">
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className=" bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <ProfileSidebar
            userName={user?.fullName || 'User'}
            userEmail={user?.email || 'Not provided'}
            onLogout={handleLogout}
          />

          {/* Main Content */}
          <div className="space-y-6">
            {!showForm ? (
              <>
                {/* Header Section */}
                <Card padding="lg">
                  <Heading level={2} align="center" className="mb-2">
                    Free Kundli Online
                  </Heading>
                  <p className="text-gray-600 text-center mb-6">
                    Get instant & accurate, Janam Kundli
                  </p>

                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => setShowForm(true)} disabled={profileFetching}>
                      + Create New Kundli
                    </Button>
                    <Button onClick={handleFetchFromProfile} disabled={profileFetching}>
                      {profileFetching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Fetch From Profile'
                      )}
                    </Button>
                  </div>
                </Card>

                {/* Saved Kundlis Grid */}
                {historyLoading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <KundliCardSkeleton key={i} />
                    ))}
                  </div>
                ) : kundliHistory.length === 0 ? (
                  <Card padding="lg">
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">No Kundli generated yet</p>
                      <Button onClick={() => setShowForm(true)}>Create Your First Kundli</Button>
                    </div>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {kundliHistory.map((kundli) => (
                      <KundliCard
                        key={kundli.id}
                        name={kundli.fullName}
                        relation="Self"
                        dob={formatDate(kundli.dateOfbirth)}
                        birthPlace={kundli.placeOfBirth}
                        onClick={() => handleViewKundli(kundli.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Card padding="lg" className="max-w-2xl mx-auto">
                <Heading level={2} align="center" className="mb-2">
                  Free Kundli Online
                </Heading>
                <p className="text-gray-600 text-center mb-8">
                  Get instant & accurate, Janam Kundli
                </p>

                <StepIndicator currentStep={currentStep} totalSteps={5} />

                {renderStepContent()}
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastProps.isVisible && (
        <Toast
          message={toastProps.message}
          type={toastProps.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
