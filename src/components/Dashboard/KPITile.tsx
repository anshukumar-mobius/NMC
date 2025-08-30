import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  target: number;
  category: 'quality' | 'efficiency' | 'clinical' | 'safety' | 'workforce' | 'financial';
  subcategory: string;
  description: string;
  benchmark: number;
  lastUpdated: string;
  dataSource: string;
}

interface KPITileProps {
  kpi: KPI;
}

export function KPITile({ kpi }: KPITileProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4" />;
      case 'down':
        return <ArrowDownIcon className="h-4 w-4" />;
      default:
        return <MinusIcon className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    // For metrics where higher is better (satisfaction, adherence)
    if (kpi.category === 'quality' || kpi.name.includes('Adherence') || kpi.name.includes('Response')) {
      switch (kpi.trend) {
        case 'up':
          return 'text-green-700 bg-green-50';
        case 'down':
          return 'text-red-700 bg-red-50';
        default:
          return 'text-slate-700 bg-slate-50';
      }
    }
    // For metrics where lower is better (readmission, length of stay, TAT)
    else {
      switch (kpi.trend) {
        case 'up':
          return 'text-red-700 bg-red-50';
        case 'down':
          return 'text-green-700 bg-green-50';
        default:
          return 'text-slate-700 bg-slate-50';
      }
    }
  };

  const getCategoryColor = () => {
    switch (kpi.category) {
      case 'quality':
        return 'bg-green-100 text-green-800';
      case 'efficiency':
        return 'bg-blue-100 text-blue-800';
      case 'clinical':
        return 'bg-purple-100 text-purple-800';
      case 'safety':
        return 'bg-red-100 text-red-800';
      case 'workforce':
        return 'bg-orange-100 text-orange-800';
      case 'financial':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const isOnTarget = () => {
    // For metrics where lower is better
    const lowerIsBetter = ['Rate', 'TAT', 'Time', 'Days', 'Error', 'Fall', 'Turnover', 'Denial', 'Wait'].some(term => 
      kpi.name.includes(term) || kpi.unit.includes('per') || kpi.unit.includes('days') || kpi.unit.includes('hours') || kpi.unit.includes('minutes')
    );
    
    if (lowerIsBetter) {
      return kpi.value <= kpi.target;
    } else {
      return kpi.value >= kpi.target;
    }
  };

  const getPerformanceVsBenchmark = () => {
    const diff = kpi.value - kpi.benchmark;
    const percentage = ((Math.abs(diff) / kpi.benchmark) * 100).toFixed(1);
    
    // For metrics where lower is better
    const lowerIsBetter = ['Rate', 'TAT', 'Time', 'Days', 'Error', 'Fall', 'Turnover', 'Denial', 'Wait'].some(term => 
      kpi.name.includes(term) || kpi.unit.includes('per') || kpi.unit.includes('days') || kpi.unit.includes('hours') || kpi.unit.includes('minutes')
    );
    
    if (lowerIsBetter) {
      return diff < 0 ? `${percentage}% better` : `${percentage}% worse`;
    } else {
      return diff > 0 ? `${percentage}% better` : `${percentage}% worse`;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 relative">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor()}`}>
              {kpi.subcategory.replace('_', ' ')}
            </span>
            {isOnTarget() && (
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            )}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <InformationCircleIcon className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">{kpi.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {kpi.value}
            </span>
            <span className="text-sm font-medium text-slate-500">{kpi.unit}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getTrendColor()}`}>
          {getTrendIcon()}
          {kpi.change}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
        <span>Target: {kpi.target}{kpi.unit}</span>
        <span className={isOnTarget() ? 'text-green-600' : 'text-amber-600'}>
          {isOnTarget() ? 'On target' : 'Off target'}
        </span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            isOnTarget() ? 'bg-green-500' : 'bg-amber-500'
          }`}
          style={{ 
            width: `${Math.min(Math.max((kpi.value / kpi.target) * 100, 0), 100)}%` 
          }}
        ></div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">{kpi.description}</p>

      {showDetails && (
        <div className="absolute inset-0 bg-white rounded-2xl border border-slate-200 p-6 shadow-xl z-10">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">{kpi.name}</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500">Current Value</span>
                <div className="text-2xl font-bold text-slate-900">
                  {kpi.value}{kpi.unit}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500">Target</span>
                <div className="text-2xl font-bold text-slate-700">
                  {kpi.target}{kpi.unit}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">vs Industry Benchmark</span>
                <span className="text-sm font-medium text-slate-900">
                  {kpi.benchmark}{kpi.unit}
                </span>
              </div>
              <div className="text-sm text-slate-600">
                Performance: <span className="font-medium">{getPerformanceVsBenchmark()}</span>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarDaysIcon className="h-4 w-4" />
                Last Updated: {new Date(kpi.lastUpdated).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ClockIcon className="h-4 w-4" />
                Data Source: {kpi.dataSource}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}