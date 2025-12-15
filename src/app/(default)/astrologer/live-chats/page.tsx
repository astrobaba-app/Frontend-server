"use client";

import React, { useState } from "react";
import { 
  FiSearch, 
  FiPhone, 
  FiVideo, 
  FiMoreVertical,
  FiPaperclip,
  FiMic,
  FiCamera,
  FiSend,
  FiCheck,
  FiCheckCircle
} from "react-icons/fi";
import { colors } from "@/utils/colors";
import Image from "next/image";

// Mock data for chat users
const mockChatUsers = [
  {
    id: 1,
    name: "Rahul Sharma",
    lastMessage: "Thank you for the reading!",
    time: "10:30 AM",
    unread: 2,
    online: true,
    avatar: null,
  },
  {
    id: 2,
    name: "Priya Patel",
    lastMessage: "Can we discuss my kundli?",
    time: "Yesterday",
    unread: 0,
    online: false,
    avatar: null,
  },
  {
    id: 3,
    name: "Amit Kumar",
    lastMessage: "When is the best time for marriage?",
    time: "2 days ago",
    unread: 1,
    online: true,
    avatar: null,
  },
  {
    id: 4,
    name: "Sneha Reddy",
    lastMessage: "Thank you so much!",
    time: "3 days ago",
    unread: 0,
    online: false,
    avatar: null,
  },
];

const mockChatRequests = [
  {
    id: 5,
    name: "Vikas Singh",
    message: "Hello, I need guidance about my career",
    time: "5 min ago",
    avatar: null,
  },
  {
    id: 6,
    name: "Anjali Gupta",
    message: "Looking for marriage compatibility analysis",
    time: "15 min ago",
    avatar: null,
  },
  {
    id: 7,
    name: "Rajesh Verma",
    message: "Need urgent consultation",
    time: "1 hour ago",
    avatar: null,
  },
];

const mockMessages = [
  {
    id: 1,
    text: "Namaste! I need guidance about my career path.",
    sender: "user",
    time: "10:25 AM",
    status: "read",
  },
  {
    id: 2,
    text: "🙏 Namaste! I'd be happy to help you with career guidance. Please share your birth details for accurate predictions.",
    sender: "astrologer",
    time: "10:26 AM",
    status: "delivered",
  },
  {
    id: 3,
    text: "Date: 15/03/1995, Time: 08:30 AM, Place: Mumbai",
    sender: "user",
    time: "10:27 AM",
    status: "read",
  },
  {
    id: 4,
    text: "Thank you for sharing. Let me analyze your chart. Your 10th house shows strong career prospects in technology and communication fields.",
    sender: "astrologer",
    time: "10:29 AM",
    status: "delivered",
  },
  {
    id: 5,
    text: "That's wonderful! Can you tell me about the timing?",
    sender: "user",
    time: "10:30 AM",
    status: "read",
  },
];

type TabType = "chats" | "requests";

export default function LiveChatsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("chats");
  const [selectedUser, setSelectedUser] = useState(mockChatUsers[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const filteredChats = mockChatUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = mockChatRequests.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // Handle send message logic here
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex">
      {/* Left Panel - Chat List */}
      <div className="w-96  border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.black }}>
            Live Chats
          </h2>
          
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700]"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "chats"
                ? "text-gray-900 border-b-2 border-[#FFD700] bg-yellow-50"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Chats
            {mockChatUsers.filter(u => u.unread > 0).length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#FFD700] text-xs rounded-full">
                {mockChatUsers.reduce((acc, u) => acc + u.unread, 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "requests"
                ? "text-gray-900 border-b-2 border-[#FFD700] bg-yellow-50"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Requests
            {mockChatRequests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {mockChatRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Chat/Request List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats" ? (
            // Chats List
            filteredChats.length > 0 ? (
              filteredChats.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedUser?.id === user.id ? "bg-yellow-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-700">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      {user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {user.time}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 truncate">
                          {user.lastMessage}
                        </p>
                        {user.unread > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-[#FFD700] text-xs rounded-full font-medium flex-shrink-0">
                            {user.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No chats found
              </div>
            )
          ) : (
            // Requests List
            filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-700">
                        {request.name.charAt(0)}
                      </span>
                    </div>

                    {/* Request Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {request.name}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {request.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.message}
                      </p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[#FFD700] text-sm font-medium rounded hover:bg-yellow-500 transition-colors">
                          Accept
                        </button>
                        <button className="px-3 py-1 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 transition-colors">
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No pending requests
              </div>
            )
          )}
        </div>
      </div>

      {/* Right Panel - Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className=" border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-700">
                        {selectedUser.name.charAt(0)}
                      </span>
                    </div>
                    {selectedUser.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedUser.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Voice Call">
                    <FiPhone className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Video Call">
                    <FiVideo className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="More Options">
                    <FiMoreVertical className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div 
              className="flex-1 overflow-y-auto p-6"
            >
              {/* Decorative Elements */}
              <div className="absolute top-20 right-10 opacity-5">
                <div className="text-9xl">☀️</div>
              </div>
              <div className="absolute bottom-20 left-10 opacity-5">
                <div className="text-9xl">🌙</div>
              </div>
              <div className="absolute top-1/3 right-1/4 opacity-5">
                <div className="text-7xl">⭐</div>
              </div>

              <div className="max-w-4xl mx-auto space-y-4 relative z-10">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "astrologer" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-3 shadow-sm ${
                        message.sender === "astrologer"
                          ? "bg-[#FFD700] text-gray-900"
                          : " text-gray-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-600">
                          {message.time}
                        </span>
                        {message.sender === "astrologer" && (
                          <span className="text-blue-500">
                            {message.status === "read" ? (
                              <FiCheckCircle className="w-3 h-3" />
                            ) : (
                              <FiCheck className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input Area */}
            <div className=" border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                {/* Attachment Button */}
                <button
                  type="button"
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  title="Attach file"
                >
                  <FiPaperclip className="w-5 h-5 text-gray-600" />
                </button>

                {/* Camera Button */}
                <button
                  type="button"
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  title="Take photo"
                >
                  <FiCamera className="w-5 h-5 text-gray-600" />
                </button>

                {/* Message Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-[#FFD700] bg-gray-50"
                  />
                  {/* Mic Button (when input is empty) */}
                  {!messageInput && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 rounded-full transition-colors"
                      title="Voice message"
                    >
                      <FiMic className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className={`p-3 rounded-full transition-colors ${
                    messageInput.trim()
                      ? "bg-[#FFD700] hover:bg-yellow-500"
                      : "bg-gray-200 cursor-not-allowed"
                  }`}
                  title="Send message"
                >
                  <FiSend className={`w-5 h-5 ${messageInput.trim() ? "text-gray-900" : "text-gray-400"}`} />
                </button>
              </form>
            </div>
          </>
        ) : (
          // No Chat Selected
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="text-center">
              <div className="text-8xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Live Chats
              </h3>
              <p className="text-gray-600">
                Select a conversation to start chatting with your clients
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
