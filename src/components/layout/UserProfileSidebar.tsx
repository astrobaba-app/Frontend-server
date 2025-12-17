'use client';
import React from 'react';
import { User, Wallet, Heart, ShoppingBag, FileText, Settings, LogOut, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface ProfileSidebarProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const ACCENT_YELLOW = '#FFD700'; 

const MENU_ITEMS = [
  { icon: User, label: 'My Profile', href: '/profile' },
  { icon: Wallet, label: 'My Wallet', href: '/profile/wallet' },
  { icon: Heart, label: 'My following', href: '/profile/following' },
  { icon: ShoppingBag, label: 'My Cart', href: '/cart' },
  { icon: ShoppingBag, label: 'My orders', href: '/profile/orders' },
  { icon: Star, label: 'My Reviews', href: '/profile/reviews' },
  { icon: FileText, label: 'Free Kundli', href: '/profile/kundli' },
  { icon: Settings, label: 'Settings', href: '/profile/settings' },
];


const UserAvatar = () => (
    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-white">
       
        <div className="relative w-full h-full">

            <div className="absolute inset-0 rounded-full bg-blue-100 flex items-center justify-center">
                {/* Simplified flat vector style placeholder for the user figure */}
                <div className="w-16 h-16 mt-4 rounded-t-full bg-blue-700"></div> {/* Body/Suit part */}
                <div className="absolute top-4 w-10 h-10 rounded-full bg-blue-300 border-2 border-white"></div> {/* Head part */}
                <div className="absolute top-7 w-3 h-3 rounded-full bg-red-600"></div> {/* Tie knot */}
            </div>
            
            <div className="absolute inset-0 rounded-full" style={{ 
                backgroundImage: 'url(/path/to/avatar.png)', // Placeholder for the actual image
                backgroundSize: 'cover' 
            }}>
                {/* Fallback to simple colored circles for structural similarity if the image isn't loaded */}
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-blue-100 border border-gray-300"> 
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
);


export default function ProfileSidebar({ userName = 'John Doe', userEmail = 'example@gmail.com', onLogout }: ProfileSidebarProps) {
  
  const pathname = usePathname() || '/profile/following'; 

  return (
 
    <div className="bg-white rounded-lg overflow-hidden w-full max-w-xs border border-[#FFD700]">
    

      {/* Menu Items */}
      <div className="pt-0 pb-0">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          let bgColor = '';
          if (isActive) {
            bgColor = 'bg-[#FFD700]'; 
          }

          const iconColor = ''; 
          const textColor = isActive  ? 'text-gray-900' : 'text-gray-800'; 

          return (
            <Link
              key={item.href}
              href={item.href}
             
              className={`flex items-center  gap-4 px-6 py-4 transition-all border-t border-[#f9f5e0] ${bgColor}`}
              style={{
                  backgroundColor: isActive ? ACCENT_YELLOW : 'white',
                  borderBottom: '1px solid #FFD700', 
              }}
            >
             
              <Icon className={`w-5 h-5 ${iconColor}`} />
              <span className={`text-base font-medium ${textColor}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="p-0">
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-6 py-4 w-full transition-colors bg-white hover:bg-red-50"
        >
          {/* Icon is red, text is red */}
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="text-base font-medium text-red-600">Logout</span>
        </button>
      </div>
    </div>
  );
}