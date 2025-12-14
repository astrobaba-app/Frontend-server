'use client';
import React from 'react';
import ProfileSidebar from '@/components/layout/UserProfileSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import { Wallet, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function WalletPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <ProfileSidebar
            userName={user?.fullName || 'User'}
            userEmail={user?.email || 'Not provided'}
            onLogout={handleLogout}
          />

          {/* Main Content */}
          <Card padding="lg">
            <div className="text-center py-20">
              <Wallet className="w-20 h-20 mx-auto mb-6 text-[#FFD700]" />
              <Heading level={2} className="mb-4">My Wallet</Heading>
              <p className="text-gray-600 text-lg mb-8">Coming Soon!</p>
              <p className="text-gray-500 max-w-md mx-auto">
                We're working hard to bring you a seamless wallet experience. 
                Soon you'll be able to manage your transactions, recharge your wallet, and track your spending all in one place.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
