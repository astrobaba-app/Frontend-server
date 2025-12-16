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
  };
}

export interface ChatMessageDto {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: "user" | "astrologer";
  message: string | null;
  messageType: "text" | "image" | "file";
  fileUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  replyToMessageId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
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
  return response.data as { success: boolean; session: ChatSessionSummary };
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

export async function approveChatRequest(sessionId: string) {
  const response = await api.post(`/chat/astrologer/requests/${sessionId}/approve`);
  return response.data as { success: boolean };
}

export async function rejectChatRequest(sessionId: string) {
  const response = await api.post(`/chat/astrologer/requests/${sessionId}/reject`);
  return response.data as { success: boolean };
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
  data: { message: string; messageType?: "text" | "image" | "file"; replyToMessageId?: string | null; file?: File }
) {
  if (data.file) {
    const formData = new FormData();
    formData.append("message", data.message);
    formData.append("messageType", data.messageType || "image");
    if (data.replyToMessageId) {
      formData.append("replyToMessageId", data.replyToMessageId);
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
