"use client";

import React, { useState, useEffect } from "react";
import ProfileSidebar from "@/components/layout/UserProfileSidebar";
import { colors } from "@/utils/colors";
import { Star } from "lucide-react";
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
import UserReviewSkeleton from "@/components/skeleton/UserReviewSkeleton";
import Image from "next/image";

export default function MyReviewsPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading, logout } = useAuth();
  const [review, setReview] = useState<UserReview | null>(null);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Redirect if not logged in
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
      }
    } catch (error: any) {
      // Silently handle errors - no toast for fetch
      console.log("No review found or error fetching review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleCardClick = (reviewData: UserReview) => {
    setSelectedReview(reviewData);
    setReviewModalOpen(true);
  };

  const handleUpdateReview = async (
    reviewId: string,
    rating: number,
    reviewText: string
  ) => {
    try {
      setIsUpdating(true);
      const response = await updateReview(reviewId, { rating, review: reviewText });
      if (response.success) {
        showToast("Review updated successfully", "success");
        setReviewModalOpen(false);
        fetchReview();
      }
    } catch (error: any) {
      showToast(error.message || "Failed to update review", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setReviewModalOpen(false);
    setDeleteModalOpen(true);
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
      showToast(error.message || "Failed to delete review", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-4 h-4"
            fill={star <= rating ? colors.primeYellow : "none"}
            stroke={star <= rating ? colors.primeYellow : colors.gray}
          />
        ))}
      </div>
    );
  };

  if (loading || reviewLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <ProfileSidebar
                userName={user?.fullName || "User"}
                userEmail={user?.email || ""}
                onLogout={logout}
              />
            </div>
            <div className="lg:w-3/4">
              <h1
                className="text-3xl font-bold mb-8"
                style={{ color: colors.black }}
              >
                My Reviews
              </h1>
              <UserReviewSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <ProfileSidebar
                userName={user?.fullName || "User"}
                userEmail={user?.email || ""}
                onLogout={logout}
              />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <h1
                className="text-3xl font-bold mb-8"
                style={{ color: colors.black }}
              >
                My Reviews
              </h1>

              {!review ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                  <Star
                    className="w-24 h-24 mx-auto mb-4"
                    style={{ color: colors.gray }}
                  />
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: colors.black }}
                  >
                    No Reviews Yet
                  </h2>
                  <p style={{ color: colors.gray }}>
                    You haven't written any reviews yet.
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => handleCardClick(review)}
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  {/* Astrologer Info */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      {review.astrologer?.photo ? (
                        <Image
                          src={review.astrologer.photo}
                          alt={review.astrologer.fullName}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-2xl font-bold"
                          style={{ color: colors.gray }}
                        >
                          {review.astrologer?.fullName?.charAt(0) || "A"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold"
                        style={{ color: colors.black }}
                      >
                        {review.astrologer?.fullName || "Astrologer"}
                      </h3>
                      <p className="text-sm" style={{ color: colors.gray }}>
                        Reviewed on{" "}
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  {/* Review Text */}
                  <p
                    className="text-base leading-relaxed mb-4"
                    style={{ color: colors.darkGray }}
                  >
                    {review.review}
                  </p>

                  {/* Astrologer Reply */}
                  {review.reply && (
                    <div
                      className="rounded-lg p-4"
                      style={{ backgroundColor: colors.offYellow }}
                    >
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: colors.black }}
                      >
                        Astrologer's Reply:
                      </p>
                      <p className="text-sm" style={{ color: colors.darkGray }}>
                        {review.reply}
                      </p>
                    </div>
                  )}

                  {/* Edit Indicator */}
                  {review.isEdited && (
                    <p
                      className="text-xs mt-3"
                      style={{ color: colors.gray }}
                    >
                      (Edited)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        review={selectedReview}
        onUpdate={handleUpdateReview}
        onDelete={handleDeleteClick}
        isUpdating={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteReviewModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setReviewToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/* Toast Notification
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )} */}
    </>
  );
}
