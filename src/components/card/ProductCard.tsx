import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { addToCart } from "@/store/api/store";
import { useCart } from "@/contexts/CartContext";
import { Button } from "../atoms";

interface ProductCardProps {
  id: string;
  slug: string;
  productName: string;
  price: number;
  images?: string[] | string | null;
  averageRating?: number;
  totalReviews?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  slug,
  productName,
  price,
  images,
  averageRating = 5,
  totalReviews = 500,
}) => {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const { fetchCartCount } = useCart();

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!isLoggedIn) {
      showToast("Please login to add products to cart", "error");
      return;
    }

    try {
      await addToCart(id, 1);
      showToast("Product added to cart", "success");
      fetchCartCount();
    } catch (error: any) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to add product to cart";
      showToast(message, "error");
    }
  };

  return (
    <Link href={`/store/products/${slug}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden w-full max-w-[260px]">
        {/* Image */}
        <div className="relative w-full h-44 bg-gray-100">
          {(() => {
            const primaryImage = Array.isArray(images)
              ? images[0]
              : typeof images === "string"
              ? images
              : undefined;
            const imageSrc = primaryImage || "/images/placeholder.png";

            return (
              <img
                src={imageSrc}
                alt={productName}
                className="object-cover w-full h-full"
              />
            );
          })()}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-base text-gray-900 mb-1">
            {productName}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="text-yellow-400 text-sm">{"★".repeat(5)}</div>
            <span className="text-sm text-gray-500">
              {totalReviews} reviews
            </span>
          </div>

          {/* Price + Add */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">₹ {price}</span>

            <Button
              variant="custom"
              size="sm"
              onClick={handleAddToCart}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-1.5 rounded-sm"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
