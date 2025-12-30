/**
 * Wallet utility functions for Razorpay integration and wallet management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface WalletBalance {
  balance: number;
  totalRecharge: number;
  totalSpent: number;
  isActive: boolean;
  totalAdded:number;  
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'razorpay' | 'manual' | 'refund' | 'bonus';
  description: string;
  balanceBefore: number | null;
  balanceAfter: number | null;
  createdAt: string;
  date: string;
}

export interface TransactionHistoryResponse {
  success: boolean;
  transactions: WalletTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RazorpayOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
    amountInPaise: number;
    currency: string;
    transactionId: string;
    key: string;
    couponApplied?: {
      code: string;
      discount: number;
    };
  };
}

/**
 * Fetch wallet balance
 */
export const getWalletBalance = async (): Promise<WalletBalance> => {
  console.log('[PRODUCTION DEBUG FRONTEND] getWalletBalance called');
  console.log('[PRODUCTION DEBUG FRONTEND] API_BASE_URL:', API_BASE_URL);
  console.log('[PRODUCTION DEBUG FRONTEND] Full URL:', `${API_BASE_URL}/wallet/balance`);
  
  const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('[PRODUCTION DEBUG FRONTEND] getWalletBalance response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[PRODUCTION DEBUG FRONTEND] getWalletBalance failed:', {
      status: response.status,
      errorText
    });
    throw new Error('Failed to fetch wallet balance');
  }

  const data = await response.json();
  console.log('[PRODUCTION DEBUG FRONTEND] getWalletBalance success:', {
    balance: data.wallet?.balance,
    hasWallet: !!data.wallet
  });
  return data.wallet;
};

/**
 * Get transaction history
 */
export const getTransactionHistory = async (
  page: number = 1,
  limit: number = 20,
  type?: 'credit' | 'debit',
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
): Promise<TransactionHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (type) params.append('type', type);
  if (status) params.append('status', status);

  const response = await fetch(`${API_BASE_URL}/wallet/transactions?${params}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transaction history');
  }

  return response.json();
};

/**
 * Create a recharge order
 */
export const createRechargeOrder = async (
  amount: number,
  couponCode?: string
): Promise<RazorpayOrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/wallet/recharge/create-order`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, couponCode }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create recharge order');
  }

  return response.json();
};

/**
 * Verify payment after Razorpay success
 */
export const verifyRecharge = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  const response = await fetch(`${API_BASE_URL}/wallet/recharge/verify`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to verify payment');
  }

  return response.json();
};

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

/**
 * Format amount with currency symbol
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Get status color for transactions
 */
export const getStatusColor = (
  status: 'pending' | 'completed' | 'failed' | 'refunded'
): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'failed':
      return 'text-red-600 bg-red-50';
    case 'refunded':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};
