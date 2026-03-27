import api from "../index";
import { AxiosResponse } from "axios";

export type ConsultationType = "chat" | "voice_call" | "video_call" | "live";
export type EarningPaymentStatus = "pending" | "processing" | "completed" | "failed";

export interface EarningHistoryItem {
  id: string;
  userId: string;
  sessionId: string;
  consultationType: ConsultationType;
  sessionType: "chat" | "call" | "live";
  durationMinutes: number | string;
  pricePerMinute: number | string;
  totalAmount: number | string;
  platformCommission: number | string;
  netEarning: number | string;
  paymentStatus: EarningPaymentStatus;
  sessionStartTime: string;
  sessionEndTime: string;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface PayoutRequest {
  id: string;
  requestedAmount: number | string;
  status: "requested" | "processing" | "paid" | "rejected";
  requestedAt: string;
  processedAt?: string | null;
  paymentMethod?: string | null;
  transactionId?: string | null;
  notes?: string | null;
}

export interface EarningsSummary {
  totalGrossEarning: number;
  totalPlatformFee: number;
  totalNetEarning: number;
  lifetimeNetEarning: number;
  totalChatEarning: number;
  totalVoiceCallEarning: number;
  totalVideoCallEarning: number;
  ongoingChatEarning: number;
  totalPaidOut: number;
  availableForPayout: number;
  processingPayoutAmount: number;
  platformFeePercentage: number;
}

export interface EarningsDashboardResponse {
  success: boolean;
  summary: EarningsSummary;
  activePayoutRequest: PayoutRequest | null;
  earnings: EarningHistoryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PayoutRequestsResponse {
  success: boolean;
  payoutRequests: PayoutRequest[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getAstrologerEarningsDashboard = async (params?: {
  page?: number;
  limit?: number;
  paymentStatus?: EarningPaymentStatus;
  consultationType?: ConsultationType;
}): Promise<EarningsDashboardResponse> => {
  const response: AxiosResponse<EarningsDashboardResponse> = await api.get(
    "/astrologer/earnings/dashboard",
    { params }
  );
  return response.data;
};

export const requestAstrologerPayout = async (): Promise<{
  success: boolean;
  message: string;
  payoutRequest: PayoutRequest;
}> => {
  const response = await api.post("/astrologer/earnings/payout-request");
  return response.data;
};

export const getAstrologerPayoutRequests = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PayoutRequestsResponse> => {
  const response: AxiosResponse<PayoutRequestsResponse> = await api.get(
    "/astrologer/earnings/payout-requests",
    { params }
  );
  return response.data;
};
