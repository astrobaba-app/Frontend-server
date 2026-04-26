import api from "../index";

export interface ChatSessionSummary {
  id: string;
  userId: string;
  astrologerId: string;
  status: "active" | "completed" | "cancelled";
  requestStatus: "pending" | "approved" | "rejected";
  startTime: string;
  endTime: string | null;
  totalMinutes: number;
  totalCost: string;
  pricePerMinute: string;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  astrologer?: {
    id: string;
    fullName: string;
    photo: string | null;
    rating?: number;
  };
  user?: {
    id: string;
    fullName: string;
    email: string;
    mobile?: number | string | null;
    gender?: string | null;
    dateOfbirth?: string | null;
    timeOfbirth?: string | null;
    placeOfBirth?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
  };
}

export interface ChatMessageDto {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: "user" | "astrologer";
  message: string | null;
  messageType: "text" | "image" | "file" | "voice";
  fileUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  replyToMessageId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatHistoryMessageDto {
  id: string;
  historySessionId: string;
  senderId: string;
  senderType: "user" | "astrologer";
  message: string | null;
  messageType: "text" | "image" | "file" | "voice";
  fileUrl: string | null;
  isDeleted: boolean;
  replyToMessageId: string | null;
  originalMessageId: string | null;
  originalCreatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatHistorySessionDto {
  id: string;
  sourceSessionId: string;
  userId: string;
  astrologerId: string;
  status: "completed" | "cancelled";
  requestStatus: "pending" | "approved" | "rejected";
  startTime: string;
  endTime: string | null;
  totalMinutes: number;
  totalCost: string;
  billedAmount: string;
  pricePerMinute: string;
  endReason: string | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  astrologer?: {
    id: string;
    fullName: string;
    photo: string | null;
    rating?: number;
    pricePerMinute?: string;
  };
  messages?: ChatHistoryMessageDto[];
}

interface PaginatedResponse<T> {
  success: boolean;
  sessions?: T[];
  messages?: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function startChatSession(astrologerId: string) {
  const response = await api.post("/chat/start", { astrologerId });
  return response.data as {
    success: boolean;
    session: ChatSessionSummary;
    requestTimeoutSeconds?: number;
    requestExpiresAt?: string;
  };
}

export async function getMyChatSessions(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const response = await api.get<PaginatedResponse<ChatSessionSummary>>(
    "/chat/my-sessions",
    { params }
  );
  return response.data;
}

export async function endChatSession(
  sessionId: string,
  reason?: "user_ended_chat" | "insufficient_balance"
) {
  const response = await api.post(`/chat/${sessionId}/end`, reason ? { reason } : {});
  return response.data as { success: boolean; message: string };
}

export async function getAstrologerChatSessions(params?: {
  page?: number;
  limit?: number;
  status?: string;
  requestStatus?: "pending" | "approved" | "rejected";
}) {
  const response = await api.get<PaginatedResponse<ChatSessionSummary>>(
    "/chat/astrologer/sessions",
    { params }
  );
  return response.data;
}

export async function approveChatRequest(sessionId: string, forceAccept = false) {
  const response = await api.post(`/chat/astrologer/requests/${sessionId}/approve`, {
    forceAccept,
  });
  return response.data as { success: boolean };
}

export async function rejectChatRequest(sessionId: string) {
  const response = await api.post(`/chat/astrologer/requests/${sessionId}/reject`);
  return response.data as { success: boolean };
}

export async function endAstrologerChatSession(sessionId: string) {
  const response = await api.post(`/chat/astrologer/${sessionId}/end`);
  return response.data as { success: boolean; message: string };
}

export async function getChatMessages(
  sessionId: string,
  params?: { page?: number; limit?: number }
) {
  const response = await api.get<PaginatedResponse<ChatMessageDto>>(
    `/chat/${sessionId}/messages`,
    { params }
  );
  return response.data;
}

export async function sendChatMessageHttp(
  sessionId: string,
  data: {
    message: string;
    messageType?: "text" | "image" | "file" | "voice";
    replyToMessageId?: string | null;
    file?: File;
    voiceDurationSec?: number;
  }
) {
  if (data.file) {
    const formData = new FormData();
    formData.append("message", data.message);
    formData.append("messageType", data.messageType || "image");
    if (data.replyToMessageId) {
      formData.append("replyToMessageId", data.replyToMessageId);
    }
    if (typeof data.voiceDurationSec === "number") {
      formData.append("voiceDurationSec", String(data.voiceDurationSec));
    }
    formData.append("file", data.file);
    const response = await api.post(`/chat/${sessionId}/message`, formData);
    return response.data as { success: boolean; chatMessage: ChatMessageDto };
  }

  const response = await api.post(`/chat/${sessionId}/message`, {
    message: data.message,
    messageType: data.messageType || "text",
    replyToMessageId: data.replyToMessageId,
  });
  return response.data as { success: boolean; chatMessage: ChatMessageDto };
}

export async function getUserChatHistory(params?: {
  page?: number;
  limit?: number;
}) {
  const response = await api.get<{
    success: boolean;
    historySessions: ChatHistorySessionDto[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>("/chat/history", { params });

  return response.data;
}

export async function getUserAstrologerChatHistory(
  astrologerId: string,
  params?: { page?: number; limit?: number }
) {
  const response = await api.get<{
    success: boolean;
    historySessions: ChatHistorySessionDto[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>(`/chat/history/${astrologerId}`, { params });

  return response.data;
}
