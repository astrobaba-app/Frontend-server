import api from "../index";

export interface LiveSession {
  id: string;
  astrologerId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  sessionType: "live_stream" | "one_on_one_call";
  pricePerMinute: number;
  status: "scheduled" | "live" | "ended" | "cancelled";
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  agoraChannelName: string;
  agoraAppId?: string;
  totalViewers: number;
  currentViewers: number;
  maxViewers: number;
  totalRevenue: number;
  recordingEnabled: boolean;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
  astrologer?: {
    id: string;
    fullName: string;
    photo?: string;
    rating?: number;
    yearsOfExperience?: number;
  };
}

export interface LiveParticipant {
  id: string;
  liveSessionId: string;
  userId: string;
  joinedAt: string;
  leftAt?: string;
  totalMinutes: number;
  totalCost: number;
  isActive: boolean;
  agoraUid?: number;
}

export interface AgoraTokenResponse {
  success: boolean;
  token: string;
  appId: string;
  channelName: string;
  uid: number;
  expiresAt: string;
  role?: string;
}

export interface LiveChatMessage {
  id: string;
  liveSessionId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  message: string;
  messageType: "text" | "emoji" | "system";
  timestamp: string;
  createdAt?: string;
}

export interface LiveHistorySession {
  id: string;
  title: string;
  startedAt: string;
  endedAt: string;
  totalViewers: number;
  maxViewers: number;
  totalRevenue: number;
  durationMinutes: number;
}

// Create live session (Astrologer only)
export const createLiveSession = async (data: {
  title: string;
  description?: string;
  pricePerMinute: number;
  sessionType?: "live_stream" | "one_on_one_call";
  scheduledAt?: string;
  thumbnail?: File;
}): Promise<{
  success: boolean;
  message?: string;
  liveSession?: LiveSession;
  error?: string;
}> => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("pricePerMinute", data.pricePerMinute.toString());
    
    if (data.description) formData.append("description", data.description);
    if (data.sessionType) formData.append("sessionType", data.sessionType);
    if (data.scheduledAt) formData.append("scheduledAt", data.scheduledAt);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    const response = await api.post("/live/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create live session",
    };
  }
};

// Start scheduled live session
export const startLiveSession = async (
  sessionId: string
): Promise<{
  success: boolean;
  message?: string;
  liveSession?: LiveSession;
  error?: string;
}> => {
  try {
    const response = await api.post(`/live/${sessionId}/start`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to start live session",
    };
  }
};

// Get Agora token for host (Astrologer)
export const getHostToken = async (
  sessionId: string
): Promise<AgoraTokenResponse> => {
  try {
    const response = await api.get(`/live/${sessionId}/host-token`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to get host token"
    );
  }
};

// Join live session (User)
export const joinLiveSession = async (
  sessionId: string
): Promise<{
  success: boolean;
  message?: string;
  token?: string;
  appId?: string;
  channelName?: string;
  uid?: number;
  participant?: LiveParticipant;
  liveSession?: LiveSession;
  pricePerMinute?: number;
  error?: string;
}> => {
  try {
    const response = await api.post(`/live/${sessionId}/join`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to join live session",
    };
  }
};

// Leave live session (User)
export const leaveLiveSession = async (
  sessionId: string
): Promise<{
  success: boolean;
  message?: string;
  minutes?: number;
  cost?: number;
  totalMinutes?: number;
  totalCost?: number;
  error?: string;
}> => {
  try {
    const response = await api.post(`/live/${sessionId}/leave`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to leave live session",
    };
  }
};

// End live session (Astrologer)
export const endLiveSession = async (
  sessionId: string
): Promise<{
  success: boolean;
  message?: string;
  liveSession?: {
    id: string;
    totalViewers: number;
    maxViewers: number;
    totalRevenue: number;
    duration: number;
  };
  error?: string;
}> => {
  try {
    const response = await api.post(`/live/${sessionId}/end`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to end live session",
    };
  }
};

// Get all active live sessions (Public)
export const getActiveLiveSessions = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  liveSessions: LiveSession[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    const response = await api.get("/live/active", { params });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      liveSessions: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  }
};

// Get astrologer's live sessions (Astrologer only)
export const getAstrologerLiveSessions = async (params?: {
  page?: number;
  limit?: number;
  status?: "scheduled" | "live" | "ended" | "cancelled";
}): Promise<{
  success: boolean;
  liveSessions: LiveSession[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    const response = await api.get("/live/astrologer/sessions", { params });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      liveSessions: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  }
};

// Get live history (Astrologer only)
export const getLiveHistory = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  sessions: LiveHistorySession[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    const response = await api.get("/live/astrologer/history", { params });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      sessions: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  }
};

// Get live chat messages
export const getLiveChatMessages = async (
  sessionId: string,
  params?: {
    page?: number;
    limit?: number;
  }
): Promise<{
  success: boolean;
  messages: LiveChatMessage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    const response = await api.get(`/live/${sessionId}/messages`, { params });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      messages: [],
      pagination: { total: 0, page: 1, limit: 50, totalPages: 0 },
    };
  }
};
