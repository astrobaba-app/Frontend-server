"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";

import { useParams, useRouter } from "next/navigation";

import {
  getProductBySlug,
  addToCart,
  getProductReviews,
} from "@/store/api/store";

import { useCart } from "@/contexts/CartContext";

import { useAuth } from "@/contexts/AuthContext";

import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";

// ⚠️ IMPORT YOUR REUSABLE BUTTON HERE

import Button from "@/components/atoms/Button";

// ⚠️ Note: Adjust the import path if your file location is different

interface Product {
  id: string;

  slug: string;

  productName: string;

  description: string;

  shortDescription?: string;

  price: number;

  discountPrice?: number;

  images?: string[] | string | null;

  category: string;

  productType: string;

  stock: number;

  isFeatured?: boolean;

  averageRating?: number;

  totalReviews?: number;

  weight?: string;

  dimensions?: string;

  tags?: string[];

  digitalFileUrl?: string;
}

interface ProductReviewUser {
  id?: string;

  fullName?: string;

  profilePicture?: string | null;
}

interface ProductReview {
  id: string;

  rating: number;

  title?: string;

  review: string;

  images?: string[];

  isVerifiedPurchase?: boolean;

  createdAt?: string;

  user?: ProductReviewUser;
}

export default function ProductDetailPage() {
  const params = useParams();

  const router = useRouter();

  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const [addingToCart, setAddingToCart] = useState(false);

  const [reviews, setReviews] = useState<ProductReview[]>([]);

  const [reviewsLoading, setReviewsLoading] = useState(false);

  const { fetchCartCount } = useCart();

  const { isLoggedIn } = useAuth();

  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await getProductBySlug(slug);

      setProduct(data.product);

      setSelectedImage(0);

      if (data.product?.id) {
        fetchReviews(data.product.id);
      }
    } catch (err: any) {
      console.error("Error fetching product:", err);

      setError(err?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      setReviewsLoading(true);

      const data = await getProductReviews(productId, { page: 1, limit: 20 });

      setReviews(data.reviews || []);
    } catch (err: any) {
      console.error("Error fetching reviews:", err);

      // We keep page usable even if reviews fail
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    console.log("--- Add to Cart Clicked ---");

    if (!product) {
      console.warn("Attempted to add to cart, but product data is missing.");

      showToast("Cannot add to cart: Product data is unavailable.", "error");

      return;
    }

    if (!isLoggedIn) {
      console.log("User is NOT logged in. Showing error toast.");

      showToast("Please login to add products to cart", "error");

      return;
    }

    if (addingToCart) {
      console.log("Add to cart already in progress. Ignoring click.");

      return;
    }

    try {
      setAddingToCart(true);

      console.log(
        `Attempting to add Product ID: ${product.id}, Quantity: ${quantity}`
      );

      await addToCart(product.id, quantity);

      await fetchCartCount();

      showToast("Product added to cart successfully!", "success");

      setQuantity(1);

      console.log("Product added successfully and cart count updated.");
    } catch (err: any) {
      console.error("Error adding to cart (API failure):", err);

      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to add product to cart (check network).";

      showToast(message, "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const formatCategoryLabel = (category: string) => {
    return category

      .replace(/_/g, " ")

      .split(" ")

      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))

      .join(" ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {/* The existing loader is fine, but you could also use your Button's loading state */}

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {error || "Product not found"}
          </p>

          {/* 1. Replaced Go Back button with the reusable Button */}

          <Button onClick={() => router.back()} variant="primary" size="md">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discountPrice != null;

  const displayPrice = hasDiscount ? product.discountPrice! : product.price;

  const originalPrice = hasDiscount ? product.price : null;

  const discount =
    hasDiscount && originalPrice != null && product.discountPrice != null
      ? Math.round(
          ((originalPrice - product.discountPrice) / originalPrice) * 100
        )
      : 0;

  const totalReviews = product.totalReviews ?? 0;

  const averageRating = Number(product.averageRating ?? 0);

  const isOutOfStock = product.stock === 0;

  const imageList = Array.isArray(product.images)
    ? product.images
    : typeof product.images === "string"
    ? [product.images]
    : [];

  const mainImage = imageList[selectedImage] || "/images/placeholder.png";

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-10">
      {/* Product Section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10">
        {/* LEFT: Images */}

        {/* ... (Image display and thumbnails remain the same) */}

        <div>
          <div className="relative aspect-square bg-gray-100 rounded-lg md:rounded-xl overflow-hidden">
            <img
              src={mainImage}
              alt={product.productName}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Thumbnails */}

          {imageList && imageList.length > 1 && (
            <div className="flex gap-2 md:gap-3 mt-3 md:mt-4 overflow-x-auto">
              {imageList.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-md md:rounded-lg overflow-hidden border flex-shrink-0 ${
                    selectedImage === i
                      ? "border-yellow-400"
                      : "border-gray-300"
                  }`}
                >
                  <img src={img || "/images/placeholder.png"} alt="" className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Info */}

        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{product.productName}</h1>

          {/* Price */}

          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
            {originalPrice && (
              <span className="text-sm md:text-base text-gray-400 line-through">
                Rs.{originalPrice}
              </span>
            )}

            <span className="text-xl md:text-2xl font-bold">Rs.{displayPrice}</span>

            {discount > 0 && (
              <span className="text-sm md:text-base text-green-600 font-semibold">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Quantity + Add */}

          <div className="flex items-center gap-3 md:gap-6 mb-6 md:mb-8">
            {/* Quantity controls remain basic buttons as they are simple */}

            <div className="flex border border-yellow-400 rounded text-sm md:text-base">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2 md:px-3 py-1"
                disabled={quantity <= 1 || addingToCart}
              >
                −
              </button>

              <span className="px-3 md:px-4 py-1">{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2 md:px-3 py-1"
                disabled={quantity >= product.stock || addingToCart}
              >
                +
              </button>
            </div>

            {/* 2. Replaced Add to Cart button with the reusable Button */}

            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="md"
              loading={addingToCart}
              disabled={isOutOfStock || addingToCart}
              className="flex-1 md:flex-initial text-sm md:text-base"
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          {/* Description */}

          {/* ... (Description and details section remains the same) */}

          <div className="space-y-3 md:space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm md:text-base">Product Description</h3>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2 text-xs md:text-sm">
              <p>
                <span className="text-gray-600">Category:</span>{" "}
                <span className="font-semibold">
                  {formatCategoryLabel(product.category)}
                </span>
              </p>

              <p>
                <span className="text-gray-600">Type:</span>{" "}
                <span className="font-semibold">
                  {product.productType === "digital" ? "Digital" : "Physical"}
                </span>
              </p>

              <p>
                <span className="text-gray-600">Stock:</span>{" "}
                <span
                  className={`font-semibold ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </p>

              {product.weight && (
                <p>
                  <span className="text-gray-600">Weight:</span>{" "}
                  <span className="font-semibold">{product.weight}</span>
                </p>
              )}

              {product.dimensions && (
                <p>
                  <span className="text-gray-600">Dimensions:</span>{" "}
                  <span className="font-semibold">{product.dimensions}</span>
                </p>
              )}

              {product.tags && product.tags.length > 0 && (
                <p>
                  <span className="text-gray-600">Tags:</span>{" "}
                  <span className="font-semibold">
                    {product.tags.join(", ")}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}

      <div className="mt-8 md:mt-16">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="font-semibold text-base md:text-lg">Reviews ({reviews.length})</h2>

          {totalReviews > 0 && (
            <div className="text-xs md:text-sm text-gray-600">
              <span className="text-yellow-400 mr-1">★</span>
              {averageRating.toFixed(1)} average from {totalReviews} ratings
            </div>
          )}
        </div>

        {reviewsLoading ? (
          <p className="text-gray-500 text-xs md:text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-xs md:text-sm">
            No reviews yet. Be the first to review this product.
          </p>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {reviews.map((rev) => {
              const name = rev.user?.fullName || "Anonymous";

              const nameParts = name.trim().split(/\s+/);
              const firstInitial = nameParts[0]?.[0] || "";
              const lastInitial =
                nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";
              const initials = `${firstInitial}${lastInitial}`.toUpperCase();

              const stars = "★".repeat(Math.round(rev.rating || 0));

              const emptyStars = "☆".repeat(5 - Math.round(rev.rating || 0));

              return (
                <div key={rev.id} className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xs font-semibold text-yellow-800 flex-shrink-0">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 text-xs md:text-sm">
                        {name}
                      </span>

                      {rev.isVerifiedPurchase && (
                        <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    <div className="text-yellow-400 text-xs md:text-sm">
                      {stars}

                      <span className="text-gray-300">{emptyStars}</span>
                    </div>

                    {rev.title && (
                      <p className="text-xs md:text-sm font-semibold text-gray-900 mt-1">
                        {rev.title}
                      </p>
                    )}

                    <p className="text-xs md:text-sm text-gray-600 mt-1 whitespace-pre-line break-words">
                      {rev.review}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Review */}
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
