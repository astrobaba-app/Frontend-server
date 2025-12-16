import { useState, useEffect, useRef, useCallback } from 'react';
import { getWalletBalance } from '@/utils/wallet';

interface UseAstrologerChatWalletProps {
  userId?: string;
  astrologerPricePerMinute: number; // Dynamic price from astrologer
  onInsufficientBalance?: () => void;
  onBalanceUpdate?: (newBalance: number) => void;
}

interface WalletDeduction {
  amount: number;
  type: 'chat';
  minutes: number;
}

interface UseAstrologerChatWalletReturn {
  // Balance state
  balance: number;
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  hasSufficientBalance: (minAmount: number) => boolean;
  
  // Chat state
  isChatting: boolean;
  chatMinutes: number;
  chatDuration: string; // "MM:SS"
  chatCost: number;
  
  // Actions
  startChatTimer: () => void;
  stopChatTimer: () => void;
  
  // Pricing
  pricePerMinute: number;
}

export const useAstrologerChatWallet = ({
  userId,
  astrologerPricePerMinute,
  onInsufficientBalance,
  onBalanceUpdate,
}: UseAstrologerChatWalletProps): UseAstrologerChatWalletReturn => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Chat timer state
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [chatMinutes, setChatMinutes] = useState<number>(0);
  
  // Refs for timers and tracking
  const chatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastChatDeductionRef = useRef<number>(0);

  /**
   * Fetch wallet balance from API
   */
  const fetchBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      const walletData = await getWalletBalance();
      setBalance(walletData.balance);
      onBalanceUpdate?.(walletData.balance);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch wallet balance:', err);
      setError(err.message || 'Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  }, [onBalanceUpdate]);

  /**
   * Deduct amount from wallet for astrologer chat usage
   */
  const deductFromWallet = async (deduction: WalletDeduction): Promise<boolean> => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001/api';
      
      const response = await fetch(`${API_URL}/wallet/ai-deduct`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: deduction.amount,
          type: deduction.type,
          minutes: deduction.minutes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to deduct from wallet');
      }

      const data = await response.json();
      
      // Update local balance
      setBalance(data.newBalance);
      onBalanceUpdate?.(data.newBalance);
      
      console.log(`✓ Deducted ₹${deduction.amount} for ${deduction.type} (${deduction.minutes} min)`);
      return true;
    } catch (err: any) {
      console.error('Wallet deduction error:', err);
      return false;
    }
  };

  /**
   * Check if balance is sufficient for minimum amount
   */
  const checkSufficientBalance = useCallback((minAmount: number): boolean => {
    return balance >= minAmount;
  }, [balance]);

  /**
   * Start chat timer
   */
  const startChatTimer = useCallback(() => {
    if (isChatting) return; // Already running
    
    console.log(`Starting astrologer chat timer at ₹${astrologerPricePerMinute}/min...`);
    setIsChatting(true);
    setChatMinutes(0);
    lastChatDeductionRef.current = 0;

    // Check initial balance
    if (!checkSufficientBalance(astrologerPricePerMinute)) {
      console.log('Insufficient balance to start chat');
      onInsufficientBalance?.();
      return;
    }

    // Start timer (tick every second)
    chatTimerRef.current = setInterval(() => {
      setChatMinutes((prevMinutes) => {
        const newMinutes = prevMinutes + 1 / 60; // Add 1 second
        const completedMinutes = Math.floor(newMinutes);

        // Deduct every completed minute
        if (completedMinutes > lastChatDeductionRef.current) {
          lastChatDeductionRef.current = completedMinutes;

          // Check if balance is sufficient for this deduction
          if (checkSufficientBalance(astrologerPricePerMinute)) {
            deductFromWallet({
              amount: astrologerPricePerMinute,
              type: 'chat',
              minutes: completedMinutes,
            });
          } else {
            console.log('Insufficient balance during chat');
            stopChatTimer();
            onInsufficientBalance?.();
          }
        }

        return newMinutes;
      });
    }, 1000); // Update every second
  }, [isChatting, balance, astrologerPricePerMinute, onInsufficientBalance]);

  /**
   * Stop chat timer
   */
  const stopChatTimer = useCallback(() => {
    console.log('Stopping astrologer chat timer...');
    setIsChatting(false);
    
    if (chatTimerRef.current) {
      clearInterval(chatTimerRef.current);
      chatTimerRef.current = null;
    }

    // Final deduction - round up to full minute
    // If user chatted for any amount of time, charge at least 1 minute
    // If user is at 1:40 (1.67 minutes), charge for 2 full minutes
    const totalMinutesUsed = chatMinutes > 0 ? Math.ceil(chatMinutes) : 1;
    const alreadyDeducted = lastChatDeductionRef.current;
    const remainingMinutes = totalMinutesUsed - alreadyDeducted;

    if (remainingMinutes > 0 && balance >= (astrologerPricePerMinute * remainingMinutes)) {
      deductFromWallet({
        amount: astrologerPricePerMinute * remainingMinutes,
        type: 'chat',
        minutes: totalMinutesUsed,
      });
    }

    setChatMinutes(0);
    lastChatDeductionRef.current = 0;
  }, [chatMinutes, balance, astrologerPricePerMinute]);

  /**
   * Format minutes to MM:SS
   */
  const formatTime = (minutes: number): string => {
    const totalSeconds = Math.floor(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Calculate cost so far
   */
  const calculateCost = (minutes: number, pricePerMinute: number): number => {
    return Math.ceil(minutes * pricePerMinute);
  };

  // Load balance on mount
  useEffect(() => {
    if (userId) {
      fetchBalance();
    }
  }, [userId, fetchBalance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chatTimerRef.current) {
        clearInterval(chatTimerRef.current);
      }
    };
  }, []);

  return {
    // Balance
    balance,
    isLoading,
    error,
    fetchBalance,
    hasSufficientBalance: checkSufficientBalance,
    
    // Chat
    isChatting,
    chatMinutes,
    chatDuration: formatTime(chatMinutes),
    chatCost: calculateCost(chatMinutes, astrologerPricePerMinute),
    startChatTimer,
    stopChatTimer,
    
    // Pricing
    pricePerMinute: astrologerPricePerMinute,
  };
};
