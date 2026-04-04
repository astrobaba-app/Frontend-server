import api from "../index";
import { AxiosResponse } from "axios";

export interface ChatUserKundliListItem {
  id: string;
  fullName: string;
  dateOfbirth: string;
  timeOfbirth: string;
  placeOfBirth: string;
  gender: string;
  createdAt: string;
}

export interface UserKundlisForChatResponse {
  success: boolean;
  userRequests: ChatUserKundliListItem[];
  userName: string;
}

export interface ChatKundliShareViewResponse {
  success: boolean;
  shareUrl: string;
}

export const getUserKundlisForChat = async (
  sessionId: string
): Promise<UserKundlisForChatResponse> => {
  const response: AxiosResponse<UserKundlisForChatResponse> = await api.get(
    `/kundli/chat/${sessionId}/user-kundlis`
  );
  return response.data;
};

export const getKundliShareViewForChat = async (
  sessionId: string,
  userRequestId: string
): Promise<ChatKundliShareViewResponse> => {
  const response: AxiosResponse<ChatKundliShareViewResponse> = await api.get(
    `/kundli/chat/${sessionId}/kundli/${userRequestId}/share-view`
  );
  return response.data;
};
