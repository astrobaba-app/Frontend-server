import api from '../index'; 
import { AxiosResponse } from 'axios';

// --- Interfaces Shared with Auth ---

export interface AstrologerProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string | null;
  languages: string[];
  skills: string[];
  yearsOfExperience?: number | null;
  bio?: string | null;
  photo?: string | null;
  isOnline?: boolean;
  pricePerMinute?: number;
  availability?: string;
  approvalStatus?: string;
  rating?: number;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ErrorResponseData {
  message: string;
  success: false;
  error?: string;
}

// --- Profile Specific Interfaces ---

export interface GetProfileResponse {
  success: boolean;
  astrologer: AstrologerProfile;
}

export interface UpdateProfileRequest {
  fullName?: string;
  dateOfBirth?: string;
  languages?: string[] | string;
  skills?: string[] | string;
  yearsOfExperience?: number;
  bio?: string;
  pricePerMinute?: number;
  availability?: string;
  photo?: File;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  astrologer: AstrologerProfile;
}

// --- API Functions ---

// Get profile
export const getAstrologerProfile = async (): Promise<GetProfileResponse> => {
  try {
    const response: AxiosResponse<GetProfileResponse> = await api.get('/astrologer/auth/profile');
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to fetch profile', 
      success: false 
    };
  }
};

// Update profile
export const updateAstrologerProfile = async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  try {
    const formData = new FormData();
    
    if (data.fullName) formData.append('fullName', data.fullName);
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (data.yearsOfExperience) formData.append('yearsOfExperience', data.yearsOfExperience.toString());
    if (data.bio) formData.append('bio', data.bio);
    if (data.pricePerMinute) formData.append('pricePerMinute', data.pricePerMinute.toString());
    if (data.availability) formData.append('availability', data.availability);
    
    // Handle languages as array fields so backend receives a proper array
    if (data.languages) {
      if (Array.isArray(data.languages)) {
        data.languages.forEach((lang) => {
          formData.append('languages', lang);
        });
      } else {
        formData.append('languages', data.languages);
      }
    }

    // Handle skills as array fields so backend receives a proper array
    if (data.skills) {
      if (Array.isArray(data.skills)) {
        data.skills.forEach((skill) => {
          formData.append('skills', skill);
        });
      } else {
        formData.append('skills', data.skills);
      }
    }
    
    // Handle photo upload
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response: AxiosResponse<UpdateProfileResponse> = await api.put('/astrologer/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to update profile', 
      success: false 
    };
  }
};