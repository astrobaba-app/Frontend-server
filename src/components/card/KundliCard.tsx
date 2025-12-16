import React from "react";
import Card from "../atoms/Card";
import { Edit2 } from "lucide-react";

interface KundliCardProps {
  name: string;
  dob: string;
  birthPlace: string;
  onEdit?: () => void;
  onClick?: () => void;
}

export default function KundliCard({
  name,
  dob,
  birthPlace,
  onEdit,
  onClick,
}: KundliCardProps) {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div 
      onClick={onClick}
      className="relative  rounded-xl border-1 border-[#FFD700] p-4 cursor-pointer hover:shadow-lg transition-shadow"
    >
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-3 right-3 p-1.5 hover:bg-yellow-200 rounded-lg transition-colors"
        >
          <Edit2 className="w-5 h-5 text-green-600" />
        </button>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md">
          {getInitial(name)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
          
        </div>
      </div>

      <div className="space-y-1 text-sm text-gray-700 ml-0">
        <p className="font-medium">{dob}</p>
        <p className="text-gray-600">{birthPlace}</p>
      </div>
    </div>
  );
}
