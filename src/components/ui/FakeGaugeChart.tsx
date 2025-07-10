import React from 'react';

interface FakeGaugeChartProps {
  value: number;
  min: number;
  max: number;
  title: string;
  unit?: string;
  color?: string;
  thresholds?: {
    low: number;
    high: number;
  };
}

export function FakeGaugeChart({ 
  value, 
  min, 
  max, 
  title, 
  unit = '', 
  color = '#3B82F6',
  thresholds 
}: FakeGaugeChartProps) {
  const range = max - min;
  const normalizedValue = (value - min) / range;
  const angle = normalizedValue * 180 - 90; // -90 to 90 degrees
  
  const svgSize = 200;
  const center = svgSize / 2;
  const radius = 70;
  
  // Calculate arc path
  const startAngle = -90;
  const endAngle = 90;
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  
  const x1 = center + radius * Math.cos(startAngleRad);
  const y1 = center + radius * Math.sin(startAngleRad);
  const x2 = center + radius * Math.cos(endAngleRad);
  const y2 = center + radius * Math.sin(endAngleRad);
  
  const arcPath = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  
  // Calculate needle position
  const needleAngleRad = (angle * Math.PI) / 180;
  const needleX = center + (radius - 10) * Math.cos(needleAngleRad);
  const needleY = center + (radius - 10) * Math.sin(needleAngleRad);
  
  // Determine color based on thresholds
  let gaugeColor = color;
  if (thresholds) {
    if (value < thresholds.low) {
      gaugeColor = '#EF4444'; // red
    } else if (value > thresholds.high) {
      gaugeColor = '#F59E0B'; // amber
    } else {
      gaugeColor = '#10B981'; // green
    }
  }
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 text-center">{title}</h3>
      <div className="bg-white border rounded-lg p-4 flex flex-col items-center">
        <svg width={svgSize} height={svgSize * 0.7} viewBox={`0 0 ${svgSize} ${svgSize * 0.7}`}>
          {/* Background arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          {/* Colored progress arc */}
          <path
            d={arcPath}
            fill="none"
            stroke={gaugeColor}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${normalizedValue * 180} 180`}
            className="transition-all duration-500"
          />
          
          {/* Tick marks */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const tickAngle = -90 + ratio * 180;
            const tickAngleRad = (tickAngle * Math.PI) / 180;
            const outerX = center + radius * Math.cos(tickAngleRad);
            const outerY = center + radius * Math.sin(tickAngleRad);
            const innerX = center + (radius - 15) * Math.cos(tickAngleRad);
            const innerY = center + (radius - 15) * Math.sin(tickAngleRad);
            
            return (
              <line
                key={index}
                x1={innerX}
                y1={innerY}
                x2={outerX}
                y2={outerY}
                stroke="#6B7280"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Needle */}
          <line
            x1={center}
            y1={center}
            x2={needleX}
            y2={needleY}
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          
          {/* Center dot */}
          <circle
            cx={center}
            cy={center}
            r="8"
            fill="#374151"
          />
          
          {/* Value labels */}
          <text x={center - 60} y={center + 40} textAnchor="middle" className="text-sm fill-gray-600">
            {min}{unit}
          </text>
          <text x={center + 60} y={center + 40} textAnchor="middle" className="text-sm fill-gray-600">
            {max}{unit}
          </text>
        </svg>
        
        <div className="mt-4 text-center">
          <div className="text-3xl font-bold" style={{ color: gaugeColor }}>
            {value.toFixed(1)}{unit}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Current Value
          </div>
          {thresholds && (
            <div className="text-xs text-gray-500 mt-2">
              Normal: {thresholds.low}{unit} - {thresholds.high}{unit}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}