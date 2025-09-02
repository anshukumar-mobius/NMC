import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  BellIcon,
  CpuChipIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BeakerIcon,
  HeartIcon,
  UserIcon,
  CalendarDaysIcon,
  LightBulbIcon,
  ExclamationCircleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { useGetInstanceQuery } from '../api/query';

interface ClinicalRule {
  id: string;
  name: string;
  family: 'medication_safety' | 'clinical_deterioration' | 'chronic_disease' | 'imaging_safety' | 'lab_values' | 'preventive_care' | 'infection_control' | 'quality_metrics';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  active: boolean;
  triggers: number;
  overrides: number;
  acceptanceRate: number;
  lastModified: string;
  createdBy: string;
  version: string;
  cds: {
    condition: string;
    action: string;
    message: string;
    recommendation?: string;
  };
  parameters: Array<{
    name: string;
    type: 'number' | 'string' | 'boolean' | 'list';
    value: any;
    description: string;
  }>;
  evidence: string[];
  references: string[];
  performance: {
    sensitivity: number;
    specificity: number;
    positiveValue: number;
    negativeValue: number;
  };
  auditTrail: Array<{
    date: string;
    action: string;
    user: string;
    changes?: string;
  }>;
}

export function Rules() {
  const [rules, setRules] = useState<ClinicalRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<ClinicalRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState<ClinicalRule | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    family: 'all',
    severity: 'all',
    status: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);

  const RulesSchemaId = import.meta.env.VITE_CLINICAL_RULE_ID;
  const { data: Rules } = useGetInstanceQuery(RulesSchemaId);
  console.log(Rules);

  useEffect(() => {
    const loadRules = async () => {
      try {
          setRules(Rules || []);
          setFilteredRules(Rules || []);
          setLoading(false);
      } catch (error) {
        console.error('Error loading rules:', error);
        setLoading(false);
      }
    };
    loadRules();
  }, []);

  useEffect(() => {
    let filtered = rules;

    // Apply filters
    if (activeFilters.family !== 'all') {
      filtered = filtered.filter(rule => rule.family === activeFilters.family);
    }
    if (activeFilters.severity !== 'all') {
      filtered = filtered.filter(rule => rule.severity === activeFilters.severity);
    }
    if (activeFilters.status !== 'all') {
      const isActive = activeFilters.status === 'active';
      filtered = filtered.filter(rule => rule.active === isActive);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(rule =>
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.cds.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRules(filtered);
  }, [rules, activeFilters, searchQuery]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getFamilyColor = (family: string) => {
    switch (family) {
      case 'medication_safety':
        return 'bg-red-100 text-red-800';
      case 'clinical_deterioration':
        return 'bg-orange-100 text-orange-800';
      case 'chronic_disease':
        return 'bg-blue-100 text-blue-800';
      case 'imaging_safety':
        return 'bg-purple-100 text-purple-800';
      case 'lab_values':
        return 'bg-green-100 text-green-800';
      case 'preventive_care':
        return 'bg-teal-100 text-teal-800';
      case 'infection_control':
        return 'bg-yellow-100 text-yellow-800';
      case 'quality_metrics':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ));
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Clinical Rules Library</h1>
        <p className="text-slate-600">Manage and configure clinical decision support rules</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Rules</p>
              <p className="text-3xl font-bold text-slate-900">{rules.length}</p>
            </div>
            <Cog6ToothIcon className="h-8 w-8 text-slate-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Clinical decision rules
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Rules</p>
              <p className="text-3xl font-bold text-green-600">
                {rules.filter(r => r.active).length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Currently enabled
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Triggers</p>
              <p className="text-3xl font-bold text-blue-600">
                {rules.reduce((sum, rule) => sum + rule.triggers, 0).toLocaleString()}
              </p>
            </div>
            <BellIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            This month
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg Acceptance</p>
              <p className="text-3xl font-bold text-purple-600">
                {Math.round(rules.reduce((sum, rule) => sum + rule.acceptanceRate, 0) / rules.length)}%
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Rule acceptance rate
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
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-slate-400" />
            <select
              value={activeFilters.family}
              onChange={(e) => setActiveFilters({...activeFilters, family: e.target.value})}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="medication_safety">Medication Safety</option>
              <option value="clinical_deterioration">Clinical Deterioration</option>
              <option value="chronic_disease">Chronic Disease</option>
              <option value="imaging_safety">Imaging Safety</option>
              <option value="lab_values">Lab Values</option>
              <option value="preventive_care">Preventive Care</option>
              <option value="infection_control">Infection Control</option>
              <option value="quality_metrics">Quality Metrics</option>
            </select>
          </div>
          <select
            value={activeFilters.severity}
            onChange={(e) => setActiveFilters({...activeFilters, severity: e.target.value})}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={activeFilters.status}
            onChange={(e) => setActiveFilters({...activeFilters, status: e.target.value})}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => setShowNewRuleModal(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4" />
            New Rule
          </button>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          Showing {filteredRules.length} of {rules.length} rules
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-6">
        {filteredRules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200">
            {/* Rule Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{rule.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFamilyColor(rule.family)}`}>
                    {rule.family.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(rule.severity)}`}>
                    {rule.severity.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    {rule.active ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircleIcon className="h-4 w-4" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500 text-sm">
                        <XCircleIcon className="h-4 w-4" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-slate-600 mb-3">{rule.description}</p>
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    {rule.createdBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    v{rule.version}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    {new Date(rule.lastModified).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{rule.acceptanceRate}%</div>
                  <div className="text-xs text-slate-500">Acceptance Rate</div>
                </div>
              </div>
            </div>

            {/* CDS Information */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <CpuChipIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-medium text-blue-900 mb-1">Clinical Decision Support</h5>
                  <p className="text-blue-800 text-sm mb-2">{rule.cds.message}</p>
                  {rule.cds.recommendation && (
                    <div className="bg-blue-100 rounded p-2">
                      <p className="text-blue-900 text-sm">
                        <span className="font-medium">Recommendation:</span> {rule.cds.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">{rule.triggers.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Triggers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">{rule.overrides}</div>
                <div className="text-xs text-slate-500">Overrides</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{rule.performance.sensitivity}%</div>
                <div className="text-xs text-slate-500">Sensitivity</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{rule.performance.specificity}%</div>
                <div className="text-xs text-slate-500">Specificity</div>
              </div>
            </div>

            {/* Parameters Preview */}
            <div className="mb-4">
              <h5 className="font-medium text-slate-900 mb-2">Key Parameters</h5>
              <div className="flex flex-wrap gap-2">
                {rule.parameters.slice(0, 3).map((param, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                    {param.name}: {typeof param.value === 'boolean' ? (param.value ? 'Yes' : 'No') : param.value.toString()}
                  </span>
                ))}
                {rule.parameters.length > 3 && (
                  <span className="text-xs text-slate-500">+{rule.parameters.length - 3} more</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleToggleRule(rule.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm ${
                  rule.active 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {rule.active ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                {rule.active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => setSelectedRule(rule)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                <EyeIcon className="h-4 w-4" />
                View Details
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm">
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
                <ArrowPathIcon className="h-4 w-4" />
                Test Rule
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12">
          <Cog6ToothIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No rules found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}

      {/* Rule Detail Modal */}
      {selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Rule Details: {selectedRule.name}
              </h3>
              <button
                onClick={() => setSelectedRule(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rule Information */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Rule Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Rule ID:</span>
                      <span className="font-medium">{selectedRule.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Version:</span>
                      <span className="font-medium">{selectedRule.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Created By:</span>
                      <span className="font-medium">{selectedRule.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Modified:</span>
                      <span className="font-medium">{new Date(selectedRule.lastModified).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className={`font-medium ${selectedRule.active ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedRule.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-600">Sensitivity:</span>
                      <div className="font-medium text-lg">{selectedRule.performance.sensitivity}%</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Specificity:</span>
                      <div className="font-medium text-lg">{selectedRule.performance.specificity}%</div>
                    </div>
                    <div>
                      <span className="text-slate-600">PPV:</span>
                      <div className="font-medium text-lg">{selectedRule.performance.positiveValue}%</div>
                    </div>
                    <div>
                      <span className="text-slate-600">NPV:</span>
                      <div className="font-medium text-lg">{selectedRule.performance.negativeValue}%</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Evidence Base</h4>
                  <ul className="space-y-1">
                    {selectedRule.evidence.map((evidence, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {evidence}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Parameters and Configuration */}
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Rule Parameters</h4>
                  <div className="space-y-3">
                    {selectedRule.parameters.map((param, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3">
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-medium text-slate-900">{param.name}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {param.type}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 mb-1">
                          Value: <span className="font-medium">{param.value.toString()}</span>
                        </div>
                        <p className="text-xs text-slate-500">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">References</h4>
                  <ul className="space-y-1">
                    {selectedRule.references.map((reference, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <DocumentTextIcon className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        {reference}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Audit Trail</h4>
                  <div className="space-y-2">
                    {selectedRule.auditTrail.map((entry, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-slate-900">{entry.action}</span>
                          <span className="text-slate-500">{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                        <div className="text-slate-600">by {entry.user}</div>
                        {entry.changes && (
                          <div className="text-slate-500 text-xs mt-1">{entry.changes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Edit Rule
              </button>
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Test Rule
              </button>
              <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                Export Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}