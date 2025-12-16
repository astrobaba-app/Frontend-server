"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms";
import { colors } from "@/utils/colors";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* Order Number */}
        {orderNumber && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-blue-600">{orderNumber}</p>
          </div>
        )}

        {/* Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3 text-sm">
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <span>✓</span>
            <span>Order Confirmed</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <span>✓</span>
            <span>Confirmation email sent</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <span>✓</span>
            <span>Ready for dispatch</span>
          </div>
        </div>

        {/* Info Message */}
        <p className="text-gray-600 text-sm mb-8">
          You will receive tracking information via email once your order is
          shipped.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            href="/store"
            variant="custom"
            size="md"
            fullWidth={true}
            customColors={{
              backgroundColor: colors.primeYellow,
              textColor: colors.black,
            }}
          >
             Continue Shopping
          </Button>
          <Button
            href="/profile/orders"
            variant="custom"
            size="md"
            fullWidth={true}
            customColors={{
              backgroundColor: colors.primeYellow,
              textColor: colors.black,
            }}
          >
             View My Orders
          </Button>
        </div>

        {/* Support */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-2">Need Help?</p>
          <p className="text-gray-600 text-sm">
            Contact our support team at{" "}
            <span className="font-semibold">support@grahostore.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
