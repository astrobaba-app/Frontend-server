import api from '../index';
import { AxiosResponse } from 'axios';

export interface KundliRequest {
  fullName: string;
  dateOfbirth: string; 
  timeOfbirth: string; 
  placeOfBirth: string;
  gender: string;
  latitude: number;
  longitude: number;
}

export interface KundliResponse {
  success: boolean;
  kundli: {
    id: string;
    requestId: string;
    basicDetails: any;
    manglikAnalysis: any;
    panchang: any;
    charts: any;
    dasha: any;
    yogini: any;
    personality: any;
    planetary: any[];
    remedies: any;
    yogas?: any[];
    createdAt: string;
    updatedAt: string;
    userRequest: {
      id: string;
      userId: string;
      fullName: string;
      dateOfbirth: string;
      timeOfbirth: string;
      placeOfBirth: string;
      gender: string;
      latitude: number;
      longitude: number;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface AllKundlisResponse {
  success: boolean;
  userRequests: Array<{
    id: string;
    fullName: string;
    dateOfbirth: string;
    timeOfbirth: string;
    placeOfBirth: string;
  }>;
}

export const createKundli = async (data: KundliRequest): Promise<KundliResponse> => {
  try {
    const response: AxiosResponse<KundliResponse> = await api.post('/kundli/create', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to create kundli', success: false };
  }
};

export const getAllKundlis = async (): Promise<AllKundlisResponse> => {
  try {
    const response: AxiosResponse<AllKundlisResponse> = await api.get('/kundli/all');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch kundlis', success: false };
  }
};

export const getKundli = async (userRequestId: string): Promise<KundliResponse> => {
  try {
    const response: AxiosResponse<KundliResponse> = await api.get(`/kundli/${userRequestId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch kundli details', success: false };
  }
};
