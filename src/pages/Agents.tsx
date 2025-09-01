import React, { useState, useEffect } from 'react';
import {
  CpuChipIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BoltIcon,
  HeartIcon,
  BeakerIcon,
  UserGroupIcon,
  AcademicCapIcon,
  EyeIcon,
  XCircleIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';
import { getJoinInstance } from '../api/axios';

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
    "id": "sentinel",
    "name": "Sentinel",
    "capability": "Real-time patient monitoring and early warning detection",
    "status": "active",
    "type": "monitoring",
    "lastActivity": "2024-01-20T08:45:00Z",
    "enabled": true,
    "version": "2.1.3",
    "uptime": 99.7,
    "metrics": {
      "alertsTriggered": 47,
      "accuracy": 94.2,
      "responseTime": "1.2s",
      "patientsMonitored": 156
    },
    "recentActions": [
      "Detected sepsis risk in patient P0045 - Alert sent to ICU team",
      "Alerted nursing staff about medication due for patient P0023",
      "Identified potential drug interaction for patient P0067",
      "Triggered early warning for deteriorating vitals in patient P0089",
      "Recommended care escalation for patient P0012"
    ],
    "configuration": {
      "monitoringInterval": 30,
      "alertThreshold": 0.8,
      "enabledAlerts": ["sepsis", "deterioration", "medication"],
      "escalationDelay": 300,
      "maxConcurrentPatients": 200
    },
    "dependencies": ["EMR System", "Vital Signs Monitor", "Lab System"],
    "resources": {
      "cpu": 45,
      "memory": 62,
      "storage": 23
    },
    "performance": {
      "successRate": 94.2,
      "avgResponseTime": "1.2s",
      "throughput": "150 alerts/hour"
    },
    "alerts": [
      {
        "level": "info",
        "message": "Successfully processed 47 alerts in the last hour",
        "timestamp": "2024-01-20T08:45:00Z"
      },
      {
        "level": "warning",
        "message": "High CPU usage detected - consider scaling",
        "timestamp": "2024-01-20T07:30:00Z"
      }
    ]
  },
  {
    "id": "navigator",
    "name": "Navigator",
    "capability": "Comparative KPI exploration and physician benchmarking",
    "status": "active",
    "type": "analytics",
    "lastActivity": "2024-01-20T10:05:00Z",
    "enabled": true,
    "version": "3.0.1",
    "uptime": 98.9,
    "metrics": {
      "benchmarksGenerated": 32,
      "accuracy": 92.5,
      "avgQueryResponse": "2.5s",
      "departmentsAnalyzed": 12
    },
    "recentActions": [
      "Generated KPI variation index for Cardiology vs. Neurology",
      "Identified protocol adherence gaps in Orthopedics",
      "Highlighted antibiotic stewardship deviations for Dr. Smith",
      "Created specialty composite score for Pediatrics",
      "Visualized ALOS benchmark comparison across 3 hospitals"
    ],
    "configuration": {
      "defaultFilters": ["specialty", "physician"],
      "enableHeatmaps": true,
      "benchmarkThreshold": 0.85,
      "roleAdaptiveUX": true
    },
    "dependencies": ["EMR Data Warehouse", "KPI Graph Model", "Visualization Engine"],
    "resources": {
      "cpu": 38,
      "memory": 55,
      "storage": 18
    },
    "performance": {
      "successRate": 92.5,
      "avgResponseTime": "2.5s",
      "throughput": "100 benchmarks/hour"
    },
    "alerts": [
      {
        "level": "info",
        "message": "32 new benchmark analyses generated in last 24h",
        "timestamp": "2024-01-20T09:50:00Z"
      }
    ]
  },
  {
    "id": "aegis",
    "name": "Aegis",
    "capability": "Automated clinical escalation and governance enforcement",
    "status": "active",
    "type": "governance",
    "lastActivity": "2024-01-20T09:15:00Z",
    "enabled": true,
    "version": "1.9.8",
    "uptime": 99.3,
    "metrics": {
      "escalationsTriggered": 24,
      "escalationSuccessRate": 88.7,
      "avgTimeToEscalation": "3.4h",
      "rolesEngaged": 15
    },
    "recentActions": [
      "Escalated ICU sepsis cluster to CMO and Quality Director",
      "Suppressed duplicate medication error alerts",
      "Triggered escalation tree for Surgical Site Infections",
      "Routed multiple unresolved ICU alerts to governance board",
      "Logged escalation resolution turnaround for Neurology unit"
    ],
    "configuration": {
      "escalationRules": ["persist > 4h", "multi-patient > 2"],
      "maxEscalationDepth": 3,
      "notifyRoles": ["CMO", "Quality Lead", "Unit Director"]
    },
    "dependencies": ["Sentinel", "Org Policy Graph", "Notification System"],
    "resources": {
      "cpu": 41,
      "memory": 59,
      "storage": 26
    },
    "performance": {
      "successRate": 88.7,
      "avgResponseTime": "3.4h",
      "throughput": "50 escalations/day"
    },
    "alerts": [
      {
        "level": "warning",
        "message": "3 unresolved escalations pending over 24h",
        "timestamp": "2024-01-20T09:00:00Z"
      }
    ]
  },
  {
    "id": "archivist",
    "name": "Archivist",
    "capability": "Immutable audit trail for all alerts, overrides, and actions",
    "status": "active",
    "type": "compliance",
    "lastActivity": "2024-01-20T07:55:00Z",
    "enabled": true,
    "version": "2.4.0",
    "uptime": 99.9,
    "metrics": {
      "auditLogsCaptured": 231,
      "overrideEvents": 42,
      "avgRetrievalTime": "1.5s",
      "usersTracked": 84
    },
    "recentActions": [
      "Recorded override of sepsis alert by Dr. Patel",
      "Logged ICU threshold update to 0.75 sensitivity",
      "Captured decision trail for antibiotic stewardship alert",
      "Flagged repeated overrides for same patient in Pediatrics",
      "Generated audit report for JCI compliance"
    ],
    "configuration": {
      "logRetentionDays": 365,
      "immutableLedger": true,
      "enableAuditSearch": true,
      "overrideAlerting": true
    },
    "dependencies": ["Sentinel", "Aegis", "Governance Ledger"],
    "resources": {
      "cpu": 27,
      "memory": 43,
      "storage": 71
    },
    "performance": {
      "successRate": 99.9,
      "avgResponseTime": "1.5s",
      "throughput": "300 logs/hour"
    },
    "alerts": [
      {
        "level": "info",
        "message": "231 audit events successfully recorded in last 24h",
        "timestamp": "2024-01-20T07:50:00Z"
      }
    ]
  },
  {
    "id": "synthesizer",
    "name": "Synthesizer",
    "capability": "Outcome attribution and ROI calculation of interventions",
    "status": "active",
    "type": "analytics",
    "lastActivity": "2024-01-20T11:20:00Z",
    "enabled": true,
    "version": "1.6.5",
    "uptime": 98.5,
    "metrics": {
      "interventionsLogged": 18,
      "roiReportsGenerated": 11,
      "accuracy": 90.8,
      "avgAnalysisTime": "3.8s"
    },
    "recentActions": [
      "Correlated discharge planning with reduced readmission rate",
      "Generated ROI report for antibiotic stewardship initiative",
      "Highlighted high-ROI intervention in Cardiology",
      "Flagged unsuccessful hand hygiene campaign impact",
      "Summarized financial savings from improved LOS metrics"
    ],
    "configuration": {
      "impactWindowDays": 90,
      "statConfidenceThreshold": 0.9,
      "enableROIHeatmap": true
    },
    "dependencies": ["Navigator", "KPI Graph", "Financial DB"],
    "resources": {
      "cpu": 33,
      "memory": 51,
      "storage": 39
    },
    "performance": {
      "successRate": 90.8,
      "avgResponseTime": "3.8s",
      "throughput": "60 analyses/day"
    },
    "alerts": [
      {
        "level": "info",
        "message": "ROI attribution completed for 5 interventions yesterday",
        "timestamp": "2024-01-20T11:10:00Z"
      }
    ]
  },
  {
    "id": "configurator",
    "name": "Configurator",
    "capability": "Low-code KPI threshold and escalation rule configuration",
    "status": "active",
    "type": "governance",
    "lastActivity": "2024-01-20T06:30:00Z",
    "enabled": true,
    "version": "2.0.2",
    "uptime": 97.8,
    "metrics": {
      "rulesConfigured": 14,
      "misconfigurationsDetected": 2,
      "avgConfigSaveTime": "1.1s",
      "usersActive": 9
    },
    "recentActions": [
      "Set ICU medication error threshold to 0.8%",
      "Validated conflicting escalation rules across Pediatrics and ICU",
      "Logged KPI ownership mapping for Cardiology",
      "Rolled back sepsis threshold update due to misconfiguration",
      "Simulated impact of ALOS KPI adjustment"
    ],
    "configuration": {
      "enableLowCodeUI": true,
      "schemaValidation": true,
      "defaultAuditLogging": true,
      "rollbackEnabled": true
    },
    "dependencies": ["Governance DB", "Alert System", "Archivist"],
    "resources": {
      "cpu": 29,
      "memory": 46,
      "storage": 22
    },
    "performance": {
      "successRate": 97.8,
      "avgResponseTime": "1.1s",
      "throughput": "40 rule updates/day"
    },
    "alerts": [
      {
        "level": "warning",
        "message": "2 misconfigured rules detected during validation",
        "timestamp": "2024-01-20T06:15:00Z"
      }
    ]
  },
  {
    "id": "companion",
    "name": "Companion",
    "capability": "Patient-specific KPI insight and conversational assistance",
    "status": "active",
    "type": "assistant",
    "lastActivity": "2024-01-20T12:10:00Z",
    "enabled": true,
    "version": "1.4.7",
    "uptime": 96.9,
    "metrics": {
      "patientAlertsServed": 73,
      "avgQueryTime": "1.9s",
      "contextAccuracy": 91.3,
      "activeUsers": 27
    },
    "recentActions": [
      "Explained ICU deterioration alert for patient P0034 to Dr. Khan",
      "Provided discharge readiness assessment for patient P0060",
      "Summarized alert history for Mr. Ahmed’s ICU stay",
      "Forecasted sepsis escalation risk for patient P0072",
      "Presented override commentary summary for patient P0051"
    ],
    "configuration": {
      "contextWindowDays": 30,
      "conversationMode": "clinical-explainer",
      "feedbackLearning": true
    },
    "dependencies": ["EMR", "LLM Engine", "Sentinel"],
    "resources": {
      "cpu": 52,
      "memory": 68,
      "storage": 31
    },
    "performance": {
      "successRate": 91.3,
      "avgResponseTime": "1.9s",
      "throughput": "80 patient sessions/day"
    },
    "alerts": [
      {
        "level": "info",
        "message": "73 patient alert explanations completed in last 24h",
        "timestamp": "2024-01-20T12:05:00Z"
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

  getJoinInstance("68b5777a449b0c059a42adce").then(data => {
    console.log('Agents data:', data);
  });

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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  {getTypeIcon(agent.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{agent.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(agent.type)}`}>
                      {agent.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">v{agent.version}</span>
                  </div>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}
                  {agent.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Agent Description */}
            <p className="text-slate-600 text-sm mb-4">{agent.capability}</p>

            {/* Core Information */}
            <div className="mb-4 bg-slate-50 rounded-lg p-3">
              <h5 className="text-sm font-medium text-slate-900 mb-2">Agent Information</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">ID:</span>
                  <span className="font-medium text-slate-900">{agent.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Active:</span>
                  <span className="font-medium text-slate-900">{new Date(agent.lastActivity).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dependencies:</span>
                  <span className="font-medium text-slate-900">{agent.dependencies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Uptime:</span>
                  <span className="font-medium text-slate-900">{agent.uptime}%</span>
                </div>
              </div>
            </div>

            {/* Key Metrics - Using only the most important ones */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-700">
                  {agent.performance.successRate}%
                </div>
                <div className="text-xs text-slate-600">Success Rate</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-700">
                  {agent.performance.avgResponseTime}
                </div>
                <div className="text-xs text-slate-600">Response Time</div>
              </div>
            </div>

            {/* Latest Alert - Show only the most recent one if it exists */}
            {agent.alerts.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-slate-900 mb-2">Latest Alert</h5>
                <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                  agent.alerts[0].level === 'error' ? 'bg-red-50 text-red-700' :
                  agent.alerts[0].level === 'warning' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {agent.alerts[0].level === 'error' ? <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" /> :
                   agent.alerts[0].level === 'warning' ? <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" /> :
                   <InformationCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                  <div>
                    <span className="flex-1 font-medium">{agent.alerts[0].message}</span>
                    <div className="text-xs mt-1 opacity-75">{new Date(agent.alerts[0].timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleAgent(agent.id)}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  agent.enabled 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {agent.enabled ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                {agent.enabled ? 'Stop Agent' : 'Start Agent'}
              </button>
              <button
                onClick={() => setSelectedAgent(agent)}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <EyeIcon className="h-4 w-4" />
                Details
              </button>
              <button
                onClick={() => {
                  setSelectedAgent(agent);
                  setShowConfigModal(true);
                }}
                className="flex items-center gap-1 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm font-medium"
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