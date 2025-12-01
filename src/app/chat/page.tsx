"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🙏 Namaste! Welcome to AstroBaba. How can I assist you with your cosmic journey today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage("");

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "Thank you for reaching out! Our astrologer will connect with you shortly to provide personalized guidance. ✨",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      <Header />
    <div className="h-screen flex flex-col  font-inter">
      <div className=" px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/" className="hover:bg-[#ffea00] p-2 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </Link>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Image 
                src="/images/logo.png" 
                alt="AstroBaba" 
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#F0DF20]"></div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900 font-['Poly']">AstroBaba Support</h1>
            <p className="text-xs text-gray-700">Online • Typically replies instantly</p>
          </div>
        </div>
      </div>
      <div 
        className="flex-1 overflow-y-auto py-6 space-y-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c5a0' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#E5DCC5'
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Date Divider */}
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
                    <svg viewBox="0 0 16 15" width="16" height="15" className="text-blue-500">
                      <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Bar - WhatsApp Style */}
      <div className="bg-[#F5F1E8] border-t border-gray-300 px-2 sm:px-4 py-2 sticky bottom-0">
        <form 
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto flex items-center gap-2"
        >
          <div className="flex-1 flex items-center bg-white rounded-full shadow-md overflow-hidden">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-sm text-gray-900 placeholder-gray-500"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className={`
              rounded-full p-3 transition-all duration-200 flex items-center justify-center shadow-md
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
     </>
  );
};

export default ChatPage;
