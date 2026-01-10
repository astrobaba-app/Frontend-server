"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, Star } from "lucide-react";
import { getMyOrders, cancelOrder, addProductReview, getMyProductReviews } from "@/store/api/store";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import { OrdersSkeleton } from "@/components/skeletons";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set());
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchOrders();
    fetchUserReviews();
  }, [filterStatus]);

  const fetchUserReviews = async () => {
    try {
      const response = await getMyProductReviews({ page: 1, limit: 1000 });
      if (response.success && response.reviews) {
        const productIds = new Set<string>(
          response.reviews
            .map((r: any) => r.product?.id)
            .filter((id: string | undefined): id is string => Boolean(id))
        );
        setReviewedProductIds(productIds);
      }
    } catch (err) {
      console.error("Failed to fetch user reviews:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (filterStatus !== "all") params.orderStatus = filterStatus;
      const response = await getMyOrders(params);
      setOrders(response.orders || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    try {
      setCancellingOrderId(selectedOrder.id);
      await cancelOrder(selectedOrder.orderNumber, cancellationReason);
      await fetchOrders();
      setShowCancelModal(false);
      showToast("Order cancelled successfully", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to cancel order", "error");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleOpenReviewModal = (product: any) => {
    setSelectedProduct(product);
    setReviewRating(5);
    setReviewTitle("");
    setReviewText("");
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct || !reviewText.trim()) {
      showToast("Please provide a review", "error");
      return;
    }

    try {
      setSubmittingReview(true);
      await addProductReview(selectedProduct.productId, {
        rating: reviewRating,
        title: reviewTitle || undefined,
        review: reviewText,
      });
      showToast("Review submitted successfully", "success");
      setShowReviewModal(false);
      setReviewRating(5);
      setReviewTitle("");
      setReviewText("");
      setSelectedProduct(null);
    } catch (err: any) {
      showToast(err?.message || "Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    // Use max-w-full and overflow-x-hidden on the main wrapper
    <div className="w-full max-w-full overflow-x-auto bg-gray-50 min-h-screen pb-20">
      
      {/* Header Container */}
      <div className="bg-white border-b border-gray-100 p-4 mb-4">
        <Heading level={2} className="text-xl font-bold mb-4">My Orders</Heading>
        
        {/* Filter Bar: Fixed with flex-nowrap and hidden scrollbar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar touch-pan-x">
          {["all", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border shrink-0 transition-colors ${
                filterStatus === status
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="px-4"><OrdersSkeleton count={3} /></div>
      ) : orders.length === 0 ? (
        <div className="m-4 text-center p-10 bg-white rounded-2xl border border-dashed border-gray-300">
          <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm font-medium">No orders found</p>
        </div>
      ) : (
        <div className="px-4 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              
              {/* Header Info: Wrap allowed for very small screens */}
              <div className="p-3 border-b border-gray-50 flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Order Number</p>
                  <p className="text-xs font-bold truncate">#{order.orderNumber}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>

              {/* Product Item */}
              <div className="p-3 space-y-3">
                {order.items.slice(0, 1).map((item: any, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded shrink-0 overflow-hidden">
                      {item.images?.[0] && <img src={item.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.productName}</p>
                      <p className="text-[11px] text-gray-500">Qty: {item.quantity} • ₹{item.price}</p>
                      {order.orderStatus.toLowerCase() === "delivered" && !reviewedProductIds.has(item.productId) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReviewModal(item);
                          }}
                          className="mt-1 flex items-center gap-1 text-[10px] font-bold text-yellow-600 hover:text-yellow-700"
                        >
                          <Star className="w-3 h-3" />
                          Write Review
                        </button>
                      )}
                      {order.orderStatus.toLowerCase() === "delivered" && reviewedProductIds.has(item.productId) && (
                        <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-green-600">
                          <Star className="w-3 h-3 fill-green-600" />
                          Reviewed
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Actions: Column layout on mobile to prevent overflow */}
              <div className="p-3 bg-gray-50/50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                   <p className="text-[10px] uppercase text-gray-400 font-bold">Total Amount</p>
                   <p className="text-sm font-black text-gray-900">₹{order.totalAmount}</p>
                </div>

                {/* BUTTONS: These now stack on mobile and only side-by-side on tablet+ */}
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button 
                    href={`/profile/orders/${order.orderNumber}`}
                    className="w-full sm:w-auto h-9 text-[11px] font-bold border-gray-200"
                    variant="ghost"
                  >
                    VIEW DETAILS
                  </Button>
                  {!["shipped", "delivered", "cancelled"].includes(order.orderStatus) && (
                    <button
                      onClick={() => { setSelectedOrder(order); setShowCancelModal(true); }}
                      className="w-full sm:w-auto h-9 px-4 rounded-lg bg-red-50 text-red-600 text-[11px] font-bold border border-red-100"
                    >
                      CANCEL
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !submittingReview && setShowReviewModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">Write a Review</h3>
            
            {/* Product Info */}
            <div className="flex gap-3 mb-4 pb-4 border-b">
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                {selectedProduct.images?.[0] && (
                  <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 line-clamp-2">{selectedProduct.productName}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= reviewRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                disabled={submittingReview}
              />
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                disabled={submittingReview}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || !reviewText.trim()}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white rounded-lg font-bold text-sm transition-colors"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
                disabled={submittingReview}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-600 rounded-lg font-bold text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal - Mobile Drawer Style */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h3 className="font-bold mb-4">Cancel Order?</h3>
            <div className="flex flex-col gap-3">
              <button onClick={handleCancelOrder} className="w-full py-3 bg-red-600 text-white rounded-lg font-bold text-sm">
                Confirm Cancellation
              </button>
              <button onClick={() => setShowCancelModal(false)} className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg font-bold text-sm">
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}