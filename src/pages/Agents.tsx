import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import {
  CpuChipIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BoltIcon,
  ShieldCheckIcon,
  HeartIcon,
  BeakerIcon,
  DocumentTextIcon,
  UserGroupIcon,
  AcademicCapIcon,
  LightBulbIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XCircleIcon,
  SignalIcon,
  CloudIcon,
  ServerIcon,
  WifiIcon
} from '@heroicons/react/24/outline';

interface Agent {
  id: string;
  name: string;
  capability: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  type: 'monitoring' | 'coordination' | 'financial' | 'clinical' | 'analytics' | 'research';
  lastActivity: string;
  enabled: boolean;
  version: string;
  uptime: number;
  metrics: {
    [key: string]: string | number;
  };
  recentActions: string[];
  configuration: {
    [key: string]: any;
  };
  dependencies: string[];
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
  performance: {
    successRate: number;
    avgResponseTime: string;
    throughput: string;
  };
  alerts: Array<{
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
}

export function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Mock agents data
  const mockAgents: Agent[] = [
    {
      id: 'sentinel',
      name: 'Sentinel',
      capability: 'Real-time patient monitoring and early warning detection',
      status: 'active',
      type: 'monitoring',
      lastActivity: '2024-01-20T08:45:00Z',
      enabled: true,
      version: '2.1.3',
      uptime: 99.7,
      metrics: {
        alertsTriggered: 47,
        accuracy: 94.2,
        responseTime: '1.2s',
        patientsMonitored: 156
      },
      recentActions: [
        'Detected sepsis risk in patient P0045 - Alert sent to ICU team',
        'Alerted nursing staff about medication due for patient P0023',
        'Identified potential drug interaction for patient P0067',
        'Triggered early warning for deteriorating vitals in patient P0089',
        'Recommended care escalation for patient P0012'
      ],
      configuration: {
        monitoringInterval: 30,
        alertThreshold: 0.8,
        enabledAlerts: ['sepsis', 'deterioration', 'medication'],
        escalationDelay: 300,
        maxConcurrentPatients: 200
      },
      dependencies: ['EMR System', 'Vital Signs Monitor', 'Lab System'],
      resources: {
        cpu: 45,
        memory: 62,
        storage: 23
      },
      performance: {
        successRate: 94.2,
        avgResponseTime: '1.2s',
        throughput: '150 alerts/hour'
      },
      alerts: [
        {
          level: 'info',
          message: 'Successfully processed 47 alerts in the last hour',
          timestamp: '2024-01-20T08:45:00Z'
        },
        {
          level: 'warning',
          message: 'High CPU usage detected - consider scaling',
          timestamp: '2024-01-20T07:30:00Z'
        }
      ]
    },
    {
      id: 'navigator',
      name: 'Navigator',
      capability: 'Clinical pathway optimization and care coordination',
      status: 'active',
      type: 'coordination',
      lastActivity: '2024-01-20T08:32:00Z',
      enabled: true,
      version: '1.8.2',
      uptime: 98.9,
      metrics: {
        pathwaysOptimized: 23,
        efficiencyGain: '12%',
        costSavings: 'AED 15,400',
        avgLengthOfStay: '3.2 days'
      },
      recentActions: [
        'Optimized discharge pathway for cardiac patient - Reduced LOS by 1.5 days',
        'Coordinated multi-disciplinary team meeting for complex case',
        'Identified bottleneck in radiology scheduling - Suggested optimization',
        'Recommended early mobilization protocol for orthopedic patients',
        'Streamlined medication reconciliation process'
      ],
      configuration: {
        optimizationAlgorithm: 'machine_learning',
        pathwayTypes: ['cardiac', 'orthopedic', 'general_surgery'],
        coordinationMode: 'proactive',
        meetingScheduler: true,
        costOptimization: true
      },
      dependencies: ['EMR System', 'Scheduling System', 'Resource Management'],
      resources: {
        cpu: 38,
        memory: 55,
        storage: 41
      },
      performance: {
        successRate: 89.7,
        avgResponseTime: '2.1s',
        throughput: '25 optimizations/day'
      },
      alerts: [
        {
          level: 'info',
          message: 'Pathway optimization completed for 23 patients',
          timestamp: '2024-01-20T08:32:00Z'
        }
      ]
    },
    {
      id: 'mediator',
      name: 'Mediator',
      capability: 'Insurance pre-authorization and claims processing',
      status: 'active',
      type: 'financial',
      lastActivity: '2024-01-20T08:28:00Z',
      enabled: true,
      version: '3.0.1',
      uptime: 99.2,
      metrics: {
        preAuthsProcessed: 156,
        approvalRate: 89.7,
        avgTAT: '3.2 hours',
        costSavings: 'AED 45,200'
      },
      recentActions: [
        'Generated pre-auth package for MRI - Approved in 2.1 hours',
        'Submitted claim to DAMAN - Processing status updated',
        'Negotiated coverage for experimental treatment - Approved',
        'Identified billing discrepancy - Corrected before submission',
        'Automated prior authorization for routine procedures'
      ],
      configuration: {
        insuranceProviders: ['ADNIC', 'DAMAN', 'Thiqa', 'Others'],
        autoSubmission: true,
        approvalThreshold: 0.85,
        escalationRules: true,
        documentGeneration: 'automated'
      },
      dependencies: ['Billing System', 'Insurance APIs', 'Document Management'],
      resources: {
        cpu: 52,
        memory: 48,
        storage: 67
      },
      performance: {
        successRate: 89.7,
        avgResponseTime: '3.2h',
        throughput: '156 auths/day'
      },
      alerts: [
        {
          level: 'info',
          message: 'Processed 156 pre-authorizations with 89.7% approval rate',
          timestamp: '2024-01-20T08:28:00Z'
        },
        {
          level: 'warning',
          message: 'DAMAN API response time increased - monitoring',
          timestamp: '2024-01-20T06:15:00Z'
        }
      ]
    },
    {
      id: 'kya',
      name: 'KYA (Know Your Antibiotics)',
      capability: 'Antimicrobial stewardship and resistance monitoring',
      status: 'active',
      type: 'clinical',
      lastActivity: '2024-01-20T08:15:00Z',
      enabled: true,
      version: '2.3.0',
      uptime: 97.8,
      metrics: {
        appropriateUse: 91.5,
        resistanceReduction: '8%',
        costOptimization: 'AED 32,100',
        interventions: 67
      },
      recentActions: [
        'Recommended de-escalation therapy for patient P0034',
        'Identified resistance pattern in ICU - Updated protocols',
        'Suggested culture-guided treatment for sepsis case',
        'Flagged inappropriate broad-spectrum use - Intervention made',
        'Generated antibiogram report for monthly review'
      ],
      configuration: {
        stewardshipRules: 'CDC_guidelines',
        resistanceTracking: true,
        cultureIntegration: true,
        costAnalysis: true,
        interventionThreshold: 0.7
      },
      dependencies: ['Lab System', 'Pharmacy System', 'Microbiology'],
      resources: {
        cpu: 41,
        memory: 39,
        storage: 28
      },
      performance: {
        successRate: 91.5,
        avgResponseTime: '0.8s',
        throughput: '67 interventions/week'
      },
      alerts: [
        {
          level: 'info',
          message: 'Antimicrobial stewardship interventions: 67 this week',
          timestamp: '2024-01-20T08:15:00Z'
        },
        {
          level: 'warning',
          message: 'Increased resistance pattern detected in ICU',
          timestamp: '2024-01-19T14:22:00Z'
        }
      ]
    },
    {
      id: 'pi',
      name: 'Pi (Performance Intelligence)',
      capability: 'Clinical performance analytics and quality metrics',
      status: 'active',
      type: 'analytics',
      lastActivity: '2024-01-20T08:10:00Z',
      enabled: true,
      version: '1.9.4',
      uptime: 99.1,
      metrics: {
        metricsTracked: 145,
        anomaliesDetected: 12,
        reportGenerated: 34,
        dashboardViews: 892
      },
      recentActions: [
        'Generated quality dashboard update - 18 KPIs refreshed',
        'Identified readmission trend in cardiology - Alert sent',
        'Produced JCI compliance report - 98.7% compliance',
        'Detected performance anomaly in OR scheduling',
        'Created monthly executive summary report'
      ],
      configuration: {
        metricsRefreshRate: 15,
        anomalyDetection: true,
        reportSchedule: 'daily',
        dashboardCustomization: true,
        alertThresholds: 'dynamic'
      },
      dependencies: ['Data Warehouse', 'EMR System', 'Quality System'],
      resources: {
        cpu: 67,
        memory: 73,
        storage: 89
      },
      performance: {
        successRate: 98.1,
        avgResponseTime: '0.5s',
        throughput: '145 metrics/min'
      },
      alerts: [
        {
          level: 'info',
          message: 'Generated 34 reports and tracked 145 metrics',
          timestamp: '2024-01-20T08:10:00Z'
        },
        {
          level: 'error',
          message: 'Data source connection timeout - retrying',
          timestamp: '2024-01-20T07:45:00Z'
        }
      ]
    },
    {
      id: 'marco',
      name: 'Marco (Medical AI Research COordinator)',
      capability: 'Clinical research coordination and data analysis',
      status: 'maintenance',
      type: 'research',
      lastActivity: '2024-01-19T16:00:00Z',
      enabled: false,
      version: '1.2.1',
      uptime: 0,
      metrics: {
        studiesManaged: 8,
        enrollmentRate: 67.3,
        dataQuality: 98.1,
        publicationsSupported: 3
      },
      recentActions: [
        'Identified eligible research subjects for diabetes study',
        'Generated recruitment report - 67.3% enrollment rate',
        'Validated clinical trial data - 98.1% quality score',
        'Coordinated multi-site research protocol',
        'Prepared regulatory submission documents'
      ],
      configuration: {
        studyTypes: ['clinical_trials', 'observational', 'registry'],
        dataValidation: 'automated',
        recruitmentCriteria: 'AI_assisted',
        complianceChecking: true,
        reportGeneration: 'scheduled'
      },
      dependencies: ['Research Database', 'EMR System', 'Regulatory Systems'],
      resources: {
        cpu: 0,
        memory: 0,
        storage: 45
      },
      performance: {
        successRate: 0,
        avgResponseTime: 'N/A',
        throughput: '0 studies/active'
      },
      alerts: [
        {
          level: 'warning',
          message: 'Agent in maintenance mode - scheduled upgrade',
          timestamp: '2024-01-19T16:00:00Z'
        },
        {
          level: 'info',
          message: 'Maintenance window: 2 hours remaining',
          timestamp: '2024-01-20T06:00:00Z'
        }
      ]
    }
  ];

  useEffect(() => {
    const loadAgents = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setAgents(mockAgents);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading agents:', error);
        setLoading(false);
      }
    };
    loadAgents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-slate-700 bg-slate-50 border-slate-200';
      case 'maintenance':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <StopIcon className="h-4 w-4 text-slate-600" />;
      case 'maintenance':
        return <Cog6ToothIcon className="h-4 w-4 text-amber-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'monitoring':
        return 'bg-red-100 text-red-800';
      case 'coordination':
        return 'bg-blue-100 text-blue-800';
      case 'financial':
        return 'bg-green-100 text-green-800';
      case 'clinical':
        return 'bg-purple-100 text-purple-800';
      case 'analytics':
        return 'bg-indigo-100 text-indigo-800';
      case 'research':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'monitoring':
        return <HeartIcon className="h-5 w-5" />;
      case 'coordination':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'financial':
        return <BoltIcon className="h-5 w-5" />;
      case 'clinical':
        return <BeakerIcon className="h-5 w-5" />;
      case 'analytics':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'research':
        return <AcademicCapIcon className="h-5 w-5" />;
      default:
        return <CpuChipIcon className="h-5 w-5" />;
    }
  };

  const handleToggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, enabled: !agent.enabled, status: agent.enabled ? 'inactive' : 'active' } : agent
    ));
  };

  const getResourceColor = (usage: number) => {
    if (usage >= 80) return 'bg-red-500';
    if (usage >= 60) return 'bg-amber-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Agents Console</h1>
        <p className="text-slate-600">Monitor and manage intelligent healthcare automation agents</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Agents</p>
              <p className="text-3xl font-bold text-slate-900">{agents.length}</p>
            </div>
            <CpuChipIcon className="h-8 w-8 text-slate-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            AI automation agents
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Agents</p>
              <p className="text-3xl font-bold text-green-600">
                {agents.filter(a => a.status === 'active').length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Currently running
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg Uptime</p>
              <p className="text-3xl font-bold text-blue-600">
                {(agents.reduce((sum, agent) => sum + agent.uptime, 0) / agents.length).toFixed(1)}%
              </p>
            </div>
            <SignalIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            System reliability
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Actions</p>
              <p className="text-3xl font-bold text-purple-600">1,247</p>
            </div>
            <BoltIcon className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Last 24 hours
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200">
            {/* Agent Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  {getTypeIcon(agent.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{agent.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(agent.type)}`}>
                    {agent.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}
                  {agent.status.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500">v{agent.version}</span>
              </div>
            </div>

            {/* Agent Description */}
            <p className="text-slate-600 text-sm mb-4">{agent.capability}</p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(agent.metrics).slice(0, 4).map(([key, value]) => (
                <div key={key} className="text-center p-2 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-slate-900">{value}</div>
                  <div className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>

            {/* Resource Usage */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-slate-900 mb-2">Resource Usage</h5>
              <div className="space-y-2">
                {Object.entries(agent.resources).map(([resource, usage]) => (
                  <div key={resource} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 capitalize">{resource}:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getResourceColor(usage)}`}
                          style={{ width: `${usage}%` }}
                        ></div>
                      </div>
                      <span className="text-slate-900 font-medium w-8">{usage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Actions */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-slate-900 mb-2">Recent Actions</h5>
              <div className="space-y-1">
                {agent.recentActions.slice(0, 2).map((action, idx) => (
                  <p key={idx} className="text-xs text-slate-600 truncate">{action}</p>
                ))}
                {agent.recentActions.length > 2 && (
                  <p className="text-xs text-slate-500">+{agent.recentActions.length - 2} more actions</p>
                )}
              </div>
            </div>

            {/* Alerts */}
            {agent.alerts.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-slate-900 mb-2">Recent Alerts</h5>
                <div className="space-y-1">
                  {agent.alerts.slice(0, 2).map((alert, idx) => (
                    <div key={idx} className={`flex items-start gap-2 p-2 rounded text-xs ${
                      alert.level === 'error' ? 'bg-red-50 text-red-700' :
                      alert.level === 'warning' ? 'bg-amber-50 text-amber-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {alert.level === 'error' ? <ExclamationTriangleIcon className="h-3 w-3 mt-0.5 flex-shrink-0" /> :
                       alert.level === 'warning' ? <ExclamationTriangleIcon className="h-3 w-3 mt-0.5 flex-shrink-0" /> :
                       <InformationCircleIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                      <span className="flex-1">{alert.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance */}
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-slate-900 mb-2">Performance</h5>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold text-green-600">{agent.performance.successRate}%</div>
                  <div className="text-slate-500">Success</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">{agent.performance.avgResponseTime}</div>
                  <div className="text-slate-500">Response</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">{agent.uptime}%</div>
                  <div className="text-slate-500">Uptime</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleAgent(agent.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  agent.enabled 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {agent.enabled ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                {agent.enabled ? 'Stop' : 'Start'}
              </button>
              <button
                onClick={() => setSelectedAgent(agent)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <EyeIcon className="h-4 w-4" />
                Details
              </button>
              <button
                onClick={() => {
                  setSelectedAgent(agent);
                  setShowConfigModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm font-medium"
              >
                <Cog6ToothIcon className="h-4 w-4" />
                Config
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && !showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Agent Details: {selectedAgent.name}
              </h3>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Information */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Agent Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Agent ID:</span>
                      <span className="font-medium">{selectedAgent.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Version:</span>
                      <span className="font-medium">{selectedAgent.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Type:</span>
                      <span className="font-medium capitalize">{selectedAgent.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className={`font-medium ${
                        selectedAgent.status === 'active' ? 'text-green-600' :
                        selectedAgent.status === 'error' ? 'text-red-600' :
                        selectedAgent.status === 'maintenance' ? 'text-amber-600' : 'text-slate-600'
                      }`}>
                        {selectedAgent.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Activity:</span>
                      <span className="font-medium">{new Date(selectedAgent.lastActivity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedAgent.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-slate-900">{value}</div>
                        <div className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Dependencies</h4>
                  <div className="space-y-2">
                    {selectedAgent.dependencies.map((dep, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-slate-700">{dep}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Actions and Alerts */}
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Recent Actions</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedAgent.recentActions.map((action, idx) => (
                      <div key={idx} className="text-sm text-slate-700 p-2 bg-white rounded">
                        {action}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">System Alerts</h4>
                  <div className="space-y-2">
                    {selectedAgent.alerts.map((alert, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${
                        alert.level === 'error' ? 'bg-red-100 border border-red-200' :
                        alert.level === 'warning' ? 'bg-amber-100 border border-amber-200' :
                        'bg-blue-100 border border-blue-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          {alert.level === 'error' ? <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mt-0.5" /> :
                           alert.level === 'warning' ? <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 mt-0.5" /> :
                           <InformationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Resource Usage</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedAgent.resources).map(([resource, usage]) => (
                      <div key={resource}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600 capitalize">{resource}</span>
                          <span className="font-medium">{usage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getResourceColor(usage)}`}
                            style={{ width: `${usage}%` }}
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
                View Logs
              </button>
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Performance Report
              </button>
              <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                Export Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Configure {selectedAgent.name}
              </h3>
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  setSelectedAgent(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Configuration Parameters</h4>
                <div className="space-y-3">
                  {Object.entries(selectedAgent.configuration).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </label>
                      <div className="flex-1 ml-4">
                        {typeof value === 'boolean' ? (
                          <input
                            type="checkbox"
                            checked={value}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            readOnly
                          />
                        ) : typeof value === 'number' ? (
                          <input
                            type="number"
                            value={value}
                            className="w-full px-3 py-1 border border-slate-300 rounded text-sm"
                            readOnly
                          />
                        ) : Array.isArray(value) ? (
                          <div className="flex flex-wrap gap-1">
                            {value.map((item, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={value.toString()}
                            className="w-full px-3 py-1 border border-slate-300 rounded text-sm"
                            readOnly
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Save Changes
              </button>
              <button className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}