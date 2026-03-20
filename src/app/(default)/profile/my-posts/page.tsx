'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageSquare, ThumbsUp, Share2, AlertCircle, CheckCircle, Clock, XCircle, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/atoms/Toast';
import { deleteForumPost, getMyForumPosts, createForumPostAppeal, updateForumPost, type MyForumPost } from '@/store/api/general/forum';

type FilterTab = 'all' | 'active' | 'removed';

export default function MyPostsPage() {
  const { showToast, toastProps, hideToast } = useToast();
  const [posts, setPosts] = useState<MyForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>('all');
  const [appealingPostId, setAppealingPostId] = useState<string | null>(null);
  const [appealMessage, setAppealMessage] = useState('');
  const [submittingAppeal, setSubmittingAppeal] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [updatingPost, setUpdatingPost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getMyForumPosts({ page: 1, limit: 50 });
      setPosts(res.posts);
    } catch (error: any) {
      showToast(error?.message || 'Failed to load your posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const visiblePosts = posts.filter((p) => {
    if (tab === 'active') return p.isActive;
    if (tab === 'removed') return !p.isActive;
    return true;
  });

  const handleSubmitAppeal = async (postId: string) => {
    try {
      setSubmittingAppeal(true);
      const res = await createForumPostAppeal(postId, { message: appealMessage.trim() || undefined });
      showToast(res.message, 'success');
      setAppealingPostId(null);
      setAppealMessage('');
      await fetchPosts();
    } catch (error: any) {
      showToast(error?.message || 'Failed to submit appeal', 'error');
    } finally {
      setSubmittingAppeal(false);
    }
  };

  const handleStartEdit = (post: MyForumPost) => {
    if (!post.isActive) {
      showToast('Removed posts cannot be edited', 'error');
      return;
    }

    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditDescription(post.description);
  };

  const handleUpdatePost = async (postId: string) => {
    try {
      if (!editTitle.trim() || !editDescription.trim()) {
        showToast('Title and description are required', 'error');
        return;
      }

      setUpdatingPost(true);
      const response = await updateForumPost(postId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      showToast(response.message || 'Post updated', 'success');
      setEditingPostId(null);
      await fetchPosts();
    } catch (error: any) {
      showToast(error?.message || 'Failed to update post', 'error');
    } finally {
      setUpdatingPost(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setDeletingPostId(postId);
      const response = await deleteForumPost(postId);
      showToast(response.message || 'Post deleted', 'success');
      if (editingPostId === postId) {
        setEditingPostId(null);
      }
      await fetchPosts();
    } catch (error: any) {
      showToast(error?.message || 'Failed to delete post', 'error');
    } finally {
      setDeletingPostId(null);
    }
  };

  const AppealStatusBadge = ({ appeal }: { appeal: MyForumPost['appeal'] }) => {
    if (!appeal) return null;
    const config = {
      pending: { icon: Clock, text: 'Review Requested', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      approved: { icon: CheckCircle, text: 'Appeal Approved', cls: 'bg-green-50 text-green-700 border-green-200' },
      rejected: { icon: XCircle, text: 'Appeal Rejected', cls: 'bg-red-50 text-red-700 border-red-200' },
    }[appeal.status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.cls}`}>
        <Icon className="h-3.5 w-3.5" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Posts</h1>
        <p className="mt-1 text-sm text-gray-500">Manage all your forum discussions, including removed ones.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {(['all', 'active', 'removed'] as FilterTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
              tab === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-36 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="font-bold text-gray-900">No posts found</p>
          <p className="mt-1 text-sm text-gray-500">
            {tab === 'removed'
              ? 'None of your posts have been removed.'
              : tab === 'active'
              ? 'You have no active posts yet.'
              : 'You haven\'t created any posts yet.'}
          </p>
          {tab !== 'removed' && (
            <Link href="/forum" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600">
              Start a Discussion
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visiblePosts.map((post) => {
            const isRemoved = !post.isActive;
            const canAppeal = isRemoved && !post.appeal;
            const isAppealOpen = appealingPostId === post.id;

            return (
              <div
                key={post.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                  isRemoved ? 'border-red-100 bg-red-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {isRemoved ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                          <AlertCircle className="h-3 w-3" />
                          Removed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </span>
                      )}
                      {post.authorDisplayMode === 'anonymous' && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-500">Anonymous</span>
                      )}
                      <AppealStatusBadge appeal={post.appeal} />
                    </div>

                    <h3 className="mt-2 font-bold text-gray-900 line-clamp-2">{post.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.description}</p>
                    <p className="mt-2 text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>

                    {/* Removal reason */}
                    {isRemoved && (post.moderationReason || post.aiModerationReason) && (
                      <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Removal Reason</p>
                        <p className="mt-1 text-sm text-red-800">
                          {post.moderationReason || post.aiModerationReason}
                        </p>
                        {post.duplicateOfPostUrl && (
                          <Link
                            href={post.duplicateOfPostUrl}
                            className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-red-900 underline underline-offset-2 hover:text-red-700"
                          >
                            Open already-answered thread
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Appeal admin note */}
                    {post.appeal?.adminNote && (
                      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Admin Note</p>
                        <p className="mt-1 text-sm text-gray-700">{post.appeal.adminNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex shrink-0 items-center gap-3 text-xs text-gray-400 sm:flex-col sm:items-end sm:gap-1.5">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" />{post.likeCount}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{post.commentCount}</span>
                    <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5" />{post.shareCount}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {!isRemoved && (
                    <>
                      <Link
                        href={`/forum/${post.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-bold text-gray-700 hover:border-gray-900 hover:text-gray-900"
                      >
                        View Post <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(post)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-bold text-gray-700 hover:border-gray-900 hover:text-gray-900"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletingPostId === post.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deletingPostId === post.id ? 'Deleting...' : 'Delete'}
                  </button>

                  {canAppeal && (
                    <button
                      type="button"
                      onClick={() => { setAppealingPostId(post.id); setAppealMessage(''); }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-1.5 text-sm font-bold text-white hover:bg-amber-600"
                    >
                      Request Review
                    </button>
                  )}
                </div>

                {/* Appeal form */}
                {isAppealOpen && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-bold text-amber-900">Request Admin Review</p>
                    <p className="mt-0.5 text-xs text-amber-700">Explain why you believe this post should be reinstated. This is optional but helps the admin review faster.</p>
                    <textarea
                      rows={3}
                      value={appealMessage}
                      onChange={(e) => setAppealMessage(e.target.value)}
                      placeholder="Briefly explain your case (optional)..."
                      className="mt-3 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={submittingAppeal}
                        onClick={() => handleSubmitAppeal(post.id)}
                        className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-60"
                      >
                        {submittingAppeal ? 'Submitting…' : 'Submit Request'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppealingPostId(null)}
                        className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit form */}
                {editingPostId === post.id && (
                  <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm font-bold text-gray-900">Edit Post</p>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <textarea
                      rows={4}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdatePost(post.id)}
                        disabled={updatingPost}
                        className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-60"
                      >
                        {updatingPost ? 'Saving…' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPostId(null)}
                        className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Toast {...toastProps} onClose={hideToast} />
    </div>
  );
}
