import api from "@/store/api/index";

// ==================== SUPPORT TICKETS ====================

export interface CreateTicketPayload {
  subject: string;
  description: string;
  images?: string[];
  category?: string;
  priority?: string;
}

export interface ReplyToTicketPayload {
  message: string;
  attachments?: string[];
}

export const createSupportTicket = async (payload: CreateTicketPayload) => {
  try {
    const response = await api.post("/support/tickets", payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getMyTickets = async (params?: any) => {
  try {
    const response = await api.get("/support/tickets/my-tickets", { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getTicketDetails = async (ticketId: string) => {
  try {
    const response = await api.get(`/support/tickets/${ticketId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const replyToTicket = async (
  ticketId: string,
  payload: ReplyToTicketPayload
) => {
  try {
    const response = await api.post(
      `/support/tickets/${ticketId}/reply`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const uploadTicketImages = async (images: File[]) => {
  try {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    const response = await api.post("/support/upload", formData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
