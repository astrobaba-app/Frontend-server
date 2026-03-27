"use client";

import React, { useEffect, useMemo, useState } from "react";
import { colors } from "@/utils/colors";
import {
  getAstrologerEarningsDashboard,
  getAstrologerPayoutRequests,
  requestAstrologerPayout,
  type EarningHistoryItem,
  type EarningsSummary,
  type PayoutRequest,
} from "@/store/api/astrologer/earning";
import { FiDollarSign, FiClock, FiUser } from "react-icons/fi";

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

const formatMinutes = (value: number | string) => `${Number(value || 0).toFixed(0)} min`;

const consultationLabel: Record<string, string> = {
  chat: "Chat",
  voice_call: "Voice Call",
  video_call: "Video Call",
  live: "Live",
};

export default function AstrologerEarningPage() {
  const [loading, setLoading] = useState(true);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [earnings, setEarnings] = useState<EarningHistoryItem[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);

  const latestPayout = payoutRequests[0] || null;

  const canRequestPayout = useMemo(() => {
    if (!summary) return false;
    if (summary.availableForPayout <= 0) return false;
    return !latestPayout || !["requested", "processing"].includes(latestPayout.status);
  }, [summary, latestPayout]);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashboardRes, payoutRes] = await Promise.all([
        getAstrologerEarningsDashboard({ page: 1, limit: 30 }),
        getAstrologerPayoutRequests({ page: 1, limit: 10 }),
      ]);

      setSummary(dashboardRes.summary);
      setEarnings(dashboardRes.earnings || []);
      setPayoutRequests(payoutRes.payoutRequests || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load earning dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRequestPayout = async () => {
    if (!canRequestPayout) return;

    setRequestingPayout(true);
    setError(null);

    try {
      await requestAstrologerPayout();
      await loadDashboard();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to request payout");
    } finally {
      setRequestingPayout(false);
    }
  };

  return (
    <div className="md:px-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.black }}>
          My Earning
        </h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Chat Earning (Unpaid)</p>
            <p className="text-xl font-semibold" style={{ color: colors.black }}>
              {formatMoney(summary?.totalChatEarning || 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Voice Call Earning (Unpaid)</p>
            <p className="text-xl font-semibold" style={{ color: colors.black }}>
              {formatMoney(summary?.totalVoiceCallEarning || 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Video Call Earning (Unpaid)</p>
            <p className="text-xl font-semibold" style={{ color: colors.black }}>
              {formatMoney(summary?.totalVideoCallEarning || 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Available For Payout</p>
            <p className="text-xl font-semibold" style={{ color: colors.black }}>
              {formatMoney(summary?.availableForPayout || 0)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Platform fee</p>
            <p className="text-base font-semibold" style={{ color: colors.black }}>
              {summary?.platformFeePercentage || 10}% per minute
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Lifetime earned: {formatMoney(summary?.lifetimeNetEarning || 0)} | Ongoing chat earning: {formatMoney(summary?.ongoingChatEarning || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Paid out: {formatMoney(summary?.totalPaidOut || 0)} | Processing: {formatMoney(summary?.processingPayoutAmount || 0)}
            </p>
          </div>
          <button
            onClick={handleRequestPayout}
            disabled={!canRequestPayout || requestingPayout || loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-500 text-white hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {requestingPayout ? "Requesting..." : "Request Payout"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: colors.black }}>
              Earning History
            </h2>
            <div className="text-xs text-gray-500">Latest 30 entries</div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading earning history...</div>
          ) : earnings.length === 0 ? (
            <div className="p-10 text-center">
              <FiDollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No earning records yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Type</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">User</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Minutes</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Gross</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Fee</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Net</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {consultationLabel[item.consultationType] || item.consultationType}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-gray-400" />
                          <span>{item.user?.fullName || "User"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiClock className="text-gray-400" />
                          <span>{formatMinutes(item.durationMinutes)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatMoney(Number(item.totalAmount || 0))}</td>
                      <td className="px-4 py-3 text-sm text-red-600">-{formatMoney(Number(item.platformCommission || 0))}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatMoney(Number(item.netEarning || 0))}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.paymentStatus === "completed"
                              ? "bg-green-100 text-green-700"
                              : item.paymentStatus === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mt-6">
          <h3 className="text-base font-semibold mb-3" style={{ color: colors.black }}>
            Payout Requests
          </h3>
          {payoutRequests.length === 0 ? (
            <p className="text-sm text-gray-500">No payout requests yet.</p>
          ) : (
            <div className="space-y-2">
              {payoutRequests.map((request) => (
                <div key={request.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-gray-100 rounded-lg p-3">
                  <div className="text-sm text-gray-700">
                    {formatMoney(Number(request.requestedAmount || 0))} on {new Date(request.requestedAt).toLocaleString()}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
