import { XMarkIcon, InformationCircleIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon, DocumentChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

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

interface KPIDetailModalProps {
  kpi: KPI | null;
  isOpen: boolean;
  onClose: () => void;
}

export function KPIDetailModal({ kpi, isOpen, onClose }: KPIDetailModalProps) {
  if (!isOpen || !kpi) return null;

  const formatLastUpdated = (timestamp: string) => {
    if (!timestamp) {
      return 'N/A';
    }
    
    const numTimestamp = Number(timestamp);
    if (isNaN(numTimestamp)) {
      // It might be an ISO string or other date format, try to parse it directly
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString();
      }
      return 'N/A';
    }

    // If it's a 10-digit number, assume it's in seconds, otherwise milliseconds
    const date = new Date(timestamp.length === 10 ? numTimestamp * 1000 : numTimestamp);
    
    if (isNaN(date.getTime())) {
      return 'N/A';
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
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

  // Determine if lower values are better for this KPI
  const lowerIsBetter = ['Rate', 'TAT', 'Time', 'Days', 'Error', 'Fall', 'Turnover', 'Denial', 'Wait'].some(term => 
    (kpi.name && kpi.name.includes(term)) || 
    (kpi.unit && (
      kpi.unit.includes('per') || 
      kpi.unit.includes('days') || 
      kpi.unit.includes('hours') || 
      kpi.unit.includes('minutes')
    ))
  );

  const getStatusColor = () => {
    if (lowerIsBetter) {
      return kpi.value <= kpi.target ? 'text-green-600' : 'text-red-600';
    } else {
      return kpi.value >= kpi.target ? 'text-green-600' : 'text-red-600';
    }
  };

  const getStatusLabel = () => {
    if (lowerIsBetter) {
      return kpi.value <= kpi.target ? 'On Target' : 'Off Target';
    } else {
      return kpi.value >= kpi.target ? 'On Target' : 'Off Target';
    }
  };

  const getPerformanceVsBenchmark = () => {
    const diff = kpi.value - kpi.benchmark;
    const percentage = ((Math.abs(diff) / kpi.benchmark) * 100).toFixed(1);
    
    if (lowerIsBetter) {
      if (kpi.value < kpi.benchmark) {
        return <span className="text-green-600">{percentage}% better than benchmark</span>;
      } else {
        return <span className="text-red-600">{percentage}% worse than benchmark</span>;
      }
    } else {
      if (kpi.value > kpi.benchmark) {
        return <span className="text-green-600">{percentage}% better than benchmark</span>;
      } else {
        return <span className="text-red-600">{percentage}% worse than benchmark</span>;
      }
    }
  };

  // Generate trend data directly from the KPI's trend and change values
  const getTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Parse the change value from the KPI data
    const changeStr = kpi.change ? kpi.change.replace(/[+]/g, '') : '0'; // Remove plus sign but keep minus sign
    const changeValue = parseFloat(changeStr.replace(/[%]/g, '')) || 0.1;
    
    // Determine if the change is a percentage or absolute value
    const isPercentage = (kpi.change && kpi.change.includes('%')) || 
                         kpi.unit === '%' || 
                         (kpi.unit && kpi.unit.includes('per'));
    
    // Calculate the exact rate of change based on trend direction and change value
    let changeRate;
    if (isPercentage) {
      changeRate = changeValue / 100;
    } else {
      changeRate = changeValue / kpi.value;
    }
    
    // Adjust the sign based on trend direction
    if (kpi.trend === 'down' && (changeStr && !changeStr.includes('-'))) {
      changeRate = -changeRate;
    } else if (kpi.trend === 'up' && (changeStr && changeStr.includes('-'))) {
      changeRate = -changeRate;
    }
    
    // Calculate what the value was 12 months ago based on the current value and change rate
    const annualChangeRate = changeRate * 12; // Extrapolate monthly change to annual
    const valueOneYearAgo = kpi.value / (1 + annualChangeRate);
    
    // Generate data points for each month with a smooth progression
    return Array(12).fill(0).map((_, i) => {
      const monthIndex = (currentMonth - 11 + i) % 12;
      const month = months[monthIndex >= 0 ? monthIndex : monthIndex + 12];
      
      // Calculate progression as a non-linear curve to make the trend more realistic
      // This creates a slightly curved line instead of a straight line
      const progression = Math.pow(i / 11, 1.1); // Slightly non-linear curve
      
      // Calculate the value at this point on the curve
      const valueAtPoint = valueOneYearAgo + (kpi.value - valueOneYearAgo) * progression;
      
      // Add small random variations for visual interest, but smaller for a smoother line
      const randomVariation = i < 11 ? (Math.random() - 0.5) * 0.02 * kpi.value : 0;
      const finalValue = Math.max(0, valueAtPoint + randomVariation); // Ensure no negative values
      
      return {
        name: month,
        value: parseFloat(finalValue.toFixed(2)),
        month: i + 1,
        target: kpi.target,
        benchmark: kpi.benchmark
      };
    });
  };

  const chartData = getTrendData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor()}`}>
                {kpi.category.charAt(0).toUpperCase() + kpi.category.slice(1)}
              </span>
              <span className="text-xs text-slate-500">{kpi.subcategory}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{kpi.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* KPI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="text-sm text-slate-500 mb-1">Current Value</div>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {kpi.value} <span className="text-xl font-normal text-slate-500">{kpi.unit}</span>
              </div>
              <div className="flex items-center text-sm">
                <div className={`flex items-center ${kpi.trend === 'up' ? 'text-green-600' : (kpi.trend === 'down' ? 'text-red-600' : 'text-slate-600')}`}>
                  {kpi.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : kpi.trend === 'down' ? (
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  ) : null}
                  <span>{kpi.change}</span>
                </div>
                <span className="text-slate-400 mx-2">vs last period</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <div className="text-sm text-slate-500 mb-1">Target</div>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {kpi.target} <span className="text-xl font-normal text-slate-500">{kpi.unit}</span>
              </div>
              <div className="flex items-center text-sm">
                <div className={`flex items-center font-medium ${getStatusColor()}`}>
                  {getStatusLabel()}
                </div>
                <span className="text-slate-400 mx-2">current performance</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <div className="text-sm text-slate-500 mb-1">Benchmark</div>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {kpi.benchmark} <span className="text-xl font-normal text-slate-500">{kpi.unit}</span>
              </div>
              <div className="flex items-center text-sm">
                {getPerformanceVsBenchmark()}
              </div>
            </div>
          </div>

          {/* KPI Details */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ChartBarIcon className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900">Trend (12 Months)</h3>
                <span className={`ml-auto inline-flex items-center text-sm px-2 py-0.5 rounded-full ${
                  kpi.trend === 'up' ? 'bg-green-100 text-green-800' : 
                  (kpi.trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800')
                }`}>
                  {kpi.trend === 'up' ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : (kpi.trend === 'down' ? <ArrowTrendingDownIcon className="h-4 w-4 mr-1" /> : <MinusIcon className="h-4 w-4 mr-1" />)}
                  {kpi.trend === 'up' ? 'Increasing' : (kpi.trend === 'down' ? 'Decreasing' : 'Stable')} {kpi.change && `(${kpi.change})`}
                </span>
              </div>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 40,
                      left: 30,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 14 }}
                      tickFormatter={(value) => value}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `${value}${kpi.unit}`}
                      tick={{ fontSize: 14 }}
                      width={60}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'value') name = kpi.name;
                        if (name === 'target') name = 'Target';
                        if (name === 'benchmark') name = 'Benchmark';
                        return [`${value} ${kpi.unit}`, name];
                      }}
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{ fontSize: '14px', padding: '10px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                    <ReferenceLine 
                      y={kpi.target} 
                      label={{ value: 'Target', position: 'right', fill: '#10b981', fontSize: 14 }} 
                      stroke="#10b981" 
                      strokeDasharray="3 3" 
                      strokeWidth={2}
                    />
                    <ReferenceLine 
                      y={kpi.benchmark} 
                      label={{ value: 'Benchmark', position: 'right', fill: '#3b82f6', fontSize: 14 }} 
                      stroke="#3b82f6" 
                      strokeDasharray="3 3"
                      strokeWidth={2} 
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={kpi.trend === 'up' ? '#16a34a' : (kpi.trend === 'down' ? '#dc2626' : '#6366f1')}
                      strokeWidth={3}
                      dot={{ r: 5, fill: kpi.trend === 'up' ? '#16a34a' : (kpi.trend === 'down' ? '#dc2626' : '#6366f1') }}
                      activeDot={{ r: 8 }}
                      name={kpi.name}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#10b981"
                      strokeWidth={0}
                      dot={false}
                      activeDot={false}
                      name="Target"
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      stroke="#3b82f6"
                      strokeWidth={0}
                      dot={false}
                      activeDot={false}
                      name="Benchmark"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Description - Now below the chart */}
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <InformationCircleIcon className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900">Description</h3>
              </div>
              <p className="text-slate-700">
                {kpi.description}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Data Source:</span>
                  <span className="ml-2 text-slate-900">{kpi.dataSource}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-slate-400 mr-1" />
                  <span className="text-slate-500">Last Updated:</span>
                  <span className="ml-2 text-slate-900">{formatLastUpdated(kpi.lastUpdated)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <DocumentChartBarIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-slate-900">AI Recommendations</h3>
            </div>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">1</span>
                <span>Review documentation completeness in {kpi.subcategory} to improve data quality.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">2</span>
                <span>Compare performance across departments to identify best practices.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">3</span>
                <span>Consider targeted interventions based on current {kpi.trend === 'down' ? 'negative' : (kpi.trend === 'up' ? 'positive' : 'neutral')} trend.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t border-slate-200 bg-slate-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            Close
          </button>
          <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
