import { useState, useEffect } from 'react';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  UserIcon,
  ComputerDesktopIcon,
  EyeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  CpuChipIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { useGetInstanceQuery } from '../api/query';

interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  outcome: 'success' | 'failure' | 'warning';
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  details: {
    description: string;
    changes?: Array<{
      field: string;
      oldValue: string;
      newValue: string;
    }>;
    metadata?: Record<string, any>;
  };
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system_admin' | 'clinical_decision' | 'patient_access' | 'configuration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  compliance: string[];
  location: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'api';
}

export function AuditTrail() {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    outcome: 'all',
    severity: 'all',
    user: 'all',
    dateRange: '7d'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const AuditEventSchema = import.meta.env.VITE_AUDIT_EVENT_ID;
  const { data: auditEventsData = [], isLoading } = useGetInstanceQuery(AuditEventSchema);
  console.log('auditEventsData:', auditEventsData);
  useEffect(() => {
    if (auditEventsData) {
      setAuditEvents(auditEventsData);
      setFilteredEvents(auditEventsData);
      setLoading(false);
    }
  }, [auditEventsData]);

  useEffect(() => {
    let filtered = auditEvents;
    // Apply filters
    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(event => event.category === activeFilters.category);
    }
    if (activeFilters.outcome !== 'all') {
      filtered = filtered.filter(event => event.outcome === activeFilters.outcome);
    }
    if (activeFilters.severity !== 'all') {
      filtered = filtered.filter(event => event.severity === activeFilters.severity);
    }
    if (activeFilters.user !== 'all') {
      filtered = filtered.filter(event => event.userId === activeFilters.user);
    }

    // Apply date range filter
    if (activeFilters.dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (activeFilters.dateRange) {
        case '1d':
          startDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
      }
      
      filtered = filtered.filter(event => new Date(event.timestamp) >= startDate);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(event =>
        event.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.details.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.resource.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setFilteredEvents(filtered);
  }, [auditEvents, activeFilters, searchQuery]);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'failure':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'failure':
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-4 w-4 text-amber-600" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-slate-600" />;
    }
  };

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication':
        return 'bg-red-100 text-red-800';
      case 'authorization':
        return 'bg-orange-100 text-orange-800';
      case 'data_access':
        return 'bg-blue-100 text-blue-800';
      case 'data_modification':
        return 'bg-purple-100 text-purple-800';
      case 'system_admin':
        return 'bg-indigo-100 text-indigo-800';
      case 'clinical_decision':
        return 'bg-green-100 text-green-800';
      case 'patient_access':
        return 'bg-teal-100 text-teal-800';
      case 'configuration':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case 'tablet':
        return <ComputerDesktopIcon className="h-4 w-4" />;
      case 'desktop':
        return <ComputerDesktopIcon className="h-4 w-4" />;
      case 'api':
        return <CpuChipIcon className="h-4 w-4" />;
      default:
        return <ComputerDesktopIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Audit Trail</h1>
        <p className="text-slate-600">Comprehensive system activity logging and compliance monitoring</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Events</p>
              <p className="text-3xl font-bold text-slate-900">{auditEvents.length}</p>
            </div>
            <ClipboardDocumentListIcon className="h-8 w-8 text-slate-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Last 24 hours
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Success Rate</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.round((auditEvents.filter(e => e.outcome === 'success').length / auditEvents.length) * 100)}%
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            System reliability
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Failed Events</p>
              <p className="text-3xl font-bold text-red-600">
                {auditEvents?.filter(e => e.outcome === 'failure').length}
              </p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Require attention
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Compliance</p>
              <p className="text-3xl font-bold text-blue-600">100%</p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Regulatory compliance
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
              placeholder="Search audit events..."
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
              <option value="authentication">Authentication</option>
              <option value="authorization">Authorization</option>
              <option value="data_access">Data Access</option>
              <option value="data_modification">Data Modification</option>
              <option value="system_admin">System Admin</option>
              <option value="clinical_decision">Clinical Decision</option>
              <option value="patient_access">Patient Access</option>
              <option value="configuration">Configuration</option>
            </select>
          </div>
          <select
            value={activeFilters.outcome}
            onChange={(e) => setActiveFilters({...activeFilters, outcome: e.target.value})}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Outcomes</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="warning">Warning</option>
          </select>
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
            value={activeFilters.dateRange}
            onChange={(e) => setActiveFilters({...activeFilters, dateRange: e.target.value})}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <div className="ml-auto flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm">
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          Showing {filteredEvents.length} of {auditEvents.length} events
        </div>
      </div>

      {/* Audit Events List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-200">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-6 hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getOutcomeColor(event.outcome)}`}>
                      {getOutcomeIcon(event.outcome)}
                      {event.outcome.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                      {event.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{event.action.replace('_', ' ')}</h3>
                  <p className="text-slate-600 mb-3">{event.details.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{event.userName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getDeviceIcon(event.deviceType)}
                      <span className="capitalize">{event.deviceType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GlobeAltIcon className="h-4 w-4" />
                      <span>{event.ipAddress}</span>
                    </div>
                  </div>

                  <div className="text-sm text-slate-500">
                    <span className="font-medium">Resource:</span> {event.resource} ({event.resourceId})
                    <span className="mx-2">•</span>
                    <span className="font-medium">Location:</span> {event.location}
                  </div>

                  {/* Compliance Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {event.compliance.map((standard, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-6">
                  <div className="text-right text-xs text-slate-500">
                    <div>Session: {event.sessionId.substring(0, 12)}...</div>
                    <div>Event ID: {event.id}</div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No audit events found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Audit Event Details: {selectedEvent.id}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Information */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Event Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Event ID:</span>
                      <span className="font-medium">{selectedEvent.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Timestamp:</span>
                      <span className="font-medium">{new Date(selectedEvent.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Action:</span>
                      <span className="font-medium">{selectedEvent.action.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Resource:</span>
                      <span className="font-medium">{selectedEvent.resource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Resource ID:</span>
                      <span className="font-medium">{selectedEvent.resourceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Outcome:</span>
                      <span className={`font-medium ${
                        selectedEvent.outcome === 'success' ? 'text-green-600' :
                        selectedEvent.outcome === 'failure' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {selectedEvent.outcome.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">User Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">User ID:</span>
                      <span className="font-medium">{selectedEvent.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">User Name:</span>
                      <span className="font-medium">{selectedEvent.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Role:</span>
                      <span className="font-medium">{selectedEvent.userRole.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Session ID:</span>
                      <span className="font-medium font-mono text-xs">{selectedEvent.sessionId}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Technical Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">IP Address:</span>
                      <span className="font-medium font-mono">{selectedEvent.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Device Type:</span>
                      <span className="font-medium capitalize">{selectedEvent.deviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Location:</span>
                      <span className="font-medium">{selectedEvent.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">User Agent:</span>
                      <p className="font-medium font-mono text-xs mt-1 break-all">{selectedEvent.userAgent}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Event Details</h4>
                  <p className="text-sm text-slate-700 mb-3">{selectedEvent.details.description}</p>
                  
                  {selectedEvent.details.changes && selectedEvent.details.changes.length > 0 && (
                    <div>
                      <h5 className="font-medium text-slate-900 mb-2 text-sm">Changes Made</h5>
                      <div className="space-y-2">
                        {selectedEvent.details.changes.map((change, idx) => (
                          <div key={idx} className="bg-white rounded p-2 text-sm">
                            <div className="font-medium text-slate-900">{change.field}</div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-red-600">From: {change.oldValue}</span>
                              <span className="text-slate-400">→</span>
                              <span className="text-green-600">To: {change.newValue}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedEvent.details.metadata && (
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Metadata</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedEvent.details.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-slate-600 capitalize">{key.replace('_', ' ')}:</span>
                          <span className="font-medium">{value?.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Compliance Standards</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.compliance.map((standard, idx) => (
                      <span key={idx} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Classification</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Category:</span>
                      <span className="font-medium capitalize">{selectedEvent.category.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Severity:</span>
                      <span className={`font-medium capitalize ${
                        selectedEvent.severity === 'critical' ? 'text-red-600' :
                        selectedEvent.severity === 'high' ? 'text-orange-600' :
                        selectedEvent.severity === 'medium' ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {selectedEvent.severity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Export Event
              </button>
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Create Report
              </button>
              <button className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                Related Events
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}