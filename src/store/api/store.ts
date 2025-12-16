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

export const cancelOrder = async (orderNumber: string) => {
  try {
    const response = await api.post(`/store/orders/${orderNumber}/cancel`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
