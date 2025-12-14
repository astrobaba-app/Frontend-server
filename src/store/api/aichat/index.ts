import api from '../index';
import { AxiosResponse } from 'axios';

const BASE_URL = '/ai-chat';

// ============= TYPES =============

export interface AIChatSession {
  id: string;
  userId: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

export interface AIChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionResponse {
  success: boolean;
  message: string;
  session: {
    id: string;
    title: string;
    createdAt: string;
  };
}

export interface SendMessageResponse {
  success: boolean;
  userMessage: {
    id: string;
    role: 'user';
    content: string;
    createdAt: string;
  };
  aiMessage: {
    id: string;
    role: 'assistant';
    content: string;
    createdAt: string;
  };
  tokensUsed: number;
}

export interface GetSessionsResponse {
  success: boolean;
  sessions: AIChatSession[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetMessagesResponse {
  success: boolean;
  session: {
    id: string;
    title: string;
    createdAt: string;
    lastMessageAt: string;
  };
  messages: AIChatMessage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DeleteSessionResponse {
  success: boolean;
  message: string;
}

export interface ClearSessionResponse {
  success: boolean;
  message: string;
}

export interface VoiceSessionResponse {
  success: boolean;
  model: string;
  voice: string;
  userId: string;
  message?: string;
}

export interface VoiceConfigResponse {
  success: boolean;
  config: {
    model: string;
    voices: string[];
    defaultVoice: string;
    turnDetection: {
      type: string;
      threshold: number;
      prefix_padding_ms: number;
      silence_duration_ms: number;
    };
  };
}

// ============= API FUNCTIONS =============

/**
 * Create a new AI chat session
 */
export const createChatSession = async (): Promise<CreateSessionResponse> => {
  try {
    const response: AxiosResponse<CreateSessionResponse> = await api.post(`${BASE_URL}/create`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to create chat session', success: false };
  }
};

/**
 * Get all chat sessions for the user
 */
export const getMyChatSessions = async (page: number = 1, limit: number = 20): Promise<GetSessionsResponse> => {
  try {
    const response: AxiosResponse<GetSessionsResponse> = await api.get(`${BASE_URL}/sessions`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch chat sessions', success: false };
  }
};

/**
 * Get messages from a specific chat session
 */
export const getChatMessages = async (sessionId: string, page: number = 1, limit: number = 50): Promise<GetMessagesResponse> => {
  try {
    const response: AxiosResponse<GetMessagesResponse> = await api.get(`${BASE_URL}/session/${sessionId}/messages`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch chat messages', success: false };
  }
};

/**
 * Send a message in a chat session
 */
export const sendMessage = async (sessionId: string, message: string): Promise<SendMessageResponse> => {
  try {
    const response: AxiosResponse<SendMessageResponse> = await api.post(`${BASE_URL}/session/${sessionId}/send`, {
      message
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to send message', success: false };
  }
};

/**
 * Delete a chat session
 */
export const deleteChatSession = async (sessionId: string): Promise<DeleteSessionResponse> => {
  try {
    const response: AxiosResponse<DeleteSessionResponse> = await api.delete(`${BASE_URL}/session/${sessionId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to delete chat session', success: false };
  }
};

/**
 * Clear all messages from a chat session
 */
export const clearChatSession = async (sessionId: string): Promise<ClearSessionResponse> => {
  try {
    const response: AxiosResponse<ClearSessionResponse> = await api.delete(`${BASE_URL}/session/${sessionId}/clear`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to clear chat session', success: false };
  }
};

/**
 * Create a voice call session
 */
export const createVoiceSession = async (): Promise<VoiceSessionResponse> => {
  try {
    const response: AxiosResponse<VoiceSessionResponse> = await api.post(`${BASE_URL}/voice/session`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to create voice session', success: false };
  }
};

/**
 * Get voice call configuration
 */
export const getVoiceConfig = async (): Promise<VoiceConfigResponse> => {
  try {
    const response: AxiosResponse<VoiceConfigResponse> = await api.get(`${BASE_URL}/voice/config`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to get voice configuration', success: false };
  }
};
