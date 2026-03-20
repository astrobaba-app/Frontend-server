import api from '../index';
import { AxiosResponse } from 'axios';

export type ForumIdentityMode = 'real' | 'anonymous';

export interface ForumPost {
  id: string;
  authorUserId: string;
  title: string;
  description: string;
  image?: string | null;
  images: string[];
  tags: string[];
  authorDisplayMode: ForumIdentityMode;
  authorName: string;
  authorAvatarSeed: string;
  authorAnonymousHash?: string | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  lastActivityAt: string;
  isLikedByCurrentUser?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForumReportReasonOption {
  value:
    | 'abusive_content'
    | 'harassment_or_hate'
    | 'spam_or_scam'
    | 'false_information'
    | 'sexual_content'
    | 'off_topic'
    | 'other';
  label: string;
  description: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorUserId: string;
  parentCommentId?: string | null;
  content: string;
  depth: number;
  path: string;
  sortOrder: number;
  authorDisplayMode: ForumIdentityMode;
  authorName: string;
  authorAvatarSeed: string;
  authorAnonymousHash?: string | null;
  replyCount: number;
  descendantCount: number;
  isRemovedByModerator?: boolean;
  isDeletedByAuthor?: boolean;
  isEdited?: boolean;
  editedAt?: string | null;
  hasMoreReplies?: boolean;
  createdAt: string;
  updatedAt: string;
  replies: ForumComment[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ForumPostsResponse {
  success: boolean;
  posts: ForumPost[];
  pagination: Pagination;
}

export interface ForumPostResponse {
  success: boolean;
  post: ForumPost;
}

export interface ForumCommentsResponse {
  success: boolean;
  comments: ForumComment[];
  pagination: Pagination;
}

export interface ForumCommentRepliesResponse {
  success: boolean;
  parentCommentId: string;
  replies: ForumComment[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ForumMutationResponse {
  success: boolean;
  message: string;
}

export interface CreateForumPostPayload {
  title: string;
  description: string;
  tags: string[];
  images: File[];
}

export interface CreateForumCommentPayload {
  content: string;
  parentCommentId?: string;
}

export interface ToggleLikeResponse extends ForumMutationResponse {
  likeCount: number;
  isLiked: boolean;
}

export interface SharePostResponse extends ForumMutationResponse {
  shareCount: number;
}

export interface CreateForumPostResponse extends ForumMutationResponse {
  post: ForumPost;
}

export interface CreateForumCommentResponse extends ForumMutationResponse {
  comment: ForumComment;
}

export interface ErrorResponseData {
  message: string;
  success: false;
  error?: string;
}

export const FORUM_REPORT_REASON_OPTIONS: ForumReportReasonOption[] = [
  { value: 'abusive_content', label: 'Abusive Content', description: 'Insults, threats, or harmful language.' },
  { value: 'harassment_or_hate', label: 'Harassment or Hate', description: 'Targeted hate, bullying, or harassment.' },
  { value: 'spam_or_scam', label: 'Spam or Scam', description: 'Promotions, fraud, or repetitive spam.' },
  { value: 'false_information', label: 'False Information', description: 'Misleading or deceptive information.' },
  { value: 'sexual_content', label: 'Sexual Content', description: 'Explicit or sexual material.' },
  { value: 'off_topic', label: 'Off Topic', description: 'Not relevant to the community discussion.' },
  { value: 'other', label: 'Other', description: 'Something else that needs moderator review.' },
];

const BASE_URL = '/forum/posts';

export const getForumPosts = async (params?: {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'top-liked' | 'most-commented';
  tag?: string;
}): Promise<ForumPostsResponse> => {
  try {
    const response: AxiosResponse<ForumPostsResponse> = await api.get(BASE_URL, {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch forum posts', success: false };
  }
};

export const getForumPostById = async (postId: string): Promise<ForumPostResponse> => {
  try {
    const response: AxiosResponse<ForumPostResponse> = await api.get(`${BASE_URL}/${postId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch forum post', success: false };
  }
};

export const createForumPost = async (
  payload: CreateForumPostPayload,
): Promise<CreateForumPostResponse> => {
  try {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('tags', JSON.stringify(payload.tags));
    payload.images.forEach((image) => {
      formData.append('images', image);
    });

    const response: AxiosResponse<CreateForumPostResponse> = await api.post(BASE_URL, formData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to create forum post', success: false };
  }
};

export const toggleForumPostLike = async (postId: string): Promise<ToggleLikeResponse> => {
  try {
    const response: AxiosResponse<ToggleLikeResponse> = await api.post(`${BASE_URL}/${postId}/like`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update like', success: false };
  }
};

export const shareForumPost = async (postId: string): Promise<SharePostResponse> => {
  try {
    const response: AxiosResponse<SharePostResponse> = await api.post(`${BASE_URL}/${postId}/share`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update share count', success: false };
  }
};

export const getForumComments = async (
  postId: string,
  params?: { page?: number; limit?: number; depthCap?: number },
): Promise<ForumCommentsResponse> => {
  try {
    const response: AxiosResponse<ForumCommentsResponse> = await api.get(`${BASE_URL}/${postId}/comments`, {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch comments', success: false };
  }
};

export const createForumComment = async (
  postId: string,
  payload: CreateForumCommentPayload,
): Promise<CreateForumCommentResponse> => {
  try {
    const response: AxiosResponse<CreateForumCommentResponse> = await api.post(
      `${BASE_URL}/${postId}/comments`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to post comment', success: false };
  }
};

export const reportForumPost = async (
  postId: string,
  payload: { reason: ForumReportReasonOption['value']; details?: string },
): Promise<ForumMutationResponse> => {
  try {
    const response: AxiosResponse<ForumMutationResponse> = await api.post(`${BASE_URL}/${postId}/report`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to submit report', success: false };
  }
};

export interface MyForumPost {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  authorDisplayMode: ForumIdentityMode;
  authorName: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isActive: boolean;
  moderationReason?: string | null;
  aiModerationReason?: string | null;
  aiModerationStatus: 'pending' | 'approved' | 'rejected' | 'error';
  duplicateCheckStatus?: 'pending' | 'processing' | 'clean' | 'duplicate' | 'error';
  duplicateCheckReason?: string | null;
  duplicateOfPostId?: string | null;
  duplicateConfidence?: number | null;
  duplicateOfPostUrl?: string | null;
  createdAt: string;
  appeal?: {
    status: 'pending' | 'approved' | 'rejected';
    adminNote?: string | null;
    createdAt: string;
  } | null;
}

export const getMyForumPosts = async (params?: { page?: number; limit?: number }): Promise<{
  success: boolean;
  posts: MyForumPost[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}> => {
  try {
    const response = await api.get('/forum/my-posts', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch your posts', success: false };
  }
};

export const createForumPostAppeal = async (
  postId: string,
  payload?: { message?: string },
): Promise<ForumMutationResponse> => {
  try {
    const response: AxiosResponse<ForumMutationResponse> = await api.post(`${BASE_URL}/${postId}/appeal`, payload || {});
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to submit appeal', success: false };
  }
};

export const updateForumPost = async (
  postId: string,
  payload: { title: string; description: string; tags?: string[] },
): Promise<CreateForumPostResponse> => {
  try {
    const response: AxiosResponse<CreateForumPostResponse> = await api.put(`${BASE_URL}/${postId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update post', success: false };
  }
};

export const deleteForumPost = async (
  postId: string,
): Promise<ForumMutationResponse> => {
  try {
    const response: AxiosResponse<ForumMutationResponse> = await api.delete(`${BASE_URL}/${postId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to delete post', success: false };
  }
};

export const getForumCommentReplies = async (
  postId: string,
  parentCommentId: string,
  params?: { offset?: number; limit?: number },
): Promise<ForumCommentRepliesResponse> => {
  try {
    const response: AxiosResponse<ForumCommentRepliesResponse> = await api.get(
      `${BASE_URL}/${postId}/comments/${parentCommentId}/replies`,
      { params },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch replies', success: false };
  }
};

export const updateForumComment = async (
  postId: string,
  commentId: string,
  payload: { content: string },
): Promise<CreateForumCommentResponse> => {
  try {
    const response: AxiosResponse<CreateForumCommentResponse> = await api.put(
      `${BASE_URL}/${postId}/comments/${commentId}`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update comment', success: false };
  }
};

export const deleteForumComment = async (
  postId: string,
  commentId: string,
): Promise<ForumMutationResponse> => {
  try {
    const response: AxiosResponse<ForumMutationResponse> = await api.delete(
      `${BASE_URL}/${postId}/comments/${commentId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to delete comment', success: false };
  }
};