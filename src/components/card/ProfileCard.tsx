import React from 'react';
import Card from '../atoms/Card';

interface ProfileCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  bgColor?: string;
}

export default function ProfileCard({
  icon,
  title,
  value,
  bgColor = 'bg-blue-100',
}: ProfileCardProps) {
  return (
    <Card padding="md" hover>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}
