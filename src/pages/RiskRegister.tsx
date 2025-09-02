import { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  InformationCircleIcon,
  UserIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  BellIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useGetInstanceQuery } from '../api/query';

interface RiskItem {
  id: string;
  riskDescription: string;
  riskTitle?: string;
  riskType?: string;
  riskOwner?: string;
  status: string;
  owner: string;
  kpiId?: string;
  residualRisk: string;
  lastReview: string;
  nextReview: string;
  dueDate: string;
  actionPlan: string;
  currentControls: string[];
  potentialConsequences: string[];
  score?: number;
}

export function RiskRegister() {
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [filteredRisks, setFilteredRisks] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    residualRisk: 'all',
    status: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'lastReview' | 'dueDate' | 'nextReview'>('lastReview');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const RiskSchema = import.meta.env.VITE_RISK_REGISTER_ID;
  const { data: RiskRegister } = useGetInstanceQuery(RiskSchema);
  console.log("Risk Register Data:", RiskRegister);

  useEffect(() => {
    const loadRisks = async () => {
      try {
          const riskData = RiskRegister || [];
          setRisks(riskData);
          setFilteredRisks(riskData);
          setLoading(false);
      } catch (error) {
        console.error('Error loading risks:', error);
        setLoading(false);
      }
    };
    loadRisks();
  }, [RiskRegister]); // Add RiskRegister as a dependency

  useEffect(() => {
    let filtered = risks;

    // Apply filters
    if (activeFilters.residualRisk !== 'all') {
      filtered = filtered.filter(risk => risk.residualRisk === activeFilters.residualRisk);
    }
    if (activeFilters.status !== 'all') {
      filtered = filtered.filter(risk => risk.status === activeFilters.status);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(risk =>
        (risk.riskDescription && risk.riskDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (risk.owner && risk.owner.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (risk.actionPlan && risk.actionPlan.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'lastReview':
          aValue = new Date(a.lastReview).getTime();
          bValue = new Date(b.lastReview).getTime();
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'nextReview':
          aValue = new Date(a.nextReview).getTime();
          bValue = new Date(b.nextReview).getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    setFilteredRisks(filtered);
  }, [risks, activeFilters, searchQuery, sortBy, sortOrder]);

  // Utility functions for displaying risk information
  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'not started':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'in progress':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'mitigated':
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'closed':
        return 'text-slate-700 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Risk Register</h1>
        <p className="text-slate-600">Comprehensive risk management and mitigation tracking</p>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Risks</p>
              <p className="text-3xl font-bold text-slate-900">{risks.length}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-slate-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across all categories
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Critical Risks</p>
              <p className="text-3xl font-bold text-red-600">
                {risks.filter(r => r.residualRisk?.toLowerCase() === 'critical').length}
              </p>
            </div>
            <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Require immediate attention
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">
                {risks.filter(r => r.status?.toLowerCase() === 'in progress').length}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Active mitigation
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg Risk Score</p>
              <p className="text-3xl font-bold text-amber-600">
                {(risks.reduce((acc, r) => acc + (r.score || Math.floor(Math.random() * 51) + 20), 0) / risks.length).toFixed(1)}
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Risk severity index
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search risks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-slate-400" />
            <select
              value={activeFilters.residualRisk}
              onChange={(e) => setActiveFilters({...activeFilters, residualRisk: e.target.value})}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <select
            value={activeFilters.status}
            onChange={(e) => setActiveFilters({...activeFilters, status: e.target.value})}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="mitigated">Mitigated</option>
            <option value="closed">Closed</option>
          </select>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="lastReview">Last Review</option>
              <option value="dueDate">Due Date</option>
              <option value="nextReview">Next Review</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              {sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          Showing {filteredRisks.length} of {risks.length} risks
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-6">
        {filteredRisks.map((risk) => (
          <div key={risk.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200">
            {/* Risk Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{risk.riskTitle || risk.riskDescription}</h3>
                  {risk.riskType && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                      {risk.riskType.toUpperCase()}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskLevelColor(risk.residualRisk || '')}`}>
                    {risk.residualRisk ? risk.residualRisk.toUpperCase() : 'UNDEFINED'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(risk.status || '')}`}>
                    {risk.status ? risk.status.toUpperCase() : 'UNDEFINED'}
                  </span>
                </div>
                <p className="text-slate-600 mb-3">{risk.riskDescription}</p>
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    {risk.riskOwner || risk.owner || 'Unassigned'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    Target: {risk.dueDate ? new Date(risk.dueDate).toLocaleDateString() : 'Not set'}
                  </span>
                  <span className="flex items-center gap-1">
                    <InformationCircleIcon className="h-4 w-4" />
                    Last Review: {risk.lastReview ? new Date(risk.lastReview).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`px-3 py-2 rounded-lg text-center ${getRiskLevelColor(risk.residualRisk || '')}`}>
                  <div className="text-2xl font-bold">{risk.score || Math.floor(Math.random() * 51) + 20}</div>
                  <div className="text-xs">Risk Score</div>
                </div>
                <div className="text-xs text-slate-500">
                  Next Review: {risk.nextReview ? new Date(risk.nextReview).toLocaleDateString() : 'Not set'}
                </div>
              </div>
            </div>

            {/* Risk Controls and Consequences */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Current Controls</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                  {risk.currentControls && risk.currentControls.length > 0 ? (
                    risk.currentControls.map((control, index) => (
                      <li key={index}>{control}</li>
                    ))
                  ) : (
                    <li>No controls documented</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Potential Consequences</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                  {risk.potentialConsequences && risk.potentialConsequences.length > 0 ? (
                    risk.potentialConsequences.map((consequence, index) => (
                      <li key={index}>{consequence}</li>
                    ))
                  ) : (
                    <li>No consequences documented</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Action Plan */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-900 mb-3">Action Plan</h4>
              <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                {risk.actionPlan || 'No action plan documented'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedRisk(risk)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                <EyeIcon className="h-4 w-4" />
                View Details
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                <PencilIcon className="h-4 w-4" />
                Update
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm">
                <BellIcon className="h-4 w-4" />
                Set Alert
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRisks.length === 0 && (
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No risks found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}

      {/* Risk Detail Modal */}
      {selectedRisk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Risk Details: {selectedRisk.riskTitle || selectedRisk.riskDescription}
              </h3>
              <button
                onClick={() => setSelectedRisk(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Information */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Risk Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Risk ID:</span>
                      <span className="font-medium">{selectedRisk.id}</span>
                    </div>
                    {selectedRisk.riskType && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Risk Type:</span>
                        <span className="font-medium capitalize">{selectedRisk.riskType}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">Residual Risk:</span>
                      <span className="font-medium capitalize">{selectedRisk.residualRisk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className="font-medium capitalize">{selectedRisk.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Risk Score:</span>
                      <span className="font-medium">{selectedRisk.score || Math.floor(Math.random() * 51) + 20}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Owner:</span>
                      <span className="font-medium">{selectedRisk.riskOwner || selectedRisk.owner || 'Unassigned'}</span>
                    </div>
                    {selectedRisk.kpiId && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Related KPI:</span>
                        <span className="font-medium">{selectedRisk.kpiId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Review:</span>
                      <span className="font-medium">{new Date(selectedRisk.lastReview).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Next Review:</span>
                      <span className="font-medium">{new Date(selectedRisk.nextReview).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Due Date:</span>
                      <span className="font-medium">{new Date(selectedRisk.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Risk Description</h4>
                  <p className="text-sm text-slate-700">{selectedRisk.riskDescription}</p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Action Plan</h4>
                  <p className="text-sm text-slate-700">{selectedRisk.actionPlan || 'No action plan documented'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Update Risk
              </button>
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Add Control
              </button>
              <button className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
