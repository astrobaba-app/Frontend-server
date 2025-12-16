"use client";

import React, { useState, useEffect } from "react";
import { colors } from "@/utils/colors";
import { Star } from "lucide-react";
import {
  getMyReviews,
  addReviewReply,
  updateReviewReply,
  deleteReviewReply,
  type AstrologerReview,
} from "@/store/api/astrologer/review";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import DeleteReplyModal from "@/components/modals/DeleteReplyModal";
import ReviewsSkeleton from "@/components/skeletons/ReviewsSkeleton";
import { Button } from "@/components/atoms";

export default function AstrologerReviewsPage() {
  const [reviews, setReviews] = useState<AstrologerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [editingReply, setEditingReply] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [submittingReply, setSubmittingReply] = useState<{
    [key: string]: boolean;
  }>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [deletingReply, setDeletingReply] = useState(false);
  const { toastProps, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getMyReviews(1, 100);
      if (response.success) {
        setReviews(response.reviews);
        // Initialize reply text for existing replies
        const initialReplyText: { [key: string]: string } = {};
        response.reviews.forEach((review) => {
          if (review.reply) {
            initialReplyText[review.id] = review.reply;
          }
        });
        setReplyText(initialReplyText);
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    const reply = replyText[reviewId]?.trim();
    if (!reply) {
      showToast("Please enter a reply", "error");
      return;
    }

    try {
      setSubmittingReply({ ...submittingReply, [reviewId]: true });
      const review = reviews.find((r) => r.id === reviewId);

      if (review?.reply && editingReply[reviewId]) {
        // Update existing reply
        const response = await updateReviewReply(reviewId, { reply });
        if (response.success) {
          showToast("Reply updated successfully", "success");
          setEditingReply({ ...editingReply, [reviewId]: false });
          fetchReviews();
        }
      } else {
        // Add new reply
        const response = await addReviewReply(reviewId, { reply });
        if (response.success) {
          showToast("Reply added successfully", "success");
          fetchReviews();
        }
      }
    } catch (error: any) {
      showToast(error.message || "Failed to submit reply", "error");
    } finally {
      setSubmittingReply({ ...submittingReply, [reviewId]: false });
    }
  };

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    try {
      setDeletingReply(true);
      const response = await deleteReviewReply(reviewToDelete);
      if (response.success) {
        showToast("Reply deleted successfully", "success");
        setDeleteModalOpen(false);
        setReviewToDelete(null);
        fetchReviews();
      }
    } catch (error: any) {
      showToast(error.message || "Failed to delete reply", "error");
    } finally {
      setDeletingReply(false);
    }
  };

  const handleEditClick = (reviewId: string, currentReply: string) => {
    setEditingReply({ ...editingReply, [reviewId]: true });
    setReplyText({ ...replyText, [reviewId]: currentReply });
  };

  const handleCancelEdit = (reviewId: string, originalReply: string) => {
    setEditingReply({ ...editingReply, [reviewId]: false });
    setReplyText({ ...replyText, [reviewId]: originalReply });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-5 h-5"
            fill={star <= rating ? colors.primeYellow : "none"}
            stroke={star <= rating ? colors.primeYellow : colors.gray}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl">
          <h1
            className="text-3xl font-bold mb-8"
            style={{ color: colors.black }}
          >
            My Reviews
          </h1>
          <ReviewsSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8">
        <div className="max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: colors.black }}>
              My Reviews
            </h1>
            <button
              className="px-6 py-2 rounded-lg font-semibold"
              style={{
                backgroundColor: colors.primeYellow,
                color: colors.black,
              }}
            >
              {reviews.length} Reviews
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center py-12">
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
                  You don't have any reviews at the moment.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-200"
                >
                  {/* Review Content */}
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: colors.darkGray }}
                  >
                    {review.review}
                  </p>

                  {/* User Info and Rating */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                        style={{ backgroundColor: colors.primeRed }}
                      >
                        {review.user?.fullName
                          ? review.user.fullName.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <p
                          className="font-semibold text-sm"
                          style={{ color: colors.black }}
                        >
                          {review.user?.fullName || "User"}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  {/* Reply Section */}
                  {review.reply && !editingReply[review.id] ? (
                    <div
                      className="rounded-lg p-4 mb-4"
                      style={{ backgroundColor: colors.offYellow }}
                    >
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: colors.black }}
                      >
                        Your Reply:
                      </p>
                      <p className="text-sm" style={{ color: colors.darkGray }}>
                        {review.reply}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="custom"
                          size="sm"
                          onClick={() =>
                            handleEditClick(review.id, review.reply!)
                          }
                          customColors={{
                            backgroundColor: colors.primeYellow,

                            textColor: colors.black,
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="custom"
                          size="sm"
                          onClick={() => handleDeleteClick(review.id)}
                          className="text-xs px-3 py-1 rounded"
                          customColors={{
                            backgroundColor: colors.primeRed,

                            textColor: colors.black,
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={replyText[review.id] || ""}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [review.id]: e.target.value,
                          })
                        }
                        placeholder="Write your reply..."
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 mb-3"
                        style={{
                          color: colors.darkGray,
                          borderColor: colors.gray,
                        }}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => handleReplySubmit(review.id)}
                          loading={submittingReply[review.id]}
                        >
                          {editingReply[review.id]
                            ? "Update Reply"
                            : "Submit Reply"}
                        </Button>
                        {editingReply[review.id] && (
                          <Button
                            variant="custom"
                            size="sm" 
                            onClick={() =>
                              handleCancelEdit(review.id, review.reply!)
                            }
                            customColors={{
                              backgroundColor: colors.gray,

                              textColor: colors.white,
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteReplyModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setReviewToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={deletingReply}
      />
      {toastProps.isVisible && (
        <Toast
          message={toastProps.message}
          type={toastProps.type}
          onClose={hideToast}
        />
      )}
    </>
  );
}
