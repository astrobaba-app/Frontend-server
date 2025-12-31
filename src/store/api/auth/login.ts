import api from '../index'; 
import { AxiosResponse } from 'axios';

export interface UserProfile {
  id: string;
  fullName?: string | null;
  email?: string | null;
  mobile: string;
  gender?: string | null;
  dateOfbirth?: string | null;
  timeOfbirth?: string | null;
  placeOfBirth?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  currentAddress?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
}

export interface VerifyOtpSuccessData {
  success: true;
  message: string;
  isNewUser: boolean;
  token: string; 
  middlewareToken: string;
  user: UserProfile;
}

export interface LogoutSuccessData {
  success: true;
  message: string;
}

export interface ErrorResponseData {
  message: string;
  success: false;
  error?: string;
}

export const generateOtp = async (mobile: string): Promise<AxiosResponse> => {
  try {
    const response = await api.post('/auth/generate-otp', { mobile });
    return response;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { message: 'Failed to connect to server', success: false };
  }
};

export const verifyOtp = async (otp: string): Promise<VerifyOtpSuccessData> => {
  try {
    const response: AxiosResponse<VerifyOtpSuccessData> = await api.post('/auth/verify-otp', { otp });
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { message: 'Failed to verify OTP or network error', success: false };
  }
};

export const logoutUser = async (): Promise<LogoutSuccessData> => {
  try {
    const response: AxiosResponse<LogoutSuccessData> = await api.post('/auth/logout');
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ErrorResponseData || { message: 'Failed to logout', success: false };
  }
};