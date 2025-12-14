"use client";

import React from "react";
import { colors } from "@/utils/colors";
import { FiDollarSign } from "react-icons/fi";

export default function AstrologerEarningPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.black }}>
          My Earning
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <FiDollarSign
              className="w-24 h-24 mx-auto mb-4"
              style={{ color: colors.gray }}
            />
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
              Earning Dashboard
            </h2>
            <p style={{ color: colors.gray }}>
              This feature is coming soon. You'll be able to track your earnings and transactions here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
