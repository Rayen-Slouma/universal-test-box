import React from 'react';

interface DataPoint {
  timestamp: Date;
  [key: string]: number | Date | undefined;
}

interface FakeBarChartProps {
  data: DataPoint[];
  dataKey: string;
  title: string;
  color?: string;
  unit?: string;
}

export function FakeBarChart({ data, dataKey, title, color = '#10B981', unit = '' }: FakeBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const values = data.map(point => point[dataKey] as number).filter(val => val !== undefined);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  const svgWidth = 800;
  const svgHeight = 300;
  const padding = 40;
  const chartWidth = svgWidth - 2 * padding;
  const chartHeight = svgHeight - 2 * padding;
  const barWidth = chartWidth / data.length - 4;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <div className="bg-white border rounded-lg p-4">
        <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Grid lines */}
          <defs>
            <pattern id="barGrid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#barGrid)" />
          
          {/* Axes */}
          <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#6b7280" strokeWidth="2"/>
          <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#6b7280" strokeWidth="2"/>
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = padding + chartHeight - ratio * chartHeight;
            const value = minValue + ratio * range;
            return (
              <g key={index}>
                <line x1={padding - 5} y1={y} x2={padding} y2={y} stroke="#6b7280" strokeWidth="1"/>
                <text x={padding - 10} y={y + 5} textAnchor="end" className="text-xs fill-gray-600">
                  {value.toFixed(1)}{unit}
                </text>
              </g>
            );
          })}
          
          {/* Bars */}
          {data.map((point, index) => {
            const value = point[dataKey] as number;
            const x = padding + (index * chartWidth) / data.length + 2;
            const barHeight = ((value - minValue) / range) * chartHeight;
            const y = padding + chartHeight - barHeight;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  stroke="white"
                  strokeWidth="1"
                  className="hover:opacity-80 cursor-pointer"
                >
                  <title>{`${point.timestamp.toLocaleTimeString()}: ${value.toFixed(2)}${unit}`}</title>
                </rect>
                {index % Math.ceil(data.length / 8) === 0 && (
                  <text 
                    x={x + barWidth / 2} 
                    y={svgHeight - padding + 20} 
                    textAnchor="middle" 
                    className="text-xs fill-gray-600"
                  >
                    {point.timestamp.toLocaleTimeString()}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Min: {minValue.toFixed(2)}{unit}</span>
            <span>Max: {maxValue.toFixed(2)}{unit}</span>
            <span>Avg: {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)}{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}