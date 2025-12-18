"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/store/api/store";
import BannerCarousel from "@/components/sections/store/BannerCarousel";
import ProductCard from "@/components/card/ProductCard";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import TestimonialsSection from "@/components/sections/store/TestimonialsSection";
import Button from "@/components/atoms/Button";

interface Product {
  id: string;
  slug: string;
  productName: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  category: string;
  productType: string;
  stock: number;
  isFeatured?: boolean;
  averageRating?: number;
  totalReviews?: number;
}

export default function StorePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  const fetchLatestProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts({
        page: 1,
        limit: 4,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });
      setFeaturedProducts(data.products || []);
    } catch (err: any) {
      console.error("Error fetching featured products:", err);
      setError(err?.message || "Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Carousel */}
      <div className=" w-full">
        <BannerCarousel />
      </div>

      {/* Featured Products Section */}
      <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Graho Store</h2>
          <p className="text-gray-600">
            Authentic Gemstones, Rudraksha, Yantras & More for Your Spiritual
            Journey
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton Loaders
            Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : featuredProducts.length > 0 ? (
            // Products
            featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                productName={product.productName}
                price={product.price}
                images={product.images}
                averageRating={product.averageRating}
                totalReviews={product.totalReviews}
                stock={product.stock}
              />
            ))
          ) : (
            // Empty State
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">
                No featured products available at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Browse All Products Button */}
        {!loading && featuredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button
              href="/store/products" 
              variant="custom" 
              size="md" 
              className="bg-yellow-500 text-white hover:shadow-lg duration-300"
            >
              Browse All Products
            </Button>
          </div>
        )}
      </div>

      <TestimonialsSection />
    </div>
  );
}
