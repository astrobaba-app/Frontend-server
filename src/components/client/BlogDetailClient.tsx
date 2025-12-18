'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiHeart, FiEye, FiCalendar } from 'react-icons/fi';
import { Blog, toggleBlogLike } from '@/store/api/general/blog';
import { colors } from '@/utils/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/atoms/Toast';

interface BlogDetailClientProps {
  blog: Blog;
}

export default function BlogDetailClient({ blog: initialBlog }: BlogDetailClientProps) {
  const [blog, setBlog] = useState(initialBlog);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(blog.isLikedByUser || false);
  const { isLoggedIn } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  // Track view increment to prevent multiple API calls
  useEffect(() => {
    const viewedBlogs = JSON.parse(sessionStorage.getItem('viewedBlogs') || '[]');
    if (!viewedBlogs.includes(blog.id)) {
      viewedBlogs.push(blog.id);
      sessionStorage.setItem('viewedBlogs', JSON.stringify(viewedBlogs));
    }
  }, [blog.id]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      showToast('Please login to like this blog', 'error');
      return;
    }

    if (hasLiked) {
      return; // Already liked, do nothing
    }

    setIsLiking(true);
    try {
      const response = await toggleBlogLike(blog.id);
      if (response.success) {
        setBlog({ ...blog, likes: response.likes });
        setHasLiked(true);
        showToast('Blog liked successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to like blog', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="">
      {/* Back Button */}
      
          <Link
            href="/blog"
            className="inline-flex mt-5 ms-10 items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Blogs</span>
          </Link>
        

      {/* Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 md:p-12">
            {/* Author Info & Meta */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {blog.astrologer?.photo ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-yellow-200">
                    <img
                      src={blog.astrologer.photo}
                      alt={blog.astrologer.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-yellow-200 to-yellow-300 flex items-center justify-center ring-2 ring-yellow-200">
                    <span className="text-2xl font-bold text-gray-700">
                      {blog.astrologer?.fullName?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.darkGray }}>
                    {blog.astrologer?.fullName || 'Astrobaba'}
                  </p>
                  {blog.astrologer && (
                    <p className="text-sm text-gray-600">
                      {blog.astrologer.yearsOfExperience} years experience
                    </p>
                  )}
                </div>
              </div>

              {/* Like Button - Only show for logged-in users */}
              {isLoggedIn && (
                <button
                  onClick={handleLike}
                  disabled={isLiking || hasLiked}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all ${
                    hasLiked
                      ? 'bg-red-100 text-red-600 cursor-not-allowed'
                      : 'hover:scale-105 shadow-md'
                  }`}
                  style={
                    !hasLiked
                      ? {
                          backgroundColor: colors.primeYellow,
                          color: colors.darkGray,
                        }
                      : {}
                  }
                >
                  <FiHeart className={`w-5 h-5 ${hasLiked ? 'fill-red-600' : ''}`} style={hasLiked ? { fill: '#dc2626' } : {}} />
                  <span>{blog.likes}</span>
                </button>
              )}
            </div>

            {/* Title */}
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: colors.darkGray }}>
              {blog.title}
            </p>

            {/* Date & Views */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                <span className="text-sm">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiEye className="w-5 h-5" />
                <span className="text-sm">{blog.views} views</span>
              </div>
            </div>

            {/* Description/Content */}
            <div
              className="prose prose-lg max-w-none"
              style={{ color: colors.gray }}
            >
              <div className="text-justify leading-relaxed whitespace-pre-wrap">
                {blog.description}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-3" style={{ color: colors.darkGray }}>
                  Want Personalized Guidance?
                </h3>
                <p className="text-gray-600 mb-6">
                  Connect with our expert astrologers for personalized consultations
                </p>
                <Link
                  href="/astrologer?mode=chat"
                  className="inline-block px-8 py-3 rounded-full font-semibold text-gray-900 shadow-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: colors.primeYellow }}
                >
                  Talk to Astrologer
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
