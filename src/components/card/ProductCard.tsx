import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { addToCart } from "@/store/api/store";
import { useCart } from "@/contexts/CartContext";
import { Button } from "../atoms";
import Toast from "@/components/atoms/Toast";

interface ProductCardProps {
  id: string;
  slug: string;
  productName: string;
  price: number;
  images?: string[] | string | null;
  averageRating?: number;
  totalReviews?: number;
  stock?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  slug,
  productName,
  price,
  images,
  averageRating = 5,
  totalReviews = 500,
  stock,
}) => {
  const { isLoggedIn } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const { fetchCartCount } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);

  const isOutOfStock = typeof stock === "number" && stock <= 0;

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!isLoggedIn) {
      showToast("Please login to add products to cart", "error");
      return;
    }

    try {
      if (addingToCart) return;

      setAddingToCart(true);
      await addToCart(id, 1);
      showToast("Product added to cart", "success");
      fetchCartCount();
    } catch (error: any) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to add product to cart";
      showToast(message, "error");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <>
      <Link href={`/store/products/${slug}`} className="block">
        <div className="bg-white rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition overflow-hidden w-full">
          {/* Image */}
          <div className="relative w-full h-32 sm:h-40 md:h-44 bg-gray-100">
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
          <div className="p-2 sm:p-3 md:p-4">
            {/* Title */}
            <h3 className="font-bold text-xs sm:text-sm md:text-base text-gray-900 mb-1 line-clamp-2">
              {productName}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
              <div className="text-yellow-400 text-xs md:text-sm">{"★".repeat(5)}</div>
              <span className="text-xs md:text-sm text-gray-500">
                {totalReviews} reviews
              </span>
            </div>

            {/* Price + Add */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">₹ {price}</span>

              <Button
                variant="custom"
                size="sm"
                onClick={handleAddToCart}
                loading={addingToCart}
                disabled={isOutOfStock || addingToCart}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-2 sm:px-3 md:px-4 py-1 md:py-1.5 rounded-sm text-xs sm:text-sm"
              >
                {isOutOfStock ? "Out of Stock" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </Link>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
};

export default ProductCard;
