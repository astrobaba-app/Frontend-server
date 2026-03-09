'use client';

import React, { useState, useEffect } from 'react';
import { getAllBlogs, Blog } from '@/store/api/general/blog';
import { colors } from '@/utils/colors';
import BlogCard from '@/components/card/BlogCard';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Love & Relationships', label: 'Love' },
  { id: 'Kundli & Birth Chart', label: 'Kundli' },
  { id: 'Zodiac Signs', label: 'Zodiac Sign' },
  { id: 'Spirituality', label: 'Spirituality' },
  { id: 'Tarot & Divination', label: 'Tarot' },
  { id: 'Palm Reading', label: 'Palm Reading' },
  { id: 'Vedic Astrology', label: 'Vedic Astrology' },
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
      setFilteredBlogs(blogs.filter((blog) => blog.category === selectedCategory));
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

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'text-gray-900 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selectedCategory === cat.id ? { backgroundColor: colors.primeYellow } : {}}
              >
                {cat.label}
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
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-4 text-sm font-medium underline"
                style={{ color: colors.primeYellow }}
              >
                View all blogs
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((blog) => {
              const coverImage =
                blog.images && blog.images.length > 0 ? blog.images[0] : blog.image;
              const authorName =
                blog.astrologer?.fullName || blog.admin?.name || 'Graho Team';
              return (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  img={coverImage}
                  title={blog.title}
                  author={authorName}
                  likes={blog.views}
                  category={blog.category}
                  date={new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
