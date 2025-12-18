"use client";

import React, { useEffect, useState } from "react";

import BlogCard from "@/components/card/BlogCard";

import Link from "next/link";

import { getAllBlogs, Blog } from "@/store/api/general/blog";

const LatestBlogsSection: React.FC = () => {
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);

        const response = await getAllBlogs();

        if (response.success && response.blogs) {
          const sortedBlogs = response.blogs

            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )

            .slice(0, 3); // Changed from 6 to 3 to show only the latest three

          setLatestBlogs(sortedBlogs);
        }
      } catch (error) {
        console.error("Error fetching latest blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 bg-gray-200 animate-pulse mx-auto mb-12 rounded" />

          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[280px] sm:min-w-[350px] lg:min-w-0 lg:flex-1 animate-pulse"
              >
                <div className="bg-gray-200 h-48 rounded-2xl mb-4"></div>

                <div className="bg-gray-200 h-4 rounded mb-2"></div>

                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (latestBlogs.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}

        <div className="px-4 sm:px-6 lg:px-8 mb-8 flex items-end justify-between">
          <h2 className="text-3xl sm:text-3xl md:text-4xl font-kanit font-bold text-[#171717]">
            Latest Blogs
          </h2>

          <Link
            href="/blog"
            className="hidden sm:block text-sm font-medium text-[#171717] border-b-2 border-[#F0DF20] hover:text-amber-600 transition"
          >
            View All
          </Link>
        </div>

        {/* Container handles:

            - Mobile: Single row horizontal scroll (snap-center)

            - Desktop: 3-column static grid 

        */}

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex lg:grid overflow-x-auto lg:overflow-x-visible space-x-5 lg:space-x-0 lg:grid-cols-3 lg:gap-8 pb-6 lg:pb-0 scrollbar-hide snap-x snap-mandatory">
            {latestBlogs.map((post) => (
              <div
                key={post.id}
                className="min-w-[85%] sm:min-w-[45%] lg:min-w-full snap-center"
              >
                <BlogCard
                  id={post.id}
                  img={post.image}
                  title={post.title}
                  author={post.astrologer?.fullName || "Astrobaba"}
                  likes={post.views}
                  date={new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",

                    month: "long",

                    day: "numeric",
                  })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View All Button */}

        <div className="mt-8 flex justify-center text-center sm:hidden px-4">
          <Link
            href="/blog"
            className="block text-sm font-medium text-[#171717] border-b-2 border-[#F0DF20] hover:text-amber-600 transition"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogsSection;
