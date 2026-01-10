"use client";

import React, { useState, useEffect } from "react";
import { colors } from "@/utils/colors";
import { Star, ArrowLeft, MessageSquare, Trash2, Edit3, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  getMyReview,
  updateReview,
  deleteReview,
  type UserReview,
} from "@/store/api/user/review";
import {
  getMyProductReviews,
  updateProductReview,
  deleteProductReview,
} from "@/store/api/store";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import ReviewModal from "@/components/modals/ReviewModal";
import ProductReviewModal from "@/components/modals/ProductReviewModal";
import DeleteReviewModal from "@/components/modals/DeleteReviewModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import UserReviewSkeleton from "@/components/skeletons/UserReviewSkeleton";
import Image from "next/image";
import Link from "next/link";

interface ProductReview {
  id: string;
  rating: number;
  title?: string;
  review: string;
  images?: string[];
  isVerifiedPurchase?: boolean;
  createdAt: string;
  product?: {
    id: string;
    productName: string;
    slug: string;
    images?: string[];
    price: number;
  };
}

type TabType = "astrologer" | "products";

export default function MyReviewsPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("astrologer");
  const [astrologerReview, setAstrologerReview] = useState<UserReview | null>(null);
  const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [selectedAstrologerReview, setSelectedAstrologerReview] = useState<UserReview | null>(null);
  const [selectedProductReview, setSelectedProductReview] = useState<ProductReview | null>(null);
  const [astrologerReviewModalOpen, setAstrologerReviewModalOpen] = useState(false);
  const [productReviewModalOpen, setProductReviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<{ id: string; type: "astrologer" | "product" } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/auth/login?redirect=/profile/reviews");
    }
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    if (isLoggedIn) {
      if (activeTab === "astrologer") {
        fetchAstrologerReview();
      } else {
        fetchProductReviews();
      }
    }
  }, [isLoggedIn, activeTab]);

  const fetchAstrologerReview = async () => {
    try {
      setReviewLoading(true);
      const response = await getMyReview();
      if (response.success && response.review) {
        setAstrologerReview(response.review);
      } else {
        setAstrologerReview(null);
      }
    } catch (error) {
      setAstrologerReview(null);
    } finally {
      setReviewLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    try {
      setReviewLoading(true);
      const response = await getMyProductReviews({ page: 1, limit: 50 });
      if (response.success && response.reviews) {
        setProductReviews(response.reviews);
      } else {
        setProductReviews([]);
      }
    } catch (error) {
      setProductReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleUpdateReview = async (
    reviewId: string,
    rating: number,
    reviewText: string
  ) => {
    try {
      setIsUpdating(true);
      const response = await updateReview(reviewId, {
        rating,
        review: reviewText,
      });
      if (response.success) {
        showToast("Review updated successfully", "success");
        setAstrologerReviewModalOpen(false);
        await fetchAstrologerReview();
      }
    } catch (error: any) {
      showToast(error?.message || "Failed to update review", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProductReview = async (data: {
    rating: number;
    title?: string;
    review: string;
  }) => {
    if (!selectedProductReview) return;

    try {
      setIsUpdating(true);
      const response = await updateProductReview(selectedProductReview.id, data);
      if (response.success) {
        showToast("Product review updated successfully", "success");
        setProductReviewModalOpen(false);
        await fetchProductReviews();
      }
    } catch (error: any) {
      showToast(error?.message || "Failed to update review", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    try {
      setIsDeleting(true);

      if (reviewToDelete.type === "astrologer") {
        const response = await deleteReview(reviewToDelete.id);
        if (response.success) {
          showToast("Review deleted successfully", "success");
          setAstrologerReview(null);
        }
      } else {
        const response = await deleteProductReview(reviewToDelete.id);
        if (response.success) {
          showToast("Product review deleted successfully", "success");
          await fetchProductReviews();
        }
      }

      setDeleteModalOpen(false);
      setReviewToDelete(null);
    } catch (error: any) {
      showToast(error?.message || "Failed to delete review", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-3.5 h-3.5 sm:w-4 h-4"
          fill={star <= rating ? colors.primeYellow : "none"}
          stroke={star <= rating ? colors.primeYellow : colors.gray}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 pb-12">
      <main className="max-w-4xl mx-auto px-4 pt-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("astrologer")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-bold uppercase tracking-wide transition-all ${
              activeTab === "astrologer"
                ? "bg-yellow-400 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Astrologer Reviews
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-bold uppercase tracking-wide transition-all ${
              activeTab === "products"
                ? "bg-yellow-400 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Product Reviews
          </button>
        </div>
        {loading || reviewLoading ? (
          <UserReviewSkeleton />
        ) : activeTab === "astrologer" ? (
          /* Astrologer Review Tab */
          !astrologerReview ? (
            <div className="bg-white rounded-md p-10 text-center shadow-sm border border-gray-100 mt-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase mb-2">
                No Astrologer Reviews
              </h2>
              <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">
                You haven't shared your experience with our astrologers yet.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-50">
                      {astrologerReview.astrologer?.photo ? (
                        <Image
                          src={astrologerReview.astrologer.photo}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                          {astrologerReview.astrologer?.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                        {astrologerReview.astrologer?.fullName}
                      </h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase mt-0.5">
                        {new Date(astrologerReview.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 px-3 py-1.5 rounded-xl w-fit">
                    {renderStars(astrologerReview.rating)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <p className="text-sm leading-relaxed text-gray-600 font-medium italic">
                      "{astrologerReview.review}"
                    </p>
                    {astrologerReview.isEdited && (
                      <span className="text-[10px] font-bold text-gray-400 uppercase mt-2 block">
                        Edited
                      </span>
                    )}
                  </div>

                  {astrologerReview.reply && (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-2">
                        Astrologer's Response
                      </p>
                      <p className="text-xs leading-relaxed text-gray-500 font-medium">
                        {astrologerReview.reply}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedAstrologerReview(astrologerReview);
                      setAstrologerReviewModalOpen(true);
                    }}
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-400 text-white text-[11px] md:text-[14px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setReviewToDelete({ id: astrologerReview.id, type: "astrologer" });
                      setDeleteModalOpen(true);
                    }}
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-red-50 text-red-600 text-[11px] md:text-[14px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          /* Product Reviews Tab */
          productReviews.length === 0 ? (
            <div className="bg-white rounded-md p-10 text-center shadow-sm border border-gray-100 mt-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase mb-2">
                No Product Reviews
              </h2>
              <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">
                You haven't reviewed any products yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {productReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-5 sm:p-6"
                >
                  <div className="flex gap-4 mb-4">
                    <Link
                      href={`/store/products/${review.product?.slug}`}
                      className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                    >
                      {review.product?.images && review.product.images.length > 0 ? (
                        <Image
                          src={review.product.images[0]}
                          alt={review.product.productName || ""}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/store/products/${review.product?.slug}`}
                        className="text-sm font-bold text-gray-900 hover:text-yellow-600 line-clamp-2"
                      >
                        {review.product?.productName}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-yellow-400 text-sm">
                          {"★".repeat(review.rating)}
                          <span className="text-gray-300">
                            {"☆".repeat(5 - review.rating)}
                          </span>
                        </div>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {review.title && (
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      {review.title}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {review.review}
                  </p>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedProductReview(review);
                        setProductReviewModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-bold uppercase tracking-wide transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setReviewToDelete({ id: review.id, type: "product" });
                        setDeleteModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 border-red-200 text-red-600 text-xs font-bold uppercase tracking-wide hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* Modals & Toasts */}
      <ReviewModal
        isOpen={astrologerReviewModalOpen}
        onClose={() => setAstrologerReviewModalOpen(false)}
        review={selectedAstrologerReview}
        onUpdate={handleUpdateReview}
        onDelete={(id) => {
          setReviewToDelete({ id, type: "astrologer" });
          setAstrologerReviewModalOpen(false);
          setDeleteModalOpen(true);
        }}
        isUpdating={isUpdating}
      />

      {selectedProductReview && (
        <ProductReviewModal
          isOpen={productReviewModalOpen}
          onClose={() => setProductReviewModalOpen(false)}
          productName={selectedProductReview.product?.productName || "Product"}
          existingReview={selectedProductReview}
          onSubmit={handleUpdateProductReview}
          loading={isUpdating}
        />
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setReviewToDelete(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        title="Delete Review"
        message={`Are you sure you want to delete this ${
          reviewToDelete?.type === "astrologer" ? "astrologer" : "product"
        } review? This action cannot be undone.`}
      />

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
