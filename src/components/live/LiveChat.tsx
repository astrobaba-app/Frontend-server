"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, Smile } from "lucide-react";
import { useLiveStream } from "@/contexts/LiveStreamContext";
import { getLiveChatMessages } from "@/store/api/live/live";

const LiveChat: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, sendEmoji } = useLiveStream();

  // Load previous messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await getLiveChatMessages(sessionId, { limit: 100 });
        if (response.success && response.messages.length > 0) {
          // Messages are already being handled by context
          console.log("Loaded previous messages:", response.messages.length);
        }
      } catch (error) {
        console.error("Failed to load chat messages:", error);
      }
    };

    loadMessages();
  }, [sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending) return;

    setIsSending(true);
    const success = await sendMessage(message.trim());
    
    if (success) {
      setMessage("");
    } else {
      alert("Failed to send message");
    }
    
    setIsSending(false);
  };

  const handleEmojiClick = async (emoji: string) => {
    if (isSending) return;

    setIsSending(true);
    const success = await sendEmoji(emoji);
    
    if (!success) {
      alert("Failed to send emoji");
    }
    
    setShowEmojiPicker(false);
    setIsSending(false);
  };

  // Popular emoji list
  const emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
    "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗",
    "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤑",
    "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑",
    "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔",
    "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮",
    "🤧", "🥵", "🥶", "😵", "🤯", "🤠", "🥳", "😎",
    "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯",
    "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥",
    "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩",
    "😫", "🥱", "😤", "😡", "😠", "🤬", "👍", "👎",
    "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👏", "🙌",
    "👐", "🤲", "🤝", "🙏", "✨", "💫", "⭐", "🌟",
    "💥", "💢", "💯", "💪", "🔥", "✅", "❤️", "💔",
    "💕", "💖", "💗", "💓", "💞", "💝", "💘", "💟",
    "❣️", "💌", "💋", "💎", "🎉", "🎊", "🎈", "🎁"
  ];

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {msg.userPhoto ? (
                  <img
                    src={msg.userPhoto}
                    alt={msg.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xs font-bold">
                    {msg.userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-gray-900">
                    {msg.userName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp || msg.createdAt || "").toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {msg.messageType === "emoji" ? (
                  <span className="text-3xl">{msg.message}</span>
                ) : (
                  <p className="text-sm text-gray-700 mt-1 break-words">
                    {msg.message}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4 bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          {/* Emoji Picker Button */}
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="px-3 py-2 text-gray-600 hover:text-yellow-500 transition-colors"
              disabled={isSending}
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Emoji Picker Dropdown */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 w-72 max-h-64 overflow-y-auto z-50">
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-2xl hover:bg-yellow-50 rounded p-1 transition-colors"
                      disabled={isSending}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            disabled={isSending}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="px-4 py-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveChat;
