'use client';

import React from 'react';
import Link from 'next/link';
import { Flag, Heart, MessageSquareText, Share2 } from 'lucide-react';
import ForumAvatar from './ForumAvatar';
import type { ForumPost } from '@/store/api/general/forum';

export default function ForumFeedCard({
  post,
  onLike,
  onShare,
  onReport,
  canReport = false,
}: {
  post: ForumPost;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onReport?: (post: ForumPost) => void;
  canReport?: boolean;
}) {
  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <ForumAvatar name={post.authorName} seed={post.authorAvatarSeed} />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900">{post.authorName}</p>
              {post.authorDisplayMode === 'anonymous' && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                  Anonymous
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <p className="text-xs font-semibold text-gray-400">{post.commentCount} replies</p>
      </div>

      <Link href={`/forum/${post.id}`} className="mt-5 block">
        <h3 className="text-xl font-black leading-tight text-gray-900">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-600">{post.description}</p>
      </Link>

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {post.images.length > 0 && (
        <Link href={`/forum/${post.id}`} className="mt-4 block overflow-hidden rounded-3xl border border-gray-100">
          <img src={post.images[0]} alt={post.title} className="h-64 w-full object-cover" />
        </Link>
      )}

      <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 text-sm font-semibold text-gray-600">
        <button
          type="button"
          onClick={() => onLike(post.id)}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${
            post.isLikedByCurrentUser ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-100'
          }`}
        >
          <Heart className={`h-4 w-4 ${post.isLikedByCurrentUser ? 'fill-current' : ''}`} />
          {post.likeCount}
        </button>
        <Link href={`/forum/${post.id}`} className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-gray-100">
          <MessageSquareText className="h-4 w-4" />
          {post.commentCount}
        </Link>
        <button type="button" onClick={() => onShare(post.id)} className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-gray-100">
          <Share2 className="h-4 w-4" />
          {post.shareCount}
        </button>
        {canReport && onReport && (
          <button type="button" onClick={() => onReport(post)} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-red-600 hover:bg-red-50">
            <Flag className="h-4 w-4" />
            Report
          </button>
        )}
      </div>
    </article>
  );
}