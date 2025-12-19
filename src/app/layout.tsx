'use client';

import type { Metadata } from "next";
import { Inter, Kanit } from 'next/font/google';
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { usePathname } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
  display: 'swap',
});

const kanit = Kanit({ 
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const NO_LAYOUT_ROUTES = ['/aichat', '/chat','/astrologer/live-chats'];
  const shouldHideLayout = NO_LAYOUT_ROUTES.includes(pathname);

  return (
    <html lang="en">
      <head>

 {/* Mobile viewport for React Native WebView */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

        {/* Razorpay Script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body
        className={`${inter.variable} ${kanit.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {!shouldHideLayout && <Header />}
            
            {children}
            {!shouldHideLayout && <Footer />}
            {/* <ChatButton /> */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
