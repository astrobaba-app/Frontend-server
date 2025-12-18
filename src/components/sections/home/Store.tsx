"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import Link from "next/link";

import { getAllProducts } from "@/store/api/store";

interface StoreProduct {
  id: string;

  slug: string;

  productName: string;

  price: number;

  images?: string[] | string | null;
}

interface ProductCardProps {
  product: StoreProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const primaryImage = Array.isArray(product.images)
    ? product.images[0]
    : typeof product.images === "string"
    ? product.images
    : undefined;

  const imageSrc = primaryImage || "/images/placeholder.png";

  return (
    <Link
      href={`/store/products/${product.slug}`}
      className="group flex flex-col items-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px] transition-transform duration-200 active:scale-95"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#FFFFEC] rounded-2xl mb-3 flex justify-center items-center p-3 shadow-sm overflow-hidden relative border border-yellow-100 mobile-content-box">
        <img
          src={imageSrc}
          alt={product.productName}
          className="object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="text-[10px] sm:text-xs font-semibold text-gray-700 text-center line-clamp-2 px-1 leading-tight">
        {product.productName}
      </div>
    </Link>
  );
};

const Store: React.FC = () => {
  const [products, setProducts] = useState<StoreProduct[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);

        const data = await getAllProducts({
          page: 1,

          limit: 6, // Increased limit to make horizontal scroll look better

          sortBy: "createdAt",

          sortOrder: "DESC",
        });

        setProducts((data?.products || []).slice(0, 6));
      } catch (error) {
        console.error("Failed to load home store products", error);

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <div className="w-full py-10 bg-gray-50/50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title Section */}

        <div className="flex flex-col items-center mb-6 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Graho Store
          </h2>
        </div>

        {/* Store Container */}

        <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8  border border-gray-200 rounded-md bg-white shadow-md shadow-gray-200/50 relative">
          <div className="mb-6 ml-0">
            <Link
              href="/store"
              className="text-xs sm:text-sm font-bold text-yellow-600 hover:text-yellow-700 transition-colors border-b-2 border-yellow-100 hover:border-yellow-500 pb-0.5"
            >
              Visit Store &rarr;
            </Link>
          </div>

          {/* Single Row Horizontal Scroll for Mobile & Desktop */}

          <div className="flex overflow-x-auto justify-between gap-4 sm:gap-4 pb-4 no-scrollbar snap-x snap-mandatory">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center space-y-3 min-w-[100px]"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg animate-pulse" />

                  <div className="w-12 h-2 bg-gray-100 rounded animate-pulse" />
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="snap-start">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic w-full text-center">
                No products found.
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Remove border-box for mobile card containers */

        @media (max-width: 639px) {
          .mobile-content-box {
            box-sizing: content-box !important;
          }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;

          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Store;
