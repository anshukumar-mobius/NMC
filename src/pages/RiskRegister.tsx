import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import {
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  UserIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BellIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface RiskItem {
  id: string;
  title: string;
  description: string;
  category: 'clinical' | 'operational' | 'financial' | 'regulatory' | 'technology' | 'reputational';
  severity: 'critical' | 'high' | 'medium' | 'low';
  likelihood: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  riskScore: number;
  status: 'open' | 'in_progress' | 'mitigated' | 'closed';
  owner: string;
  department: string;
  identifiedDate: string;
  lastReviewed: string;
  targetDate: string;
  mitigationActions: Array<{
    id: string;
    action: string;
    responsible: string;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed';
    progress: number;
  }>;
  impact: {
    patient_safety: number;
    financial: number;
    operational: number;
    regulatory: number;
  };
  trend: 'increasing' | 'stable' | 'decreasing';
  lastIncident?: string;
  relatedIncidents: number;
  complianceStandards: string[];
}

export function RiskRegister() {
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [filteredRisks, setFilteredRisks] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    severity: 'all',
    status: 'all',
    department: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'riskScore' | 'lastReviewed' | 'targetDate'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock risk data
  const mockRisks: RiskItem[] = [
    {
      id: 'RISK001',
      title: 'Medication Administration Errors',
      description: 'Risk of medication errors during administration due to look-alike/sound-alike drugs, dosing errors, or wrong patient administration',
      category: 'clinical',
      severity: 'critical',
      likelihood: 'medium',
      riskScore: 15,
      status: 'in_progress',
      owner: 'Dr. Ahmed Al-Rashid',
      department: 'Pharmacy',
      identifiedDate: '2024-01-15T00:00:00Z',
      lastReviewed: '2024-01-18T00:00:00Z',
      targetDate: '2024-02-15T00:00:00Z',
      mitigationActions: [
        {
          id: 'MA001',
          action: 'Implement barcode scanning for all medications',
          responsible: 'Pharmacy Director',
          dueDate: '2024-02-01T00:00:00Z',
          status: 'in_progress',
          progress: 65
        },
        {
          id: 'MA002',
          action: 'Conduct medication safety training for all nursing staff',
          responsible: 'Nursing Education',
          dueDate: '2024-01-30T00:00:00Z',
          status: 'completed',
          progress: 100
        }
      ],
      impact: {
        patient_safety: 9,
        financial: 6,
        operational: 7,
        regulatory: 8
      },
      trend: 'decreasing',
      lastIncident: '2024-01-10T00:00:00Z',
      relatedIncidents: 3,
      complianceStandards: ['JCI Patient Safety Goals', 'ISMP Guidelines', 'UAE MOH Standards']
    },
    {
      id: 'RISK002',
      title: 'Healthcare-Associated Infections (HAI)',
      description: 'Risk of patients acquiring infections during their hospital stay, including CLABSI, CAUTI, and surgical site infections',
      category: 'clinical',
      severity: 'high',
      likelihood: 'medium',
      riskScore: 12,
      status: 'open',
      owner: 'Dr. Sarah Hassan',
      department: 'Infection Control',
      identifiedDate: '2024-01-12T00:00:00Z',
      lastReviewed: '2024-01-19T00:00:00Z',
      targetDate: '2024-03-01T00:00:00Z',
      mitigationActions: [
        {
          id: 'MA003',
          action: 'Enhance hand hygiene compliance monitoring',
          responsible: 'Infection Control Team',
          dueDate: '2024-02-15T00:00:00Z',
          status: 'in_progress',
          progress: 40
        },
        {
          id: 'MA004',
          action: 'Implement daily chlorhexidine bathing in ICU',
          responsible: 'ICU Nursing Manager',
          dueDate: '2024-02-10T00:00:00Z',
          status: 'pending',
          progress: 0
        }
      ],
      impact: {
        patient_safety: 8,
        financial: 7,
        operational: 6,
        regulatory: 9
      },
      trend: 'stable',
      lastIncident: '2024-01-08T00:00:00Z',
      relatedIncidents: 5,
      complianceStandards: ['CDC Guidelines', 'JCI Infection Control Standards', 'WHO Hand Hygiene']
    },
    {
      id: 'RISK003',
      title: 'Cybersecurity Data Breach',
      description: 'Risk of unauthorized access to patient health information and hospital systems due to cyber attacks or system vulnerabilities',
      category: 'technology',
      severity: 'critical',
      likelihood: 'high',
      riskScore: 20,
      status: 'open',
      owner: 'IT Security Manager',
      department: 'Information Technology',
      identifiedDate: '2024-01-10T00:00:00Z',
      lastReviewed: '2024-01-20T00:00:00Z',
      targetDate: '2024-02-28T00:00:00Z',
      mitigationActions: [
        {
          id: 'MA005',
          action: 'Implement multi-factor authentication for all systems',
          responsible: 'IT Security Team',
          dueDate: '2024-02-05T00:00:00Z',
          status: 'in_progress',
          progress: 75
        },
        {
          id: 'MA006',
          action: 'Conduct penetration testing',
          responsible: 'External Security Consultant',
          dueDate: '2024-02-20T00:00:00Z',
          status: 'pending',
          progress: 0
        }
      ],
      impact: {
        patient_safety: 6,
        financial: 9,
        operational: 8,
        regulatory: 10
      },
      trend: 'increasing',
      relatedIncidents: 2,
      complianceStandards: ['HIPAA', 'UAE Data Protection Law', 'ISO 27001', 'NIST Cybersecurity Framework']
    },
    {
      id: 'RISK004',
      title: 'Staff Shortage in Critical Care',
      description: 'Insufficient nursing staff in ICU and emergency departments leading to increased patient-to-nurse ratios and potential safety risks',
      category: 'operational',
      severity: 'high',
      likelihood: 'high',
      riskScore: 16,
      status: 'in_progress',
      owner: 'Chief Nursing Officer',
      department: 'Nursing',
      identifiedDate: '2024-01-05T00:00:00Z',
      lastReviewed: '2024-01-17T00:00:00Z',
      targetDate: '2024-04-01T00:00:00Z',
      mitigationActions: [
        {
          id: 'MA007',
          action: 'Recruit additional ICU nurses',
          responsible: 'HR Recruitment Team',
          dueDate: '2024-03-15T00:00:00Z',
          status: 'in_progress',
          progress: 30
        },
        {
          id: 'MA008',
          action: 'Implement nurse retention program',
          responsible: 'Nursing Administration',
          dueDate: '2024-02-28T00:00:00Z',
          status: 'in_progress',
          progress: 50
        }
      ],
      impact: {
        patient_safety: 8,
        financial: 5,
        operational: 9,
        regulatory: 6
      },
      trend: 'stable',
      relatedIncidents: 1,
      complianceStandards: ['JCI Human Resources Standards', 'UAE Labor Law', 'Nursing Council Standards']
    },
    {
      id: 'RISK005',
      title: 'Medical Equipment Failure',
      description: 'Risk of critical medical equipment failure leading to patient safety incidents and operational disruptions',
      category: 'operational',
      severity: 'medium',
      likelihood: 'medium',
      riskScore: 9,
      status: 'mitigated',
      owner: 'Biomedical Engineering Manager',
      department: 'Biomedical Engineering',
      identifiedDate: '2023-12-20T00:00:00Z',
      lastReviewed: '2024-01-15T00:00:00Z',
      targetDate: '2024-01-31T00:00:00Z',
      mitigationActions: [
        {
          id: 'MA009',
          action: 'Implement preventive maintenance schedule',
          responsible: 'Biomedical Engineering Team',
          dueDate: '2024-01-20T00:00:00Z',
          status: 'completed',
          progress: 100
        },
        {
          id: 'MA010',
          action: 'Establish backup equipment inventory',
          responsible: 'Supply Chain Manager',
          dueDate: '2024-01-25T00:00:00Z',
          status: 'completed',
          progress: 100
        }
      ],
      impact: {
        patient_safety: 7,
        financial: 4,
        operational: 8,
        regulatory: 3
      },
      trend: 'decreasing',
      lastIncident: '2023-12-15T00:00:00Z',
      relatedIncidents: 2,
      complianceStandards: ['FDA Medical Device Standards', 'IEC 60601', 'JCI Equipment Management']
    },
    {
      id: 'RISK006',
      title: 'Regulatory Compliance Violations',
      description: 'Risk of non-compliance with healthcare regulations leading to penalties, license suspension, or accreditation loss',
      category: 'regulatory',
      severity: 'high',
      likelihood: 'low',
      riskScore: 8,
      status: 'open',
      owner: 'Compliance Officer',
      department: 'Quality & Compliance',
      identifiedDate: '2024-01-08T00:00:00Z',
      lastReviewed: '2024-01-16T00:00:00Z',
      targetDate: '2024-03-31T00:00:00Z',
      mitigationActions: [
        {
          id: 'MA011',
          action: 'Conduct comprehensive compliance audit',
          responsible: 'External Auditor',
          dueDate: '2024-02-29T00:00:00Z',
          status: 'pending',
          progress: 0
        },
        {
          id: 'MA012',
          action: 'Update all policies and procedures',
          responsible: 'Quality Team',
          dueDate: '2024-03-15T00:00:00Z',
          status: 'in_progress',
          progress: 25
        }
      ],
      impact: {
        patient_safety: 5,
        financial: 8,
        operational: 6,
        regulatory: 10
      },
      trend: 'stable',
      relatedIncidents: 0,
      complianceStandards: ['JCI Standards', 'MOHAP Regulations', 'DHA Requirements', 'NABIDH Standards']
    }
  ];

  useEffect(() => {
    const loadRisks = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setRisks(mockRisks);
          setFilteredRisks(mockRisks);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading risks:', error);
        setLoading(false);
      }
    };
    loadRisks();
  }, []);

  useEffect(() => {
    let filtered = risks;

    // Apply filters
    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(risk => risk.category === activeFilters.category);
    }
    if (activeFilters.severity !== 'all') {
      filtered = filtered.filter(risk => risk.severity === activeFilters.severity);
    }
    if (activeFilters.status !== 'all') {
      filtered = filtered.filter(risk => risk.status === activeFilters.status);
    }
    if (activeFilters.department !== 'all') {
      filtered = filtered.filter(risk => risk.department === activeFilters.department);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(risk =>
        risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.owner.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'riskScore':
          aValue = a.riskScore;
          bValue = b.riskScore;
          break;
        case 'lastReviewed':
          aValue = new Date(a.lastReviewed).getTime();
          bValue = new Date(b.lastReviewed).getTime();
          break;
        case 'targetDate':
          aValue = new Date(a.targetDate).getTime();
          bValue = new Date(b.targetDate).getTime();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'in_progress':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'mitigated':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'closed':
        return 'text-slate-700 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'clinical':
        return 'bg-red-100 text-red-800';
      case 'operational':
        return 'bg-blue-100 text-blue-800';
      case 'financial':
        return 'bg-green-100 text-green-800';
      case 'regulatory':
        return 'bg-purple-100 text-purple-800';
      case 'technology':
        return 'bg-indigo-100 text-indigo-800';
      case 'reputational':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case 'stable':
        return <div className="h-4 w-4 border-t-2 border-amber-500"></div>;
      default:
        return <div className="h-4 w-4 border-t-2 border-slate-500"></div>;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 15) return 'text-red-700 bg-red-50';
    if (score >= 10) return 'text-orange-700 bg-orange-50';
    if (score >= 5) return 'text-amber-700 bg-amber-50';
    return 'text-green-700 bg-green-50';
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
                {risks.filter(r => r.severity === 'critical').length}
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
                {risks.filter(r => r.status === 'in_progress').length}
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
                {(risks.reduce((acc, r) => acc + r.riskScore, 0) / risks.length).toFixed(1)}
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
              value={activeFilters.category}
              onChange={(e) => setActiveFilters({...activeFilters, category: e.target.value})}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="clinical">Clinical</option>
              <option value="operational">Operational</option>
              <option value="financial">Financial</option>
              <option value="regulatory">Regulatory</option>
              <option value="technology">Technology</option>
              <option value="reputational">Reputational</option>
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
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
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
              <option value="riskScore">Risk Score</option>
              <option value="lastReviewed">Last Reviewed</option>
              <option value="targetDate">Target Date</option>
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
                  <h3 className="text-lg font-semibold text-slate-900">{risk.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(risk.category)}`}>
                    {risk.category.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(risk.severity)}`}>
                    {risk.severity.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(risk.status)}`}>
                    {risk.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-600 mb-3">{risk.description}</p>
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    {risk.owner}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    Target: {new Date(risk.targetDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    {getTrendIcon(risk.trend)}
                    {risk.trend}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`px-3 py-2 rounded-lg text-center ${getRiskScoreColor(risk.riskScore)}`}>
                  <div className="text-2xl font-bold">{risk.riskScore}</div>
                  <div className="text-xs">Risk Score</div>
                </div>
                <div className="text-xs text-slate-500">
                  {risk.relatedIncidents} incidents
                </div>
              </div>
            </div>

            {/* Impact Visualization */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">Patient Safety</div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(risk.impact.patient_safety / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-600 mt-1">{risk.impact.patient_safety}/10</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">Financial</div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(risk.impact.financial / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-600 mt-1">{risk.impact.financial}/10</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">Operational</div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(risk.impact.operational / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-600 mt-1">{risk.impact.operational}/10</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">Regulatory</div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(risk.impact.regulatory / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-600 mt-1">{risk.impact.regulatory}/10</div>
              </div>
            </div>

            {/* Mitigation Actions */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-900 mb-3">Mitigation Actions ({risk.mitigationActions.length})</h4>
              <div className="space-y-2">
                {risk.mitigationActions.slice(0, 2).map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{action.action}</p>
                      <p className="text-xs text-slate-500">
                        {action.responsible} • Due: {new Date(action.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            action.status === 'completed' ? 'bg-green-500' :
                            action.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-400'
                          }`}
                          style={{ width: `${action.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-600">{action.progress}%</span>
                    </div>
                  </div>
                ))}
                {risk.mitigationActions.length > 2 && (
                  <div className="text-xs text-slate-500 text-center py-2">
                    +{risk.mitigationActions.length - 2} more actions
                  </div>
                )}
              </div>
            </div>

            {/* Compliance Standards */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-900 mb-2">Compliance Standards</h4>
              <div className="flex flex-wrap gap-2">
                {risk.complianceStandards.map((standard, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {standard}
                  </span>
                ))}
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
                Risk Details: {selectedRisk.title}
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
                    <div className="flex justify-between">
                      <span className="text-slate-600">Category:</span>
                      <span className="font-medium capitalize">{selectedRisk.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Severity:</span>
                      <span className="font-medium capitalize">{selectedRisk.severity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Likelihood:</span>
                      <span className="font-medium capitalize">{selectedRisk.likelihood.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Risk Score:</span>
                      <span className="font-medium">{selectedRisk.riskScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Owner:</span>
                      <span className="font-medium">{selectedRisk.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Department:</span>
                      <span className="font-medium">{selectedRisk.department}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Identified:</span>
                      <span className="font-medium">{new Date(selectedRisk.identifiedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Reviewed:</span>
                      <span className="font-medium">{new Date(selectedRisk.lastReviewed).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Target Date:</span>
                      <span className="font-medium">{new Date(selectedRisk.targetDate).toLocaleDateString()}</span>
                    </div>
                    {selectedRisk.lastIncident && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Last Incident:</span>
                        <span className="font-medium">{new Date(selectedRisk.lastIncident).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mitigation Actions */}
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">All Mitigation Actions</h4>
                  <div className="space-y-3">
                    {selectedRisk.mitigationActions.map((action) => (
                      <div key={action.id} className="bg-white rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium text-slate-900">{action.action}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            action.status === 'completed' ? 'bg-green-100 text-green-800' :
                            action.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {action.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mb-2">
                          Responsible: {action.responsible} • Due: {new Date(action.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                action.status === 'completed' ? 'bg-green-500' :
                                action.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-400'
                              }`}
                              style={{ width: `${action.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-600">{action.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Impact Assessment</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedRisk.impact).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600 capitalize">{key.replace('_', ' ')}</span>
                          <span className="font-medium">{value}/10</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              key === 'patient_safety' ? 'bg-red-500' :
                              key === 'financial' ? 'bg-green-500' :
                              key === 'operational' ? 'bg-blue-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${(value / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Update Risk
              </button>
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Add Action
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