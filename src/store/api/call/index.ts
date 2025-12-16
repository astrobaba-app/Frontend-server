import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6001/api";

export interface CallSession {
  id: number;
  userId: number;
  astrologerId: number;
  callType: "audio" | "video";
  status: "ringing" | "accepted" | "rejected" | "ongoing" | "completed";
  initiatedBy: "user" | "astrologer";
  pricePerMinute: string;
  agoraChannelName: string;
  agoraUidUser?: number;
  agoraUidAstrologer?: number;
  startTime?: string;
  endTime?: string;
  totalMinutes?: number;
  totalCost?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  astrologer?: {
    id: number;
    fullName: string;
    photo: string;
    rating: number;
  };
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface AgoraTokenResponse {
  success: boolean;
  token: string;
  appId: string;
  channelName: string;
  uid: number;
  expiresAt: string;
  userType: "user" | "astrologer";
  callType: "audio" | "video";
}

export const initiateCall = async (
  astrologerId: string,
  callType: "audio" | "video"
): Promise<{ success: boolean; message: string; callSession: CallSession }> => {
  const response = await axios.post(
    `${API_BASE_URL}/call/initiate`,
    { astrologerId, callType },
    { withCredentials: true }
  );
  return response.data;
};

export const acceptCall = async (callId: number): Promise<{ success: boolean; message: string; callSession: CallSession }> => {
  const response = await axios.post(
    `${API_BASE_URL}/call/${callId}/accept`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const rejectCall = async (callId: number, reason?: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(
    `${API_BASE_URL}/call/${callId}/reject`,
    { reason },
    { withCredentials: true }
  );
  return response.data;
};

export const getCallToken = async (callId: number): Promise<AgoraTokenResponse> => {
  const response = await axios.get(
    `${API_BASE_URL}/call/${callId}/token`,
    { withCredentials: true }
  );
  return response.data;
};

export const endCall = async (callId: number): Promise<{
  success: boolean;
  message: string;
  callSession: {
    id: number;
    totalMinutes: number;
    totalCost: string;
    callType: string;
    startTime: string;
    endTime: string;
  };
}> => {
  const response = await axios.post(
    `${API_BASE_URL}/call/${callId}/end`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const getUserCallHistory = async (page = 1, limit = 20): Promise<{
  success: boolean;
  calls: CallSession[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  const response = await axios.get(
    `${API_BASE_URL}/call/history`,
    {
      params: { page, limit },
      withCredentials: true,
    }
  );
  return response.data;
};
