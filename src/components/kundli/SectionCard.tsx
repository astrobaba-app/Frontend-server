import React from "react";

interface SectionCardProps {
  title: string;
  content: string;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, content, className = "" }) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed text-sm">{content}</p>
    </div>
  );
};

export default SectionCard;
