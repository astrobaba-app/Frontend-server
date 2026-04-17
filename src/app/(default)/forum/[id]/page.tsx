'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MessageSquareText, Minus, Plus, Send, Share2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/atoms/Toast';
import ForumAvatar from '@/components/forum/ForumAvatar';
import ForumCommentThread from '@/components/forum/ForumCommentThread';
import ForumReportModal from '@/components/forum/ForumReportModal';
import {
  createForumComment,
  deleteForumComment,
  getForumCommentReplies,
  getForumComments,
  getForumPostById,
  reportForumPost,
  shareForumPost,
  toggleForumPostLike,
  updateForumComment,
  type ForumComment,
  type ForumPost,
} from '@/store/api/general/forum';

export default function ForumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();
  const postId = params.id as string;

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [commentComposerActive, setCommentComposerActive] = useState(false);
  const [submittingTopLevelComment, setSubmittingTopLevelComment] = useState(false);
  const [submittingReplyToId, setSubmittingReplyToId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [viewerZoom, setViewerZoom] = useState(1);
  const isLikeRequestInFlightRef = useRef(false);

  const redirectToLogin = () => {
    router.push(`/auth/login?redirect=/forum/${postId}`);
  };

  const fetchPost = async () => {
    const response = await getForumPostById(postId);
    setPost(response.post);
  };

  const fetchComments = async (page = 1, append = false) => {
    const response = await getForumComments(postId, { page, limit: 12, depthCap: 1 });
    setComments((current) => (append ? [...current, ...response.comments] : response.comments));
    setCommentsPage(response.pagination.page);
    setCommentTotalPages(response.pagination.totalPages);
  };

  const handleLoadReplies = async (parentCommentId: string, offset: number, limit = 8) => {
    const response = await getForumCommentReplies(postId, parentCommentId, { offset, limit });
    return {
      replies: response.replies,
      hasMore: response.pagination.hasMore,
    };
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchPost(), fetchComments(1)]);
      } catch (error: any) {
        showToast(error?.message || 'Failed to load discussion', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      load();
    }
  }, [postId]);

  useEffect(() => {
    if (!viewerImage) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setViewerImage(null);
        setViewerZoom(1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewerImage]);

  const openImageViewer = (imageUrl: string) => {
    setViewerImage(imageUrl);
    setViewerZoom(1);
  };

  const closeImageViewer = () => {
    setViewerImage(null);
    setViewerZoom(1);
  };

  const handleZoomIn = () => {
    setViewerZoom((current) => Math.min(current + 0.25, 3));
  };

  const handleZoomOut = () => {
    setViewerZoom((current) => Math.max(current - 0.25, 0.5));
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    if (!post) {
      return;
    }

    if (isLikeRequestInFlightRef.current) {
      return;
    }

    const previousLikeState = {
      likeCount: post.likeCount,
      isLikedByCurrentUser: post.isLikedByCurrentUser,
    };
    const nextIsLiked = !post.isLikedByCurrentUser;

    setPost((currentPost) =>
      currentPost
        ? {
            ...currentPost,
            isLikedByCurrentUser: nextIsLiked,
            likeCount: Math.max(0, currentPost.likeCount + (nextIsLiked ? 1 : -1)),
          }
        : currentPost,
    );

    isLikeRequestInFlightRef.current = true;

    try {
      const response = await toggleForumPostLike(post.id);
      setPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              likeCount: response.likeCount,
              isLikedByCurrentUser: response.isLiked,
            }
          : currentPost,
      );
    } catch (error: any) {
      setPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              likeCount: previousLikeState.likeCount,
              isLikedByCurrentUser: previousLikeState.isLikedByCurrentUser,
            }
          : currentPost,
      );
      showToast(error?.message || 'Failed to update like', 'error');
    } finally {
      isLikeRequestInFlightRef.current = false;
    }
  };

  const handleShare = async () => {
    if (!post) {
      return;
    }

    try {
      const shareUrl = `${window.location.origin}/forum/${post.id}`;
      if (navigator.share) {
        await navigator.share({ url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }

      const response = await shareForumPost(post.id);
      setPost({
        ...post,
        shareCount: response.shareCount,
      });
      showToast('Discussion link shared', 'success');
    } catch {
      showToast('Unable to share this discussion', 'error');
    }
  };

  const handleCommentSubmit = async (parentCommentId?: string, content?: string) => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    const finalContent = parentCommentId ? content || '' : commentContent;
    if (!finalContent.trim()) {
      return;
    }

    let isReplySubmission = Boolean(parentCommentId);

    try {
      if (parentCommentId) {
        setSubmittingReplyToId(parentCommentId);
      } else {
        setSubmittingTopLevelComment(true);
      }

      await createForumComment(postId, {
        content: finalContent.trim(),
        parentCommentId,
      });
      if (!parentCommentId) {
        setCommentContent('');
        setSubmittingTopLevelComment(false);
      } else {
        setSubmittingReplyToId(null);
      }

      await Promise.all([fetchPost(), fetchComments(1)]);
      showToast(parentCommentId ? 'Reply added' : 'Comment posted', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Failed to post comment', 'error');
    } finally {
      if (isReplySubmission) {
        setSubmittingReplyToId(null);
      } else {
        setSubmittingTopLevelComment(false);
      }
    }
  };

  const handleSubmitReport = async (payload: { reason: any; details?: string }) => {
    if (!post) {
      return;
    }

    try {
      setSubmittingReport(true);
      const response = await reportForumPost(post.id, payload);
      showToast(response.message, 'success');
      setReportModalOpen(false);
    } catch (error: any) {
      showToast(error?.message || 'Failed to submit report', 'error');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      setEditingCommentId(commentId);
      const response = await updateForumComment(postId, commentId, { content });
      await Promise.all([fetchPost(), fetchComments(1)]);
      showToast(response.message || 'Comment updated', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Failed to update comment', 'error');
    } finally {
      setEditingCommentId(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeletingCommentId(commentId);
      const response = await deleteForumComment(postId, commentId);
      await Promise.all([fetchPost(), fetchComments(1)]);
      showToast(response.message || 'Comment deleted', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Failed to delete comment', 'error');
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen animate-pulse bg-[#f7f4ed]" />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f7f4ed] px-4 py-16 text-center">
        <p className="text-lg font-bold text-gray-900">Discussion not found</p>
        <Link href="/forum" className="mt-4 inline-flex rounded-full bg-gray-900 px-5 py-3 text-sm font-black text-white">
          Back to Forum
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ed] pb-14">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/forum" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Forum
        </Link>

        <article className="mt-6 rounded-none border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-3">
              <ForumAvatar name={post.authorName} seed={post.authorAvatarSeed} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-black text-gray-900">{post.authorName}</p>
                  {post.authorDisplayMode === 'anonymous' && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                      Anonymous
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-500">
              <span className="rounded-full bg-gray-100 px-3 py-2">{post.likeCount} likes</span>
              <span className="rounded-full bg-gray-100 px-3 py-2">{post.commentCount} comments</span>
              <span className="rounded-full bg-gray-100 px-3 py-2">{post.shareCount} shares</span>
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-black leading-tight text-gray-900 sm:text-4xl">{post.title}</h1>
          <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-gray-700">{post.description}</p>

          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {post.images.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {post.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => openImageViewer(image)}
                  className="overflow-hidden rounded-none"
                >
                  <img
                    src={image}
                    alt={`${post.title} ${index + 1}`}
                    className="h-72 w-full cursor-zoom-in object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition ${
                post.isLikedByCurrentUser ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`h-4 w-4 ${post.isLikedByCurrentUser ? 'fill-current' : ''}`} />
              Like
            </button>
            <button type="button" onClick={handleShare} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            {isLoggedIn && user?.id !== post.authorUserId && (
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-100"
              >
                Report
              </button>
            )}
          </div>
        </article>

        <section className="mt-8 rounded-none border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400">Comments</p>
              <h2 className="mt-2 text-2xl font-black text-gray-900">Threaded discussion</h2>
            </div>
            <div className="rounded-full bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600">
              Posting as {user?.forumIdentityMode === 'anonymous' ? user?.forumAnonymousHandle || 'Anonymous' : 'your profile'}
            </div>
          </div>

          <div className="mt-6">
            <textarea
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              onFocus={() => {
                if (!isLoggedIn) {
                  redirectToLogin();
                  return;
                }
                setCommentComposerActive(true);
              }}
              rows={3}
              placeholder="Join the conversation"
              className="w-full rounded-none border border-gray-200 bg-white px-4 py-4 text-sm text-gray-700 outline-none focus:border-gray-300"
            />

            {(commentComposerActive || commentContent.trim()) && (
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCommentContent('');
                    setCommentComposerActive(false);
                  }}
                  disabled={submittingTopLevelComment}
                  className="inline-flex items-center rounded-full bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleCommentSubmit()}
                  disabled={submittingTopLevelComment || !commentContent.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {submittingTopLevelComment ? 'Posting...' : 'Comment'}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {comments.length === 0 ? (
              <div className="rounded-none border border-dashed border-gray-300 px-6 py-10 text-center text-sm text-gray-500">
                No comments yet. Start the first thread.
              </div>
            ) : (
              comments.map((comment) => (
                <ForumCommentThread
                  key={comment.id}
                  comment={comment}
                  onReply={(parentCommentId, content) => handleCommentSubmit(parentCommentId, content)}
                  onLoadReplies={handleLoadReplies}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                  replyingCommentId={submittingReplyToId}
                  editingCommentId={editingCommentId}
                  deletingCommentId={deletingCommentId}
                  currentUserId={user?.id}
                  isLoggedIn={isLoggedIn}
                  onRequireAuth={redirectToLogin}
                />
              ))
            )}
          </div>

          {commentsPage < commentTotalPages && (
            <button
              type="button"
              onClick={() => fetchComments(commentsPage + 1, true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
            >
              <MessageSquareText className="h-4 w-4" />
              Load More Threads
            </button>
          )}
        </section>
      </div>

      {viewerImage && (
        <div className="fixed inset-0 z-80 bg-black/80 p-4 sm:p-8" onClick={closeImageViewer}>
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="rounded-full bg-white/90 p-2 text-gray-800 transition hover:bg-white"
                  aria-label="Zoom out"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="rounded-full bg-white/90 p-2 text-gray-800 transition hover:bg-white"
                  aria-label="Zoom in"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewerZoom(1)}
                  className="rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-gray-800 transition hover:bg-white"
                >
                  {Math.round(viewerZoom * 100)}%
                </button>
              </div>

              <button
                type="button"
                onClick={closeImageViewer}
                className="rounded-full bg-white/90 p-2 text-gray-800 transition hover:bg-white"
                aria-label="Close image viewer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-2xl bg-black/35">
              <img
                src={viewerImage}
                alt="Forum post image"
                className="max-h-full max-w-full origin-center object-contain transition-transform duration-200"
                style={{ transform: `scale(${viewerZoom})` }}
              />
            </div>
          </div>
        </div>
      )}

      <Toast {...toastProps} onClose={hideToast} />
      <ForumReportModal
        isOpen={reportModalOpen}
        postTitle={post?.title || ''}
        submitting={submittingReport}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
}