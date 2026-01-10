"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import {
  updateCartQuantity,
  removeFromCart,
} from "@/store/api/store";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import { Button } from "@/components/atoms";
import { colors } from "@/utils/colors";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

import {CartSkeleton} from "@/components/skeletons/CartSkeleton";
const CartPage = () => {
  const router = useRouter();
  const {
    cartItems,
    loading,
    error,
    fetchCart,
    totalPrice,
    shippingCharges,
    taxAmount,
    totalAmount,
    fetchCartCount,
  } = useCart();
  const [updating, setUpdating] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { isLoggedIn } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [displayItems, setDisplayItems] = useState(cartItems);
  const [displayTotal, setDisplayTotal] = useState(totalPrice);
  const [displayShipping, setDisplayShipping] = useState(shippingCharges);
  const [displayTax, setDisplayTax] = useState(taxAmount);
  const [displayTotalAmount, setDisplayTotalAmount] = useState(totalAmount);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch on initial mount
    fetchCart();
  }, []);

  useEffect(() => {
    // Sync display states with context only when context changes from external sources
    // (not from our local updates)
    setDisplayItems(cartItems);
    setDisplayTotal(totalPrice);
    setDisplayShipping(shippingCharges);
    setDisplayTax(taxAmount);
    setDisplayTotalAmount(totalAmount);
  }, [cartItems, totalPrice, shippingCharges, taxAmount, totalAmount]);

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      
      // Calculate new totals locally for immediate update
      const updatedItems = displayItems.map((item) =>
        item._id === cartItemId ? { ...item, quantity: newQuantity } : item
      );
      
      const newSubtotal = updatedItems.reduce((sum, item) => {
        const price = item.discountPrice || item.price;
        return sum + price * item.quantity;
      }, 0);
      
      // Determine if physical products exist
      const hasPhysical = updatedItems.some(
        (item) => item.productType === "physical"
      );
      
      // Get env values from current context or use defaults
      const SHIPPING_CHARGE = shippingCharges;
      const currentShipping = hasPhysical ? SHIPPING_CHARGE : 0;
      const currentTax = parseFloat(((newSubtotal + currentShipping) * (taxAmount / (totalPrice + shippingCharges))).toFixed(2));
      const currentTotal = parseFloat((newSubtotal + currentShipping + currentTax).toFixed(2));
      
      // Update all display states immediately
      setDisplayItems(updatedItems);
      setDisplayTotal(newSubtotal);
      setDisplayShipping(currentShipping);
      setDisplayTax(currentTax);
      setDisplayTotalAmount(currentTotal);

      await updateCartQuantity(cartItemId, newQuantity);
      await fetchCartCount();
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      const errorMessage = err?.message || err?.response?.data?.message || "Failed to update quantity";
      showToast(errorMessage, "error");
      // Revert to backend state on error
      const cartData = await fetchCart();
      if (cartData) {
        setDisplayItems(cartData.items || []);
        setDisplayTotal(cartData.summary?.subtotal || 0);
        setDisplayShipping(cartData.summary?.shippingCharges || 0);
        setDisplayTax(cartData.summary?.taxAmount || 0);
        setDisplayTotalAmount(cartData.summary?.totalAmount || 0);
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = (cartItemId: string) => {
    setPendingRemoveId(cartItemId);
    setIsRemoveModalOpen(true);
  };

  const confirmRemoveItem = async () => {
    if (!pendingRemoveId) return;

    try {
      setUpdating(true);
      
      // Calculate new totals locally for immediate update
      const updatedItems = displayItems.filter((item) => item._id !== pendingRemoveId);
      
      const newSubtotal = updatedItems.reduce((sum, item) => {
        const price = item.discountPrice || item.price;
        return sum + price * item.quantity;
      }, 0);
      
      // Determine if physical products exist
      const hasPhysical = updatedItems.some(
        (item) => item.productType === "physical"
      );
      
      // Get env values from current context or use defaults
      const SHIPPING_CHARGE = shippingCharges;
      const currentShipping = hasPhysical ? SHIPPING_CHARGE : 0;
      const currentTax = parseFloat(((newSubtotal + currentShipping) * (taxAmount / (totalPrice + shippingCharges))).toFixed(2));
      const currentTotal = parseFloat((newSubtotal + currentShipping + currentTax).toFixed(2));
      
      // Update all display states immediately
      setDisplayItems(updatedItems);
      setDisplayTotal(newSubtotal);
      setDisplayShipping(currentShipping);
      setDisplayTax(currentTax);
      setDisplayTotalAmount(currentTotal);

      await removeFromCart(pendingRemoveId);
      await fetchCartCount();
      showToast("Product removed from cart", "success");
    } catch (err) {
      console.error("Error removing item:", err);
      showToast("Failed to remove item", "error");
      // Revert to backend state on error
      const cartData = await fetchCart();
      if (cartData) {
        setDisplayItems(cartData.items || []);
        setDisplayTotal(cartData.summary?.subtotal || 0);
        setDisplayShipping(cartData.summary?.shippingCharges || 0);
        setDisplayTax(cartData.summary?.taxAmount || 0);
        setDisplayTotalAmount(cartData.summary?.totalAmount || 0);
      }
    } finally {
      setUpdating(false);
      setIsRemoveModalOpen(false);
      setPendingRemoveId(null);
    }
  };

  const handleImageError = (cartItemId: string) => {
    setImageErrors((prev) => ({ ...prev, [cartItemId]: true }));
  };

  if (loading) {
    return (
      <CartSkeleton />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Your Cart</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8">
        {displayItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-12 text-center">
            <div className="mb-4 sm:mb-6">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-300 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Start shopping and add items to your cart!
            </p>
            <Button
              href="/store"
              variant="custom"
              size="md"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {displayItems.map((item) => (
                  <div
                    key={item._id}
                    className="border-b border-gray-200 last:border-b-0 p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 mx-auto sm:mx-0">
                      {item.images &&
                      item.images.length > 0 &&
                      !imageErrors[item._id] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(item._id)}
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">
                        {item.productName}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                        Type:{" "}
                        {item.productType === "digital"
                          ? "Digital"
                          : "Physical"}
                      </p>

                      {/* Price */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 sm:mb-4">
                        <span className="font-bold text-base sm:text-lg text-green-600">
                          ₹ {(
                          (item.discountPrice || item.price)
                        ).toLocaleString()}
                        </span>
                        {item.discountPrice && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹{item.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleUpdateQuantity(item._id, item.quantity - 1);
                            }}
                            disabled={updating || item.quantity <= 1}
                            className="px-2 sm:px-3 py-1 text-sm sm:text-base hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            −
                          </button>
                          <span className="w-10 sm:w-12 text-center text-sm sm:text-base py-1 select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleUpdateQuantity(item._id, item.quantity + 1);
                            }}
                            disabled={updating}
                            className="px-2 sm:px-3 py-1 text-sm sm:text-base hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveItem(item._id);
                          }}
                          disabled={updating}
                          className="text-red-600 hover:text-red-700 font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                      <p className="text-xs sm:text-sm text-gray-600 sm:mb-2">Subtotal</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        ₹
                        {(
                          (item.discountPrice || item.price) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-4 sm:mt-6">
                <Button
                  href="/store/products"
                  variant="custom"
                  size="md"
                  className="bg-yellow-400 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl sm:rounded-2xl shadow-md border border-yellow-100 p-4 sm:p-5 md:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Subtotal ({displayItems.length} items)</span>
                    <span>₹{displayTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 text-xs sm:text-sm">
                    <span>Shipping</span>
                    <span className={displayShipping === 0 ? "text-green-600 font-semibold" : ""}>
                      {displayShipping === 0 ? "FREE" : `₹${displayShipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 text-xs sm:text-sm">
                    <span>Tax</span>
                    <span>₹{displayTax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    ₹{displayTotalAmount.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button
                  href="/checkout"
                  variant="custom"
                  fullWidth={true}
                  size="md"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </Button>

                {/* Security Message */}
                <p className="text-[10px] sm:text-xs text-gray-600 text-center mt-3">
                  ✓ Secure checkout • Money-back guarantee
                </p>
              </div>
            </div>
          </div>
        )}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}

        <DeleteConfirmModal
          isOpen={isRemoveModalOpen}
          onClose={() => {
            if (!updating) {
              setIsRemoveModalOpen(false);
              setPendingRemoveId(null);
            }
          }}
          onConfirm={confirmRemoveItem}
          loading={updating}
          title="Remove Item"
          message="Are you sure you want to remove this item from your cart?"
        />
      </div>
    </div>
  );
};

export default CartPage;
