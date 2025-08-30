import React, { useState, useEffect } from 'react';
import { OKRCard } from '../components/Dashboard/OKRCard';
import { KPITile } from '../components/Dashboard/KPITile';
import { CDSWidget } from '../components/Dashboard/CDSWidget';
import { mockApi } from '../utils/mockApi';
import { 
  CalendarDaysIcon, 
  BuildingOffice2Icon, 
  UserIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function Dashboard() {
  const [okrs, setOkrs] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [filteredKpis, setFilteredKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    dateRange: '30d',
    department: 'all',
    persona: 'all',
    kpiCategory: 'all'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [okrData, kpiData] = await Promise.all([
          mockApi.getOKRs(),
          mockApi.getKPIs()
        ]);
        setOkrs(okrData);
        setKpis(kpiData);
        setFilteredKpis(kpiData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = kpis;
    
    if (activeFilters.kpiCategory !== 'all') {
      filtered = filtered.filter(kpi => kpi.category === activeFilters.kpiCategory);
    }
    
    setFilteredKpis(filtered);
  }, [kpis, activeFilters.kpiCategory]);

  const agentActivity = {
    alerts: 47,
    processed: 156,
    efficiency: 94.2
  };

  const preAuthStats = {
    pending: 12,
    avgTAT: '4.2h',
    approved: 89.7
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Clinical Dashboard</h1>
        <p className="text-slate-600">Monitor your healthcare quality metrics and organizational objectives</p>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-slate-50 rounded-2xl">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-slate-400" />
          <select 
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={activeFilters.dateRange}
            onChange={(e) => setActiveFilters({...activeFilters, dateRange: e.target.value})}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <BuildingOffice2Icon className="h-5 w-5 text-slate-400" />
          <select 
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={activeFilters.department}
            onChange={(e) => setActiveFilters({...activeFilters, department: e.target.value})}
          >
            <option value="all">All Departments</option>
            <option value="internal_medicine">Internal Medicine</option>
            <option value="emergency">Emergency Medicine</option>
            <option value="icu">ICU</option>
            <option value="surgery">Surgery</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-slate-400" />
          <select 
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={activeFilters.persona}
            onChange={(e) => setActiveFilters({...activeFilters, persona: e.target.value})}
          >
            <option value="all">All Personas</option>
            <option value="physician">Physicians</option>
            <option value="nurse">Nurses</option>
            <option value="quality">Quality Team</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5 text-slate-400" />
          <select 
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={activeFilters.kpiCategory}
            onChange={(e) => setActiveFilters({...activeFilters, kpiCategory: e.target.value})}
          >
            <option value="all">All KPIs</option>
            <option value="quality">Quality</option>
            <option value="efficiency">Efficiency</option>
            <option value="clinical">Clinical</option>
            <option value="safety">Safety</option>
            <option value="workforce">Workforce</option>
            <option value="financial">Financial</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <ChartBarIcon className="h-8 w-8" />
            <span className="text-sm bg-blue-400 bg-opacity-50 px-2 py-1 rounded-full">
              Agent Activity
            </span>
          </div>
          <div className="text-3xl font-bold mb-2">{agentActivity.alerts}</div>
          <div className="text-blue-100">Alerts processed today</div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-400">
            <span className="text-sm">Efficiency: {agentActivity.efficiency}%</span>
            <span className="text-sm">{agentActivity.processed} total</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <ClockIcon className="h-8 w-8" />
            <span className="text-sm bg-green-400 bg-opacity-50 px-2 py-1 rounded-full">
              Pre-Auth TAT
            </span>
          </div>
          <div className="text-3xl font-bold mb-2">{preAuthStats.avgTAT}</div>
          <div className="text-green-100">Average turnaround time</div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-green-400">
            <span className="text-sm">{preAuthStats.pending} pending</span>
            <span className="text-sm">{preAuthStats.approved}% approved</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircleIcon className="h-8 w-8" />
            <span className="text-sm bg-purple-400 bg-opacity-50 px-2 py-1 rounded-full">
              Quality Score
            </span>
          </div>
          <div className="text-3xl font-bold mb-2">94.2%</div>
          <div className="text-purple-100">Overall clinical quality</div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-purple-400">
            <span className="text-sm">JCI Ready</span>
            <span className="text-sm">+2.1% this month</span>
          </div>
        </div>
      </div>

      {/* CDS Widget */}
      <div className="mb-8">
        <CDSWidget />
      </div>

      {/* OKR Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Objectives & Key Results</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {okrs.map((okr) => (
            <OKRCard key={okr.id} okr={okr} />
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Key Performance Indicators 
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({filteredKpis.length} metrics)
            </span>
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-slate-600">On Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <span className="text-slate-600">Off Target</span>
            </div>
          </div>
        </div>
        
        {/* KPI Categories Summary */}
        {activeFilters.kpiCategory === 'all' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {['quality', 'efficiency', 'clinical', 'safety', 'workforce', 'financial'].map(category => {
              const categoryKpis = kpis.filter(kpi => kpi.category === category);
              const onTargetCount = categoryKpis.filter(kpi => {
                const lowerIsBetter = ['Rate', 'TAT', 'Time', 'Days', 'Error', 'Fall', 'Turnover', 'Denial', 'Wait'].some(term => 
                  kpi.name.includes(term) || kpi.unit.includes('per') || kpi.unit.includes('days') || kpi.unit.includes('hours') || kpi.unit.includes('minutes')
                );
                return lowerIsBetter ? kpi.value <= kpi.target : kpi.value >= kpi.target;
              }).length;
              
              return (
                <div key={category} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900">{onTargetCount}/{categoryKpis.length}</div>
                  <div className="text-xs text-slate-500 capitalize">{category}</div>
                  <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${(onTargetCount / categoryKpis.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKpis.map((kpi) => (
            <KPITile key={kpi.id} kpi={kpi} />
          ))}
        </div>
        
        {filteredKpis.length === 0 && (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No KPIs found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your filters to see more metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}