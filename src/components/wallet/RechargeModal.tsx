'use client';
import React, { useState } from 'react';
import { X, Wallet, Tag } from 'lucide-react';
import { createRechargeOrder, loadRazorpayScript, verifyRecharge } from '@/utils/wallet';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000];

export default function RechargeModal({
  isOpen,
  onClose,
  onSuccess,
  userName,
  userEmail,
  userPhone,
}: RechargeModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleAmountClick = (value: number) => {
    setAmount(value.toString());
    setError('');
  };

  const handleRecharge = async () => {
    try {
      console.log('=== RECHARGE FLOW START ===');
      setLoading(true);
      setError('');

      const rechargeAmount = parseFloat(amount);
      console.log('Step 1: Amount validation');
      console.log('Amount:', rechargeAmount);
      console.log('Coupon:', couponCode || 'None');

      if (!rechargeAmount || rechargeAmount < 1) {
        console.log('ERROR: Invalid amount');
        setError('Please enter a valid amount (minimum ₹1)');
        return;
      }

      if (rechargeAmount > 100000) {
        console.log('ERROR: Amount exceeds maximum');
        setError('Maximum recharge amount is ₹1,00,000');
        return;
      }

      // Load Razorpay script
      console.log('Step 2: Loading Razorpay script...');
      const scriptLoaded = await loadRazorpayScript();
      console.log('Razorpay script loaded:', scriptLoaded);
      console.log('window.Razorpay available:', typeof window !== 'undefined' && !!(window as any).Razorpay);

      if (!scriptLoaded) {
        console.error('ERROR: Failed to load Razorpay script');
        setError('Failed to load payment gateway. Please try again.');
        return;
      }

      // Create order
      console.log('Step 3: Creating recharge order...');
      const orderData = await createRechargeOrder(
        rechargeAmount,
        couponCode || undefined
      );
      console.log('Order created:', orderData.success);
      console.log('Order data:', orderData);

      if (!orderData.success) {
        console.error('ERROR: Failed to create order');
        setError('Failed to create order. Please try again.');
        return;
      }

      const { orderId, finalAmount, amountInPaise, key, couponApplied } = orderData.data;

      console.log('Step 4: Initializing Razorpay checkout');
      console.log('Order ID:', orderId);
      console.log('Amount (paise):', amountInPaise);
      console.log('Razorpay Key:', key);

      // Initialize Razorpay
      const options = {
        key: key,
        amount: amountInPaise,
        currency: 'INR',
        name: 'Graho',
        description: couponApplied
          ? `Wallet Recharge (₹${couponApplied.discount} discount applied)`
          : 'Wallet Recharge',
        order_id: orderId,
        prefill: {
          name: userName || '',
          email: userEmail || '',
          contact: userPhone || '',
        },
        theme: {
          color: '#FFD700',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment cancelled');
          },
        },
        handler: async function (response: any) {
          try {
            console.log('Step 5: Payment successful from Razorpay');
            console.log('Response:', response);
            console.log('Step 6: Verifying payment with backend...');

            // Close recharge modal immediately
            onClose();
            setAmount('');
            setCouponCode('');

            // Verify payment
            const verifyResult = await verifyRecharge(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            console.log('Step 7: Verification result:', verifyResult);
            console.log('=== PAYMENT COMPLETED SUCCESSFULLY ===');

            // Success - show success modal
            setLoading(false);
            onSuccess();
          } catch (verifyError: any) {
            console.error('=== VERIFICATION ERROR ===');
            console.error('Verification error:', verifyError);
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
      };

      console.log('Step 5: Opening Razorpay checkout...');
      const razorpay = new (window as any).Razorpay(options);

      razorpay.on('payment.failed', function (response: any) {
        console.error('=== PAYMENT FAILED ===');
        console.error('Payment failed:', response.error);
        setError(
          response.error.description ||
            'Payment failed. Please try again.'
        );
        setLoading(false);
      });

      razorpay.open();
      console.log('Razorpay checkout opened');
    } catch (err: any) {
      console.error('=== RECHARGE FLOW ERROR ===');
      console.error('Error details:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setError(err.message || 'Failed to process recharge. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFD700] bg-opacity-20 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-[#FFD700]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Recharge Wallet
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder="Enter amount"
              min="1"
              max="100000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((value) => (
                <button
                  key={value}
                  onClick={() => handleAmountClick(value)}
                  disabled={loading}
                  className={`py-2 px-4 rounded-lg border transition-all ${
                    amount === value.toString()
                      ? 'bg-[#FFD700] border-[#FFD700] text-gray-900 font-semibold'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-[#FFD700] hover:bg-[#FFD700] hover:bg-opacity-10'
                  }`}
                >
                  ₹{value}
                </button>
              ))}
            </div>
          </div>

          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code (Optional)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="Enter coupon code"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all uppercase"
                disabled={loading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Your wallet will be credited instantly after successful payment
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={handleRecharge}
            disabled={loading || !amount}
            className="w-full bg-[#FFD700] text-gray-900 py-3 rounded-lg font-semibold hover:bg-[#FFD700] hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}
