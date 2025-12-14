import api from '../index';
import { AxiosResponse } from 'axios';

// --- Review API Interfaces ---

export interface ReviewUser {
  id: string;
  fullName: string | null;
  email: string | null;
}

export interface AstrologerReview {
  id: string;
  userId: string;
  astrologerId: string;
  rating: number;
  review: string;
  reply: string | null;
  repliedAt: string | null;
  isEdited: boolean;
  isReplyEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user?: ReviewUser;
}

export interface ReviewPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AstrologerReviewsResponse {
  success: boolean;
  reviews: AstrologerReview[];
  pagination: ReviewPagination;
}

export interface AddReplyRequest {
  reply: string;
}

export interface AddReplyResponse {
  success: boolean;
  message: string;
  review: AstrologerReview;
}

export interface UpdateReplyRequest {
  reply: string;
}

export interface UpdateReplyResponse {
  success: boolean;
  message: string;
  review: AstrologerReview;
}

export interface DeleteReplyResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponseData {
  message: string;
  success: false;
  error?: string;
}

// --- API Call Functions ---

const BASE_URL = '/reviews/astrologer';

/**
 * Get all pending reviews for the astrologer
 */
export const getMyReviews = async (page: number = 1, limit: number = 10): Promise<AstrologerReviewsResponse> => {
  try {
    const response: AxiosResponse<AstrologerReviewsResponse> = await api.get(
      `${BASE_URL}/pending-replies`,
      {
        params: { page, limit }
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to fetch reviews',
      success: false
    };
  }
};

/**
 * Add a reply to a review
 */
export const addReviewReply = async (
  reviewId: string,
  data: AddReplyRequest
): Promise<AddReplyResponse> => {
  try {
    const response: AxiosResponse<AddReplyResponse> = await api.post(
      `${BASE_URL}/${reviewId}/reply`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to add reply',
      success: false
    };
  }
};

/**
 * Update a reply to a review
 */
export const updateReviewReply = async (
  reviewId: string,
  data: UpdateReplyRequest
): Promise<UpdateReplyResponse> => {
  try {
    const response: AxiosResponse<UpdateReplyResponse> = await api.put(
      `${BASE_URL}/${reviewId}/reply`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to update reply',
      success: false
    };
  }
};

/**
 * Delete a reply to a review
 */
export const deleteReviewReply = async (reviewId: string): Promise<DeleteReplyResponse> => {
  try {
    const response: AxiosResponse<DeleteReplyResponse> = await api.delete(
      `${BASE_URL}/${reviewId}/reply`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to delete reply',
      success: false
    };
  }
};
