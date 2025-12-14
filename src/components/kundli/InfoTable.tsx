import React from "react";

interface InfoRow {
  label: string;
  value: string | number | null | undefined;
}

interface InfoTableProps {
  rows: InfoRow[];
  className?: string;
}

const InfoTable: React.FC<InfoTableProps> = ({ rows, className = "" }) => {
  const getValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
      return "--";
    }
    return String(value);
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {rows.map((row, index) => (
        <div
          key={index}
          className="flex border-b border-gray-200 last:border-b-0"
        >
          <div className="w-1/2 p-4 bg-gray-50 font-medium text-gray-700 text-sm">
            {row.label}
          </div>
          <div className="w-1/2 p-4 text-gray-900 text-sm">
            {getValue(row.value)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoTable;
