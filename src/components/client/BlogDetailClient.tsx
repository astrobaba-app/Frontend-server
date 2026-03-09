'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiEye, FiCalendar } from 'react-icons/fi';
import { Blog } from '@/store/api/general/blog';
import { colors } from '@/utils/colors';

interface BlogDetailClientProps {
  blog: Blog;
}

// ─── Structured Content Renderer ────────────────────────────────────────────
interface ContentBlock {
  id?: string;
  type: 'heading2' | 'heading3' | 'paragraph' | 'bullets' | 'quote' | 'image';
  content?: string;
  items?: string[];
  imageUrl?: string;
}

function renderStructuredContent(description: string) {
  try {
    const blocks: ContentBlock[] = JSON.parse(description);
    if (!Array.isArray(blocks)) throw new Error('Not an array');

    return (
      <div className="space-y-4">
        {blocks.map((block, i) => {
          if (block.type === 'heading2') {
            return (
              <h2 key={i} className="text-xl sm:text-2xl font-bold mt-6 mb-3" style={{ color: colors.darkGray }}>
                {block.content}
              </h2>
            );
          }
          if (block.type === 'heading3') {
            return (
              <h3 key={i} className="text-lg sm:text-xl font-semibold mt-5 mb-2" style={{ color: colors.darkGray }}>
                {block.content}
              </h3>
            );
          }
          if (block.type === 'quote') {
            return (
              <blockquote
                key={i}
                className="border-l-4 pl-5 py-2 italic my-4 rounded-r-lg bg-yellow-50"
                style={{ borderColor: colors.primeYellow, color: colors.gray }}
              >
                {block.content}
              </blockquote>
            );
          }
          if (block.type === 'bullets') {
            return (
              <ul key={i} className="space-y-2 my-4 pl-2">
                {(block.items || []).filter(Boolean).map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span
                      className="w-2 h-2 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: colors.primeYellow }}
                    />
                    <span className="leading-relaxed" style={{ color: colors.gray }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            );
          }
          if (block.type === 'image' && block.imageUrl) {
            return (
              <div key={i} className="my-6 rounded-xl overflow-hidden">
                <img
                  src={block.imageUrl}
                  alt=""
                  className="w-full max-h-[500px] object-contain bg-gray-50 rounded-xl"
                />
              </div>
            );
          }
          // 'paragraph' or fallback
          return (
            <p key={i} className="leading-relaxed text-justify" style={{ color: colors.gray }}>
              {block.content}
            </p>
          );
        })}
      </div>
    );
  } catch {
    // Fallback: plain text for legacy astrologer blogs
    return (
      <div className="leading-relaxed whitespace-pre-wrap text-justify" style={{ color: colors.gray }}>
        {description}
      </div>
    );
  }
}

export default function BlogDetailClient({ blog: initialBlog }: BlogDetailClientProps) {
  const [blog] = useState(initialBlog);

  // Track view in sessionStorage to avoid UI weirdness on revisits
  useEffect(() => {
    const viewedBlogs = JSON.parse(sessionStorage.getItem('viewedBlogs') || '[]');
    if (!viewedBlogs.includes(blog.id)) {
      viewedBlogs.push(blog.id);
      sessionStorage.setItem('viewedBlogs', JSON.stringify(viewedBlogs));
    }
  }, [blog.id]);

  const coverImage =
    blog.images && blog.images.length > 0 ? blog.images[0] : blog.image;

  const authorName = blog.astrologer?.fullName || blog.admin?.name || 'Graho Team';
  const authorPhoto = blog.astrologer?.photo || null;
  const authorInitial = authorName.charAt(0).toUpperCase();
  const isAdmin = !blog.astrologer && (blog.admin || blog.adminId);

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
          {coverImage && (
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
              <img
                src={coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8 md:p-12">
            {/* Category Badge */}
            {blog.category && (
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: colors.offYellow || '#FCF5CC', color: colors.darkGray }}
              >
                {blog.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: colors.darkGray }}>
              {blog.title}
            </h1>

            {/* Author Info & Meta */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {authorPhoto ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-yellow-200">
                    <img src={authorPhoto} alt={authorName} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-yellow-200 text-xl font-bold text-gray-700"
                    style={{ backgroundColor: colors.creamyYellow || '#FFE07B' }}
                  >
                    {authorInitial}
                  </div>
                )}
                <div>
                  <p className="font-bold" style={{ color: colors.darkGray }}>
                    {authorName}
                  </p>
                  {blog.astrologer?.yearsOfExperience && (
                    <p className="text-sm text-gray-500">
                      {blog.astrologer.yearsOfExperience} years experience
                    </p>
                  )}
                  {isAdmin && (
                    <p className="text-xs text-gray-500">Graho Editorial Team</p>
                  )}
                </div>
              </div>

              {/* Date & Views */}
              <div className="flex items-center gap-5 text-gray-500">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiEye className="w-4 h-4" />
                  <span className="text-sm">{blog.views} views</span>
                </div>
              </div>
            </div>

            {/* Structured Blog Content */}
            <div className="prose prose-lg max-w-none">
              {renderStructuredContent(blog.description)}
            </div>

            {/* Additional Images Gallery (if multiple) */}
            {blog.images && blog.images.length > 1 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.darkGray }}>
                  Images
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {blog.images.slice(1).map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden h-40">
                      <img src={img} alt={`${blog.title} ${i + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #FCF5CC, #fff7e0)' }}>
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
    </div>
  );
}


