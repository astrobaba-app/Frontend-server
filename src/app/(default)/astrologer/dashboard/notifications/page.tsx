"use client";

import React from "react";
import { colors } from "@/utils/colors";
import { FiBell } from "react-icons/fi";

export default function AstrologerNotificationsPage() {
  return (
    <div className="px-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.black }}>
          Notifications
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <FiBell
              className="w-24 h-24 mx-auto mb-4"
              style={{ color: colors.gray }}
            />
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
              No New Notifications
            </h2>
            <p style={{ color: colors.gray }}>
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
