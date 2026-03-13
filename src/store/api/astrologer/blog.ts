import api from '../index'; 
import { AxiosResponse } from 'axios';

export interface Blog {
  _id?: string;
  id: string;
  astrologerId?: string;
  adminId?: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  category?: string;
  isPublished: boolean;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  astrologer?: {
    id: string;
    fullName: string;
    photo: string;
    email: string;
  };
  admin?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateBlogRequest {
  title: string;
  description: string;
  category?: string;
  isPublished?: boolean;
  images?: File[];
}

export interface UpdateBlogRequest {
  title?: string;
  description?: string;
  category?: string;
  isPublished?: boolean;
  images?: File[];
}

export interface BlogResponse {
  success: boolean;
  message: string;
  blog: Blog;
}

export interface BlogListResponse {
  success: boolean;
  blogs: Blog[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DeleteBlogResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponseData {
  message: string;
  success: false;
  error?: string;
}

const BASE = '/blogs';

export const createBlog = async (data: CreateBlogRequest): Promise<BlogResponse> => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.isPublished !== undefined) formData.append('isPublished', String(data.isPublished));
    (data.images || []).forEach((file) => {
      formData.append('images', file);
    });

    const response: AxiosResponse<BlogResponse> = await api.post(
      BASE,
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to create blog', 
      success: false 
    };
  }
};

export const updateBlog = async (id: string, data: UpdateBlogRequest): Promise<BlogResponse> => {
  try {
    const formData = new FormData();
    
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.isPublished !== undefined) formData.append('isPublished', String(data.isPublished));
    (data.images || []).forEach((file) => {
      formData.append('images', file);
    });

    const response: AxiosResponse<BlogResponse> = await api.put(
      `${BASE}/${id}`,
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to update blog', 
      success: false 
    };
  }
};

export const deleteBlog = async (id: string): Promise<DeleteBlogResponse> => {
  try {
    const response: AxiosResponse<DeleteBlogResponse> = await api.delete(`${BASE}/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to delete blog', 
      success: false 
    };
  }
};

export const getMyBlogs = async (): Promise<BlogListResponse> => {
  try {
    const response: AxiosResponse<BlogListResponse> = await api.get(`${BASE}/my/blogs`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to fetch blogs', 
      success: false 
    };
  }
};

export const toggleBlogPublish = async (
  id: string
): Promise<{ success: boolean; message: string; blog: Blog }> => {
  try {
    const response = await api.patch(`${BASE}/${id}/toggle`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || {
      message: 'Failed to toggle publish status',
      success: false,
    };
  }
};

export const uploadInlineImage = async (
  formData: FormData
): Promise<{ success: boolean; url: string }> => {
  try {
    const response = await api.post(`${BASE}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to upload image', 
      success: false 
    };
  }
};