import api from '../index'; 
import { AxiosResponse } from 'axios';

// --- Blog API Interfaces ---

export interface Astrologer {
  id: string;
  fullName: string;
  photo: string;
  email: string;
  rating: string;
  yearsOfExperience: number;
}

export interface Blog {
  id: string;
  astrologerId: string;
  title: string;
  description: string;
  image: string;
  isPublished: boolean;
  views: number;
  likes: number;
  isLikedByUser?: boolean;
  createdAt: string;
  updatedAt: string;
  astrologer?: Astrologer;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogListResponse {
  success: boolean;
  blogs: Blog[];
  pagination?: Pagination;
}

export interface BlogDetailResponse {
  success: boolean;
  blog: Blog;
}

export interface LikeBlogResponse {
  success: boolean;
  message: string;
  likes: number;
  isLiked?: boolean;
}

export interface ErrorResponseData {
  message: string;
  success: false;
  error?: string;
}

// --- API Call Functions ---

const BASE_URL = "/blogs";

export const getAllBlogs = async (): Promise<BlogListResponse> => {
  try {
    const response: AxiosResponse<BlogListResponse> = await api.get(BASE_URL);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to fetch all blogs', 
      success: false 
    };
  }
};

export const getBlogById = async (id: string): Promise<BlogDetailResponse> => {
  if (!id) {
    throw new Error("Blog ID is required.");
  }
  try {
    const url = `${BASE_URL}/${id}`;
    const response: AxiosResponse<BlogDetailResponse> = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to fetch blog details', 
      success: false 
    };
  }
};

export const toggleBlogLike = async (id: string): Promise<LikeBlogResponse> => {
  if (!id) {
    throw new Error("Blog ID is required.");
  }
  try {
    const url = `${BASE_URL}/${id}/like`;
    const response: AxiosResponse<LikeBlogResponse> = await api.post(url); 
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to toggle like status', 
      success: false 
    };
  }
};