import api from '../index'; 
import { AxiosResponse } from 'axios';

// --- Astrologer API Interfaces ---

export interface Astrologer {
  id: string;
  fullName: string;
  photo: string | null;
  skills: string[];
  languages: string[];
  categories: string[];
  yearsOfExperience: number;
  rating: string;
  pricePerMinute: string;
  totalConsultations: number;
  bio: string;
  isOnline: boolean;
  followersCount?: number;
}

export interface Review {
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
  user?: {
    id: string;
    fullName: string | null;
    photo: string | null;
    email?: string | null;
  };
}

export interface RatingStats {
  average: string;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewsResponse {
  success: boolean;
  reviews: Review[];
  ratingStats: RatingStats;
  pagination?: Pagination;
}

export interface FollowStatus {
  success: boolean;
  isFollowing: boolean;
  followId?: string;
}

export interface FollowResponse {
  success: boolean;
  message: string;
  followId?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AstrologerListResponse {
  success: boolean;
  astrologers: Astrologer[];
  pagination?: Pagination;
}

export interface AstrologerDetailResponse {
  success: boolean;
  astrologer: Astrologer;
}

export interface ErrorResponseData {
  message: string;
  success: false;
  error?: string;
}

// --- API Call Functions ---

const BASE_URL = "/astrologers";

export interface AstrologerFilters {
  page?: number;
  limit?: number;
  skills?: string[];
  languages?: string[];
  categories?: string[];
  minRating?: number;
  maxPrice?: number;
}

export const getAllAstrologers = async (filters?: AstrologerFilters): Promise<AstrologerListResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.skills && filters.skills.length > 0) params.append('skills', filters.skills.join(','));
      if (filters.languages && filters.languages.length > 0) params.append('languages', filters.languages.join(','));
      if (filters.categories && filters.categories.length > 0) params.append('categories', filters.categories.join(','));
      if (filters.minRating) params.append('minRating', filters.minRating.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    }
    
    const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;
    const response: AxiosResponse<AstrologerListResponse> = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to fetch astrologers', 
      success: false 
    };
  }
};

export const getAstrologerById = async (id: string): Promise<AstrologerDetailResponse> => {
  if (!id) {
    throw new Error("Astrologer ID is required.");
  }
  try {
    const url = `${BASE_URL}/${id}`;
    const response: AxiosResponse<AstrologerDetailResponse> = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to fetch astrologer details', 
      success: false 
    };
  }
};

export const searchAstrologers = async (query: string): Promise<AstrologerListResponse> => {
  if (!query.trim()) {
    return { success: true, astrologers: [] };
  }
  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `${BASE_URL}/search?query=${encodedQuery}`;

    const response: AxiosResponse<AstrologerListResponse> = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to search astrologers', 
      success: false 
    };
  }
};

export const getTopRatedAstrologers = async (): Promise<AstrologerListResponse> => {
  try {
    const url = `${BASE_URL}/top-rated`;
    const response: AxiosResponse<AstrologerListResponse> = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to fetch top rated astrologers', 
      success: false 
    };
  }
};

// --- Follow/Unfollow API Functions ---

export const followAstrologer = async (astrologerId: string): Promise<FollowResponse> => {
  if (!astrologerId) {
    throw new Error("Astrologer ID is required.");
  }
  try {
    const url = `/follow/follow-astro/${astrologerId}`;
    const response: AxiosResponse<FollowResponse> = await api.post(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to follow astrologer', 
      success: false 
    };
  }
};

export const unfollowAstrologer = async (astrologerId: string): Promise<FollowResponse> => {
  if (!astrologerId) {
    throw new Error("Astrologer ID is required.");
  }
  try {
    const url = `/follow/unfollow-astro/${astrologerId}`;
    const response: AxiosResponse<FollowResponse> = await api.delete(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to unfollow astrologer', 
      success: false 
    };
  }
};

export const checkFollowStatus = async (astrologerId: string): Promise<FollowStatus> => {
  if (!astrologerId) {
    throw new Error("Astrologer ID is required.");
  }
  try {
    const url = `/follow/check/${astrologerId}`;
    const response: AxiosResponse<FollowStatus> = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to check follow status', 
      success: false 
    };
  }
};

// --- Reviews API Functions ---

export const getAstrologerReviews = async (astrologerId: string, page: number = 1, limit: number = 10): Promise<ReviewsResponse> => {
  if (!astrologerId) {
    throw new Error("Astrologer ID is required.");
  }
  try {
    const url = `/reviews/astrologer/${astrologerId}?page=${page}&limit=${limit}`;
    const response: AxiosResponse<ReviewsResponse> = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to fetch reviews', 
      success: false 
    };
  }
};