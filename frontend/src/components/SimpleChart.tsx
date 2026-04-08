import React from 'react';
import { ChartData } from '../services/employeeReportService';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

interface SimpleChartProps {
  chart: ChartData;
  className?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ chart, className = '' }) => {
  const renderPieChart = (data: any) => {
    const total = data.datasets[0].data.reduce((sum: number, value: number) => sum + value, 0);
    const colors = data.datasets[0].backgroundColor;
    
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <div className="flex items-center justify-center mb-2">
          <PieChart className="w-6 h-6 text-blue-600 mr-2" />
          <span className="font-medium text-gray-900">{chart.title}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {data.labels.map((label: string, index: number) => {
            const value = data.datasets[0].data[index];
            const percentage = ((value / total) * 100).toFixed(1);
            const color = colors[index] || '#3B82F6';
            
            return (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900 truncate">{label}</div>
                  <div className="text-xs text-gray-500">{value} ({percentage}%)</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBarChart = (data: any) => {
    const maxValue = Math.max(...data.datasets[0].data);
    const colors = Array.isArray(data.datasets[0].backgroundColor) 
      ? data.datasets[0].backgroundColor 
      : [data.datasets[0].backgroundColor];
    
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <div className="flex items-center justify-center mb-2">
          <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
          <span className="font-medium text-gray-900">{chart.title}</span>
        </div>
        <div className="space-y-2">
          {data.labels.map((label: string, index: number) => {
            const value = data.datasets[0].data[index];
            const percentage = (value / maxValue) * 100;
            const color = colors[index % colors.length] || '#3B82F6';
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-700">{label}</span>
                  <span className="text-gray-500">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDoughnutChart = (data: any) => {
    // For simplicity, render doughnut charts the same as pie charts
    return renderPieChart(data);
  };

  const renderLineChart = (data: any) => {
    const maxValue = Math.max(...data.datasets[0].data);
    const minValue = Math.min(...data.datasets[0].data);
    const range = maxValue - minValue;
    
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <div className="flex items-center justify-center mb-2">
          <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
          <span className="font-medium text-gray-900">{chart.title}</span>
        </div>
        <div className="relative h-32 bg-gray-50 rounded p-2">
          <svg className="w-full h-full" viewBox="0 0 300 100">
            <polyline
              points={data.datasets[0].data.map((value: number, index: number) => {
                const x = (index / (data.datasets[0].data.length - 1)) * 280 + 10;
                const y = 90 - ((value - minValue) / range) * 80;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            {data.datasets[0].data.map((value: number, index: number) => {
              const x = (index / (data.datasets[0].data.length - 1)) * 280 + 10;
              const y = 90 - ((value - minValue) / range) * 80;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#3B82F6"
                />
              );
            })}
          </svg>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          {data.labels.map((label: string, index: number) => (
            <span key={index} className="text-center">{label}</span>
          ))}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    if (!chart.data) return null;

    switch (chart.type) {
      case 'pie':
        return renderPieChart(chart.data);
      case 'bar':
        return renderBarChart(chart.data);
      case 'doughnut':
        return renderDoughnutChart(chart.data);
      case 'line':
        return renderLineChart(chart.data);
      default:
        return (
          <div className="text-center text-gray-500 p-4">
            <BarChart3 className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Chart type "{chart.type}" not supported</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      {renderChart()}
    </div>
  );
};

export default SimpleChart;