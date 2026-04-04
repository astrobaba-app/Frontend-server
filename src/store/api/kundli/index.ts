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
  shared?: boolean;
  kundli: {
    id: string;
    requestId: string;
    basicDetails: any;
    astroDetails?: any;
    manglikAnalysis: any;
    panchang: any;
    charts: any;
    dasha: any;
    yogini: any;
    personality: any;
    planetary: any;
    remedies: any;
    ashtakvarga?: any;
    yogas?: any[];
    horoscope?: any;
    createdAt: string;
    updatedAt: string;
    userRequest: {
      id: string;
      userId?: string;
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
    aiFreeReport?: {
      general?: {
        ascendant_overview?: string;
        personality?: string;
        physical?: string;
        health?: string;
      };
      remedies?: {
        overview?: string;
        rudraksha?: string;
        gemstones?: string;
      };
      dosha?: {
        overview?: string;
        manglik?: string;
        kalsarpa?: string;
        sadesati?: string;
      };
    };
  };
}

export interface ShareKundliLinkResponse {
  success: boolean;
  message: string;
  shareUrl: string;
}

export interface AiReportStatusResponse {
  success: boolean;
  isReady: boolean;
  aiFreeReport?: any;
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

export interface DeleteKundliResponse {
  success: boolean;
  message: string;
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

export const deleteKundli = async (userRequestId: string): Promise<DeleteKundliResponse> => {
  try {
    const response: AxiosResponse<DeleteKundliResponse> = await api.delete(`/kundli/${userRequestId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to delete kundli', success: false };
  }
};

export const getKundli = async (userRequestId: string): Promise<KundliResponse> => {
  try {
    const response: AxiosResponse<KundliResponse> = await api.get(`/kundli/${userRequestId}`);
    console.log('Kundli details fetched successfully:', response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch kundli details', success: false };
  }
};

export const getSharedKundli = async (userRequestId: string): Promise<KundliResponse> => {
  try {
    const response: AxiosResponse<KundliResponse> = await api.get(`/kundli/shared/${encodeURIComponent(userRequestId)}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch shared kundli details', success: false };
  }
};

export const createKundliShareLink = async (userRequestId: string): Promise<ShareKundliLinkResponse> => {
  try {
    const response: AxiosResponse<ShareKundliLinkResponse> = await api.post(`/kundli/${userRequestId}/share-link`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to create share link', success: false };
  }
};

export const checkAiReportStatus = async (userRequestId: string): Promise<AiReportStatusResponse> => {
  try {
    const response: AxiosResponse<AiReportStatusResponse> = await api.get(`/kundli/${userRequestId}/ai-status`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to check AI report status', success: false };
  }
};

export const refreshAshtakvarga = async (userRequestId: string): Promise<KundliResponse> => {
  try {
    const response: AxiosResponse<KundliResponse> = await api.put(`/kundli/${userRequestId}/refresh-ashtakvarga`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to refresh Ashtakavarga', success: false };
  }
};
