"use client";

import React, { useEffect, useState } from "react";
import { useLiveStream } from "@/contexts/LiveStreamContext";

interface FloatingMessage {
  id: string;
  userName: string;
  userPhoto?: string;
  message: string;
  messageType: "text" | "emoji" | "system";
  timestamp: number;
}

const FloatingMessages: React.FC = () => {
  const [floatingMessages, setFloatingMessages] = useState<FloatingMessage[]>([]);
  const { messages } = useLiveStream();

  useEffect(() => {
    // Get the latest message
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      // Create floating message
      const floatingMsg: FloatingMessage = {
        id: latestMessage.id,
        userName: latestMessage.userName,
        userPhoto: latestMessage.userPhoto,
        message: latestMessage.message,
        messageType: latestMessage.messageType,
        timestamp: Date.now(),
      };

      // Add to floating messages
      setFloatingMessages((prev) => [...prev, floatingMsg]);

      // Remove after 5 seconds
      setTimeout(() => {
        setFloatingMessages((prev) =>
          prev.filter((msg) => msg.id !== floatingMsg.id)
        );
      }, 5000);
    }
  }, [messages]);

  return (
    <div className="fixed left-4 bottom-20 z-40 pointer-events-none">
      <div className="flex flex-col-reverse gap-2">
        {floatingMessages.map((msg, index) => (
          <div
            key={msg.id}
            className="animate-float-up"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 max-w-xs shadow-lg">
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                  <div className="text-yellow-400 text-xs font-semibold">
                    {msg.userName}
                  </div>
                  {msg.messageType === "emoji" ? (
                    <div className="text-2xl leading-none mt-1">{msg.message}</div>
                  ) : (
                    <div className="text-white text-sm break-words">
                      {msg.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingMessages;
