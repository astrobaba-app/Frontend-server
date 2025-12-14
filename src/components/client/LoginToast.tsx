'use client';

import { useEffect } from 'react';
import Toast from '@/components/atoms/Toast';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginToast() {
  const { toast, showToast, hideToast } = useToast();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    // Check if user just logged in successfully
    const loginSuccess = sessionStorage.getItem('loginSuccess');
    if (loginSuccess === 'true' && isLoggedIn && user) {
      showToast(`Welcome back, ${user.fullName || 'User'}! Login successful.`, 'success');
      sessionStorage.removeItem('loginSuccess');
    }
  }, [isLoggedIn, user, showToast]);

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
}
