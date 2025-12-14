'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Sparkles, Clock, Wallet as WalletIcon, Trash2, Plus, MessageSquare, Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { colors } from '@/utils/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  createChatSession, 
  sendMessage as sendMessageAPI, 
  getChatMessages,
  getMyChatSessions,
  deleteChatSession as deleteChatSessionAPI,
  clearChatSession as clearChatSessionAPI,
  createVoiceSession,
  getVoiceConfig,
  AIChatMessage,
  AIChatSession
} from '@/store/api/aichat';

// AI Astrologer Info
const AI_ASTROLOGER_INFO = {
  name: "AI Astrologer",
  title: "Your 24/7 Vedic AI Guide",
  photo: "/images/ai_astrologer.png",
  isOnline: true,
  status: "Always Available"
};

// Quick Prompt Suggestions
const PROMPT_SUGGESTIONS = [
  "What does my birth chart say about my career?",
  "When will I find love?",
  "What are my strengths and weaknesses?",
  "Tell me about my current planetary transits",
  "What is my lucky gemstone?",
  "How can I improve my financial situation?",
];

const AIChatPage = () => {
  const { isLoggedIn, loading, user } = useAuth();
  const router = useRouter();
  
  // Chat state
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<AIChatSession[]>([]);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Voice call state
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callStatus, setCallStatus] = useState<string>('Connecting...');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // Mock wallet balance - will be replaced with real data later
  const walletBalance = 1500;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/auth/login');
    }
  }, [isLoggedIn, loading, router]);

  // Load sessions on mount
  useEffect(() => {
    if (isLoggedIn) {
      loadSessions();
    }
  }, [isLoggedIn]);

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    }
  }, [currentSessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call timer
  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      setCallDuration(0);
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [isCallActive]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load all chat sessions
  const loadSessions = async () => {
    try {
      const response = await getMyChatSessions(1, 20);
      setSessions(response.sessions);
      
      // If there's at least one session, load it
      if (response.sessions.length > 0 && !currentSessionId) {
        setCurrentSessionId(response.sessions[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load sessions:', err);
      setError(err.message || 'Failed to load chat sessions');
    }
  };

  // Load messages for a session
  const loadMessages = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const response = await getChatMessages(sessionId, 1, 50);
      setMessages(response.messages);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new chat session
  const handleNewChat = async () => {
    try {
      setIsLoading(true);
      const response = await createChatSession();
      
      // Add to sessions list
      const newSession: AIChatSession = {
        id: response.session.id,
        userId: String(user?.id || ''),
        title: response.session.title,
        isActive: true,
        createdAt: response.session.createdAt,
        updatedAt: response.session.createdAt,
        lastMessageAt: response.session.createdAt,
      };
      
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
      setError(null);
    } catch (err: any) {
      console.error('Failed to create session:', err);
      setError(err.message || 'Failed to create new chat');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a chat session
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      await deleteChatSessionAPI(sessionId);
      
      // Remove from sessions list
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(updatedSessions);
      
      // If deleted session was active, switch to first available or create new
      if (currentSessionId === sessionId) {
        if (updatedSessions.length > 0) {
          setCurrentSessionId(updatedSessions[0].id);
        } else {
          setCurrentSessionId(null);
          setMessages([]);
        }
      }
    } catch (err: any) {
      console.error('Failed to delete session:', err);
      setError(err.message || 'Failed to delete chat');
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  };

  // Format call duration
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start voice call
  const handleStartCall = async () => {
    try {
      console.log('=== STARTING VOICE CALL ===');
      setIsConnecting(true);
      setCallStatus('Requesting microphone access...');
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      console.log('✅ Microphone access granted');
      
      setCallStatus('Connecting to AI...');
      
      // Get session configuration from backend
      console.log('Calling createVoiceSession API...');
      const response = await createVoiceSession();
      console.log('Voice session response:', response);
      
      if (!response.success) {
        const errorMsg = response.message || 'Failed to create session';
        throw new Error(errorMsg);
      }
      
      console.log('Model:', response.model);
      console.log('Voice:', response.voice);
      
      // Connect to backend WebSocket proxy (handles OpenAI auth)
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '') || 'localhost:6001';
      const wsUrl = `${wsProtocol}//${wsHost}/api/ai-voice-ws`;
      console.log('Connecting to backend WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected to backend');
        setCallStatus('Connected');
        setIsCallActive(true);
        setIsConnecting(false);
        
        // Backend proxy handles session configuration automatically
        // Start audio streaming
        startAudioStreaming(ws, stream);
      };
      
      ws.onmessage = (event) => {
        handleWebSocketMessage(event);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setCallStatus('Connection error');
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket closed');
        console.log('Close code:', event.code);
        console.log('Close reason:', event.reason);
        console.log('Was clean:', event.wasClean);
        setCallStatus('Disconnected');
        
        // Auto cleanup if closed unexpectedly
        if (isCallActive) {
          handleEndCall();
        }
      };
      
      console.log('=== VOICE CALL INITIATED ===');
    } catch (err: any) {
      console.error('=== VOICE CALL ERROR ===');
      console.error('Error:', err);
      console.error('Error message:', err.message);
      
      setError(err.message || 'Failed to start voice call');
      setIsConnecting(false);
      setCallStatus('Failed');
      
      // Cleanup on error
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      
      alert(`Failed to start call: ${err.message}`);
    }
  };
  
  // Start audio streaming from microphone to WebSocket
  const startAudioStreaming = (ws: WebSocket, stream: MediaStream) => {
    try {
      const audioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      processor.onaudioprocess = (e) => {
        if (isMuted || ws.readyState !== WebSocket.OPEN) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Convert Float32Array to Int16Array (PCM16)
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Convert to base64 and send to OpenAI
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
        
        ws.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: base64Audio
        }));
      };
      
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      console.log('✅ Audio streaming started (OpenAI server-side VAD active)');
    } catch (err) {
      console.error('Audio streaming error:', err);
    }
  };
  
  // Play base64-encoded PCM16 audio from response.audio.delta
  const playBase64Audio = (base64Audio: string) => {
    try {
      console.log('🎵 playBase64Audio called with length:', base64Audio.length);
      
      // Initialize audio context
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        nextPlayTimeRef.current = 0;
        console.log('Created new AudioContext');
      }
      
      const context = audioContextRef.current;
      
      // Resume if suspended
      if (context.state === 'suspended') {
        console.log('Resuming suspended AudioContext');
        context.resume();
      }
      
      // Decode base64 to binary
      const binaryString = atob(base64Audio);
      console.log('Decoded base64 to binary, length:', binaryString.length);
      
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Skip tiny chunks
      if (bytes.length < 2) {
        console.log('⚠️ Skipping tiny chunk:', bytes.length);
        return;
      }
      
      // Ensure even byte count for Int16Array
      const buffer = bytes.length % 2 === 0 ? bytes.buffer : (() => {
        console.log('⚠️ Padding odd byte length:', bytes.length);
        const padded = new Uint8Array(bytes.length + 1);
        padded.set(bytes);
        return padded.buffer;
      })();
      
      // Convert PCM16 to Float32
      const pcm16 = new Int16Array(buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF);
      }
      
      console.log('Converted to Float32, samples:', float32.length);
      
      // Create and schedule audio buffer
      const audioBuffer = context.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);
      
      console.log('Created AudioBuffer, duration:', audioBuffer.duration, 'seconds');
      
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      
      const now = context.currentTime;
      // Always play sequentially - never overlap
      const scheduledNext = nextPlayTimeRef.current || now;
      const startTime = Math.max(now + 0.01, scheduledNext); // At least 10ms from now, or after previous chunk
      
      console.log('Scheduling playback - now:', now.toFixed(3), 'scheduled:', scheduledNext.toFixed(3), 'actual startTime:', startTime.toFixed(3));
      
      source.start(startTime);
      source.onended = () => {
        console.log('✅ Audio chunk finished');
      };
      
      nextPlayTimeRef.current = startTime + audioBuffer.duration;
      setIsAISpeaking(true);
      setCallStatus('AI speaking...');
      
      console.log('✅ Audio queued, next play time:', nextPlayTimeRef.current);
    } catch (err) {
      console.error('❌ Audio playback error:', err);
      console.error('Error stack:', err instanceof Error ? err.stack : err);
    }
  };
  
  // Handle WebSocket messages from OpenAI
  const handleWebSocketMessage = async (event: MessageEvent) => {
    try {
      // Ignore binary PCM16 audio frames; we rely on JSON response.audio.delta
      if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
        console.log('Received binary audio frame from OpenAI, ignoring (using JSON response.audio.delta only)');
        return;
      }
      
      // Handle text/JSON data
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data.type);
      
      switch (data.type) {
        case 'connection.ready':
          console.log('Backend proxy ready');
          break;
          
        case 'session.created':
          console.log('Session created:', data.session);
          break;
          
        case 'session.updated':
          console.log('Session updated');
          setCallStatus('Ready');
          break;
          
        case 'response.created':
          console.log('Response created - resetting audio timing');
          // Reset playback timing for new response
          if (audioContextRef.current) {
            nextPlayTimeRef.current = audioContextRef.current.currentTime;
          }
          break;
          
        case 'response.output_item.added':
          console.log('Response output item added');
          break;
          
        case 'response.audio.delta':
          // Debug: Log the entire event to see structure
          console.log('🔊 Audio delta event keys:', Object.keys(data));
          console.log('🔊 Has delta?', 'delta' in data, 'Delta value:', data.delta?.substring(0, 50));
          console.log('🔊 Has audio?', 'audio' in data, 'Audio value:', (data as any).audio?.substring(0, 50));
          
          // Audio comes in the 'delta' field as base64-encoded PCM16
          const audioData = data.delta || (data as any).audio;
          if (audioData) {
            console.log('✅ Playing audio chunk, length:', audioData.length);
            playBase64Audio(audioData);
          } else {
            console.error('❌ No audio data found in response.audio.delta event');
          }
          break;
          
        case 'response.audio.done':
          console.log('Audio response completed');
          setCallStatus('Connected');
          setIsAISpeaking(false);
          // Clear any pending audio after a short delay
          setTimeout(() => {
            nextPlayTimeRef.current = 0;
          }, 100);
          break;
          
        case 'response.text.delta':
          console.log('Text delta:', data.delta);
          break;
          
        case 'response.done':
          console.log('Response completed');
          setCallStatus('Connected');
          break;
          
        case 'input_audio_buffer.speech_started':
          console.log('User started speaking');
          setCallStatus('Listening...');
          break;
          
        case 'input_audio_buffer.speech_stopped':
          console.log('User stopped speaking');
          setCallStatus('Processing...');
          break;
          
        case 'error':
        case 'auth_error':
          console.error('Error:', data.error);
          setCallStatus(`Error: ${data.error?.message || 'Unknown error'}`);
          handleEndCall();
          break;
          
        default:
          console.log('Unhandled message type:', data.type);
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  };
  
  // Play audio chunk received from OpenAI
  const playAudioChunk = (base64Audio: string) => {
    try {
      console.log('🎵 Playing audio chunk, base64 length:', base64Audio.length);
      
      // Create or resume audio context
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        console.log('Created new audio context for playback');
      }
      
      const context = audioContextRef.current;
      
      // Resume context if suspended (required by browser autoplay policies)
      if (context.state === 'suspended') {
        console.log('Resuming suspended audio context...');
        context.resume().then(() => {
          console.log('Audio context resumed');
        });
      }
      
      // Decode base64 to PCM16
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      console.log('Decoded bytes:', bytes.length);
      
      const pcm16 = new Int16Array(bytes.buffer);
      console.log('PCM16 samples:', pcm16.length);
      
      // Convert PCM16 to Float32
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF);
      }
      
      console.log('Float32 samples:', float32.length);
      
      // Create audio buffer and play
      const audioBuffer = context.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);
      
      console.log('Audio buffer duration:', audioBuffer.duration, 'seconds');
      
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      
      // Schedule playback at current time to prevent overlaps
      const startTime = Math.max(context.currentTime, (audioPlayerRef.current as any)?.nextStartTime || 0);
      console.log('Scheduling playback at:', startTime, 'current time:', context.currentTime);
      
      source.start(startTime);
      
      source.onended = () => {
        console.log('Audio chunk finished playing');
      };
      
      // Track next available start time for sequential playback
      (audioPlayerRef.current as any) = {
        nextStartTime: startTime + audioBuffer.duration
      };
      
      setCallStatus('AI speaking...');
      console.log('✅ Audio chunk queued for playback');
    } catch (err) {
      console.error('❌ Error playing audio chunk:', err);
      console.error('Error details:', err instanceof Error ? err.message : err);
    }
  };

  // End voice call
  const handleEndCall = () => {
    console.log('=== ENDING VOICE CALL ===');
    
    // Stop audio processor
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    // Stop microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // Reset playback timing
    nextPlayTimeRef.current = 0;
    
    setIsCallActive(false);
    setIsMuted(false);
    setCallDuration(0);
  };

  // Toggle mute
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    console.log('Microphone:', !isMuted ? 'Muted' : 'Unmuted');
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Will be opposite after state update
      });
    }
  };

  // Don't render while checking auth
  if (loading || !isLoggedIn) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent, messageText: string = inputMessage) => {
    e.preventDefault();
    
    if (messageText.trim() === "") return;
    if (!currentSessionId) {
      // Create a new session if none exists
      await handleNewChat();
      return;
    }

    const tempUserMessage: AIChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId: currentSessionId,
      role: 'user',
      content: messageText.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, tempUserMessage]);
    setInputMessage("");
    
    // Show typing indicator immediately
    setIsTyping(true);

    try {
      const response = await sendMessageAPI(currentSessionId, messageText.trim());
      
      // Remove temp message and add real messages
      setMessages((prev) => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMessage.id);
        
        const userMsg: AIChatMessage = {
          ...response.userMessage,
          sessionId: currentSessionId,
          updatedAt: response.userMessage.createdAt,
        };
        
        const aiMsg: AIChatMessage = {
          ...response.aiMessage,
          sessionId: currentSessionId,
          updatedAt: response.aiMessage.createdAt,
        };
        
        return [
          ...withoutTemp,
          userMsg,
          aiMsg
        ];
      });
      
      // Update session title in list if it changed
      const sessionIndex = sessions.findIndex(s => s.id === currentSessionId);
      if (sessionIndex !== -1) {
        const updatedSessions = [...sessions];
        updatedSessions[sessionIndex].lastMessageAt = new Date().toISOString();
        setSessions(updatedSessions);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message');
      // Remove temp message on error
      setMessages((prev) => prev.filter(m => m.id !== tempUserMessage.id));
    } finally {
      // Hide typing indicator
      setIsTyping(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage({ preventDefault: () => {} } as React.FormEvent, prompt);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Chat Sessions */}
      <div 
        className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-80 h-full bg-white border-r shadow-lg transition-transform duration-300 z-20 flex flex-col`}
        style={{ borderColor: colors.gray + '20' }}
      >
        {/* Sidebar Header */}
        <div 
          className="p-4 border-b space-y-2"
          style={{ borderColor: colors.gray + '20' }}
        >
          <button
            onClick={handleNewChat}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: colors.primeYellow, color: colors.white }}
          >
            <Plus size={20} />
            <span className="font-semibold">New Chat</span>
          </button>
          
          <button
            onClick={handleStartCall}
            disabled={isConnecting || isCallActive}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: colors.primeGreen, color: colors.white }}
          >
            <Phone size={20} />
            <span className="font-semibold">
              {isConnecting ? 'Connecting...' : isCallActive ? 'Call Active' : 'Voice Call'}
            </span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center" style={{ color: colors.gray }}>
              <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chat sessions yet</p>
              <p className="text-xs mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="p-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setCurrentSessionId(session.id)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors relative group`}
                  style={{
                    backgroundColor: currentSessionId === session.id ? colors.offYellow : colors.white,
                    border: currentSessionId === session.id ? `2px solid ${colors.primeYellow}` : '2px solid transparent'
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-medium text-sm truncate"
                        style={{ color: colors.darkGray }}
                      >
                        {session.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: colors.gray }}>
                        {formatDate(session.lastMessageAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                      style={{ color: colors.darkGray }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <div 
          className="shadow-md"
          style={{ backgroundColor: colors.white }}
        >
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Left: Menu toggle and AI info */}
            <div className="flex items-center gap-3 flex-1">
              <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MessageSquare size={24} style={{ color: colors.darkGray }} />
              </button>
              
              <Link href="/" className="hidden md:block">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ArrowLeft size={24} style={{ color: colors.darkGray }} />
                </button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.primeYellow }}
                  >
                    <Sparkles size={24} style={{ color: colors.white }} />
                  </div>
                  <span 
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                    style={{ backgroundColor: colors.primeGreen, borderColor: colors.white }}
                  ></span>
                </div>
                
                <div>
                  <h2 className="font-bold text-lg" style={{ color: colors.darkGray }}>
                    {AI_ASTROLOGER_INFO.name}
                  </h2>
                  <p className="text-sm" style={{ color: colors.gray }}>
                    {AI_ASTROLOGER_INFO.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Wallet */}
            <Link href="/profile/wallet">
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                style={{ backgroundColor: colors.primeYellow }}
              >
                <WalletIcon size={18} style={{ color: colors.white }} />
                <span className="font-semibold" style={{ color: colors.white }}>
                  ₹{walletBalance}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Error Message */}
            {error && (
              <div 
                className="mb-4 p-4 rounded-lg border"
                style={{ backgroundColor: '#FEE2E2', borderColor: '#FCA5A5', color: '#991B1B' }}
              >
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && messages.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200" style={{ borderTopColor: colors.primeYellow }}></div>
              </div>
            )}

            {/* No Session Selected */}
            {!currentSessionId && !isLoading && (
              <div className="flex flex-col items-center justify-center h-64">
                <Sparkles size={64} style={{ color: colors.primeYellow }} className="mb-4" />
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.darkGray }}>
                  Welcome to AI Astrologer
                </h3>
                <p className="text-center mb-6" style={{ color: colors.gray }}>
                  Start a new chat to get personalized Vedic astrology insights
                </p>
                <button
                  onClick={handleNewChat}
                  className="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: colors.primeYellow, color: colors.white }}
                >
                  Start New Chat
                </button>
              </div>
            )}

            {/* Messages */}
            {currentSessionId && (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[85%] md:max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className="shrink-0">
                        {message.role === 'assistant' ? (
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colors.primeYellow }}
                          >
                            <Sparkles size={20} style={{ color: colors.white }} />
                          </div>
                        ) : (
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colors.gray }}
                          >
                            <span className="text-white font-semibold text-sm">
                              {user?.fullName?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div>
                        <div
                          className="px-4 py-3 rounded-2xl shadow-sm"
                          style={{
                            backgroundColor: message.role === 'user' ? colors.primeYellow : colors.white,
                            color: message.role === 'user' ? colors.white : colors.darkGray,
                          }}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p 
                          className={`text-xs mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                          style={{ color: colors.gray }}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator - AI is typing */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex gap-3 items-end">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: colors.primeYellow }}
                      >
                        <Sparkles size={16} style={{ color: colors.white }} />
                      </div>
                      <div 
                        className="px-4 py-3 rounded-2xl"
                        style={{ backgroundColor: colors.white }}
                      >
                        <div className="flex gap-1 items-center">
                          <span 
                            className="w-2 h-2 rounded-full animate-bounce" 
                            style={{ 
                              backgroundColor: colors.darkGray,
                              animationDelay: '0ms',
                              animationDuration: '1s'
                            }}
                          ></span>
                          <span 
                            className="w-2 h-2 rounded-full animate-bounce" 
                            style={{ 
                              backgroundColor: colors.darkGray,
                              animationDelay: '200ms',
                              animationDuration: '1s'
                            }}
                          ></span>
                          <span 
                            className="w-2 h-2 rounded-full animate-bounce" 
                            style={{ 
                              backgroundColor: colors.darkGray,
                              animationDelay: '400ms',
                              animationDuration: '1s'
                            }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Quick Prompts (show only at start of new session) */}
            {currentSessionId && messages.length === 0 && !isLoading && (
              <div className="mt-8">
                <p className="text-sm font-medium mb-3" style={{ color: colors.gray }}>
                  Quick Questions:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PROMPT_SUGGESTIONS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="px-4 py-3 rounded-lg text-left text-sm hover:shadow-md transition-all border"
                      style={{ 
                        backgroundColor: colors.white,
                        borderColor: colors.primeYellow,
                        color: colors.darkGray
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed at bottom like ChatGPT */}
        <div 
          className="border-t"
          style={{ backgroundColor: colors.white, borderColor: colors.gray + '20' }}
        >
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message AI Astrologer..."
                disabled={!currentSessionId || isTyping}
                className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-2 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{ 
                  borderColor: colors.gray + '40',
                  backgroundColor: currentSessionId ? colors.white : '#F3F4F6',
                  color: colors.darkGray
                }}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || !currentSessionId || isTyping}
                className="px-4 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ 
                  backgroundColor: inputMessage.trim() && currentSessionId ? colors.primeYellow : colors.gray,
                  color: colors.white
                }}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Voice Call Modal */}
      {isCallActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
          <div 
            className="rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            style={{ backgroundColor: colors.white }}
          >
            {/* AI Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4 relative"
                style={{ backgroundColor: colors.primeYellow }}
              >
                <Sparkles size={48} style={{ color: colors.white }} />
                <div 
                  className="absolute inset-0 rounded-full opacity-75"
                  style={{ 
                    backgroundColor: colors.primeYellow,
                    animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                  }}
                ></div>
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ color: colors.darkGray }}>
                AI Astrologer
              </h3>
              <p className="text-sm mb-2" style={{ color: colors.gray }}>
                {callStatus}
              </p>
              <p className="text-2xl font-mono font-semibold" style={{ color: colors.primeYellow }}>
                {formatCallDuration(callDuration)}
              </p>
            </div>

            {/* Call Status */}
            <div className="text-center mb-6">
              <p className="text-sm font-medium" style={{ color: isMuted ? '#EF4444' : colors.primeGreen }}>
                {isMuted ? '🔇 Microphone Muted' : '🎤 Microphone Active'}
              </p>
            </div>

            {/* Call Controls */}
            <div className="flex justify-center gap-4">
              {/* Mute Button */}
              <button
                onClick={handleToggleMute}
                className="p-4 rounded-full transition-all hover:scale-110"
                style={{ 
                  backgroundColor: isMuted ? '#EF4444' : colors.gray,
                  color: colors.white 
                }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                className="p-4 rounded-full transition-all hover:scale-110"
                style={{ backgroundColor: '#EF4444', color: colors.white }}
                title="End Call"
              >
                <PhoneOff size={24} />
              </button>
            </div>

            {/* Info */}
            <div className="mt-6 p-3 rounded-lg" style={{ backgroundColor: colors.bg }}>
              <p className="text-xs text-center" style={{ color: colors.gray }}>
                🎙️ Real-time voice conversation powered by OpenAI
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatPage;
