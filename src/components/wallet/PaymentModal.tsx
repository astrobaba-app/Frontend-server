'use client';
import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { formatAmount } from '@/utils/wallet';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'failure';
  amount?: number;
  message?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  type,
  amount,
  message,
}: PaymentModalProps) {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            {isSuccess ? (
              <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
            ) : (
              <XCircle className="w-20 h-20 mx-auto text-red-500" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h2>

          {/* Amount */}
          {amount !== undefined && (
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-1">
                {isSuccess ? 'Amount Credited' : 'Amount'}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatAmount(amount)}
              </p>
            </div>
          )}

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {message ||
              (isSuccess
                ? 'Your wallet has been recharged successfully. You can now use your balance for consultations and services.'
                : 'Your payment could not be processed. Please try again or contact support if the issue persists.')}
          </p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              isSuccess
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isSuccess ? 'View Wallet' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
}
