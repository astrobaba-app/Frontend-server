"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts } from "@/store/api/store";
import ProductCard from "@/components/card/ProductCard";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

interface Product {
  id: string;
  slug: string;
  productName: string;
  price: number;
  images?: string[];
  productType: string;
  averageRating?: number;
  totalReviews?: number;
  stock?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<"digital" | "physical" | "">("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data.products || []);
    setLoading(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchType = activeType
      ? p.productType === activeType
      : true;

    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="text-center py-6 md:py-10 px-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
          Graho Store
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-2">
          Shop Best Online Astrology Products And Services
        </p>
      </div>

      {/* Filters Row */}
      <div className="max-w-7xl mx-auto px-4 mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveType("digital")}
            className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full font-medium border text-xs md:text-sm whitespace-nowrap ${
              activeType === "digital"
                ? "bg-yellow-400 border-yellow-400 text-black"
                : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            Digital Product
          </button>

          <button
            onClick={() => setActiveType("physical")}
            className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full font-medium border text-xs md:text-sm whitespace-nowrap ${
              activeType === "physical"
                ? "bg-yellow-400 border-yellow-400 text-black"
                : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            Physical Product
          </button>
        </div>

        {/* Search */}
        <div className="flex w-full md:w-auto">
          <input
            type="text"
            placeholder="Search Your product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-yellow-400 px-3 md:px-4 py-1.5 md:py-2 rounded-l-full w-full md:w-64 focus:outline-none text-sm md:text-base"
          />
          <button className="bg-yellow-400 px-4 md:px-6 rounded-r-full font-semibold text-xs md:text-sm">
            Search
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8 md:pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : filteredProducts.map((product) => (
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
              ))}
        </div>
      </div>
    </div>
  );
}