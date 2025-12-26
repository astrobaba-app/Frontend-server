"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyTickets } from "@/store/api/support";
import {
  FaPlus,
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

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
  lastRepliedAt?: string;
}

export default function SupportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterStatus !== "all") params.status = filterStatus;

      const response = await getMyTickets(params);
      setTickets(response.tickets || []);
    } catch (error: any) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <FaClock className="text-orange-500" />;
      case "in_progress":
        return <FaExclamationCircle className="text-blue-500" />;
      case "resolved":
      case "closed":
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaTicketAlt className="text-gray-500" />;
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-1">
              View and manage your support requests
            </p>
          </div>
          <button
            onClick={() => router.push("/support/create")}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <FaPlus />
            Create Ticket
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaTicketAlt className="mx-auto text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Tickets Found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't created any support tickets yet.
            </p>
            <button
              onClick={() => router.push("/support/create")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => router.push(`/support/${ticket.id}`)}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(ticket.status)}
                      <span className="text-sm font-semibold text-gray-500">
                        {ticket.ticketNumber}
                      </span>
                      <span
                        className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                        style={{ backgroundColor: getStatusColor(ticket.status) }}
                      >
                        {formatStatus(ticket.status)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {ticket.subject}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {formatDate(ticket.createdAt)}
                      </span>
                      {ticket.category && (
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                          {formatStatus(ticket.category)}
                        </span>
                      )}
                      {ticket.priority && (
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
