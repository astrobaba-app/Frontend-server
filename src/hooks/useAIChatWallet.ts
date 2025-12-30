
import { useState, useEffect, useRef, useCallback } from 'react';
import { getWalletBalance } from '@/utils/wallet';

// AI pricing constants (can be moved to environment variables)
export const AI_CHAT_PRICE_PER_MINUTE = 10; // ₹10 per minute
export const AI_VOICE_PRICE_PER_MINUTE = 15; // ₹15 per minute

interface UseAIChatWalletOptions {
  userId: string;
  onInsufficientBalance?: () => void;
  onBalanceUpdate?: (newBalance: number) => void;
}

interface WalletDeduction {
  amount: number;
  type: 'chat' | 'voice';
  minutes: number;
}

export const useAIChatWallet = ({
  userId,
  onInsufficientBalance,
  onBalanceUpdate,
}: UseAIChatWalletOptions) => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tracking state
  const [chatMinutes, setChatMinutes] = useState(0);
  const [voiceMinutes, setVoiceMinutes] = useState(0);
  const [isChatting, setIsChatting] = useState(false);
  const [isVoiceCalling, setIsVoiceCalling] = useState(false);
  
  // Timer refs
  const chatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Last deduction tracking
  const lastChatDeductionRef = useRef<number>(0);
  const lastVoiceDeductionRef = useRef<number>(0);

  /**
   * Fetch wallet balance from API
   */
  const fetchBalance = useCallback(async () => {
    try {
      console.log('[PRODUCTION DEBUG FRONTEND] Fetching wallet balance...');
      setIsLoading(true);
      const walletData = await getWalletBalance();
      console.log('[PRODUCTION DEBUG FRONTEND] Wallet balance fetched:', {
        balance: walletData.balance,
        totalRecharge: walletData.totalRecharge,
        totalSpent: walletData.totalSpent
      });
      setBalance(walletData.balance);
      onBalanceUpdate?.(walletData.balance);
      setError(null);
    } catch (err: any) {
      console.error('[PRODUCTION DEBUG FRONTEND] Failed to fetch wallet balance:', {
        error: err.message,
        stack: err.stack
      });
      setError(err.message || 'Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  }, [onBalanceUpdate]);

  /**
   * Deduct amount from wallet for AI usage
   */
  const deductFromWallet = async (deduction: WalletDeduction): Promise<boolean> => {
    try {
      // Use NEXT_PUBLIC_API_BASE_URL for consistency with rest of codebase
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001/api';
      console.log('[PRODUCTION DEBUG FRONTEND] Deducting from wallet:', {
        amount: deduction.amount,
        type: deduction.type,
        minutes: deduction.minutes,
        apiUrl: API_URL,
        endpoint: `${API_URL}/wallet/ai-deduct`,
        hasAPI_BASE_URL: !!process.env.NEXT_PUBLIC_API_BASE_URL,
        hasAPI_URL: !!process.env.NEXT_PUBLIC_API_URL
      });
      
      const requestBody = {
        amount: deduction.amount,
        type: deduction.type,
        minutes: deduction.minutes,
      };
      console.log('[PRODUCTION DEBUG FRONTEND] Request body:', JSON.stringify(requestBody));
      
      const response = await fetch(`${API_URL}/wallet/ai-deduct`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[PRODUCTION DEBUG FRONTEND] Response status:', response.status);
      console.log('[PRODUCTION DEBUG FRONTEND] Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('[PRODUCTION DEBUG FRONTEND] Deduction failed:', {
          status: response.status,
          error: error
        });
        throw new Error(error.message || 'Failed to deduct from wallet');
      }

      const data = await response.json();
      console.log('[PRODUCTION DEBUG FRONTEND] Deduction successful:', {
        newBalance: data.newBalance,
        transaction: data.transaction
      });
      
      // Update local balance
      setBalance(data.newBalance);
      onBalanceUpdate?.(data.newBalance);
      
      console.log(`✓ Deducted ₹${deduction.amount} for ${deduction.type} (${deduction.minutes} min)`);
      return true;
    } catch (err: any) {
      console.error('[PRODUCTION DEBUG FRONTEND] Wallet deduction error:', {
        message: err.message,
        stack: err.stack,
        deduction
      });
      return false;
    }
  };

  /**
   * Check if user has sufficient balance
   */
  const checkSufficientBalance = (pricePerMinute: number): boolean => {
    return balance >= pricePerMinute;
  };

  /**
   * Start chat timer
   */
  const startChatTimer = useCallback(() => {
    if (isChatting) {
      console.log('[PRODUCTION DEBUG FRONTEND] Chat timer already running');
      return; // Already running
    }
    
    console.log('[PRODUCTION DEBUG FRONTEND] Starting chat timer...', {
      currentBalance: balance,
      pricePerMinute: AI_CHAT_PRICE_PER_MINUTE,
      hasSufficientBalance: balance >= AI_CHAT_PRICE_PER_MINUTE
    });
    setIsChatting(true);
    setChatMinutes(0);
    lastChatDeductionRef.current = 0;

    // Check initial balance
    if (!checkSufficientBalance(AI_CHAT_PRICE_PER_MINUTE)) {
      console.error('[PRODUCTION DEBUG FRONTEND] Insufficient balance to start chat:', {
        balance,
        required: AI_CHAT_PRICE_PER_MINUTE
      });
      onInsufficientBalance?.();
      return;
    }

    console.log('[PRODUCTION DEBUG FRONTEND] Chat timer started successfully');
    // Start timer - tick every second
    chatTimerRef.current = setInterval(() => {
      setChatMinutes((prevMinutes) => {
        const newMinutes = prevMinutes + 1 / 60; // Increment by 1 second (1/60 minute)
        const completedMinutes = Math.floor(newMinutes);

        // Check if we've completed a new minute
        if (completedMinutes > lastChatDeductionRef.current) {
          console.log('[PRODUCTION DEBUG FRONTEND] Completed minute:', {
            completedMinutes,
            lastDeduction: lastChatDeductionRef.current,
            currentBalance: balance
          });
          lastChatDeductionRef.current = completedMinutes;

          // Check balance before deduction
          if (checkSufficientBalance(AI_CHAT_PRICE_PER_MINUTE)) {
            console.log('[PRODUCTION DEBUG FRONTEND] Triggering chat deduction for minute:', completedMinutes);
            // Deduct for the completed minute
            deductFromWallet({
              amount: AI_CHAT_PRICE_PER_MINUTE,
              type: 'chat',
              minutes: completedMinutes,
            });
          } else {
            // Insufficient balance
            console.error('[PRODUCTION DEBUG FRONTEND] Insufficient balance during chat:', {
              balance,
              required: AI_CHAT_PRICE_PER_MINUTE
            });
            stopChatTimer();
            onInsufficientBalance?.();
          }
        }

        return newMinutes;
      });
    }, 1000); // Update every second
  }, [isChatting, balance, onInsufficientBalance]);

  /**
   * Stop chat timer
   */
  const stopChatTimer = useCallback(() => {
    console.log('[PRODUCTION DEBUG FRONTEND] Stopping chat timer...', {
      chatMinutes,
      alreadyDeducted: lastChatDeductionRef.current
    });
    setIsChatting(false);
    
    if (chatTimerRef.current) {
      clearInterval(chatTimerRef.current);
      chatTimerRef.current = null;
    }

    // Final deduction - round up to full minute
    // If user is at 1:40 (1.67 minutes), charge for 2 full minutes
    const totalMinutesUsed = Math.ceil(chatMinutes);
    const alreadyDeducted = lastChatDeductionRef.current;
    const remainingMinutes = totalMinutesUsed - alreadyDeducted;

    console.log('[PRODUCTION DEBUG FRONTEND] Final chat deduction calculation:', {
      totalMinutesUsed,
      alreadyDeducted,
      remainingMinutes,
      currentBalance: balance,
      costForRemaining: AI_CHAT_PRICE_PER_MINUTE * remainingMinutes
    });

    if (remainingMinutes > 0 && balance >= (AI_CHAT_PRICE_PER_MINUTE * remainingMinutes)) {
      console.log('[PRODUCTION DEBUG FRONTEND] Triggering final chat deduction');
      deductFromWallet({
        amount: AI_CHAT_PRICE_PER_MINUTE * remainingMinutes,
        type: 'chat',
        minutes: totalMinutesUsed,
      });
    } else {
      console.log('[PRODUCTION DEBUG FRONTEND] No final chat deduction needed or insufficient balance');
    }

    setChatMinutes(0);
    lastChatDeductionRef.current = 0;
    console.log('[PRODUCTION DEBUG FRONTEND] Chat timer stopped');
  }, [chatMinutes, balance]);

  /**
   * Start voice call timer
   */
  const startVoiceTimer = useCallback(() => {
    if (isVoiceCalling) {
      console.log('[PRODUCTION DEBUG FRONTEND] Voice timer already running');
      return; // Already running
    }
    
    console.log('[PRODUCTION DEBUG FRONTEND] Starting voice timer...', {
      currentBalance: balance,
      pricePerMinute: AI_VOICE_PRICE_PER_MINUTE,
      hasSufficientBalance: balance >= AI_VOICE_PRICE_PER_MINUTE
    });
    setIsVoiceCalling(true);
    setVoiceMinutes(0);
    lastVoiceDeductionRef.current = 0;

    // Check initial balance
    if (!checkSufficientBalance(AI_VOICE_PRICE_PER_MINUTE)) {
      console.error('[PRODUCTION DEBUG FRONTEND] Insufficient balance to start voice call:', {
        balance,
        required: AI_VOICE_PRICE_PER_MINUTE
      });
      onInsufficientBalance?.();
      return;
    }

    console.log('[PRODUCTION DEBUG FRONTEND] Voice timer started successfully');
    // Start timer
    voiceTimerRef.current = setInterval(() => {
      setVoiceMinutes((prevMinutes) => {
        const newMinutes = prevMinutes + 1 / 60;
        const completedMinutes = Math.floor(newMinutes);

        if (completedMinutes > lastVoiceDeductionRef.current) {
          console.log('[PRODUCTION DEBUG FRONTEND] Completed voice minute:', {
            completedMinutes,
            lastDeduction: lastVoiceDeductionRef.current,
            currentBalance: balance
          });
          lastVoiceDeductionRef.current = completedMinutes;

          if (checkSufficientBalance(AI_VOICE_PRICE_PER_MINUTE)) {
            console.log('[PRODUCTION DEBUG FRONTEND] Triggering voice deduction for minute:', completedMinutes);
            deductFromWallet({
              amount: AI_VOICE_PRICE_PER_MINUTE,
              type: 'voice',
              minutes: completedMinutes,
            });
          } else {
            console.error('[PRODUCTION DEBUG FRONTEND] Insufficient balance during voice call:', {
              balance,
              required: AI_VOICE_PRICE_PER_MINUTE
            });
            stopVoiceTimer();
            onInsufficientBalance?.();
          }
        }

        return newMinutes;
      });
    }, 1000);
  }, [isVoiceCalling, balance, onInsufficientBalance]);

  /**
   * Stop voice call timer
   */
  const stopVoiceTimer = useCallback(() => {
    console.log('[PRODUCTION DEBUG FRONTEND] Stopping voice timer...', {
      voiceMinutes,
      alreadyDeducted: lastVoiceDeductionRef.current
    });
    setIsVoiceCalling(false);
    
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }

    // Final deduction - round up to full minute
    // If user is at 1:40 (1.67 minutes), charge for 2 full minutes
    const totalMinutesUsed = Math.ceil(voiceMinutes);
    const alreadyDeducted = lastVoiceDeductionRef.current;
    const remainingMinutes = totalMinutesUsed - alreadyDeducted;

    console.log('[PRODUCTION DEBUG FRONTEND] Final voice deduction calculation:', {
      totalMinutesUsed,
      alreadyDeducted,
      remainingMinutes,
      currentBalance: balance,
      costForRemaining: AI_VOICE_PRICE_PER_MINUTE * remainingMinutes
    });

    if (remainingMinutes > 0 && balance >= (AI_VOICE_PRICE_PER_MINUTE * remainingMinutes)) {
      console.log('[PRODUCTION DEBUG FRONTEND] Triggering final voice deduction');
      deductFromWallet({
        amount: AI_VOICE_PRICE_PER_MINUTE * remainingMinutes,
        type: 'voice',
        minutes: totalMinutesUsed,
      });
    } else {
      console.log('[PRODUCTION DEBUG FRONTEND] No final voice deduction needed or insufficient balance');
    }

    setVoiceMinutes(0);
    lastVoiceDeductionRef.current = 0;
    console.log('[PRODUCTION DEBUG FRONTEND] Voice timer stopped');
  }, [voiceMinutes, balance]);

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
      if (voiceTimerRef.current) {
        clearInterval(voiceTimerRef.current);
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
    chatCost: calculateCost(chatMinutes, AI_CHAT_PRICE_PER_MINUTE),
    startChatTimer,
    stopChatTimer,
    
    // Voice
    isVoiceCalling,
    voiceMinutes,
    voiceDuration: formatTime(voiceMinutes),
    voiceCost: calculateCost(voiceMinutes, AI_VOICE_PRICE_PER_MINUTE),
    startVoiceTimer,
    stopVoiceTimer,
    
    // Pricing
    AI_CHAT_PRICE_PER_MINUTE,
    AI_VOICE_PRICE_PER_MINUTE,
  };
};
