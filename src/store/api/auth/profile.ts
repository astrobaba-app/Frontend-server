import api from '../index';
import { AxiosResponse } from 'axios';
import { UserProfile } from './login';

export interface ProfileResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  gender?: string;
  dateOfbirth?: string;
  timeOfbirth?: string;
  placeOfBirth?: string;
  latitude?: string;
  longitude?: string;
  currentAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response: AxiosResponse<ProfileResponse> = await api.get('/user/profile');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch profile', success: false };
  }
};

export const updateProfile = async (data: UpdateProfileData): Promise<ProfileResponse> => {
  try {
    const response: AxiosResponse<ProfileResponse> = await api.put('/user/profile', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update profile', success: false };
  }
};

export interface AccountDeletionRequest {
  id: string;
  userId: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountDeletionResponse {
  success: boolean;
  message: string;
  request?: AccountDeletionRequest;
}

export const requestAccountDeletion = async (reason?: string): Promise<AccountDeletionResponse> => {
  try {
    const response: AxiosResponse<AccountDeletionResponse> = await api.post('/user/account-deletion', { reason });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to submit account deletion request', success: false };
  }
};

export const getDeletionRequestStatus = async (): Promise<AccountDeletionResponse> => {
  try {
    const response: AxiosResponse<AccountDeletionResponse> = await api.get('/user/account-deletion/status');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch deletion request status', success: false };
  }
};

export const cancelDeletionRequest = async (requestId: string): Promise<AccountDeletionResponse> => {
  try {
    const response: AxiosResponse<AccountDeletionResponse> = await api.delete(`/user/account-deletion/${requestId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to cancel deletion request', success: false };
  }
};
