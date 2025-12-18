"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
} from "lucide-react";
import RechargeModal from "@/components/wallet/RechargeModal";
import PaymentModal from "@/components/wallet/PaymentModal";
import {
  getWalletBalance,
  getTransactionHistory,
  formatAmount,
  formatDate,
  getStatusColor,
  WalletBalance,
  WalletTransaction,
} from "@/utils/wallet";

export default function WalletPage() {
  const { user } = useAuth();

  // State management
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    type: "success" | "failure";
    amount?: number;
    message?: string;
  }>({ isOpen: false, type: "success" });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const balanceData = await getWalletBalance();
      console.log("Wallet balance data:", balanceData);
      setBalance(balanceData);
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page: number = 1) => {
    try {
      setTransactionsLoading(true);
      const data = await getTransactionHistory(page, pagination.limit);
      setTransactions(data.transactions);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  const handleRechargeSuccess = async () => {
    setPaymentModal({
      isOpen: true,
      type: "success",
      message: "Wallet recharged successfully!",
    });
    await fetchWalletData();
    await fetchTransactions(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTransactions(newPage);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-10  sm:px-0">
      {/* HEADER & ACTION - Stacked on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <Heading level={1} className="text-xl sm:text-2xl font-bold text-gray-900">
            Wallet Dashboard
          </Heading>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage your funds and track spending
          </p>
        </div>
        <button
          onClick={() => setRechargeModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Recharge Wallet
        </button>
      </div>

      {/* BALANCE OVERVIEW CARDS - 1 col on mobile, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white-900 border-none rounded-xl shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-400/20 rounded-lg">
                <Wallet className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-gray-900 text-ms font-bold uppercase tracking-widest">
                Available Balance
              </span>
            </div>
            <div className="text-3xl font-bold text-black">
              {loading ? (
                <span>Loading...</span>
              ) : balance ? (
                <span>₹{balance.balance.toLocaleString('en-IN')}</span>
              ) : (
                <span>₹0</span>
              )}
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="w-32 h-32 text-white" />
          </div>
        </div>

        {/* Small stats cards - 2 cols on mobile for better space usage */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:contents">
          <Card className="p-4 sm:p-6 bg-white border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-green-50 rounded-xl">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Credits</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {loading ? "Loading..." : balance ? `₹${balance.totalRecharge.toLocaleString('en-IN')}` : "₹0"}
              </h3>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-red-50 rounded-xl">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Debits</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {loading ? "Loading..." : balance ? `₹${balance.totalSpent.toLocaleString('en-IN')}` : "₹0"}
              </h3>
            </div>
          </Card>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <Card className="border-gray-100 overflow-hidden bg-white">
        <div className=" border-b border-gray-50 flex items-center justify-between">
          <p className="font-bold text-md text-gray-900 flex items-center gap-2">
            Transactions
            {transactionsLoading && <RefreshCw className="w-4 h-4 animate-spin text-yellow-500" />}
          </p>
          <button
            onClick={() => fetchTransactions(1)}
            className="text-sm font-bold text-yellow-600 hover:text-yellow-700"
          >
            Refresh
          </button>
        </div>

        {/* Desktop Table - Hidden on small screens */}
        <div className="hidden md:block overflow-x-auto">
          {transactionsLoading ? (
            <div className="p-10 text-center text-sm text-gray-400">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">No transactions found.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 md:text-[14px] text-[10px]  uppercase tracking-tighter text-gray-400 font-bold">
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tx.type === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                        {tx.type === "credit" ? <ArrowDownRight className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{tx.description}</p>
                        <p className="text-[10px] text-gray-400 font-mono">REF: {tx.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {tx.createdAt ? formatDate(tx.createdAt) : "N/A"}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold text-sm ${tx.type === "credit" ? "text-green-600" : "text-gray-900"}`}>
                    {tx.type === "credit" ? "+" : "-"}{formatAmount(tx.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile List View - Visible only on small screens */}
        <div className="md:hidden divide-y divide-gray-50">
          {transactionsLoading ? (
             <div className="p-6 text-center text-sm text-gray-400">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">No transactions found.</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="p-4 active:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-3">
                    <div className={`p-2 h-fit rounded-lg ${tx.type === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                      {tx.type === "credit" ? <ArrowDownRight className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">{tx.description}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{tx.createdAt ? formatDate(tx.createdAt) : "N/A"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.type === "credit" ? "text-green-600" : "text-gray-900"}`}>
                      {tx.type === "credit" ? "+" : "-"}{formatAmount(tx.amount)}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION - Improved for touch targets */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-4 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-500 order-2 sm:order-1">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30"
              >
                Prev
              </button>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* MODALS remain the same, ensure they are responsive internally */}
      <RechargeModal
        isOpen={rechargeModalOpen}
        onClose={() => setRechargeModalOpen(false)}
        onSuccess={handleRechargeSuccess}
        userName={user?.fullName || undefined}
        userEmail={user?.email || undefined}
        userPhone={user?.mobile || undefined}
      />

      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        type={paymentModal.type}
        amount={paymentModal.amount}
        message={paymentModal.message}
      />
    </div>
  );
}