import { Metadata } from 'next';
import Hero from "@/components/sections/home/Hero";
import FeatureServiceSection from "@/components/sections/home/Service";
import LiveAstrologerSection from "@/components/sections/home/LiveAstro";
import AstrologyBannerSlider from "@/components/sections/home/AstrologyBanner";
import OurAstrologers from "@/components/sections/home/OurAstrologer";
import Store from "@/components/sections/home/Store";
import Hero2 from "@/components/sections/home/Hero2";
import PopularQuestions from "@/components/sections/home/PopularQues";
import LatestBlogsSection from "@/components/sections/home/LatestBlog";
import Testinomials from "@/components/sections/home/Testinomials";

// SEO Metadata for better search engine  optimization
export const metadata: Metadata = {
  title: 'Graho',
  description: 'Graho is an astrology platform offering free Kundli, horoscope, matchmaking, and instant chat or call with verified astrologers. From questions to remedies - all in one place.',
  keywords: 'astrology, online astrology consultation, astrologer, kundli, horoscope, vedic astrology, talk to astrologer, astrology prediction',
  openGraph: {
    title: 'Graho',
    description: 'Graho is an astrology platform offering free Kundli, horoscope, matchmaking, and instant chat or call with verified astrologers. From questions to remedies - all in one place.',
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Graho',
    images: [
      {
        url: '/images/og-image.png?v=20260405',
        secureUrl: 'https://graho.in/images/og-image.png?v=20260405',
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: 'Graho - Astrology Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Graho',
    description: 'Graho is an astrology platform offering free Kundli, horoscope, matchmaking, and instant chat or call with verified astrologers. From questions to remedies - all in one place.',
    images: ['/images/og-image.png?v=20260405'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function Home() {
  return (
    <div>
      <Hero/>
      <FeatureServiceSection/>
      <LiveAstrologerSection/>
      <AstrologyBannerSlider/>
      <OurAstrologers/> 
      <Store/>
      <Hero2/>
      <PopularQuestions/>
      <Testinomials/>
      <LatestBlogsSection/>
    </div>
  );
}
