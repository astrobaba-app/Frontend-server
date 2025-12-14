import React from "react";

interface YesNoIndicatorProps {
  value: boolean;
}

const YesNoIndicator: React.FC<YesNoIndicatorProps> = ({ value }) => {
  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
        value ? "bg-red-500" : "bg-green-500"
      }`}
    >
      {value ? "Yes" : "No"}
    </div>
  );
};

export default YesNoIndicator;
