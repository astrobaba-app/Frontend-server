'use client';
import { useState, useCallback } from 'react';
import { ToastType } from '@/components/atoms/Toast';

interface ToastState {
  message: string;
  type: ToastType;
  show: boolean;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    show: false,
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type, show: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const toastProps = {
    message: toast.message,
    type: toast.type,
    isVisible: toast.show,
  };

  return { toast, toastProps, showToast, hideToast };
};
