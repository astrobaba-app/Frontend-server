import { IconType } from "react-icons";
import { FaHeart, FaBookOpen } from "react-icons/fa";
import { IoChatbubbles, IoSunnyOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { MdPhone } from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";

export interface FeatureService {
  icon: IconType | string;
  title: string;
  description: string;
  href: string;
}

export const featureServices: FeatureService[] = [
  {
    icon: IoSunnyOutline,
    title: "Daily Horoscope",
    description: "Get Your Daily Prediction",
    href: "/horoscope",
  },
  {
    icon: "/icons/kundli.png",
    title: "Free Kundli",
    description: "Generate Birth Chart",
    href: "/profile/kundli",
  },
  {
    icon: FaHeart,
    title: "Kundli Matching",
    description: "Check Compatibility",
    href: "/kundli-matching",
  },
  {
    icon: FaBookOpen,
    title: "Astrology Blog",
    description: "Read Insights & Tips",
    href: "/blog",
  },
  {
    icon: IoChatbubbles,
    title: "Chat",
    description: "Instant Messaging",
    href: "/astrologer?mode=chat",
  },
  {
    icon: MdPhone,
    title: "Call",
    description: "Voice Consultation",
    href: "/astrologer?mode=call",
  },
  {
    icon: RiRobot2Line,
    title: "AI Astrologer",
    description: "24/7 AI Astrologer",
    href: "/aichat",
  },
  {
    icon: FiShoppingBag,
    title: "Astrostore",
    description: "Remedies & Products",
    href: "/store",
  },
];
