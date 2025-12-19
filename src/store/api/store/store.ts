import api from "@/store/api/index";

// ==================== PRODUCTS ====================

export const getAllProducts = async (params?: any) => {
  try {
    const response = await api.get("/store/products", { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getProductById = async (productId: string) => {
  try {
    const response = await api.get(`/store/products/${productId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await api.get(`/store/products/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getFeaturedProducts = async (limit?: number) => {
  try {
    const response = await api.get("/store/products/featured", {
      params: { limit: limit || 10 },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/store/products/categories");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ==================== REVIEWS ====================

export const getProductReviews = async (productId: string, params?: any) => {
  try {
    const response = await api.get(`/store/reviews/products/${productId}`, {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const addProductReview = async (
  productId: string,
  payload: { rating: number; title?: string; review: string; images?: string[]; orderId?: string }
) => {
  try {
    const response = await api.post(`/store/reviews/products/${productId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ==================== CART ====================

export const addToCart = async (productId: string, quantity: number) => {
  try {
    const response = await api.post("/store/cart", { productId, quantity });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getMyCart = async () => {
  try {
    const response = await api.get("/store/cart");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getCartCount = async () => {
  try {
    const response = await api.get("/store/cart/count");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateCartQuantity = async (cartItemId: string, quantity: number) => {
  try {
    const response = await api.put(`/store/cart/${cartItemId}`, { quantity });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const removeFromCart = async (cartItemId: string) => {
  try {
    const response = await api.delete(`/store/cart/${cartItemId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete("/store/cart");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ==================== ORDERS ====================

export const checkout = async (orderData: any) => {
  try {
    const response = await api.post("/store/orders/checkout", orderData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const createRazorpayOrder = async (addressId?: string) => {
  try {
    const response = await api.post("/store/orders/create-razorpay-order", { addressId });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const verifyAndCreateOrder = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  addressId?: string;
  customerNotes?: string;
}) => {
  try {
    const response = await api.post("/store/orders/verify-and-create", paymentData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getMyOrders = async (params?: any) => {
  try {
    const response = await api.get("/store/orders", { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getOrderDetails = async (orderNumber: string) => {
  try {
    const response = await api.get(`/store/orders/${orderNumber}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const trackOrder = async (orderNumber: string) => {
  try {
    const response = await api.get(`/store/orders/${orderNumber}/track`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const cancelOrder = async (orderNumber: string, cancellationReason?: string) => {
  try {
    const response = await api.post(`/store/orders/${orderNumber}/cancel`, { cancellationReason });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ==================== ADDRESSES ====================

export interface StoreAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string | null;
  addressType: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllAddresses = async () => {
  try {
    const response = await api.get("/addresses");
    return response.data as {
      success: boolean;
      count: number;
      addresses: StoreAddress[];
    };
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const createAddress = async (payload: {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  landmark?: string | null;
  addressType?: string;
  isDefault?: boolean;
}) => {
  try {
    const response = await api.post("/addresses", payload);
    return response.data as {
      success: boolean;
      message: string;
      address: StoreAddress;
    };
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateAddress = async (
  id: string,
  payload: Partial<{
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    landmark?: string | null;
    addressType?: string;
    isDefault?: boolean;
  }>
) => {
  try {
    const response = await api.put(`/addresses/${id}`, payload);
    return response.data as {
      success: boolean;
      message: string;
      address: StoreAddress;
    };
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteAddress = async (id: string) => {
  try {
    const response = await api.delete(`/addresses/${id}`);
    return response.data as { success: boolean; message: string };
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const setDefaultAddress = async (id: string) => {
  try {
    const response = await api.put(`/addresses/${id}/set-default`);
    return response.data as {
      success: boolean;
      message: string;
      address: StoreAddress;
    };
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
