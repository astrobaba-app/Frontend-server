"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getTicketDetails,
  replyToTicket,
  uploadTicketImages,
} from "@/store/api/support";
import {
  FaArrowLeft,
  FaClock,
  FaUser,
  FaPaperPlane,
  FaImage,
  FaTimes,
} from "react-icons/fa";

interface Reply {
  id: string;
  message: string;
  attachments: string[];
  repliedBy: string;
  repliedByType: string;
  createdAt: string;
  replier: {
    fullName?: string;
    name?: string;
  };
}

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  images: string[];
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  replies: Reply[];
}

export default function TicketDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyImages, setReplyImages] = useState<File[]>([]);
  const [replyImagePreviews, setReplyImagePreviews] = useState<string[]>([]);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await getTicketDetails(ticketId);
      // Merge replies into ticket object for easier access
      setTicket({
        ...response.ticket,
        replies: response.replies || [],
      });
    } catch (error: any) {
      console.error("Error fetching ticket details:", error);
      alert(error.message || "Failed to load ticket details");
      router.push("/support");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + replyImages.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }

    setReplyImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReplyImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReplyImage = (index: number) => {
    setReplyImages((prev) => prev.filter((_, i) => i !== index));
    setReplyImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      setSendingReply(true);

      let imageUrls: string[] = [];

      // Upload images if any
      if (replyImages.length > 0) {
        const uploadResponse = await uploadTicketImages(replyImages);
        imageUrls = uploadResponse.urls || [];
      }

      // Send reply
      await replyToTicket(ticketId, {
        message: replyMessage,
        attachments: imageUrls,
      });

      // Clear form
      setReplyMessage("");
      setReplyImages([]);
      setReplyImagePreviews([]);

      // Refresh ticket details
      await fetchTicketDetails();
    } catch (error: any) {
      console.error("Error sending reply:", error);
      alert(error.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      open: "#FFA500",
      in_progress: "#4169E1",
      resolved: "#228B22",
      closed: "#666",
    };
    return statusColors[status] || "#666";
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => router.push("/support")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FaArrowLeft />
          Back to Tickets
        </button>

        {/* Ticket Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-sm font-semibold text-gray-500">
                {ticket.ticketNumber}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                {ticket.subject}
              </h1>
            </div>
            <span
              className="px-3 py-1 text-sm font-semibold rounded-full text-white"
              style={{ backgroundColor: getStatusColor(ticket.status) }}
            >
              {formatStatus(ticket.status)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <FaClock />
              {formatDate(ticket.createdAt)}
            </span>
            {ticket.category && (
              <span className="px-2 py-1 bg-gray-100 rounded-md font-medium">
                {formatStatus(ticket.category)}
              </span>
            )}
            {ticket.priority && (
              <span
                className={`px-2 py-1 rounded-md font-medium ${
                  ticket.priority === "urgent"
                    ? "bg-red-100 text-red-700"
                    : ticket.priority === "high"
                    ? "bg-orange-100 text-orange-700"
                    : ticket.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {formatStatus(ticket.priority)} Priority
              </span>
            )}
          </div>

          <p className="text-gray-700 whitespace-pre-wrap mb-4">
            {ticket.description}
          </p>

          {/* Images */}
          {ticket.images && ticket.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ticket.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open(image, "_blank")}
                />
              ))}
            </div>
          )}
        </div>

        {/* Conversation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conversation</h2>

          <div className="space-y-4 mb-6">
            {ticket.replies && ticket.replies.length > 0 ? (
              ticket.replies.map((reply) => (
                <div
                  key={reply.id}
                  className={`p-4 rounded-lg ${
                    reply.repliedByType === "admin"
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "bg-gray-50 border-l-4 border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaUser
                      className={
                        reply.repliedByType === "admin"
                          ? "text-blue-500"
                          : "text-gray-500"
                      }
                    />
                    <span className="font-semibold text-gray-900">
                      {reply.replier?.fullName ||
                        reply.replier?.name ||
                        (reply.repliedByType === "admin"
                          ? "Support Team"
                          : "You")}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {reply.message}
                  </p>

                  {reply.attachments && reply.attachments.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {reply.attachments.map((attachment, index) => (
                        <img
                          key={index}
                          src={attachment}
                          alt={`Reply attachment ${index + 1}`}
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(attachment, "_blank")}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No replies yet. Our support team will respond soon.
              </p>
            )}
          </div>

          {/* Reply Form - Only show if ticket is not closed */}
          {ticket.status !== "closed" && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Add Reply</h3>

              {/* Image Previews */}
              {replyImagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {replyImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeReplyImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your message..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none mb-3"
              />

              <div className="flex items-center gap-3">
                {replyImages.length < 5 && (
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <FaImage className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Attach ({replyImages.length}/5)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}

                <button
                  onClick={handleSendReply}
                  disabled={sendingReply || !replyMessage.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                >
                  <FaPaperPlane />
                  {sendingReply ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
