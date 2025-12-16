"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useParams, notFound,useRouter } from "next/navigation";
import Image from "next/image";
import { Star, MessageCircle, Phone, User } from "lucide-react";
import {
  getAstrologerById,
  checkFollowStatus,
  followAstrologer,
  unfollowAstrologer,
  getAstrologerReviews,
  Astrologer,
  Review,
  RatingStats,
} from "@/store/api/general/astrologer";
import { createReview } from "@/store/api/user/review";
import { AstrologerDetailPageSkeleton } from "@/components/skeletons";
import ReviewsSkeleton from "@/components/skeleton/ReviewsSkeleton";
import { colors } from "@/utils/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import Button from "@/components/atoms/Button";

export default function AstrologerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { isLoggedIn } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();
  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        setLoading(true);

        // Fetch astrologer details
        const astroResponse = await getAstrologerById(id);
        if (astroResponse.success && astroResponse.astrologer) {
          setAstrologer(astroResponse.astrologer);
        }

        // Fetch reviews
        setReviewsLoading(true);
        const reviewsResponse = await getAstrologerReviews(id);
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.reviews || []);
          setRatingStats(reviewsResponse.ratingStats);
        }
        setReviewsLoading(false);

        // Check follow status if logged in
        if (isLoggedIn) {
          try {
            const followResponse = await checkFollowStatus(id);
            if (followResponse.success) {
              setIsFollowing(followResponse.isFollowing);
            }
          } catch (error) {
            // User not following or error
            setIsFollowing(false);
          }
        }
      } catch (error) {
        console.error("Error fetching astrologer data:", error);
        setError(true);
        setReviewsLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }

    return () => {
      hasFetched.current = false;
    };
  }, [id, isLoggedIn]);

  const handleFollowToggle = async () => {
    if (!isLoggedIn) {
      showToast("Please login to follow astrologers", "error");
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        const response = await unfollowAstrologer(id);
        if (response.success) {
          setIsFollowing(false);
          showToast("Unfollowed successfully", "success");
        }
      } else {
        const response = await followAstrologer(id);
        if (response.success) {
          setIsFollowing(true);
          showToast("Following successfully", "success");
        }
      }
    } catch (error: any) {
      showToast(error.message || "Failed to update follow status", "error");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleChatClick = () => {
    if (!id) return;
    router.push(`/chat?astrologerId=${id}`);
  };

   const handleCallClick = () => {
    showToast("Call feature coming soon!", "info");  }

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      showToast("Please login to write a review", "error");
      router.push("/auth/login");
      return;
    }

    if (!reviewText.trim()) {
      showToast("Please write a review", "error");
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await createReview({
        astrologerId: id,
        rating: reviewRating,
        review: reviewText,
      });

      if (response.success) {
        showToast("Review submitted successfully", "success");
        setShowReviewForm(false);
        setReviewText("");
        setReviewRating(5);
        
        // Refresh reviews
        setReviewsLoading(true);
        const reviewsResponse = await getAstrologerReviews(id);
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.reviews || []);
          setRatingStats(reviewsResponse.ratingStats);
        }
        setReviewsLoading(false);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }  }

  if (loading) {
    return <AstrologerDetailPageSkeleton />;
  }

  if (error || !astrologer) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-yellow-400">
                {astrologer.photo ? (
                  <Image
                    src={astrologer.photo}
                    alt={astrologer.fullName}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                {/* Rating Badge (Moved to Avatar based on image) */}
                <div className="absolute -bottom-2 left-7 flex items-center bg-white   px-2 py-0.5 border-3 rounded-md border-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-800 ml-1">
                    {astrologer.rating}
                  </span>
                </div>
              </div>
              {/* Followers Badge */}
              <div className="absolute -top-2 -right-2 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white">
                {astrologer.followersCount || 0}
              </div>
              {astrologer.isOnline && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
              )}
            </div>

            {/* Info & Action Buttons */}
            <div className="flex-1 w-full flex flex-col sm:flex-row justify-between">
              {/* Text Info */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-800">
                  {astrologer.fullName}
                </h1>
                <p className="text-gray-600 text-base mb-1">
                  {astrologer.skills.join(", ")}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  {astrologer.languages.join(", ")}
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  Exp: {astrologer.yearsOfExperience} Years
                </p>
                <div className="flex items-center text-sm font-semibold mb-6">
                  <span className="text-gray-800">
                    ₹ {astrologer.pricePerMinute}
                  </span>
                  <span className="text-gray-500 ml-1">/min</span>
                  <span className="text-gray-500 ml-3">
                    ({ratingStats?.total || 0} reviews)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
              {isLoggedIn && (
                <Button
                  variant={isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  loading={followLoading}
                  onClick={handleFollowToggle}
                  customColors={!isFollowing ? {
                    backgroundColor: colors.primeYellow,
                    textColor: 'black',
                    
                  } : undefined}
                  className="shadow"
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
              <Button
                variant="custom"
                size="sm"
                onClick={handleChatClick}
                icon={<MessageCircle className="w-4 h-4 text-gray-800" />}
                className="shadow sm:w-1/2" // Added sm:w-1/2 for better layout on small screens
                customColors={{
                  backgroundColor: colors.primeYellow,
                  textColor: 'black',
                  hoverBackgroundColor: '#e5d41f',
                }}
              >
                Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCallClick}
                icon={<Phone className="w-4 h-4 text-gray-800" />}
                className="shadow sm:w-1/2" // Added sm:w-1/2 for better layout on small screens
                customStyles={{
                  borderColor: '#F0DF20', // Matches your yellow-500 border
                }}
              >
                Call
              </Button>
            </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {astrologer.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-700 leading-relaxed text-sm">
                {astrologer.bio}
              </p>
            </div>
          )}
        </div>
        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <p
              className="text-2xl font-bold"
              style={{ color: colors.darkGray }}
            >
              Reviews
            </p>
            {isLoggedIn && !showReviewForm && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowReviewForm(true)}
                customColors={{
                  backgroundColor: colors.primeYellow,
                  textColor: colors.black,
                }}
              >
                Write Review
              </Button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8 p-6 rounded-xl border-2 border-gray-200" style={{ backgroundColor: colors.offYellow }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.black }}>
                Write Your Review
              </h3>

              {/* Star Rating */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className="w-8 h-8"
                        fill={
                          star <= (hoveredStar || reviewRating)
                            ? colors.primeYellow
                            : "none"
                        }
                        stroke={
                          star <= (hoveredStar || reviewRating)
                            ? colors.primeYellow
                            : colors.gray
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.black }}>
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this astrologer..."
                  className="w-full border border-gray-300 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2"
                  style={{
                    color: colors.darkGray,
                    minHeight: "120px",
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !reviewText.trim()}
                  customColors={{
                    backgroundColor: colors.primeYellow,
                    textColor: colors.black,
                  }}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewText("");
                    setReviewRating(5);
                  }}
                  disabled={submittingReview}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <ReviewsSkeleton />
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex gap-4 pb-6 border-b border-gray-200 last:border-0"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                    {review.user?.fullName?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {review.user?.fullName || "Anonymous"}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.review}</p>
                    {review.isEdited && (
                      <p className="text-xs text-gray-500 mt-1">(Edited)</p>
                    )}
                    
                    {/* Astrologer Reply */}
                    {review.reply && (
                      <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: colors.offYellow }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: colors.black }}>
                          Astrologer's Reply:
                        </p>
                        <p className="text-sm" style={{ color: colors.darkGray }}>
                          {review.reply}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
