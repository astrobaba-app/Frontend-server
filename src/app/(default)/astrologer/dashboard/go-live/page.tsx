"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Video, DollarSign, FileText, Image as ImageIcon } from "lucide-react";
import {
  createLiveSession,
  getAstrologerLiveSessions,
  getHostToken,
} from "@/store/api/live/live";

const GoLivePage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerMinute, setPricePerMinute] = useState("10");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    try {
      const response = await getAstrologerLiveSessions({ status: "live", limit: 1 });
      if (response.success && response.liveSessions.length > 0) {
        setHasActiveSession(true);
        setActiveSessionId(response.liveSessions[0].id);
      }
    } catch (error) {
      console.error("Failed to check active session:", error);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoLive = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !pricePerMinute) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCreating(true);

    try {
      const response = await createLiveSession({
        title: title.trim(),
        description: description.trim() || undefined,
        pricePerMinute: parseFloat(pricePerMinute),
        sessionType: "live_stream",
        thumbnail: thumbnail || undefined,
      });

      if (response.success && response.liveSession) {
        // Get host token
        const tokenResponse = await getHostToken(response.liveSession.id);
        
        // Navigate to live stream page
        router.push(`/astrologer/live/${response.liveSession.id}`);
      } else {
        alert(response.error || "Failed to start live session");
      }
    } catch (error: any) {
      console.error("Failed to go live:", error);
      alert(error.message || "Failed to start live session");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinActiveSession = () => {
    if (activeSessionId) {
      router.push(`/astrologer/live/${activeSessionId}`);
    }
  };

  if (hasActiveSession) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            You're Already Live!
          </h2>
          <p className="text-gray-600 mb-6">
            You have an active live session running. Join it to continue streaming.
          </p>
          <button
            onClick={handleJoinActiveSession}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors w-full mb-3"
          >
            Join Active Session
          </button>
          <button
            onClick={() => setHasActiveSession(false)}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors w-full"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Go Live</h1>
        <p className="text-gray-600 mt-1">
          Start a live session and connect with users in real-time
        </p>
      </div>

      <form onSubmit={handleGoLive} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Session Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Ask Me Anything - Vedic Astrology"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            required
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you'll discuss in this session..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Price Per Minute (₹) *
          </label>
          <input
            type="number"
            value={pricePerMinute}
            onChange={(e) => setPricePerMinute(e.target.value)}
            min="1"
            max="1000"
            step="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Users will be charged ₹{pricePerMinute} per minute for joining your live session
          </p>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Thumbnail (Optional)
          </label>
          <div className="flex items-start gap-4">
            {thumbnailPreview && (
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              <p className="text-xs text-gray-500 mt-2">
                Recommended: 16:9 aspect ratio, max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isCreating || !title.trim()}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Starting Live Session...
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Go Live Now
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Make sure your camera and microphone are working properly
            before going live. Users will be able to see and hear you during the session.
          </p>
        </div>
      </form>
    </div>
  );
};

export default GoLivePage;
