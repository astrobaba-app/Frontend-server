"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, User, Phone, ChevronRight } from 'lucide-react';
import { IoChatbubblesSharp } from "react-icons/io5";
import Link from 'next/link';
import Image from 'next/image';
import { FiCheckCircle } from 'react-icons/fi'; // Used for message status checkmark
import { colors } from '@/utils/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
// Custom colors based on the design


// Placeholder Astrologer/User Data (matching the design)
const ASTROLOGER_INFO = {
  name: "Astro Preeti",
  title: "Numerology, Face Reading",
  photo: "/images/astrologer_preeti.jpg", // Replace with actual path
  isOnline: true,
};

const USER_INFO = {
  balance: 2000,
};

const INITIAL_PROMPTS = [
  "What does my chatr say about my career?",
  "When will I find Love?",
  "What are my Strengths?",
  "Tell me about my Sade sati",
];

const PREVIOUS_CHATS = [
  "When will I find Love?",
  "When will I find Love?",
  "When will I find Love?",
  "When will I find Love?",
];


const ChatPage = () => {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<
    { id: number; text: string; sender: "user" | "bot"; timestamp: string }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/auth/login');
    }
  }, [isLoggedIn, loading, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Don't render anything while checking auth or if not logged in
  if (loading || !isLoggedIn) {
    return null;
  }

  const handleSendMessage = (e: React.FormEvent, messageText: string = inputMessage) => {
    e.preventDefault();
    
    if (messageText.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: "user" as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate Bot response after a short delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: `The stars are aligning to analyze your query: "${messageText}". Please wait for the astrologer to connect.`,
        sender: "bot" as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    // Treat prompt click as sending a user message
    handleSendMessage({ preventDefault: () => {} } as React.FormEvent, prompt);
  };

  // Check if initial prompts should be shown
  const showInitialContent = messages.length === 0;

  return (
    <div className=" flex font-inter bg-gray-50">
      {/* 1. Left Sidebar (Fixed) */}
      <div className="hidden lg:flex flex-col w-80  border-r border-gray-200">
        {/* Astrologer Info Header */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-100">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image 
                src={ASTROLOGER_INFO.photo || "/images/logo.png"} 
                alt={ASTROLOGER_INFO.name} 
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            {ASTROLOGER_INFO.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{ASTROLOGER_INFO.name}</h2>
            <p className="text-xs text-gray-500">{ASTROLOGER_INFO.title}</p>
          </div>
        </div>
        
        {/* Chat/Call Tabs (Matching the design image) */}
        <div className="flex p-4 gap-2 border-b border-gray-100">
          <button 
            className="flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-bold shadow-md" 
            style={{ backgroundColor: colors.primeYellow, color: colors.darkGray }}
          >
            <IoChatbubblesSharp className="w-5 h-5 mr-2" />Chat
          </button>
          <button 
            className="flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-bold bg-white text-gray-600 border border-gray-300 shadow-sm"
          >
            <Phone className="w-5 h-5 mr-2" />Call
          </button>
        </div>

        {/* Balance */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-center bg-green-100 text-green-700 font-semibold py-2 rounded-lg text-sm">
            Available balance: ₹{USER_INFO.balance.toLocaleString()}
          </div>
        </div>

        {/* New Chat & Past Conversations */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-800 mb-3 uppercase">+ New Chat</h3>
          <h3 className="text-sm font-bold text-gray-800 mb-2">Past Conversation</h3>
          
          <ul className="space-y-1">
            {PREVIOUS_CHATS.map((chat, index) => (
              <li key={index}>
                <Link href="#" className="flex justify-between items-center p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  {chat}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* 2. Right Chat Area (Main Content) */}
      <div className="flex-1 flex flex-col">
        {/* Header - Back, Timer, Profile */}
        <div className=" border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="lg:hidden hover:bg-gray-100 p-2 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </Link>
            <span className="text-sm text-gray-600 ml-2">2:39 min</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-green-500 cursor-pointer" />
            <div className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1 cursor-pointer">
              <span className="text-sm font-semibold text-gray-700 mr-2">Profile</span>
              <User className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Chat Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-4"
          style={{
            backgroundImage: `url("/images/bg4.png")`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'contain',
          }}
        >
          {showInitialContent ? (
            // Initial Content (Matching Design Image)
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-8">
                <Image 
                  src="/images/shooting-stars.png" // Replace with actual path for shooting stars icon
                  alt="Shooting Stars"
                  width={60}
                  height={60}
                  className="mx-auto mb-4"
                />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Namaste, John Doe</h2>
                <p className="text-gray-600 max-w-sm mx-auto">
                  I have prepared your birth chart. The stars have much to reveal. Ask me anything about your destiny.
                </p>
              </div>
              
              <div className="w-full max-w-sm space-y-3">
                {INITIAL_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="w-full py-3 px-4 bg-white rounded-lg border border-gray-200 text-gray-800 font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Conversation History
            <div className="max-w-4xl mx-auto px-2">
              <div className="flex justify-center mb-4">
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-600 font-medium">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-[65%] rounded-lg px-3 py-2 shadow-md ${
                      message.sender === 'user'
                        ? 'bg-[#F0DF20] text-gray-900 rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                    <div className={`flex items-center justify-end gap-1 mt-1`}>
                      <p className="text-[10px] text-gray-600">
                        {message.timestamp}
                      </p>
                      {message.sender === 'user' && (
                        <FiCheckCircle className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Fixed Input Bar */}
        <div className=" border-t border-gray-200 px-4 py-3 sticky bottom-0">
          <form 
            onSubmit={(e) => handleSendMessage(e, inputMessage)}
            className="max-w-4xl mx-auto flex items-center gap-3"
          >
            <div className="flex-1 flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-300">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Anything Form Our Astrologer......"
                className="flex-1 px-5 py-3 bg-transparent focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className={`
                rounded-full p-3 transition-all duration-200 flex items-center justify-center shadow-md shrink-0
                ${inputMessage.trim() 
                  ? 'bg-[#F0DF20] hover:bg-[#ffea00] hover:scale-105' 
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
              aria-label="Send message"
            >
              <Send className={`w-5 h-5 ${inputMessage.trim() ? 'text-gray-900' : 'text-gray-500'}`} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;