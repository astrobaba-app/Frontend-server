"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Mail, MessageSquare, Settings, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { requestAccountDeletion, getDeletionRequestStatus, cancelDeletionRequest, type AccountDeletionRequest } from "@/store/api/auth/profile";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast, toastProps, hideToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletionRequest, setDeletionRequest] = useState<AccountDeletionRequest | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    fetchDeletionStatus();
  }, []);

  const fetchDeletionStatus = async () => {
    try {
      const response = await getDeletionRequestStatus();
      if (response.success && response.request) {
        setDeletionRequest(response.request);
      }
    } catch (error: any) {
      // No active request found - this is fine
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteReason.trim()) {
      showToast("Please provide a reason for account deletion", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestAccountDeletion(deleteReason);
      if (response.success) {
        showToast(response.message, "success");
        setShowDeleteModal(false);
        setDeleteReason("");
        fetchDeletionStatus();
      }
    } catch (error: any) {
      showToast(error.message || "Failed to submit deletion request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!deletionRequest) return;

    setIsSubmitting(true);
    try {
      const response = await cancelDeletionRequest(deletionRequest.id);
      if (response.success) {
        showToast(response.message, "success");
        setDeletionRequest(null);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to cancel deletion request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    if (!deletionRequest) return null;

    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, text: "Pending Review" },
      approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", icon: AlertTriangle, text: "Rejected" },
      completed: { color: "bg-gray-100 text-gray-700", icon: CheckCircle, text: "Completed" },
    };

    const config = statusConfig[deletionRequest.status];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </div>
    );
  };

  return (
    <div className=" bg-gray-50 pb-12">
      

      <main className="max-w-4xl mx-auto px-4 pt-6">
        

        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4 px-2">
              <Settings className="w-4 h-4 text-yellow-600" />
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                Preferences
              </h3>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {/* Notification Toggle */}
              <div className="flex items-center justify-between p-5 sm:p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Push Notifications</h4>
                    <p className="text-xs text-gray-500 mt-1">Stay updated on your consultations</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>

              {/* Email Updates Toggle */}
              <div className="flex items-center justify-between p-5 sm:p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Email Updates</h4>
                    <p className="text-xs text-gray-500 mt-1">Receive reports and receipts via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>

              {/* SMS Alerts Toggle */}
              <div className="flex items-center justify-between p-5 sm:p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">SMS Alerts</h4>
                    <p className="text-xs text-gray-500 mt-1">Get instant session reminders</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Additional Info Section */}
          <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100">
            <p className="text-[10px] text-yellow-800 font-bold leading-relaxed text-center uppercase tracking-wider">
              Note: Notification changes may take a few minutes to synchronize across all your devices.
            </p>
          </div>

          {/* Account Deletion Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 px-2">
              <Trash2 className="w-4 h-4 text-red-600" />
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                Account Management
              </h3>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">Delete Account</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Permanently remove your account and all associated data
                    </p>
                  </div>
                </div>

                {!loadingStatus && (
                  <>
                    {deletionRequest && deletionRequest.status === 'pending' ? (
                      <div className="mt-4 p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-yellow-800">Request Status:</span>
                          {getStatusBadge()}
                        </div>
                        <p className="text-xs text-yellow-700 mb-3">
                          Your account deletion request is under review. Our team will process it shortly.
                        </p>
                        <button
                          onClick={handleCancelRequest}
                          disabled={isSubmitting}
                          className="w-full py-2 px-4 bg-white border border-yellow-300 text-yellow-700 rounded-lg text-xs font-semibold hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Cancelling..." : "Cancel Request"}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full mt-2 py-2.5 px-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        Request Account Deletion
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
                <p className="text-xs text-gray-500">This action requires admin approval</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-4">
                Are you sure you want to delete your account? This will:
              </p>
              <ul className="text-xs text-gray-600 space-y-2 ml-4 list-disc">
                <li>Remove all your personal data</li>
                <li>Delete your consultation history</li>
                <li>Cancel any active subscriptions</li>
                <li>Permanently delete your wallet balance</li>
              </ul>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Please tell us why you&apos;re leaving
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Your feedback helps us improve..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReason("");
                }}
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRequest}
                disabled={isSubmitting || !deleteReason.trim()}
                className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastProps.isVisible && (
        <Toast
          message={toastProps.message}
          type={toastProps.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}