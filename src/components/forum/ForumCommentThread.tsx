'use client';

import React, { useEffect, useState } from 'react';
import { CornerDownRight, Pencil, Send, Trash2 } from 'lucide-react';
import type { ForumComment } from '@/store/api/general/forum';
import ForumAvatar from './ForumAvatar';

export default function ForumCommentThread({
  comment,
  onReply,
  onLoadReplies,
  onEditComment,
  onDeleteComment,
  replyingCommentId,
  editingCommentId,
  deletingCommentId,
  currentUserId,
  isLoggedIn,
  onRequireAuth,
}: {
  comment: ForumComment;
  onReply: (parentCommentId: string, content: string) => Promise<void>;
  onLoadReplies: (
    parentCommentId: string,
    offset: number,
    limit?: number,
  ) => Promise<{ replies: ForumComment[]; hasMore: boolean }>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  replyingCommentId: string | null;
  editingCommentId: string | null;
  deletingCommentId: string | null;
  currentUserId?: string;
  isLoggedIn: boolean;
  onRequireAuth: () => void;
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showEditBox, setShowEditBox] = useState(false);
  const [editContent, setEditContent] = useState(comment.content || '');
  const [visibleReplies, setVisibleReplies] = useState<ForumComment[]>(comment.replies || []);
  const [hasMoreReplies, setHasMoreReplies] = useState(Boolean(comment.hasMoreReplies));
  const [loadingMoreReplies, setLoadingMoreReplies] = useState(false);
  const isReplyAllowed = !comment.isRemovedByModerator;
  const isCommentDeleted = Boolean(comment.isDeletedByAuthor);
  const isOwner = Boolean(currentUserId && comment.authorUserId === currentUserId);
  const isSubmittingThisReply = replyingCommentId === comment.id;
  const isEditingThisComment = editingCommentId === comment.id;
  const isDeletingThisComment = deletingCommentId === comment.id;

  useEffect(() => {
    setVisibleReplies(comment.replies || []);
    setHasMoreReplies(Boolean(comment.hasMoreReplies));
    setEditContent(comment.content || '');
  }, [comment.id, comment.replies, comment.hasMoreReplies]);

  const handleReplySubmit = async () => {
    if (!isReplyAllowed) {
      return;
    }

    if (!isLoggedIn) {
      onRequireAuth();
      return;
    }

    if (!replyContent.trim()) {
      return;
    }

    await onReply(comment.id, replyContent.trim());
    setReplyContent('');
    setShowReplyBox(false);
  };

  const handleLoadMoreReplies = async () => {
    if (loadingMoreReplies) {
      return;
    }

    try {
      setLoadingMoreReplies(true);
      const response = await onLoadReplies(comment.id, visibleReplies.length, 8);

      setVisibleReplies((current) => {
        const existingIds = new Set(current.map((item) => item.id));
        const incoming = response.replies.filter((item) => !existingIds.has(item.id));
        return [...current, ...incoming];
      });
      setHasMoreReplies(response.hasMore);
    } finally {
      setLoadingMoreReplies(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) {
      return;
    }

    await onEditComment(comment.id, editContent.trim());
    setShowEditBox(false);
  };

  const handleDelete = async () => {
    await onDeleteComment(comment.id);
    setShowEditBox(false);
  };

  return (
    <div className="py-2">
      <div className="flex items-start gap-3">
        <ForumAvatar name={comment.authorName} seed={comment.authorAvatarSeed} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-gray-900">{comment.authorName}</p>
            {comment.authorDisplayMode === 'anonymous' && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                Anonymous
              </span>
            )}
            <p className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-gray-700">{comment.content}</p>
          {comment.isEdited && !comment.isDeletedByAuthor && !comment.isRemovedByModerator && (
            <p className="mt-1 text-[11px] font-semibold text-gray-400">Edited</p>
          )}
          {isReplyAllowed && (
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  onRequireAuth();
                  return;
                }
                setShowReplyBox((value) => !value);
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
            >
              <CornerDownRight className="h-4 w-4" />
              Reply
            </button>
          )}

          {isOwner && !comment.isRemovedByModerator && !isCommentDeleted && (
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEditBox((value) => !value)}
                disabled={isEditingThisComment || isDeletingThisComment}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeletingThisComment || isEditingThisComment}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isDeletingThisComment ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}

          {showEditBox && isOwner && !comment.isRemovedByModerator && !isCommentDeleted && (
            <div className="mt-3 rounded-none border border-gray-200 bg-gray-50 p-3">
              <textarea
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                rows={3}
                className="w-full rounded-none border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-amber-400"
                placeholder="Edit your comment"
              />
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditBox(false)}
                  className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  disabled={isEditingThisComment}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEditingThisComment ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {isReplyAllowed && showReplyBox && (
            <div className="mt-3">
              <textarea
                value={replyContent}
                onChange={(event) => setReplyContent(event.target.value)}
                rows={3}
                className="w-full rounded-none border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-amber-400"
                placeholder="Write a reply"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleReplySubmit}
                  disabled={isSubmittingThisReply}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isSubmittingThisReply ? 'Replying...' : 'Reply'}
                </button>
              </div>
            </div>
          )}

          {visibleReplies.length > 0 && (
            <div className="mt-3 space-y-2.5 border-l border-gray-200 pl-4 sm:pl-5">
              {visibleReplies.map((reply) => (
                <ForumCommentThread
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLoadReplies={onLoadReplies}
                  onEditComment={onEditComment}
                  onDeleteComment={onDeleteComment}
                  replyingCommentId={replyingCommentId}
                  editingCommentId={editingCommentId}
                  deletingCommentId={deletingCommentId}
                  currentUserId={currentUserId}
                  isLoggedIn={isLoggedIn}
                  onRequireAuth={onRequireAuth}
                />
              ))}
            </div>
          )}

          {isReplyAllowed && hasMoreReplies && (
            <button
              type="button"
              onClick={handleLoadMoreReplies}
              disabled={loadingMoreReplies}
              className="mt-2 inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingMoreReplies ? 'Loading replies...' : 'Load more replies'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}