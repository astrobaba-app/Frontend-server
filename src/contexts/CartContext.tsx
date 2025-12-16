import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMyCart, getCartCount } from "@/store/api/store";

interface CartItem {
  _id: string; // cart item id from backend
  productId: string; // product UUID
  productName: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  images?: string[];
  productType: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  fetchCartCount: () => Promise<void>;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyCart();
      const apiCart = data.cart;
      const items = (apiCart?.items || []).map((item: any) => ({
        _id: item.id,
        productId: item.productId,
        productName: item.product?.productName ?? "",
        price: Number(item.product?.price ?? item.priceAtAdd ?? 0),
        discountPrice: item.product?.discountPrice
          ? Number(item.product.discountPrice)
          : undefined,
        quantity: item.quantity,
        images: item.product?.images || [],
        productType: item.product?.productType || "physical",
      }));

      setCartItems(items);
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError(err?.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const data = await getCartCount();
      setCartCount(data.count || 0);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const itemPrice = item.discountPrice || item.price;
    return total + itemPrice * item.quantity;
  }, 0);

  useEffect(() => {
    fetchCart();
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        error,
        fetchCart,
        fetchCartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
