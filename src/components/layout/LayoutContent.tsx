"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LiveStreamProvider } from "@/contexts/LiveStreamContext";
import { RouteProtection } from "@/components/RouteProtection";
import {
  identifyAnonymousMixpanelUser,
  initializeMixpanel,
  trackMixpanelEvent,
} from "@/utils/mixpanel";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hasEmbedParam =
      new URLSearchParams(window.location.search).get("embed") === "1";
    const isInsideIframe = window.self !== window.top;

    setIsEmbed(hasEmbedParam || isInsideIframe);
  }, [pathname]);

  useEffect(() => {
    initializeMixpanel();

    if (typeof window === "undefined") {
      return;
    }

    const hasUserToken = Boolean(localStorage.getItem("token_middleware"));
    const hasAstrologerToken = Boolean(localStorage.getItem("token_astrologer"));
    const alreadyProfiled = sessionStorage.getItem("mixpanel_anon_profiled") === "1";

    if (!hasUserToken && !hasAstrologerToken && !alreadyProfiled) {
      identifyAnonymousMixpanelUser();
      sessionStorage.setItem("mixpanel_anon_profiled", "1");
    }
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    trackMixpanelEvent("homepage load", {
      page_path: pathname,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      page_title: typeof document !== "undefined" ? document.title : "",
    });
  }, [pathname]);

  useEffect(() => {
    const commonProperties = {
      page_path: pathname,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      page_title: typeof document !== "undefined" ? document.title : "",
    };

    if (pathname === "/aichat") {
      trackMixpanelEvent("chat page load", {
        ...commonProperties,
        chat_type: "ai_astrologer",
        actor: "user",
      });
      return;
    }

    if (pathname === "/chat") {
      trackMixpanelEvent("chat page load", {
        ...commonProperties,
        chat_type: "human_astrologer",
        actor: "user",
      });
      return;
    }

    if (pathname === "/astrologer/live-chats") {
      trackMixpanelEvent("chat page load", {
        ...commonProperties,
        chat_type: "human_astrologer",
        actor: "astrologer",
      });
    }
  }, [pathname]);

  // Track Meta Pixel PageView on every route change (SPA navigation)
  useEffect(() => {
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "PageView");
    }
  }, [pathname]);

  const NO_LAYOUT_ROUTES = [
    "/aichat",
    "/chat",
    "/astrologer/live-chats",
    "/astrologer/signup",
    "/astrologer/login",
    "/astrologer/register",
  ];
  // Check if current path is in list OR starts with /astrologer/dashboard OR /live/ OR /astrologer/live/
  const shouldHideLayout =
    NO_LAYOUT_ROUTES.includes(pathname) ||
    pathname.startsWith("/astrologer/dashboard") ||
    pathname.match(/^\/live\/[^/]+$/) ||
    pathname.match(/^\/astrologer\/live\/[^/]+$/) ||
    isEmbed;

  return (
    <AuthProvider>
      <CartProvider>
        <LiveStreamProvider>
          <RouteProtection>
            {!shouldHideLayout && <Header />}
            {children}
            {!shouldHideLayout && <Footer />}
          </RouteProtection>
        </LiveStreamProvider>
      </CartProvider>
    </AuthProvider>
  );
}
