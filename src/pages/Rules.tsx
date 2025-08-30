import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
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

  // Mock rules data
  const mockRules: ClinicalRule[] = [
    {
      id: 'R001',
      name: 'High-Risk Drug Interaction Alert',
      family: 'medication_safety',
      severity: 'critical',
      description: 'Alert when prescribing drugs with known dangerous interactions that could cause serious adverse events',
      active: true,
      triggers: 1847,
      overrides: 23,
      acceptanceRate: 98.8,
      lastModified: '2024-01-10T08:30:00Z',
      createdBy: 'Dr. Ahmed Al-Rashid',
      version: '2.1',
      cds: {
        condition: 'drug_interaction',
        action: 'alert_prescriber',
        message: 'Critical drug interaction detected between prescribed medications',
        recommendation: 'Consider alternative medications or adjust dosing with increased monitoring'
      },
      parameters: [
        {
          name: 'interaction_severity',
          type: 'list',
          value: ['major', 'contraindicated'],
          description: 'Minimum interaction severity to trigger alert'
        },
        {
          name: 'alert_delay',
          type: 'number',
          value: 0,
          description: 'Delay in seconds before showing alert'
        }
      ],
      evidence: [
        'FDA Drug Interaction Database',
        'Clinical pharmacology studies',
        'Adverse event reports from FAERS'
      ],
      references: [
        'FDA Drug Safety Communications',
        'Clinical Pharmacology & Therapeutics Guidelines',
        'ISMP High-Alert Medications List'
      ],
      performance: {
        sensitivity: 94.2,
        specificity: 87.5,
        positiveValue: 89.3,
        negativeValue: 93.1
      },
      auditTrail: [
        {
          date: '2024-01-10T08:30:00Z',
          action: 'Rule Updated',
          user: 'Dr. Ahmed Al-Rashid',
          changes: 'Updated interaction severity threshold'
        },
        {
          date: '2024-01-05T14:20:00Z',
          action: 'Rule Activated',
          user: 'System Admin',
          changes: 'Enabled rule after testing'
        }
      ]
    },
    {
      id: 'R002',
      name: 'Sepsis Early Warning System',
      family: 'clinical_deterioration',
      severity: 'high',
      description: 'Early identification of sepsis risk based on vital signs, lab values, and clinical indicators',
      active: true,
      triggers: 324,
      overrides: 45,
      acceptanceRate: 86.1,
      lastModified: '2024-01-08T14:20:00Z',
      createdBy: 'Dr. Sarah Hassan',
      version: '1.8',
      cds: {
        condition: 'sepsis_risk',
        action: 'escalate_care',
        message: 'Patient shows signs consistent with early sepsis - consider urgent evaluation',
        recommendation: 'Initiate sepsis bundle: blood cultures, lactate, broad-spectrum antibiotics within 1 hour'
      },
      parameters: [
        {
          name: 'temperature_threshold',
          type: 'number',
          value: 38.0,
          description: 'Temperature threshold in Celsius'
        },
        {
          name: 'heart_rate_threshold',
          type: 'number',
          value: 90,
          description: 'Heart rate threshold in BPM'
        },
        {
          name: 'wbc_threshold',
          type: 'number',
          value: 12000,
          description: 'White blood cell count threshold'
        }
      ],
      evidence: [
        'Surviving Sepsis Campaign Guidelines',
        'SIRS criteria validation studies',
        'qSOFA score performance data'
      ],
      references: [
        'Surviving Sepsis Campaign: International Guidelines',
        'Critical Care Medicine Journal',
        'JAMA Internal Medicine Studies'
      ],
      performance: {
        sensitivity: 89.7,
        specificity: 82.3,
        positiveValue: 76.8,
        negativeValue: 92.4
      },
      auditTrail: [
        {
          date: '2024-01-08T14:20:00Z',
          action: 'Parameters Updated',
          user: 'Dr. Sarah Hassan',
          changes: 'Adjusted temperature threshold from 38.3 to 38.0'
        }
      ]
    },
    {
      id: 'R003',
      name: 'Diabetic Foot Care Reminder',
      family: 'chronic_disease',
      severity: 'medium',
      description: 'Reminder for annual diabetic foot examination and preventive care measures',
      active: true,
      triggers: 156,
      overrides: 12,
      acceptanceRate: 92.3,
      lastModified: '2024-01-05T11:15:00Z',
      createdBy: 'Dr. Priya Sharma',
      version: '1.3',
      cds: {
        condition: 'diabetes_annual_exam',
        action: 'schedule_appointment',
        message: 'Annual diabetic foot examination due for this patient',
        recommendation: 'Schedule comprehensive foot exam including monofilament testing and vascular assessment'
      },
      parameters: [
        {
          name: 'reminder_interval',
          type: 'number',
          value: 365,
          description: 'Days between reminders'
        },
        {
          name: 'high_risk_interval',
          type: 'number',
          value: 180,
          description: 'Days for high-risk patients'
        }
      ],
      evidence: [
        'American Diabetes Association Standards',
        'Diabetic foot ulcer prevention studies',
        'Cost-effectiveness analyses'
      ],
      references: [
        'ADA Standards of Medical Care in Diabetes',
        'Diabetes Care Journal',
        'International Diabetes Federation Guidelines'
      ],
      performance: {
        sensitivity: 95.1,
        specificity: 78.9,
        positiveValue: 82.4,
        negativeValue: 94.2
      },
      auditTrail: [
        {
          date: '2024-01-05T11:15:00Z',
          action: 'Rule Created',
          user: 'Dr. Priya Sharma',
          changes: 'Initial rule creation'
        }
      ]
    },
    {
      id: 'R004',
      name: 'Contrast Agent Allergy Check',
      family: 'imaging_safety',
      severity: 'critical',
      description: 'Verify patient allergy status before contrast imaging studies to prevent adverse reactions',
      active: true,
      triggers: 89,
      overrides: 2,
      acceptanceRate: 97.8,
      lastModified: '2024-01-12T16:45:00Z',
      createdBy: 'Dr. Hassan Mahmoud',
      version: '1.5',
      cds: {
        condition: 'contrast_allergy_risk',
        action: 'verify_allergies',
        message: 'Patient has documented contrast allergy - verify before proceeding',
        recommendation: 'Consider pre-medication protocol or alternative imaging without contrast'
      },
      parameters: [
        {
          name: 'allergy_types',
          type: 'list',
          value: ['iodine', 'contrast', 'shellfish'],
          description: 'Allergy types that trigger the alert'
        },
        {
          name: 'premedication_required',
          type: 'boolean',
          value: true,
          description: 'Require premedication for known allergies'
        }
      ],
      evidence: [
        'ACR Manual on Contrast Media',
        'Contrast-induced nephropathy studies',
        'Allergic reaction incidence data'
      ],
      references: [
        'American College of Radiology Guidelines',
        'European Society of Urogenital Radiology',
        'Radiology Journal Publications'
      ],
      performance: {
        sensitivity: 98.5,
        specificity: 94.7,
        positiveValue: 91.2,
        negativeValue: 99.1
      },
      auditTrail: [
        {
          date: '2024-01-12T16:45:00Z',
          action: 'Rule Updated',
          user: 'Dr. Hassan Mahmoud',
          changes: 'Added shellfish allergy to trigger conditions'
        }
      ]
    },
    {
      id: 'R005',
      name: 'Antibiotic Stewardship Protocol',
      family: 'infection_control',
      severity: 'high',
      description: 'Promote appropriate antibiotic use and prevent resistance through evidence-based prescribing',
      active: true,
      triggers: 267,
      overrides: 34,
      acceptanceRate: 87.3,
      lastModified: '2024-01-15T09:30:00Z',
      createdBy: 'Dr. Fatima Al-Zahra',
      version: '2.0',
      cds: {
        condition: 'antibiotic_prescription',
        action: 'stewardship_review',
        message: 'Consider antibiotic stewardship guidelines for optimal therapy',
        recommendation: 'Review culture results, consider de-escalation, and assess duration of therapy'
      },
      parameters: [
        {
          name: 'broad_spectrum_alert',
          type: 'boolean',
          value: true,
          description: 'Alert for broad-spectrum antibiotics'
        },
        {
          name: 'duration_threshold',
          type: 'number',
          value: 7,
          description: 'Days after which to review continuation'
        }
      ],
      evidence: [
        'CDC Antibiotic Stewardship Guidelines',
        'Infectious Diseases Society Guidelines',
        'Local antibiogram data'
      ],
      references: [
        'CDC Core Elements of Antibiotic Stewardship',
        'IDSA Practice Guidelines',
        'Clinical Infectious Diseases Journal'
      ],
      performance: {
        sensitivity: 85.4,
        specificity: 79.8,
        positiveValue: 73.2,
        negativeValue: 89.1
      },
      auditTrail: [
        {
          date: '2024-01-15T09:30:00Z',
          action: 'Major Update',
          user: 'Dr. Fatima Al-Zahra',
          changes: 'Updated to version 2.0 with new resistance patterns'
        }
      ]
    },
    {
      id: 'R006',
      name: 'Renal Function Monitoring',
      family: 'lab_values',
      severity: 'high',
      description: 'Monitor renal function in patients on nephrotoxic medications or with kidney disease',
      active: false,
      triggers: 0,
      overrides: 0,
      acceptanceRate: 0,
      lastModified: '2024-01-18T13:45:00Z',
      createdBy: 'Dr. Mohammed Al-Rashid',
      version: '1.0',
      cds: {
        condition: 'renal_function_decline',
        action: 'alert_provider',
        message: 'Significant decline in renal function detected',
        recommendation: 'Review nephrotoxic medications, ensure adequate hydration, consider nephrology consult'
      },
      parameters: [
        {
          name: 'creatinine_increase',
          type: 'number',
          value: 0.5,
          description: 'mg/dL increase that triggers alert'
        },
        {
          name: 'gfr_decline',
          type: 'number',
          value: 25,
          description: 'Percentage GFR decline threshold'
        }
      ],
      evidence: [
        'KDIGO Clinical Practice Guidelines',
        'Acute kidney injury studies',
        'Nephrotoxicity research'
      ],
      references: [
        'Kidney Disease: Improving Global Outcomes',
        'American Journal of Kidney Diseases',
        'Clinical Journal of the American Society of Nephrology'
      ],
      performance: {
        sensitivity: 0,
        specificity: 0,
        positiveValue: 0,
        negativeValue: 0
      },
      auditTrail: [
        {
          date: '2024-01-18T13:45:00Z',
          action: 'Rule Created',
          user: 'Dr. Mohammed Al-Rashid',
          changes: 'Initial rule creation - pending validation'
        }
      ]
    }
  ];

  useEffect(() => {
    const loadRules = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setRules(mockRules);
          setFilteredRules(mockRules);
          setLoading(false);
        }, 800);
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