'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CHART_NAMES } from '@/constants/kundli';

export default function ChartsTab() {
  const [chartType, setChartType] = useState<'north' | 'south'>('north');

  return (
    <div className="space-y-8">
      {/* Chart Type Toggle */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setChartType('north')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            chartType === 'north'
              ? 'bg-[#F0DF20] text-gray-900'
              : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          North Indian
        </button>
        <button
          onClick={() => setChartType('south')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            chartType === 'south'
              ? 'bg-[#F0DF20] text-gray-900'
              : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          South Indian
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHART_NAMES.map((chart, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">{chart}</h3>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <DivisionalChart type={chartType} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Divisional Chart Component - Canvas Based
function DivisionalChart({ type }: { type: 'north' | 'south' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 200;
    const height = 200;

    ctx.clearRect(0, 0, width, height);

    if (type === 'north') {
      // Draw diamond shape
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(100, 5);
      ctx.lineTo(195, 100);
      ctx.lineTo(100, 195);
      ctx.lineTo(5, 100);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cross lines
      ctx.beginPath();
      ctx.moveTo(100, 5);
      ctx.lineTo(100, 195);
      ctx.moveTo(5, 100);
      ctx.lineTo(195, 100);
      ctx.stroke();

      // Sample planet positions
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Asc', 100, 25);
      ctx.fillText('Ju', 165, 70);
      ctx.fillText('Ma', 150, 140);
      ctx.fillText('Mo', 50, 80);
      ctx.fillText('Ve', 50, 95);
    } else {
      // South Indian Chart
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 2;
      ctx.fillRect(5, 5, 190, 190);
      ctx.strokeRect(5, 5, 190, 190);

      // Grid lines
      ctx.lineWidth = 1;
      // Horizontal
      [52.5, 100, 147.5].forEach(y => {
        ctx.beginPath();
        ctx.moveTo(5, y);
        ctx.lineTo(195, y);
        ctx.stroke();
      });
      // Vertical
      [52.5, 100, 147.5].forEach(x => {
        ctx.beginPath();
        ctx.moveTo(x, 5);
        ctx.lineTo(x, 195);
        ctx.stroke();
      });

      // Sample planet positions
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Asc', 75, 75);
      ctx.fillText('Ju', 170, 30);
      ctx.fillText('Ma', 170, 130);
    }
  }, [type]);

  return (
    <div className="relative w-full aspect-square">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="w-full h-full"
      />
    </div>
  );

  /* ===== OLD SVG IMPLEMENTATION (COMMENTED) =====
  if (type === 'north') {
    return (
      <div className="relative w-full aspect-square">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 100 5 L 195 100 L 100 195 L 5 100 Z"
            fill="white"
            stroke="#D1D5DB"
            strokeWidth="2"
          />
          <line x1="100" y1="5" x2="100" y2="195" stroke="#D1D5DB" strokeWidth="2" />
          <line x1="5" y1="100" x2="195" y2="100" stroke="#D1D5DB" strokeWidth="2" />
          <text x="100" y="25" textAnchor="middle" className="text-xs">Asc</text>
          <text x="165" y="70" textAnchor="middle" className="text-xs">Ju</text>
          <text x="150" y="140" textAnchor="middle" className="text-xs">Ma</text>
          <text x="50" y="80" textAnchor="middle" className="text-xs">Mo</text>
          <text x="50" y="95" textAnchor="middle" className="text-xs">Ve</text>
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="5" y="5" width="190" height="190" fill="white" stroke="#D1D5DB" strokeWidth="2" />
        <line x1="5" y1="52.5" x2="195" y2="52.5" stroke="#D1D5DB" strokeWidth="1" />
        <line x1="5" y1="100" x2="195" y2="100" stroke="#D1D5DB" strokeWidth="1" />
        <line x1="5" y1="147.5" x2="195" y2="147.5" stroke="#D1D5DB" strokeWidth="1" />
        <line x1="52.5" y1="5" x2="52.5" y2="195" stroke="#D1D5DB" strokeWidth="1" />
        <line x1="100" y1="5" x2="100" y2="195" stroke="#D1D5DB" strokeWidth="1" />
        <line x1="147.5" y1="5" x2="147.5" y2="195" stroke="#D1D5DB" strokeWidth="1" />
        <text x="75" y="75" textAnchor="middle" className="text-xs">Asc</text>
        <text x="170" y="30" textAnchor="middle" className="text-xs">Ju</text>
        <text x="170" y="130" textAnchor="middle" className="text-xs">Ma</text>
      </svg>
    </div>
  );
  ===== END OLD SVG IMPLEMENTATION ===== */
}
