"use client";
import React from "react";
import { User, Wallet, Heart, ShoppingBag, FileText, Settings, LogOut, Star, ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuShoppingCart } from "react-icons/lu";

interface ProfileSidebarProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const MENU_ITEMS = [
  { icon: User, label: "My Profile", href: "/profile" },
  { icon: Wallet, label: "My Wallet", href: "/profile/wallet" },
  { icon: Heart, label: "My Following", href: "/profile/following" },
  { icon: Heart, label: "Free Kundli", href: "/profile/kundli" },
  // TEMPORARILY HIDDEN: Uncomment the line below to show Generate Kundli Report feature
  // { icon: FileText, label: "Generate Kundli Report (PDF)", href: "/profile/kundli-report" },
  { icon: ShoppingBag, label: "My Orders", href: "/profile/orders" },
  { icon: LuShoppingCart, label: "My cart", href: "/cart" },
  { icon: Star, label: "My Reviews", href: "/profile/reviews" },
  { icon: HelpCircle, label: "Support Tickets", href: "/support" },
  { icon: Settings, label: "Settings", href: "/profile/settings" },
];

export default function ProfileSidebar({ userName = "User", userEmail = "Not provided", onLogout }: ProfileSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-2xl overflow-hidden w-full border border-gray-100 shadow-sm transition-all duration-300">
      <div className="p-6 bg-gradient-to-br from-yellow-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xl shadow-inner">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      <nav className="py-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-6 py-3.5 transition-all group ${
                isActive 
                ? "bg-yellow-50 border-r-4 border-yellow-500" 
                : "hover:bg-gray-50 border-r-4 border-transparent"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon className={`w-5 h-5 ${isActive ? "text-yellow-600" : "text-gray-500 group-hover:text-yellow-600"}`} />
                <span className={`text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"}`}>
                  {item.label}
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isActive ? "text-yellow-600" : "text-gray-300 group-hover:text-yellow-600"}`} />
            </Link>
          );
        })}

        <div className="px-4 mt-2">
          <div className="border-t border-gray-100 my-2"></div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-6 py-3.5 w-full transition-colors text-red-500 hover:bg-red-50 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </nav>
    </div>
  );
}