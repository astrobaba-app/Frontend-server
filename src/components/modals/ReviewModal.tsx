import React, { useState, useEffect } from "react";
import { colors } from "@/utils/colors";
import { Star, X } from "lucide-react";
import Button from "../atoms/Button";
import Image from "next/image";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: {
    id: string;
    rating: number;
    review: string;
    reply: string | null;
    repliedAt: string | null;
    createdAt: string;
    astrologer?: {
      id: string;
      fullName: string;
      photo: string | null;
    };
  } | null;
  onUpdate: (reviewId: string, rating: number, reviewText: string) => void;
  onDelete: (reviewId: string) => void;
  isUpdating?: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  review,
  onUpdate,
  onDelete,
  isUpdating = false,
}: ReviewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setReviewText(review.review);
      setIsEditing(false);
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleUpdate = () => {
    if (reviewText.trim()) {
      onUpdate(review.id, rating, reviewText);
    }
  };

  const handleDelete = () => {
    onDelete(review.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold" style={{ color: colors.black }}>
            {isEditing ? "Edit Review" : "Review Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" style={{ color: colors.darkGray }} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Astrologer Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              {review.astrologer?.photo ? (
                <Image
                  src={review.astrologer.photo}
                  alt={review.astrologer.fullName}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: colors.gray }}>
                  {review.astrologer?.fullName?.charAt(0) || "A"}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: colors.black }}>
                {review.astrologer?.fullName || "Astrologer"}
              </h3>
              <p className="text-sm" style={{ color: colors.gray }}>
                Reviewed on {new Date(review.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3" style={{ color: colors.black }}>
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  disabled={!isEditing}
                  onClick={() => isEditing && setRating(star)}
                  onMouseEnter={() => isEditing && setHoveredStar(star)}
                  onMouseLeave={() => isEditing && setHoveredStar(0)}
                  className={`${isEditing ? "cursor-pointer" : "cursor-default"}`}
                >
                  <Star
                    className="w-8 h-8"
                    fill={
                      star <= (hoveredStar || rating)
                        ? colors.primeYellow
                        : "none"
                    }
                    stroke={
                      star <= (hoveredStar || rating)
                        ? colors.primeYellow
                        : colors.gray
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3" style={{ color: colors.black }}>
              Review
            </label>
            {isEditing ? (
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                className="w-full border border-gray-300 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2"
                style={{
                  color: colors.darkGray,
                  minHeight: "150px",
                }}
              />
            ) : (
              <p className="text-base leading-relaxed" style={{ color: colors.darkGray }}>
                {review.review}
              </p>
            )}
          </div>

          {/* Astrologer Reply */}
          {review.reply && !isEditing && (
            <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: colors.offYellow }}>
              <p className="text-sm font-semibold mb-2" style={{ color: colors.black }}>
                Astrologer's Reply:
              </p>
              <p className="text-sm" style={{ color: colors.darkGray }}>
                {review.reply}
              </p>
              {review.repliedAt && (
                <p className="text-xs mt-2" style={{ color: colors.gray }}>
                  Replied on {new Date(review.repliedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setRating(review.rating);
                    setReviewText(review.review);
                  }}
                  disabled={isUpdating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdate}
                  disabled={isUpdating || !reviewText.trim()}
                  className="flex-1"
                  style={{ backgroundColor: colors.primeYellow, color: colors.black }}
                >
                  {isUpdating ? "Updating..." : "Update Review"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  className="flex-1"
                  style={{ backgroundColor: colors.primeYellow, color: colors.black }}
                >
                  Edit Review
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDelete}
                  className="flex-1"
                  style={{ backgroundColor: colors.primeRed, color: colors.white }}
                >
                  Delete Review
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
