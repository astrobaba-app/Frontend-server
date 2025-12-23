import api from '../index';
import { AxiosResponse } from 'axios';
import { KundliResponse } from '../kundli';

export interface UserKundliListItem {
  id: string;
  fullName: string;
  dateOfbirth: string;
  timeOfbirth: string;
  placeOfBirth: string;
  gender: string;
  createdAt: string;
}

export interface UserKundlisForCallResponse {
  success: boolean;
  userRequests: UserKundliListItem[];
  userName: string;
}

/**
 * Get all Kundlis of the user in the call (for astrologer)
 */
export const getUserKundlisForCall = async (callId: string): Promise<UserKundlisForCallResponse> => {
  try {
    const response: AxiosResponse<UserKundlisForCallResponse> = await api.get(
      `/kundli/call/${callId}/user-kundlis`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch user kundlis', success: false };
  }
};

/**
 * Get specific Kundli details during a call (for astrologer)
 */
export const getKundliForCall = async (
  callId: string,
  userRequestId: string
): Promise<KundliResponse> => {
  try {
    const response: AxiosResponse<KundliResponse> = await api.get(
      `/kundli/call/${callId}/kundli/${userRequestId}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch kundli details', success: false };
  }
};
