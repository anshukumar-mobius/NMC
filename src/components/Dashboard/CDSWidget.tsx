import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  BellIcon
} from '@heroicons/react/24/outline';
interface CDSAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  patient: string;
  timestamp: string;
}

interface CDSWidgetProps {
  alerts?: CDSAlert[];
}

export function CDSWidget({ alerts = [] }: CDSWidgetProps) {
  const mockAlerts: CDSAlert[] = [
    {
      id: 'CDS001',
      severity: 'critical',
      title: 'Critical INR Elevation',
      patient: 'Omar Al-Mansouri',
      timestamp: '1705745700000'
    },
    {
      id: 'CDS002',
      severity: 'critical',
      title: 'Renal Dosing Alert',
      patient: 'Omar Al-Mansouri',
      timestamp: '2024-01-20T11:30:00Z'
    },
    {
      id: 'CDS003',
      severity: 'high',
      title: 'Acute Kidney Injury',
      patient: 'Omar Al-Mansouri',
      timestamp: '2024-01-20T09:00:00Z'
    },
    {
      id: 'CDS004',
      severity: 'high',
      title: 'Early Sepsis Warning',
      patient: 'Ahmed Hassan',
      timestamp: '2024-01-20T09:45:00Z'
    },
    {
      id: 'CDS005',
      severity: 'high',
      title: 'QT Prolongation Risk',
      patient: 'Sarah Johnson',
      timestamp: '2024-01-20T07:30:00Z'
    },
    {
      id: 'CDS006',
      severity: 'medium',
      title: 'Hypokalemia Alert',
      patient: 'Sarah Johnson',
      timestamp: '2024-01-20T08:45:00Z'
    }
  ];

  const formatTimestamp = (timestamp: string | number) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      // Try parsing as a number if it's a string representation of a number
      const numTimestamp = Number(timestamp);
      if (!isNaN(numTimestamp)) {
        const numDate = new Date(numTimestamp);
        if (!isNaN(numDate.getTime())) {
          return numDate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
        }
      }
      return 'Invalid Date';
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;
  const activeAlerts = displayAlerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <ClockIcon className="h-4 w-4 text-amber-600" />;
      case 'low':
        return <CheckCircleIcon className="h-4 w-4 text-blue-600" />;
      default:
        return <BellIcon className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Clinical Decision Support</h3>
            <p className="text-sm text-slate-500">Active alerts and recommendations</p>
          </div>
        </div>
        <Link
          to="/cds"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
        >
          View All
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{displayAlerts.filter(a => a.severity === 'critical').length}</div>
          <div className="text-xs text-slate-500">Critical</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">{displayAlerts.filter(a => a.severity === 'high').length}</div>
          <div className="text-xs text-slate-500">High</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">{displayAlerts.filter(a => a.severity === 'medium').length}</div>
          <div className="text-xs text-slate-500">Medium</div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-700">Recent Alerts</h4>
        {activeAlerts.slice(0, 3).map((alert) => (
          <Link
            key={alert.id}
            to={`/cds?alertId=${alert.id}`}
            className="block hover:bg-slate-100 transition-colors duration-200 rounded-lg"
          >
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-900 truncate">{alert.title}</p>
                <p className="text-xs text-slate-500">Patient: {alert.patient}</p>
                <p className="text-xs text-slate-400">{formatTimestamp(alert.timestamp)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {activeAlerts.length === 0 && (
        <div className="text-center py-8">
          <CheckCircleIcon className="mx-auto h-8 w-8 text-green-500 mb-2" />
          <p className="text-sm text-slate-600">No active critical alerts</p>
          <p className="text-xs text-slate-500">All patients are within safe parameters</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/cds"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
          >
            <ShieldCheckIcon className="h-4 w-4" />
            Open Console
          </Link>
          <Link
            to="/rules"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors duration-200 text-sm font-medium"
          >
            <BellIcon className="h-4 w-4" />
            Manage Rules
          </Link>
        </div>
      </div>
    </div>
  );
}