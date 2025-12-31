import api from './index';
import { AxiosResponse } from 'axios';

export interface LocationResponse {
  success: boolean;
  states?: string[];
  state?: string;
  cities?: string[];
  message?: string;
}

export interface ValidationResponse {
  success: boolean;
  message: string;
  errors?: {
    state?: string;
    city?: string;
    pincode?: string;
  };
}

// Get all Indian states
export const getStates = async (): Promise<LocationResponse> => {
  try {
    const response: AxiosResponse<LocationResponse> = await api.get('/location/states');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch states', success: false };
  }
};

// Get cities by state
export const getCitiesByState = async (state: string): Promise<LocationResponse> => {
  try {
    const response: AxiosResponse<LocationResponse> = await api.get('/location/cities', {
      params: { state }
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch cities', success: false };
  }
};

// Validate location data
export const validateLocation = async (data: {
  state?: string;
  city?: string;
  pincode?: string;
}): Promise<ValidationResponse> => {
  try {
    const response: AxiosResponse<ValidationResponse> = await api.post('/location/validate', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to validate location', success: false };
  }
};
