import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface KeyResult {
  description: string;
  progress: number;
  target: number;
  unit: string;
}

interface OKR {
  id: string;
  title: string;
  objective: string;
  keyResults: KeyResult[];
  owner: string;
  status: 'on_track' | 'at_risk' | 'achieved';
  quarter: string;
}

interface OKRCardProps {
  okr: OKR;
}

export function OKRCard({ okr }: OKRCardProps) {
  const getStatusIcon = () => {
    switch (okr.status) {
      case 'achieved':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'at_risk':
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (okr.status) {
      case 'achieved':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'at_risk':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const getStatusText = () => {
    switch (okr.status) {
      case 'achieved':
        return 'Achieved';
      case 'at_risk':
        return 'At Risk';
      default:
        return 'On Track';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{okr.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{okr.objective}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
          {getStatusIcon()}
          {getStatusText()}
        </div>
      </div>

      <div className="space-y-4">
        {okr.keyResults.map((kr, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-start">
              <p className="text-sm text-slate-700 flex-1">{kr.description}</p>
              <span className="text-sm font-medium text-slate-900 ml-2">
                {kr.progress}{kr.unit}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((kr.progress / kr.target) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Target: {kr.target}{kr.unit}</span>
              <span>{Math.round((kr.progress / kr.target) * 100)}% complete</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
        <span className="text-sm text-slate-500">{okr.quarter}</span>
        <span className="text-sm font-medium text-slate-700">{okr.owner}</span>
      </div>
    </div>
  );
}