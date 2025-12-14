import React from 'react';
import Link from 'next/link';

interface TodaysHoroscopeCardProps {
  sign: string;
  signSlug: string;
  dateRange: string;
  description: string;
}

const TodaysHoroscopeCard: React.FC<TodaysHoroscopeCardProps> = ({
  sign,
  signSlug,
  dateRange,
  description,
}) => {
  return (
    <Link
      href={`/horoscope/${signSlug}`}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-[#F0DF20] group"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-16 h-16 flex items-center justify-center bg-yellow-50 rounded-lg">
          <span className="text-4xl">⭐</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{sign} Today's Horoscope</h3>
          <p className="text-xs text-gray-500 mb-3">{dateRange}</p>
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default TodaysHoroscopeCard;
