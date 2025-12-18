"use client";

import React from "react";
import { colors } from "@/utils/colors";
import { FiMessageSquare } from "react-icons/fi";

export default function AstrologerConsultationsPage() {
  return (
    <div className="px-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.black }}>
          My Consultations
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <FiMessageSquare
              className="w-24 h-24 mx-auto mb-4"
              style={{ color: colors.gray }}
            />
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
              Consultation History
            </h2>
            <p style={{ color: colors.gray }}>
              This feature is coming soon. You'll be able to see all your consultations here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
