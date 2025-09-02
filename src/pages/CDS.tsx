import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BeakerIcon,
  HeartIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  LightBulbIcon,
  CpuChipIcon,
  BellIcon,
  EyeIcon,
  HandRaisedIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useGetInstanceQuery } from '../api/query';
import { getInstance } from '../api/axios';

interface Alert {
  id: string;
  ruleId: string;
  patientId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'medication_safety' | 'clinical_deterioration' | 'chronic_disease' | 'imaging_safety' | 'lab_values' | 'preventive_care';
  title: string;
  message: string;
  recommendation: string;
  evidence: string[];
  timestamp: string;
  status: 'active' | 'acknowledged' | 'overridden' | 'resolved';
  overrideReason?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  priority: number;
  source: string;
  relatedData: {
    medications?: string[];
    labValues?: { name: string; value: string; unit: string; status: string }[];
    vitals?: { name: string; value: string; status: string }[];
    conditions?: string[];
  };
}

interface Patient {
  id: string;
  name: string;
  mrn: string;
  age: number;
  gender: string;
  allergies: Array<{ allergen: string; severity: string }>;
  currentMedications: Array<{ medication: string; dosage: string }>;
  chronicConditions: Array<{ condition: string; icdCode: string }>;
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenSaturation: string;
  };
}

export function CDS() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient');
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [showExplainModal, setShowExplainModal] = useState(false);

  // Mock alerts data

  const AlertSchema = import.meta.env.VITE_ALERT_ID;
  const PatientSchema = import.meta.env.VITE_PATIENT_ID;
  const { data: Alerts } = useGetInstanceQuery(AlertSchema);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (patientId) {
          const patientData = await getInstance(PatientSchema, patientId);
          setPatient(patientData);
        }
        // Simulate loading alerts
        setTimeout(() => {
          setAlerts(Alerts || []);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading CDS data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, [patientId, Alerts]);

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
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <InformationCircleIcon className="h-5 w-5 text-amber-600" />;
      case 'low':
        return <InformationCircleIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-slate-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <BellIcon className="h-4 w-4 text-red-500" />;
      case 'acknowledged':
        return <EyeIcon className="h-4 w-4 text-blue-500" />;
      case 'overridden':
        return <HandRaisedIcon className="h-4 w-4 text-amber-500" />;
      case 'resolved':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-slate-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication_safety':
        return <BeakerIcon className="h-5 w-5" />;
      case 'clinical_deterioration':
        return <HeartIcon className="h-5 w-5" />;
      case 'chronic_disease':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'imaging_safety':
        return <EyeIcon className="h-5 w-5" />;
      case 'lab_values':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'preventive_care':
        return <ShieldCheckIcon className="h-5 w-5" />;
      default:
        return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged', acknowledgedBy: 'Current User', acknowledgedAt: new Date().toISOString() }
        : alert
    ));
  };

  const handleOverride = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setShowOverrideModal(true);
    }
  };

  const confirmOverride = () => {
    if (selectedAlert && overrideReason.trim()) {
      setAlerts(prev => prev.map(alert => 
        alert.id === selectedAlert.id 
          ? { ...alert, status: 'overridden', overrideReason, acknowledgedBy: 'Current User', acknowledgedAt: new Date().toISOString() }
          : alert
      ));
      setShowOverrideModal(false);
      setOverrideReason('');
      setSelectedAlert(null);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (activeTab) {
      case 'active':
        return alert.status === 'active';
      case 'acknowledged':
        return alert.status === 'acknowledged';
      case 'overridden':
        return alert.status === 'overridden';
      case 'all':
        return true;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Clinical Decision Support Console</h1>
        <p className="text-slate-600">Real-time clinical alerts and decision support recommendations</p>
      </div>

      {/* Patient Context */}
      {patient && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                <p className="text-slate-600">MRN: {patient.mrn} • {patient.age}y {patient.gender}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span>BP: {patient.vitals.bloodPressure}</span>
                  <span>HR: {patient.vitals.heartRate}</span>
                  <span>Temp: {patient.vitals.temperature}</span>
                  <span>O2: {patient.vitals.oxygenSaturation}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-500">Active Alerts:</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  {alerts.filter(a => a.status === 'active').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CpuChipIcon className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">AI Monitoring Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Alerts</p>
              <p className="text-3xl font-bold text-red-600">{alerts.filter(a => a.status === 'active').length}</p>
            </div>
            <BellIcon className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Critical: {alerts.filter(a => a.status === 'active' && a.severity === 'critical').length} | 
            High: {alerts.filter(a => a.status === 'active' && a.severity === 'high').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Acknowledged</p>
              <p className="text-3xl font-bold text-blue-600">{alerts.filter(a => a.status === 'acknowledged').length}</p>
            </div>
            <EyeIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Last 24h: {alerts.filter(a => a.status === 'acknowledged').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Overridden</p>
              <p className="text-3xl font-bold text-amber-600">{alerts.filter(a => a.status === 'overridden').length}</p>
            </div>
            <HandRaisedIcon className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Override Rate: {((alerts.filter(a => a.status === 'overridden').length / alerts.length) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Response Rate</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.round(((alerts.filter(a => a.status !== 'active').length / alerts.length) * 100))}%
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Avg Response: 8.5 min
          </div>
        </div>
      </div>

      {/* Alert Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'active', name: 'Active Alerts', count: alerts.filter(a => a.status === 'active').length },
              { id: 'acknowledged', name: 'Acknowledged', count: alerts.filter(a => a.status === 'acknowledged').length },
              { id: 'overridden', name: 'Overridden', count: alerts.filter(a => a.status === 'overridden').length },
              { id: 'all', name: 'All Alerts', count: alerts.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.name}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Alerts List */}
        <div className="divide-y divide-slate-200">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No alerts found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {activeTab === 'active' ? 'No active alerts for this patient.' : `No ${activeTab} alerts found.`}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(alert.category)}
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{alert.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(alert.status)}
                        <span className="text-xs text-slate-500 capitalize">{alert.status}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 mb-3">{alert.message}</p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Recommendation</h4>
                          <p className="text-blue-800 text-sm">{alert.recommendation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Related Data */}
                    {alert.relatedData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {alert.relatedData.medications && (
                          <div className="bg-purple-50 rounded-lg p-3">
                            <h5 className="font-medium text-purple-900 text-sm mb-2">Related Medications</h5>
                            {alert.relatedData.medications.map((med, idx) => (
                              <p key={idx} className="text-purple-800 text-xs">{med}</p>
                            ))}
                          </div>
                        )}
                        {alert.relatedData.labValues && (
                          <div className="bg-green-50 rounded-lg p-3">
                            <h5 className="font-medium text-green-900 text-sm mb-2">Lab Values</h5>
                            {alert.relatedData.labValues.map((lab, idx) => (
                              <p key={idx} className="text-green-800 text-xs">
                                {lab.name}: {lab.value} {lab.unit} 
                                <span className={`ml-1 px-1 rounded text-xs ${
                                  lab.status === 'high' ? 'bg-red-100 text-red-700' :
                                  lab.status === 'critical_high' ? 'bg-red-200 text-red-800 font-bold' :
                                  lab.status === 'critical_low' ? 'bg-red-200 text-red-800 font-bold' :
                                  lab.status === 'low' ? 'bg-amber-100 text-amber-700' :
                                  lab.status === 'borderline' ? 'bg-yellow-100 text-yellow-700' :
                                  lab.status === 'abnormal' ? 'bg-orange-100 text-orange-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {lab.status}
                                </span>
                              </p>
                            ))}
                          </div>
                        )}
                        {alert.relatedData.vitals && (
                          <div className="bg-orange-50 rounded-lg p-3">
                            <h5 className="font-medium text-orange-900 text-sm mb-2">Vital Signs</h5>
                            {alert.relatedData.vitals.map((vital, idx) => (
                              <p key={idx} className="text-orange-800 text-xs">
                                {vital.name}: {vital.value}
                                <span className={`ml-1 px-1 rounded text-xs ${
                                  vital.status === 'high' ? 'bg-red-100 text-red-700' :
                                  vital.status === 'low' ? 'bg-amber-100 text-amber-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {vital.status}
                                </span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Evidence */}
                    <div className="mb-4">
                      <h4 className="font-medium text-slate-900 text-sm mb-2">Supporting Evidence</h4>
                      <ul className="space-y-1">
                        {alert.evidence.map((evidence, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="h-4 w-4" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <CpuChipIcon className="h-4 w-4" />
                          {alert.source}
                        </span>
                      </div>
                      {alert.acknowledgedBy && (
                        <span className="text-xs">
                          {alert.status === 'acknowledged' ? 'Acknowledged' : 'Overridden'} by {alert.acknowledgedBy}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-6">
                    {alert.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          Acknowledge
                        </button>
                        <button
                          onClick={() => handleOverride(alert.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm"
                        >
                          <HandRaisedIcon className="h-4 w-4" />
                          Override
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowExplainModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      Explain
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Override Modal */}
      {showOverrideModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Override Alert</h3>
            <p className="text-slate-600 mb-4">
              You are about to override: <strong>{selectedAlert.title}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason for Override (Required)
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Please provide a clinical justification for overriding this alert..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmOverride}
                disabled={!overrideReason.trim()}
                className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Confirm Override
              </button>
              <button
                onClick={() => {
                  setShowOverrideModal(false);
                  setOverrideReason('');
                  setSelectedAlert(null);
                }}
                className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explain Modal */}
      {showExplainModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Alert Explanation</h3>
              <button
                onClick={() => setShowExplainModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Alert Details</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="font-medium">{selectedAlert.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{selectedAlert.message}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-2">Clinical Reasoning</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">{selectedAlert.recommendation}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-2">Evidence-Based Factors</h4>
                <ul className="space-y-2">
                  {selectedAlert.evidence.map((evidence, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {evidence}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-2">Risk Assessment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-lg p-3">
                    <h5 className="font-medium text-red-900 text-sm">Potential Risks</h5>
                    <ul className="text-red-800 text-xs mt-1 space-y-1">
                      <li>• Increased bleeding risk</li>
                      <li>• Drug interaction complications</li>
                      <li>• Patient safety concerns</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <h5 className="font-medium text-green-900 text-sm">Benefits of Action</h5>
                    <ul className="text-green-800 text-xs mt-1 space-y-1">
                      <li>• Improved patient safety</li>
                      <li>• Reduced adverse events</li>
                      <li>• Better clinical outcomes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-2">References & Guidelines</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>• American Heart Association Guidelines on Anticoagulation</p>
                  <p>• Joint Commission Medication Safety Standards</p>
                  <p>• Clinical Decision Support Best Practices</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowExplainModal(false)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}