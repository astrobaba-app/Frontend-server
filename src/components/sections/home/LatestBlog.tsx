'use client';
import React, { useEffect, useState } from 'react';
import BlogCard from '@/components/card/BlogCard';
import Link from 'next/link';
import { getAllBlogs, Blog } from '@/store/api/general/blog';

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
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
          
          setLatestBlogs(sortedBlogs);
        }
      } catch (error) {
        console.error('Error fetching latest blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  if (loading) {
    return (
      <section className="mt-6 sm:mt-8 md:mt-10 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-kanit font-bold text-center text-[#171717] mb-8 sm:mb-12 md:mb-16">
            Latest Blogs
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (latestBlogs.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 sm:mt-8 md:mt-10 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-kanit font-bold text-center text-[#171717] mb-8 sm:mb-12 md:mb-16">
          Latest Blogs
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {latestBlogs.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              img={post.image}
              title={post.title}
              author={post.astrologer?.fullName || 'Astrobaba'}
              likes={post.views}
              date={new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          ))}
        </div>

        <div className="py-10 text-center">
          <Link
            href="/blog"
            className="text-lg font-medium font-kanit text-[#171717] border-b-2 border-[#F0DF20] hover:text-amber-600 transition duration-150"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogsSection;