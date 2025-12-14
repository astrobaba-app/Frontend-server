import api from '../index'; 
import { AxiosResponse } from 'axios';

export interface Blog {
  _id: string; 
  id: string; // Backend uses 'id'
  title: string;
  description: string;
  image: string; 
  authorId: string; 
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogRequest {
  title: string;
  description: string;
  image: File; 
}

export interface UpdateBlogRequest {
  title?: string;
  description?: string;
  image?: File; 
}

export interface BlogResponse {
  success: boolean;
  message: string;
  blog: Blog;
}

export interface BlogListResponse {
  success: boolean;
  message: string;
  blogs: Blog[];
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

export const createBlog = async (data: CreateBlogRequest): Promise<BlogResponse> => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('image', data.image); 

    const response: AxiosResponse<BlogResponse> = await api.post(
      '/blogs/create', 
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
    
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);

    const response: AxiosResponse<BlogResponse> = await api.put(
      `/blogs/update/${id}`, 
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
    const response: AxiosResponse<DeleteBlogResponse> = await api.delete(`/blogs/delete/${id}`);
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
    const response: AxiosResponse<BlogListResponse> = await api.get('/blogs/my/blogs');
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to fetch blogs', 
      success: false 
    };
  }
};