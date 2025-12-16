'use client';

import type { Metadata } from "next";
import { Inter, Kanit } from 'next/font/google';
import "./globals.css";
import ChatButton from "@/components/layout/ChatButton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const kanit = Kanit({ 
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
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
      <body
        className={`${inter.variable} ${kanit.variable} antialiased`}
      >
        <AuthProvider>
          {!shouldHideLayout && <Header />}
          
          {children}
          {!shouldHideLayout && <Footer />}
          {/* <ChatButton /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
