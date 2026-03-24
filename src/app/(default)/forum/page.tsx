'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Filter, PenLine, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/atoms/Toast';
import ForumComposer from '@/components/forum/ForumComposer';
import ForumFeedCard from '@/components/forum/ForumFeedCard';
import ForumReportModal from '@/components/forum/ForumReportModal';
import { updateProfile } from '@/store/api/auth/profile';
import {
  createForumPost,
  getForumPosts,
  reportForumPost,
  shareForumPost,
  toggleForumPostLike,
  type ForumIdentityMode,
  type ForumPost,
} from '@/store/api/general/forum';

const SORT_OPTIONS: Array<{ key: 'newest' | 'oldest' | 'top-liked' | 'most-commented'; label: string }> = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'top-liked', label: 'Top Liked' },
  { key: 'most-commented', label: 'Most Commented' },
];

export default function ForumPage() {
  const router = useRouter();
  const { user, isLoggedIn, refreshUser } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'newest' | 'oldest' | 'top-liked' | 'most-commented'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [reportingPost, setReportingPost] = useState<ForumPost | null>(null);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [identityMode, setIdentityMode] = useState<ForumIdentityMode>(user?.forumIdentityMode || 'real');
  const [updatingIdentity, setUpdatingIdentity] = useState(false);

  useEffect(() => {
    setIdentityMode(user?.forumIdentityMode || 'real');
  }, [user?.forumIdentityMode]);

  const redirectToLogin = () => {
    router.push('/auth/login?redirect=/forum');
  };

  const fetchPosts = async (nextPage = 1, append = false, nextSort = sort) => {
    try {
      setLoading(!append);
      const response = await getForumPosts({ page: nextPage, limit: 10, sort: nextSort });
      setPosts((currentPosts) => (append ? [...currentPosts, ...response.posts] : response.posts));
      setPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      showToast(error?.message || 'Failed to load forum', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, false, sort);
  }, [sort]);

  const handleCreatePost = async (payload: {
    title: string;
    description: string;
    tags: string[];
    images: File[];
  }) => {
    try {
      setSubmitting(true);
      const response = await createForumPost(payload);
      showToast(response.message, 'success');
      setComposerOpen(false);

      if (sort === 'newest') {
        setPosts((currentPosts) => [response.post, ...currentPosts]);
      } else {
        await fetchPosts(1, false, sort);
      }
    } catch (error: any) {
      showToast(error?.message || 'Failed to create post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    try {
      const response = await toggleForumPostLike(postId);
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likeCount: response.likeCount,
                isLikedByCurrentUser: response.isLiked,
              }
            : post,
        ),
      );
    } catch (error: any) {
      showToast(error?.message || 'Failed to update like', 'error');
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const shareUrl = `${window.location.origin}/forum/${postId}`;
      if (navigator.share) {
        await navigator.share({ url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }

      const response = await shareForumPost(postId);
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                shareCount: response.shareCount,
              }
            : post,
        ),
      );
      showToast('Discussion link shared', 'success');
    } catch {
      showToast('Unable to share this discussion', 'error');
    }
  };

  const handleOpenReport = (post: ForumPost) => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    setReportingPost(post);
  };

  const handleIdentitySwitch = async (mode: ForumIdentityMode) => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    if (mode === identityMode) {
      return;
    }

    const previousMode = identityMode;
    setIdentityMode(mode);
    setUpdatingIdentity(true);

    try {
      await updateProfile({ forumIdentityMode: mode });
      await refreshUser();
      showToast(`Switched to ${mode === 'anonymous' ? 'Anonymous' : 'Real'} identity`, 'success');
    } catch (error: any) {
      setIdentityMode(previousMode);
      showToast(error?.message || 'Failed to switch identity', 'error');
    } finally {
      setUpdatingIdentity(false);
    }
  };

  const handleSubmitReport = async (payload: { reason: any; details?: string }) => {
    if (!reportingPost) {
      return;
    }

    try {
      setSubmittingReport(true);
      const response = await reportForumPost(reportingPost.id, payload);
      showToast(response.message, 'success');
      setReportingPost(null);
    } catch (error: any) {
      showToast(error?.message || 'Failed to submit report', 'error');
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] pb-14">
      <div className="border-b border-[#eadfc8] bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.28),transparent_40%),linear-gradient(180deg,#fffaf0,#f7f4ed)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-700">Community Forum</p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
                Threaded conversations for questions, insights, and shared experiences.
              </h1>
              <p className="mt-4 text-base leading-8 text-gray-600 sm:text-lg">
                Post with your name or your anonymous identity, browse trending discussions, and follow deep reply chains without losing structure.
              </p>
            </div>

  
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="order-2 space-y-6 lg:order-1">
          {/* Sort + filter bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.22em] text-gray-400">
              <Filter className="h-3.5 w-3.5" />
              Sort
            </div>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSort(option.key)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  sort === option.key ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                {option.label}
              </button>
            ))}

            <div className="ml-1 h-6 w-px bg-gray-300" />

            <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 p-1">
              <span className="px-2 text-[11px] font-black uppercase tracking-[0.12em] text-amber-700">Anonymous Mode</span>
              <button
                type="button"
                disabled={updatingIdentity}
                onClick={() => handleIdentitySwitch('real')}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  identityMode === 'real' ? 'bg-amber-500 text-white' : 'text-amber-700 hover:bg-amber-100'
                } ${updatingIdentity ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                OFF
              </button>
              <button
                type="button"
                disabled={updatingIdentity}
                onClick={() => handleIdentitySwitch('anonymous')}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  identityMode === 'anonymous' ? 'bg-amber-500 text-white' : 'text-amber-700 hover:bg-amber-100'
                } ${updatingIdentity ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                ON
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-64 animate-pulse rounded-3xl bg-white" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-lg font-bold text-gray-900">No discussions yet</p>
              <p className="mt-2 text-sm text-gray-500">The first question sets the tone for the community.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <ForumFeedCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onShare={handleShare}
                  onReport={handleOpenReport}
                  canReport={Boolean(isLoggedIn && user?.id && user.id !== post.authorUserId)}
                />
              ))}
            </div>
          )}

          {!loading && page < totalPages && (
            <button
              type="button"
              onClick={() => fetchPosts(page + 1, true)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
            >
              Load More
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <aside className="order-1 space-y-4 lg:order-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">Posting Rules</p>
              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) { redirectToLogin(); return; }
                  setComposerOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-black text-white transition hover:bg-amber-600"
              >
                <PenLine className="h-3.5 w-3.5" />
                Create Question
              </button>
            </div>
            <ol className="mt-4 list-inside list-decimal space-y-3 text-sm leading-7 text-gray-600">
              <li>Post only astrology-related topics (kundli, horoscope, remedies, readings, or astrologer experiences).</li>
              <li>Keep titles clear and specific so other users can understand your question quickly.</li>
              <li>Use relevant tags (up to 8) to help your thread appear in the right category.</li>
              <li>Upload only valid images (JPG, PNG, WEBP, GIF), max 5 images, and keep each under 5MB.</li>
              <li>No abuse, hate, sexual content, violent threats, scams, or spam links.</li>
              <li>Anonymous mode hides your identity for future posts/comments; previous content keeps its original mode.</li>
              <li>Use Report for violations—repeated policy breaks can cause temporary blocks or permanent forum ban.</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-700">Identity Mode</p>
            <p className="mt-3 text-sm leading-7 text-amber-900">
              Switch between real identity and anonymous mode from your profile settings. Anonymous interactions keep their alias permanently.
            </p>
          </div>
        </aside>
      </div>

      {/* Composer modal */}
      {composerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setComposerOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-400 shadow hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <ForumComposer
              isLoggedIn={isLoggedIn}
              identityMode={identityMode}
              anonymousHandle={user?.forumAnonymousHandle}
              onSubmit={handleCreatePost}
              onRequireAuth={redirectToLogin}
              submitting={submitting}
            />
          </div>
        </div>
      )}

      <Toast {...toastProps} onClose={hideToast} />
      <ForumReportModal
        isOpen={Boolean(reportingPost)}
        postTitle={reportingPost?.title || ''}
        submitting={submittingReport}
        onClose={() => setReportingPost(null)}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
}