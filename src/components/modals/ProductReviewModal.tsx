import React, { useState, useEffect } from "react";
import { colors } from "@/utils/colors";
import { Star, X } from "lucide-react";
import Button from "../atoms/Button";

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  existingReview?: {
    id: string;
    rating: number;
    title?: string;
    review: string;
  } | null;
  onSubmit: (data: { rating: number; title?: string; review: string }) => Promise<void>;
  loading?: boolean;
}

export default function ProductReviewModal({
  isOpen,
  onClose,
  productName,
  existingReview,
  onSubmit,
  loading = false,
}: ProductReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setTitle(existingReview.title || "");
      setReviewText(existingReview.review);
    } else {
      setRating(5);
      setTitle("");
      setReviewText("");
    }
  }, [existingReview, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (reviewText.trim()) {
      await onSubmit({
        rating,
        title: title.trim() || undefined,
        review: reviewText.trim(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 md:px-8 py-4 md:py-6 flex justify-between items-center">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">
            {existingReview ? "Edit Review" : "Write a Review"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            disabled={loading}
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 md:px-8 py-6">
          {/* Product Name */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">Reviewing</p>
            <h3 className="text-base md:text-lg font-bold text-gray-900">
              {productName}
            </h3>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-900">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="cursor-pointer transition-transform hover:scale-110"
                  disabled={loading}
                >
                  <Star
                    className="w-7 h-7 md:w-8 md:h-8"
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
              <span className="ml-2 text-sm text-gray-600 self-center">
                {rating} {rating === 1 ? "star" : "stars"}
              </span>
            </div>
          </div>

          {/* Title (Optional) */}
          <div className="mb-6">
            <label
              htmlFor="review-title"
              className="block text-sm font-semibold mb-2 text-gray-900"
            >
              Review Title (Optional)
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
              maxLength={100}
              disabled={loading}
            />
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label
              htmlFor="review-text"
              className="block text-sm font-semibold mb-2 text-gray-900"
            >
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="review-text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base min-h-[120px] resize-y"
              maxLength={1000}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {reviewText.length}/1000 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={onClose}
              variant="custom"
              size="md"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="primary"
              size="md"
              className="flex-1"
              loading={loading}
              disabled={!reviewText.trim() || loading}
            >
              {existingReview ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
