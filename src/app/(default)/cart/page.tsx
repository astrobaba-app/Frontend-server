"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import {
  updateCartQuantity,
  removeFromCart,
  addProductReview,
} from "@/store/api/store";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import { Button } from "@/components/atoms";
import { colors } from "@/utils/colors";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

const CartPage = () => {
  const router = useRouter();
  const {
    cartItems,
    loading,
    error,
    fetchCart,
    totalPrice,
    fetchCartCount,
  } = useCart();
  const [updating, setUpdating] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { isLoggedIn } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [displayItems, setDisplayItems] = useState(cartItems);
  const [displayTotal, setDisplayTotal] = useState(totalPrice);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 && !selectedProductId) {
      setSelectedProductId(cartItems[0].productId);
    }
  }, [cartItems, selectedProductId]);

  useEffect(() => {
    setDisplayItems(cartItems);
    setDisplayTotal(totalPrice);
  }, [cartItems, totalPrice]);

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      await updateCartQuantity(cartItemId, newQuantity);

      setDisplayItems((prev) => {
        const updated = prev.map((item) =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        );
        const newTotal = updated.reduce((sum, item) => {
          const price = item.discountPrice || item.price;
          return sum + price * item.quantity;
        }, 0);
        setDisplayTotal(newTotal);
        return updated;
      });

      await fetchCartCount();
    } catch (err) {
      console.error("Error updating quantity:", err);
      showToast("Failed to update quantity", "error");
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
      await removeFromCart(pendingRemoveId);

      setDisplayItems((prev) => {
        const updated = prev.filter((item) => item._id !== pendingRemoveId);
        const newTotal = updated.reduce((sum, item) => {
          const price = item.discountPrice || item.price;
          return sum + price * item.quantity;
        }, 0);
        setDisplayTotal(newTotal);
        return updated;
      });

      await fetchCartCount();
      showToast("Product removed from cart", "success");
    } catch (err) {
      console.error("Error removing item:", err);
      showToast("Failed to remove item", "error");
    } finally {
      setUpdating(false);
      setIsRemoveModalOpen(false);
      setPendingRemoveId(null);
    }
  };

  const handleImageError = (cartItemId: string) => {
    setImageErrors((prev) => ({ ...prev, [cartItemId]: true }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId) return;

    if (!isLoggedIn) {
      showToast("Please login to write a review", "error");
      router.push("/auth/login?redirect=/cart");
      return;
    }

    if (!newRating || !newReviewText.trim()) {
      showToast("Please provide rating and review text", "error");
      return;
    }

    try {
      setSubmittingReview(true);
      await addProductReview(selectedProductId, {
        rating: newRating,
        title: newTitle || undefined,
        review: newReviewText,
      });
      showToast("Review added successfully", "success");
      setNewTitle("");
      setNewReviewText("");
      setNewRating(5);
    } catch (err: any) {
      console.error("Error adding review:", err);
      const message =
        err?.message || err?.response?.data?.message || "Failed to add review";
      showToast(message, "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
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
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Your Cart</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {displayItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mb-6">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {displayItems.map((item) => (
                  <div
                    key={item._id}
                    className="border-b border-gray-200 last:border-b-0 p-6 flex gap-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {item.images &&
                      item.images.length > 0 &&
                      !imageErrors[item._id] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(item._id)}
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
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Type:{" "}
                        {item.productType === "digital"
                          ? "Digital"
                          : "Physical"}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-bold text-lg text-green-600">
                          ₹{item.discountPrice?.toLocaleString()}
                        </span>
                        {item.discountPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{item.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity - 1)
                            }
                            disabled={updating || item.quantity <= 1}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item._id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-12 text-center border-l border-r border-gray-300 focus:outline-none"
                            min="1"
                          />
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                            disabled={updating}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={updating}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="flex flex-col items-end justify-center">
                      <p className="text-sm text-gray-600 mb-2">Subtotal</p>
                      <p className="text-lg font-bold text-gray-900">
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
              <div className="mt-6">
                <Button
                  href="/store/products"
                  variant="custom"
                  size="md"
                  className="bg-yellow-400 hover:shadow-lg"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-md border border-yellow-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({displayItems.length} items)</span>
                    <span>₹{displayTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>

                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Tax (estimated)</span>
                    <span>₹{(displayTotal * 0.18).toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{(displayTotal + displayTotal * 0.18).toFixed(2)}
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
                <p className="text-xs text-gray-600 text-center">
                  ✓ Secure checkout • Money-back guarantee
                </p>
              </div>

              {displayItems.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Write a Review
                  </h2>

                  {!isLoggedIn ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between flex-col sm:flex-row gap-3">
                      <p className="text-sm text-gray-700">
                        Please login to write a review for your purchased
                        products.
                      </p>
                      <button
                        onClick={() =>
                          router.push("/auth/login?redirect=/cart")
                        }
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded"
                      >
                        Login to Review
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Product
                        </label>
                        <select
                          value={selectedProductId || ""}
                          onChange={(e) =>
                            setSelectedProductId(e.target.value || null)
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          {displayItems.map((item) => (
                            <option key={item._id} value={item.productId}>
                              {item.productName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating
                          </label>
                          <select
                            value={newRating}
                            onChange={(e) =>
                              setNewRating(Number(e.target.value))
                            }
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                          >
                            {[5, 4, 3, 2, 1].map((r) => (
                              <option key={r} value={r}>
                                {r} Star{r > 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title (optional)
                          </label>
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            placeholder="Summarize your experience"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Review
                        </label>
                        <textarea
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm min-h-20"
                          placeholder="Share your experience with this product"
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="custom"
                        size="md" 
                        fullWidth={true} 
                        loading={submittingReview} 
                        customColors={{
                          backgroundColor: colors.primeYellow,
                          textColor: colors.black,
                        }}
                      >
                        Submit Review
                      </Button>
                    </form>
                  )}
                </div>
              )}
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
