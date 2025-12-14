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
