import type { Metadata } from "next";
import { Inter, Poppins, Poly } from 'next/font/google';
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatButton from "@/components/layout/ChatButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '900'],
  variable: '--font-poppins', 
});

const poly = Poly({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-poly',
});

export const metadata: Metadata = {
  title: "AstroBaba",
  description: "Shubh Drishti, Shubh Marg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${poly.variable} antialiased`}
      >
       
        {children}
        <ChatButton />
      </body>
    </html>
  );
}
