"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Toast from "@/components/atoms/Toast";
import { AstrologerSettingsSkeleton } from "@/components/skeletons";
import { useToast } from "@/hooks/useToast";
import { colors } from "@/utils/colors";
import { getOnlineStatus, goOnline, goOffline } from "@/store/api/astrologer/auth";

export default function AstrologerSettingsPage() {
  const { toast, showToast, hideToast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchOnlineStatus();
  }, []);

  const fetchOnlineStatus = async () => {
    try {
      const response = await getOnlineStatus();
      if (response.success) {
        setIsOnline(response.isOnline);
      }
    } catch (err: any) {
      console.error("Failed to fetch online status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (newStatus: boolean) => {
    setToggling(true);

    try {
      const response = newStatus ? await goOnline() : await goOffline();
      
      if (response.success) {
        setIsOnline(response.isOnline);
        showToast(response.message, "success");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.black }}>
          Settings
        </h1>

        {loading ? (
          <AstrologerSettingsSkeleton />
        ) : (

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Online/Offline Status Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
              Availability Status
            </h2>
            <p className="mb-6" style={{ color: colors.gray }}>
              Control your online status to receive consultation requests from users.
            </p>

            <div className="flex items-center justify-between p-6 rounded-lg border-2" style={{ borderColor: colors.offYellow }}>
              <div className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: isOnline ? colors.primeGreen : colors.primeRed }}
                ></div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.black }}>
                    {isOnline ? "You are Online" : "You are Offline"}
                  </h3>
                  <p className="text-sm" style={{ color: colors.gray }}>
                    {isOnline
                      ? "Users can send you consultation requests"
                      : "Users cannot send you consultation requests"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleToggleStatus(!isOnline)}
                disabled={toggling}
                className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                style={{
                  backgroundColor: isOnline ? colors.primeGreen : colors.gray,
                }}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isOnline ? "translate-x-9" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              fullWidth
              onClick={() => handleToggleStatus(true)}
              loading={toggling && !isOnline}
              disabled={isOnline || toggling}
              customColors={{
                backgroundColor: colors.primeGreen,
                textColor: colors.white,
              }}
              className="py-3 text-lg font-semibold"
            >
              {isOnline ? "Already Online" : "Go Online"}
            </Button>

            <Button
              fullWidth
              onClick={() => handleToggleStatus(false)}
              loading={toggling && isOnline}
              disabled={!isOnline || toggling}
              customColors={{
                backgroundColor: colors.primeRed,
                textColor: colors.white,
              }}
              className="py-3 text-lg font-semibold"
            >
              {!isOnline ? "Already Offline" : "Go Offline"}
            </Button>
          </div>

          {/* Additional Settings Sections */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: colors.offYellow }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
              Notification Preferences
            </h2>
            <p className="text-sm mb-4" style={{ color: colors.gray }}>
              Manage your notification settings (Coming soon)
            </p>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: colors.offYellow }}>
                <span style={{ color: colors.black }}>Email notifications</span>
                <input type="checkbox" className="toggle" disabled />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: colors.offYellow }}>
                <span style={{ color: colors.black }}>SMS notifications</span>
                <input type="checkbox" className="toggle" disabled />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: colors.offYellow }}>
                <span style={{ color: colors.black }}>Push notifications</span>
                <input type="checkbox" className="toggle" disabled />
              </label>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t" style={{ borderColor: colors.offYellow }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
              Account Settings
            </h2>
            <p className="text-sm mb-4" style={{ color: colors.gray }}>
              Manage your account preferences (Coming soon)
            </p>

            <div className="space-y-3">
              <Button
                fullWidth
                variant="outline"
                disabled
              >
                Change Password
              </Button>

              <Button
                fullWidth
                variant="outline"
                disabled
              >
                Privacy Settings
              </Button>

              <Button
                fullWidth
                variant="outline"
                disabled
              >
                Language Preferences
              </Button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
