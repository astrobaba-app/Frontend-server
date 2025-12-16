/**
 * AI Chat Wallet Integration Hook
 * Handles wallet balance tracking, per-minute deductions, and balance checks
 */

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
   * Deduct amount from wallet for AI usage
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
   * Check if user has sufficient balance
   */
  const checkSufficientBalance = (pricePerMinute: number): boolean => {
    return balance >= pricePerMinute;
  };

  /**
   * Start chat timer
   */
  const startChatTimer = useCallback(() => {
    if (isChatting) return; // Already running
    
    console.log('Starting chat timer...');
    setIsChatting(true);
    setChatMinutes(0);
    lastChatDeductionRef.current = 0;

    // Check initial balance
    if (!checkSufficientBalance(AI_CHAT_PRICE_PER_MINUTE)) {
      console.log('Insufficient balance to start chat');
      onInsufficientBalance?.();
      return;
    }

    // Start timer - tick every second
    chatTimerRef.current = setInterval(() => {
      setChatMinutes((prevMinutes) => {
        const newMinutes = prevMinutes + 1 / 60; // Increment by 1 second (1/60 minute)
        const completedMinutes = Math.floor(newMinutes);

        // Check if we've completed a new minute
        if (completedMinutes > lastChatDeductionRef.current) {
          lastChatDeductionRef.current = completedMinutes;

          // Check balance before deduction
          if (checkSufficientBalance(AI_CHAT_PRICE_PER_MINUTE)) {
            // Deduct for the completed minute
            deductFromWallet({
              amount: AI_CHAT_PRICE_PER_MINUTE,
              type: 'chat',
              minutes: completedMinutes,
            });
          } else {
            // Insufficient balance
            console.log('Insufficient balance during chat');
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
    console.log('Stopping chat timer...');
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

    if (remainingMinutes > 0 && balance >= (AI_CHAT_PRICE_PER_MINUTE * remainingMinutes)) {
      deductFromWallet({
        amount: AI_CHAT_PRICE_PER_MINUTE * remainingMinutes,
        type: 'chat',
        minutes: totalMinutesUsed,
      });
    }

    setChatMinutes(0);
    lastChatDeductionRef.current = 0;
  }, [chatMinutes, balance]);

  /**
   * Start voice call timer
   */
  const startVoiceTimer = useCallback(() => {
    if (isVoiceCalling) return; // Already running
    
    console.log('Starting voice timer...');
    setIsVoiceCalling(true);
    setVoiceMinutes(0);
    lastVoiceDeductionRef.current = 0;

    // Check initial balance
    if (!checkSufficientBalance(AI_VOICE_PRICE_PER_MINUTE)) {
      console.log('Insufficient balance to start voice call');
      onInsufficientBalance?.();
      return;
    }

    // Start timer
    voiceTimerRef.current = setInterval(() => {
      setVoiceMinutes((prevMinutes) => {
        const newMinutes = prevMinutes + 1 / 60;
        const completedMinutes = Math.floor(newMinutes);

        if (completedMinutes > lastVoiceDeductionRef.current) {
          lastVoiceDeductionRef.current = completedMinutes;

          if (checkSufficientBalance(AI_VOICE_PRICE_PER_MINUTE)) {
            deductFromWallet({
              amount: AI_VOICE_PRICE_PER_MINUTE,
              type: 'voice',
              minutes: completedMinutes,
            });
          } else {
            console.log('Insufficient balance during voice call');
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
    console.log('Stopping voice timer...');
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

    if (remainingMinutes > 0 && balance >= (AI_VOICE_PRICE_PER_MINUTE * remainingMinutes)) {
      deductFromWallet({
        amount: AI_VOICE_PRICE_PER_MINUTE * remainingMinutes,
        type: 'voice',
        minutes: totalMinutesUsed,
      });
    }

    setVoiceMinutes(0);
    lastVoiceDeductionRef.current = 0;
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
