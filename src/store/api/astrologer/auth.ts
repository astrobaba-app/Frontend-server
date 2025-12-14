import api from '../index'; 
import { AxiosResponse } from 'axios';

// --- Core Shared Interface ---

export interface AstrologerProfile {
  id: number;
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

// --- Auth Specific Interfaces ---

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  otp?: string; // For development
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  phoneNumber: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  email: string;
  password: string;
  fullName: string;
  dateOfBirth?: string;
  languages: string[] | string;
  skills: string[] | string;
  yearsOfExperience?: number;
  bio?: string;
  photo?: File;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  astrologer: AstrologerProfile;
  token: string;
  middlewareToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  astrologer: AstrologerProfile;
  token: string;
  middlewareToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface OnlineStatusResponse {
  success: boolean;
  message: string;
  isOnline: boolean;
}

export interface GetOnlineStatusResponse {
  success: boolean;
  isOnline: boolean;
}

// --- API Functions ---

// Send OTP for registration
export const sendRegistrationOTP = async (data: SendOtpRequest): Promise<SendOtpResponse> => {
  try {
    const response: AxiosResponse<SendOtpResponse> = await api.post('/astrologer/auth/send-otp', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to send OTP', 
      success: false 
    };
  }
};

// Verify OTP
export const verifyRegistrationOTP = async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  try {
    const response: AxiosResponse<VerifyOtpResponse> = await api.post('/astrologer/auth/verify-otp', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to verify OTP', 
      success: false 
    };
  }
};

// Complete registration
export const registerAstrologer = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const formData = new FormData();
    
    // Append all fields to FormData
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('fullName', data.fullName);
    
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (data.yearsOfExperience) formData.append('yearsOfExperience', data.yearsOfExperience.toString());
    if (data.bio) formData.append('bio', data.bio);
    
    // Handle languages
    if (Array.isArray(data.languages)) {
      formData.append('languages', JSON.stringify(data.languages));
    } else {
      formData.append('languages', data.languages);
    }
    
    // Handle skills
    if (Array.isArray(data.skills)) {
      formData.append('skills', JSON.stringify(data.skills));
    } else {
      formData.append('skills', data.skills);
    }
    
    // Handle photo upload
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response: AxiosResponse<RegisterResponse> = await api.post('/astrologer/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to complete registration', 
      success: false 
    };
  }
};

// Login
export const loginAstrologer = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post('/astrologer/auth/login', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to login', 
      success: false 
    };
  }
};

// Logout
export const logoutAstrologer = async (): Promise<LogoutResponse> => {
  try {
    const response: AxiosResponse<LogoutResponse> = await api.post('/astrologer/auth/logout');
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to logout', 
      success: false 
    };
  }
};

// Toggle online status
export const toggleOnlineStatus = async (): Promise<OnlineStatusResponse> => {
  try {
    const response: AxiosResponse<OnlineStatusResponse> = await api.post('/astrologer/auth/toggle-status');
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to toggle status', 
      success: false 
    };
  }
};

// Go online
export const goOnline = async (): Promise<OnlineStatusResponse> => {
  try {
    const response: AxiosResponse<OnlineStatusResponse> = await api.post('/astrologer/auth/go-online');
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to go online', 
      success: false 
    };
  }
};

// Go offline
export const goOffline = async (): Promise<OnlineStatusResponse> => {
  try {
    const response: AxiosResponse<OnlineStatusResponse> = await api.post('/astrologer/auth/go-offline');
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to go offline', 
      success: false 
    };
  }
};

// Get online status
export const getOnlineStatus = async (): Promise<GetOnlineStatusResponse> => {
  try {
    const response: AxiosResponse<GetOnlineStatusResponse> = await api.get('/astrologer/auth/status');
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { 
      message: 'Failed to fetch status', 
      success: false 
    };
  }
};