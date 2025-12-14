import api from '../index';
import { AxiosResponse } from 'axios';

// --- User Review API Interfaces ---

export interface ReviewAstrologer {
  id: string;
  fullName: string;
  photo: string | null;
}

export interface UserReview {
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
  astrologer?: ReviewAstrologer;
}

export interface CreateReviewRequest {
  astrologerId: string;
  rating: number;
  review: string;
}

export interface UpdateReviewRequest {
  rating: number;
  review: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  review: UserReview;
}

export interface MyReviewResponse {
  success: boolean;
  review: UserReview;
}

export interface UpdateReviewResponse {
  success: boolean;
  message: string;
  review: UserReview;
}

export interface DeleteReviewResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponseData {
  message: string;
  success: false;
  error?: string;
}

// --- API Call Functions ---

const BASE_URL = '/reviews/user';

/**
 * Create a new review for an astrologer
 */
export const createReview = async (data: CreateReviewRequest): Promise<CreateReviewResponse> => {
  try {
    const response: AxiosResponse<CreateReviewResponse> = await api.post(
      `${BASE_URL}/create`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to create review',
      success: false
    };
  }
};

/**
 * Get my review (returns single review)
 */
export const getMyReview = async (): Promise<MyReviewResponse> => {
  try {
    const response: AxiosResponse<MyReviewResponse> = await api.get(`${BASE_URL}/my`);
    return response.data;
  } catch (error: any) {
    // If no review found (404), return null silently
    if (error.response?.status === 404) {
      return { success: false, review: null as any };
    }
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to fetch review',
      success: false
    };
  }
};

/**
 * Update an existing review
 */
export const updateReview = async (
  reviewId: string,
  data: UpdateReviewRequest
): Promise<UpdateReviewResponse> => {
  try {
    const response: AxiosResponse<UpdateReviewResponse> = await api.put(
      `${BASE_URL}/${reviewId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to update review',
      success: false
    };
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: string): Promise<DeleteReviewResponse> => {
  try {
    const response: AxiosResponse<DeleteReviewResponse> = await api.delete(
      `${BASE_URL}/${reviewId}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to delete review',
      success: false
    };
  }
};
