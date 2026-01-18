import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";
import "./globals.css";
import LayoutContent from "@/components/layout/LayoutContent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Graho",
  description:
    "Graho is an astrology platform offering free Kundli, horoscope, matchmaking, and instant chat or call with verified astrologers. From questions to remedies - all in one place.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Mobile viewport for React Native WebView and mobile browsers */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
        />

        {/* Mobile web app capable */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Prevent automatic scaling in landscape */}
        <meta name="format-detection" content="telephone=no" />

        {/* Razorpay Script */}
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
      </head>
      <body
        className={`${inter.variable} ${kanit.variable} antialiased`}
        suppressHydrationWarning
       >
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
