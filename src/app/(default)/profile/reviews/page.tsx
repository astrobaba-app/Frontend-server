"use client";

import React, { useState, useEffect } from "react";
import { colors } from "@/utils/colors";
import { Star, ArrowLeft, MessageSquare, Trash2, Edit3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  getMyReview,
  updateReview,
  deleteReview,
  type UserReview,
} from "@/store/api/user/review";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import ReviewModal from "@/components/modals/ReviewModal";
import DeleteReviewModal from "@/components/modals/DeleteReviewModal";
import UserReviewSkeleton from "@/components/skeletons/UserReviewSkeleton";
import Image from "next/image";

export default function MyReviewsPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();

  const [review, setReview] = useState<UserReview | null>(null);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
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
      fetchReview();
    }
  }, [isLoggedIn]);

  const fetchReview = async () => {
    try {
      setReviewLoading(true);
      const response = await getMyReview();
      if (response.success && response.review) {
        setReview(response.review);
      } else {
        setReview(null);
      }
    } catch (error) {
      setReview(null);
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
        setReviewModalOpen(false);
        await fetchReview();
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
      const response = await deleteReview(reviewToDelete);
      if (response.success) {
        showToast("Review deleted successfully", "success");
        setDeleteModalOpen(false);
        setReviewToDelete(null);
        setReview(null);
      }
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
    <div className=" bg-gray-50 pb-12">
      <main className="max-w-4xl mx-auto px-4 pt-6">
        {loading || reviewLoading ? (
          <UserReviewSkeleton />
        ) : !review ? (
          /* Empty State */
          <div className="bg-white rounded-md p-10 text-center shadow-sm border border-gray-100 mt-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase mb-2">
              No Reviews Found
            </h2>
            <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">
              You haven't shared your experience with our astrologers yet.
            </p>
          </div>
        ) : (
          /* Review Card */
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-50">
                    {review.astrologer?.photo ? (
                      <Image
                        src={review.astrologer.photo}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xl shadow-inner">
            {review.astrologer?.fullName.charAt(0).toUpperCase()}
          </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                      {review.astrologer?.fullName}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-50 px-3 py-1.5 rounded-xl w-fit">
                  {renderStars(review.rating)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <p className="text-sm leading-relaxed text-gray-600 font-medium italic">
                    "{review.review}"
                  </p>
                  {review.isEdited && (
                    <span className="text-[10px] font-bold text-gray-400 uppercase mt-2 block">
                      Edited
                    </span>
                  )}
                </div>

                {review.reply && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-2">
                      Astrologer's Response
                    </p>
                    <p className="text-xs leading-relaxed text-gray-500 font-medium">
                      {review.reply}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-50 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setReviewModalOpen(true);
                  }}
                  className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-400 text-white text-[11px] md:text-[14px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setReviewToDelete(review.id);
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
        )}
      </main>

      {/* Modals & Toasts */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        review={selectedReview}
        onUpdate={handleUpdateReview}
        onDelete={(id) => {
          setReviewToDelete(id);
          setReviewModalOpen(false);
          setDeleteModalOpen(true);
        }}
        isUpdating={isUpdating}
      />

      <DeleteReviewModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setReviewToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
