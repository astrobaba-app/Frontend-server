"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Mail, MessageSquare, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();

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
        </div>
      </main>
    </div>
  );
}