'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { getAllAstrologers, Astrologer } from '@/store/api/general/astrologer';
import AstrologerCard from '@/components/card/AstrologerCard';
import { AstrologersListSkeleton } from '@/components/skeletons';
import { colors } from '@/utils/colors';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/atoms/Toast';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'love', label: 'Love', icon: '❤️' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'marriage', label: 'Marriage', icon: '💑' },
  { id: 'health', label: 'Health', icon: '🏥' },
  { id: 'wealth', label: 'Wealth', icon: '💰' },
  { id: 'remedies', label: 'Remedies', icon: '🔮' },
];

interface TrendingAstrologerCardProps {
  astro: Astrologer;
}

const TrendingAstrologerCard: React.FC<TrendingAstrologerCardProps> = ({ astro }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200 w-full">
      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-yellow-200">
        {astro.photo ? (
          <Image
            src={astro.photo}
            alt={astro.fullName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-700">
              {astro.fullName.charAt(0)}
            </span>
          </div>
        )}
        {astro.isOnline && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-tight">
        {astro.fullName.split(' ')[0]}
      </p>
      <p className="text-xs text-gray-600 mb-2">₹ {astro.pricePerMinute}/min</p>
    </div>
  );
};

interface AstrologersPageContentProps {
  mode: 'chat' | 'call';
}

export default function AstrologersPage() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') as 'chat' | 'call') || 'chat';
  const { toast, showToast, hideToast } = useToast();
  
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [filteredAstrologers, setFilteredAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);
        const response = await getAllAstrologers();
        if (response.success && response.astrologers) {
          setAstrologers(response.astrologers);
          setFilteredAstrologers(response.astrologers);
        }
      } catch (error) {
        console.error('Error fetching astrologers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  useEffect(() => {
    let filtered = astrologers;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (astro) =>
          astro.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          astro.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          astro.languages.some((lang) =>
            lang.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedCategory !== 'all') {
    }

    setFilteredAstrologers(filtered);
  }, [searchQuery, selectedCategory, astrologers]);

  const handleCallClick = () => {
    showToast('This feature is coming soon.', 'info');
  };

  const trendingAstrologers = [...astrologers]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 5);
  
  // Split filtered astrologers for top and bottom sections
  const topAstrologers = filteredAstrologers.slice(0, 3);
  const remainingAstrologers = filteredAstrologers.slice(3);

  if (loading) {
    return <AstrologersListSkeleton />;
  }

  const renderAstrologerCard = (astrologer: Astrologer) => (
    <Link key={astrologer.id} href={`/astrologer/${astrologer.id}`}>
      <AstrologerCard
        astrologer={{
          id: astrologer.id,
          name: astrologer.fullName,
          title: astrologer.skills.join(', '),
          experience: `${astrologer.yearsOfExperience} years`,
          rating: astrologer.rating,
          topics: astrologer.skills,
          price: parseFloat(astrologer.pricePerMinute),
          languages: astrologer.languages,
          status: astrologer.isOnline ? 'available' : 'offline',
          isOnline: astrologer.isOnline,
        }}
        mode={mode}
        onCallClick={handleCallClick}
      />
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar (Filter button removed) */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search astrologer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all shrink-0 text-sm ${
                selectedCategory === category.id
                  ? 'text-gray-900 shadow-md font-bold'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 font-medium'
              }`}
              style={
                selectedCategory === category.id
                  ? { backgroundColor: colors.primeYellow }
                  : {}
              }
            >
              <span className="text-base">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
        
        {/* Astrologers Grid (TOP SECTION) */}
        {topAstrologers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {topAstrologers.map(renderAstrologerCard)}
          </div>
        )}

        {/* Trending Section */}
        {trendingAstrologers.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Trending Now
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {trendingAstrologers.map((astro) => (
                <Link
                  key={astro.id}
                  href={`/astrologer/${astro.id}`}
                  className="w-full"
                >
                  <TrendingAstrologerCard astro={astro} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Astrologers Grid (BOTTOM SECTION) */}
        {remainingAstrologers.length === 0 && topAstrologers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No astrologers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingAstrologers.map(renderAstrologerCard)}
          </div>
        )}
      </div>
      
      {/* Toast Notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}