'use client';

import React, { useState, useEffect } from 'react';
import { getAllBlogs, Blog } from '@/store/api/general/blog';
import { colors } from '@/utils/colors';
import BlogCard from '@/components/card/BlogCard';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'love', label: 'Love', icon: '❤️' },
  { id: 'kundli', label: 'Kundli', icon: '🔮' },
  { id: 'zodiac', label: 'Zodiac Sign', icon: '♈' },
  { id: 'spirituality', label: 'Spirituality', icon: '🕉️' },
  { id: 'tarot', label: 'Tarot', icon: '🃏' },
  { id: 'palm', label: 'Palm Reading', icon: '🖐️' },
  { id: 'vedic', label: 'Vedic Astrology', icon: '📿' },
];

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getAllBlogs();
        if (response.success && response.blogs) {
          setBlogs(response.blogs);
          setFilteredBlogs(response.blogs);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredBlogs(blogs);
    } else {
      // For now, show all blogs since we don't have category field
      // In future, filter by: blogs.filter(blog => blog.category === selectedCategory)
      setFilteredBlogs(blogs);
    }
  }, [selectedCategory, blogs]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2" style={{ color: colors.darkGray }}>
            Latest Blogs
          </h1>
          <p className="text-center text-gray-600">
            Explore insightful articles on astrology, spirituality, and cosmic wisdom
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === category.id
                    ? 'text-gray-900 shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
                style={
                  selectedCategory === category.id
                    ? { backgroundColor: colors.primeYellow }
                    : {}
                }
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No blogs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                img={blog.image}
                title={blog.title}
                author={blog.astrologer?.fullName || 'Astrobaba'}
                likes={blog.views}
                date={new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
