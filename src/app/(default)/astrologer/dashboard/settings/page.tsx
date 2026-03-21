"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import { colors } from "@/utils/colors";

export default function AstrologerSettingsPage() {
  return (
    <div className="px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ color: colors.black }}>
          Settings
        </h1>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: colors.black }}>
              Notification Preferences
            </h2>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: colors.gray }}>
              Manage your notification settings (Coming soon)
            </p>

            <div className="space-y-2 sm:space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border text-sm sm:text-base" style={{ borderColor: colors.offYellow }}>
                <span style={{ color: colors.black }}>Email notifications</span>
                <input type="checkbox" className="toggle" disabled />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border text-sm sm:text-base" style={{ borderColor: colors.offYellow }}>
                <span style={{ color: colors.black }}>SMS notifications</span>
                <input type="checkbox" className="toggle" disabled />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border text-sm sm:text-base" style={{ borderColor: colors.offYellow }}>
                <span style={{ color: colors.black }}>Push notifications</span>
                <input type="checkbox" className="toggle" disabled />
              </label>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t" style={{ borderColor: colors.offYellow }}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: colors.black }}>
              Account Settings
            </h2>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: colors.gray }}>
              Manage your account preferences (Coming soon)
            </p>

            <div className="space-y-2 sm:space-y-3">
              <Button
                fullWidth
                variant="outline"
                disabled
                className="text-sm sm:text-base"
              >
                Change Password
              </Button>

              <Button
                fullWidth
                variant="outline"
                disabled
                className="text-sm sm:text-base"
              >
                Privacy Settings
              </Button>

              <Button
                fullWidth
                variant="outline"
                disabled
                className="text-sm sm:text-base"
              >
                Language Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
