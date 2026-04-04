import React from "react";
import { Edit2, Loader2, Trash2 } from "lucide-react";

interface KundliCardProps {
  name: string;
  dob: string;
  birthPlace: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  onClick?: () => void;
}

export default function KundliCard({
  name,
  dob,
  birthPlace,
  onEdit,
  onDelete,
  isDeleting = false,
  onClick,
}: KundliCardProps) {
  // Logic to get first and last initial (e.g., "John Doe" -> "JD")
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div 
      onClick={onClick}
      className="relative rounded-xl border border-[#FFD700] p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
    >
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 hover:bg-yellow-100 rounded-lg transition-colors"
              aria-label="Edit kundli"
            >
              <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={isDeleting}
              className="p-1 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Delete kundli"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              )}
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        {/* Responsive Avatar: smaller on mobile (w-10), larger on desktop (w-14) */}
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-lg sm:text-2xl font-bold shrink-0 shadow-sm">
          {getInitials(name)}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Truncate name if it's too long on small screens */}
          <h3 className="text-sm sm:text-lg font-bold text-gray-900 truncate">
            {name}
          </h3>
        </div>
      </div>

      <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-700">
        <p className="font-semibold text-gray-800">{dob}</p>
        <p className="text-gray-500 truncate">{birthPlace}</p>
      </div>
    </div>
  );
}