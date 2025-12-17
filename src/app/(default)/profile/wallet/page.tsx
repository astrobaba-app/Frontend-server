"use client";
import React, { useState, useEffect } from "react";
import ProfileSidebar from "@/components/layout/UserProfileSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
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
  CreditCard,
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
import { IoIosMore } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

export default function WalletPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'failure';
    amount?: number;
    message?: string;
  }>({ isOpen: false, type: 'success' });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const balanceData = await getWalletBalance();
          {/* Mobile header with menu button */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <IoIosMore className="w-6 h-6 text-gray-800" />
            </button>
            <span className="w-6" aria-hidden="true" />
          </div>

      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
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
      console.error('Failed to fetch transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  const handleRechargeSuccess = async () => {

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="w-80 max-w-full bg-transparent h-full flex flex-col">
            <div className="bg-white shadow-xl h-full p-4 border-l border-[#FFD700] flex flex-col transition-transform duration-300 transform translate-x-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <RxCross2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <div className="overflow-y-auto">
                <ProfileSidebar
                  userName={user?.fullName || "User"}
                  userEmail={user?.email || "Not provided"}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    setPaymentModal({
      isOpen: true,
      type: 'success',
      message: 'Wallet recharged successfully!',
    });
    await fetchWalletData();
    await fetchTransactions();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTransactions(newPage);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile header with menu button */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <IoIosMore className="w-6 h-6 text-gray-800" />
          </button>
          <span className="w-6" aria-hidden="true" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8 items-start">
          {/* Sidebar - Desktop view */}
          <div className="hidden lg:block">
            <ProfileSidebar
              userName={user?.fullName || "User"}
              userEmail={user?.email || "Not provided"}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Wallet Balance Card */}
            <Card padding="lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#FFD700] bg-opacity-20 rounded-full flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-[#FFD700]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Current Balance
                    </p>
                    {loading ? (
                      <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <h2 className="text-3xl font-bold text-gray-900">
                        {formatAmount(balance?.balance || 0)}
                      </h2>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setRechargeModalOpen(true)}
                  className="flex items-center gap-2 bg-[#FFD700] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#FFD700] hover:bg-opacity-90 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Recharge Wallet
                </button>
              </div>

              {/* Stats */}
              {!loading && balance && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Recharged</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatAmount(balance.totalRecharge)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatAmount(balance.totalSpent)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Transaction History */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <Heading level={3}>Transaction History</Heading>
                <button
                  onClick={() => fetchTransactions(pagination.page)}
                  disabled={transactionsLoading}
                  className="flex items-center gap-2 text-[#FFD700] hover:text-[#FFD700] hover:opacity-80 transition-all"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${
                      transactionsLoading ? 'animate-spin' : ''
                    }`}
                  />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>

              {transactionsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-200 animate-pulse rounded-lg"
                    ></div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No transactions yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Your transaction history will appear here
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'credit'
                                ? 'bg-green-50'
                                : 'bg-red-50'
                            }`}
                          >
                            {transaction.type === 'credit' ? (
                              <ArrowDownRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 text-red-600" />
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.description || 'Transaction'}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(transaction.createdAt)}
                              </p>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                  transaction.status
                                )}`}
                              >
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={`text-lg font-semibold ${
                              transaction.type === 'credit'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}
                            {formatAmount(transaction.amount)}
                          </p>
                          {transaction.paymentMethod && (
                            <p className="text-xs text-gray-500 mt-1 capitalize">
                              {transaction.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t">
                      <p className="text-sm text-gray-600">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}{' '}
                        of {pagination.total} transactions
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-600">
                          Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
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
