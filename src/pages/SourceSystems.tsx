import React, { useState, useEffect } from 'react';
import {
  ServerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CpuChipIcon,
  DocumentTextIcon,
  BeakerIcon,
  EyeIcon,
  HeartIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  SignalIcon,
  CloudIcon,
  WifiIcon,
  BoltIcon,
  ExclamationCircleIcon,
  PlayIcon,
  PauseIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface SourceSystem {
  id: string;
  name: string;
  category: string;
  purpose: string;
  vendor: string;
  version: string;
  status: 'connected' | 'warning' | 'error' | 'maintenance' | 'disconnected';
  lastSync: string;
  uptime: number;
  dataPoints: number;
  syncFrequency: string;
  location: string;
  environment: 'production' | 'staging' | 'development';
  dataExtracted: string[];
  examples: string[];
  connectionType: 'HL7' | 'FHIR' | 'REST API' | 'Database' | 'File Transfer' | 'Real-time';
  securityLevel: 'High' | 'Medium' | 'Low';
  complianceStandards: string[];
  maintenanceWindow: string;
  supportContact: string;
  businessCriticality: 'Critical' | 'High' | 'Medium' | 'Low';
  dataVolume: string;
  errorRate: number;
  avgResponseTime: string;
  lastError?: string;
  nextMaintenance: string;
}

export function SourceSystems() {
  const [systems, setSystems] = useState<SourceSystem[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<SourceSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState<SourceSystem | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    category: 'all',
    criticality: 'all',
    environment: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Mock source systems data based on the Excel screenshot
  // Need to change the data to reflect the actual systems
  const mockSystems: SourceSystem[] = [
  {
    "id": "SYS001",
    "name": "Electronic Medical Record (EMR/EHR)",
    "category": "Clinical Documentation",
    "purpose": "Primary system for clinical documentation, patient data, and orders",
    "vendor": "Epic Systems",
    "version": "2023.1",
    "status": "connected",
    "lastSync": "2024-01-20T08:00:00Z",
    "uptime": 99.8,
    "dataPoints": 25420,
    "syncFrequency": "Real-time",
    "location": "Dubai Healthcare City - Data Center 1",
    "environment": "production",
    "dataExtracted": [
      "Patient demographics",
      "Encounters & visits",
      "Diagnoses (ICD-10)",
      "Procedures (CPT, SNOMED)",
      "Progress notes",
      "Physician orders & MAR",
      "Vital signs",
      "Care plans"
    ],
    "examples": [
      "InterSystems TrakCare",
      "Epic",
      "MEDITECH",
      "Cerner Millennium",
      "Custom EMRs"
    ],
    "connectionType": "HL7",
    "securityLevel": "High",
    "complianceStandards": [
      "HIPAA",
      "UAE DPA",
      "JCI",
      "MOHAP"
    ],
    "maintenanceWindow": "Sunday 02:00-04:00 GST",
    "supportContact": "EMR Support Team (+971-4-XXX-XXXX)",
    "businessCriticality": "Critical",
    "dataVolume": "2.5TB daily",
    "errorRate": 0.02,
    "avgResponseTime": "120ms",
    "nextMaintenance": "2024-01-28T02:00:00Z"
  },
  {
    "id": "SYS002",
    "name": "Laboratory Information System (LIS)",
    "category": "Laboratory",
    "purpose": "Lab test ordering, results, and turnaround time tracking",
    "vendor": "Cerner Corporation",
    "version": "PowerLab 2023",
    "status": "connected",
    "lastSync": "2024-01-20T08:15:00Z",
    "uptime": 99.5,
    "dataPoints": 18750,
    "syncFrequency": "Every 5 minutes",
    "location": "Dubai Healthcare City - Lab Wing",
    "environment": "production",
    "dataExtracted": [
      "Lab test orders (CBC, CRP, cultures)",
      "Results & timestamps",
      "Flags (normal/abnormal/critical)",
      "Infection control alerts"
    ],
    "examples": [
      "Sunquest",
      "Cerner PathNet",
      "LabWare"
    ],
    "connectionType": "HL7",
    "securityLevel": "High",
    "complianceStandards": [
      "CAP",
      "ISO 15189",
      "UAE MOH",
      "JCI"
    ],
    "maintenanceWindow": "Saturday 23:00-01:00 GST",
    "supportContact": "Lab IT Support (+971-4-XXX-XXXY)",
    "businessCriticality": "Critical",
    "dataVolume": "850GB daily",
    "errorRate": 0.05,
    "avgResponseTime": "200ms",
    "nextMaintenance": "2024-01-27T23:00:00Z"
  },
  {
    "id": "SYS003",
    "name": "Radiology Information System (RIS) + PACS",
    "category": "Imaging",
    "purpose": "Imaging workflows, radiologist reports, and image storage",
    "vendor": "GE Healthcare",
    "version": "Centricity 6.1",
    "status": "connected",
    "lastSync": "2024-01-20T07:45:00Z",
    "uptime": 99.2,
    "dataPoints": 12340,
    "syncFrequency": "Every 10 minutes",
    "location": "Dubai Healthcare City - Imaging Center",
    "environment": "production",
    "dataExtracted": [
      "Imaging orders (CT, MRI, X-ray)",
      "Radiologist notes/reports",
      "Study timestamps",
      "DICOM image metadata"
    ],
    "examples": [
      "GE Centricity",
      "Philips IntelliSpace",
      "Fuji Synapse"
    ],
    "connectionType": "FHIR",
    "securityLevel": "High",
    "complianceStandards": [
      "DICOM",
      "ACR",
      "UAE Radiology Standards"
    ],
    "maintenanceWindow": "Sunday 01:00-03:00 GST",
    "supportContact": "Radiology IT (+971-4-XXX-XXXZ)",
    "businessCriticality": "High",
    "dataVolume": "1.2TB daily",
    "errorRate": 0.08,
    "avgResponseTime": "350ms",
    "nextMaintenance": "2024-01-28T01:00:00Z"
  },
  {
    "id": "SYS004",
    "name": "Medication Management System (eMAR/CPOE)",
    "category": "Pharmacy",
    "purpose": "Prescribing, dispensing, administration, and medication reconciliation",
    "vendor": "BD (Becton Dickinson)",
    "version": "Pyxis 2023.2",
    "status": "connected",
    "lastSync": "2024-01-20T08:10:00Z",
    "uptime": 98.9,
    "dataPoints": 15680,
    "syncFrequency": "Real-time",
    "location": "Dubai Healthcare City - Pharmacy",
    "environment": "production",
    "dataExtracted": [
      "Drug orders",
      "Route, dose, frequency",
      "Barcode scan logs",
      "Medication error logs"
    ],
    "examples": [
      "Mediware",
      "BD Pyxis",
      "Omnicell",
      "EMR modules"
    ],
    "connectionType": "HL7",
    "securityLevel": "High",
    "complianceStandards": [
      "USP 797",
      "JCI Medication Standards",
      "UAE Pharmacy Law"
    ],
    "maintenanceWindow": "Saturday 22:00-24:00 GST",
    "supportContact": "Pharmacy Systems (+971-4-XXX-XXXA)",
    "businessCriticality": "Critical",
    "dataVolume": "450GB daily",
    "errorRate": 0.03,
    "avgResponseTime": "180ms",
    "nextMaintenance": "2024-01-27T22:00:00Z"
  },
  {
    "id": "SYS005",
    "name": "Quality Management System (QMS)",
    "category": "Quality & Compliance",
    "purpose": "Manages clinical incidents, quality KPIs, audits, and compliance",
    "vendor": "Quantros (Verge Health)",
    "version": "QCMS 8.5",
    "status": "warning",
    "lastSync": "2024-01-20T06:30:00Z",
    "uptime": 97.3,
    "dataPoints": 8920,
    "syncFrequency": "Every 30 minutes",
    "location": "Dubai Healthcare City - Quality Office",
    "environment": "production",
    "dataExtracted": [
      "Quality KPIs",
      "Incident reports (falls, infections, med errors)",
      "Checklist compliance (e.g., WHO surgical checklist)"
    ],
    "examples": [
      "Quantros QCMS",
      "RLDatix",
      "JCI/NABIDH templates"
    ],
    "connectionType": "REST API",
    "securityLevel": "Medium",
    "complianceStandards": [
      "JCI",
      "NABIDH",
      "ISO 9001",
      "MOHAP Quality Standards"
    ],
    "maintenanceWindow": "Sunday 03:00-05:00 GST",
    "supportContact": "Quality IT Support (+971-4-XXX-XXXB)",
    "businessCriticality": "High",
    "dataVolume": "120GB daily",
    "errorRate": 0.15,
    "avgResponseTime": "500ms",
    "lastError": "Connection timeout during peak hours",
    "nextMaintenance": "2024-01-28T03:00:00Z"
  },
  {
    "id": "SYS006",
    "name": "Insurance/Revenue Cycle/Billing Systems",
    "category": "Financial",
    "purpose": "Handles payer integration, claims, financial KPIs",
    "vendor": "Oracle Health",
    "version": "RCM 15.2",
    "status": "connected",
    "lastSync": "2024-01-20T08:05:00Z",
    "uptime": 98.7,
    "dataPoints": 11250,
    "syncFrequency": "Every 15 minutes",
    "location": "Dubai Healthcare City - Finance Wing",
    "environment": "production",
    "dataExtracted": [
      "ICD & CPT codes submitted",
      "Claim denials / pre-approvals",
      "ALOS (Average Length of Stay)",
      "Revenue per encounter / DRG grouping",
      "Readmissions tracking"
    ],
    "examples": [
      "Oracle Health RCM",
      "SAP IS-H",
      "Cerner RevWorks"
    ],
    "connectionType": "Database",
    "securityLevel": "High",
    "complianceStandards": [
      "PCI DSS",
      "UAE Insurance Law",
      "ADNIC/DAMAN Standards"
    ],
    "maintenanceWindow": "Sunday 00:00-02:00 GST",
    "supportContact": "Revenue Cycle IT (+971-4-XXX-XXXC)",
    "businessCriticality": "Critical",
    "dataVolume": "680GB daily",
    "errorRate": 0.07,
    "avgResponseTime": "280ms",
    "nextMaintenance": "2024-01-28T00:00:00Z"
  },
  {
    "id": "SYS007",
    "name": "ADHICS/NABIDH Integration Layer",
    "category": "Government Integration",
    "purpose": "Compliance and national health data exchange for UAE",
    "vendor": "Custom Integration",
    "version": "v2.1",
    "status": "connected",
    "lastSync": "2024-01-20T07:30:00Z",
    "uptime": 96.8,
    "dataPoints": 5640,
    "syncFrequency": "Daily batch",
    "location": "Dubai Healthcare City - Integration Hub",
    "environment": "production",
    "dataExtracted": [
      "Mandatory KPIs",
      "Data sharing events",
      "Audit & access logs",
      "Compliance checkpoints"
    ],
    "examples": [
      "NABIDH APIs (Dubai)",
      "Riayati (Abu Dhabi)",
      "ADHICS specs"
    ],
    "connectionType": "REST API",
    "securityLevel": "High",
    "complianceStandards": [
      "NABIDH",
      "ADHICS",
      "UAE National Health Data Standards"
    ],
    "maintenanceWindow": "Friday 20:00-22:00 GST",
    "supportContact": "Government Integration (+971-4-XXX-XXXD)",
    "businessCriticality": "High",
    "dataVolume": "200GB daily",
    "errorRate": 0.12,
    "avgResponseTime": "800ms",
    "nextMaintenance": "2024-01-26T20:00:00Z"
  },
  {
    "id": "SYS008",
    "name": "Nurse Call/Patient Monitoring/ICU Integration",
    "category": "Patient Monitoring",
    "purpose": "Real-time vitals, monitoring trends, alarms",
    "vendor": "Philips Healthcare",
    "version": "IntelliVue MX800",
    "status": "connected",
    "lastSync": "2024-01-20T08:12:00Z",
    "uptime": 99.1,
    "dataPoints": 32150,
    "syncFrequency": "Real-time streaming",
    "location": "Dubai Healthcare City - ICU/CCU",
    "environment": "production",
    "dataExtracted": [
      "Heart rate, SpO2, blood pressure",
      "Alert triggers",
      "Device timestamps",
      "Real-time deterioration patterns"
    ],
    "examples": [
      "Philips IntelliVue",
      "Mindray BeneVision",
      "GE MUSE"
    ],
    "connectionType": "Real-time",
    "securityLevel": "High",
    "complianceStandards": [
      "IEC 60601",
      "FDA 510(k)",
      "CE Marking",
      "UAE Medical Device Standards"
    ],
    "maintenanceWindow": "Saturday 21:00-23:00 GST",
    "supportContact": "Biomedical Engineering (+971-4-XXX-XXXE)",
    "businessCriticality": "Critical",
    "dataVolume": "3.2TB daily",
    "errorRate": 0.01,
    "avgResponseTime": "50ms",
    "nextMaintenance": "2024-01-27T21:00:00Z"
  },
  {
    "id": "SYS009",
    "name": "Incident Reporting Systems",
    "category": "Risk Management",
    "purpose": "Adverse events and near misses",
    "vendor": "RLDatix",
    "version": "Datix CloudIQ",
    "status": "connected",
    "lastSync": "2024-01-20T07:50:00Z",
    "uptime": 98.4,
    "dataPoints": 3420,
    "syncFrequency": "Every hour",
    "location": "Dubai Healthcare City - Risk Management",
    "environment": "production",
    "dataExtracted": [
      "Incident IDs",
      "Medication errors",
      "Patient safety reports",
      "Root cause analysis"
    ],
    "examples": [
      "RLDatix",
      "Datix CloudIQ"
    ],
    "connectionType": "REST API",
    "securityLevel": "Medium",
    "complianceStandards": [
      "JCI Patient Safety Goals",
      "WHO Patient Safety",
      "UAE Patient Safety Standards"
    ],
    "maintenanceWindow": "Sunday 04:00-06:00 GST",
    "supportContact": "Risk Management IT (+971-4-XXX-XXXF)",
    "businessCriticality": "High",
    "dataVolume": "85GB daily",
    "errorRate": 0.09,
    "avgResponseTime": "420ms",
    "nextMaintenance": "2024-01-28T04:00:00Z"
  },
  {
    "id": "SYS010",
    "name": "Scheduling & ADT Systems",
    "category": "Patient Flow",
    "purpose": "Movement tracking and discharge workflows",
    "vendor": "Epic (Integrated)",
    "version": "Epic ADT Module",
    "status": "connected",
    "lastSync": "2024-01-20T08:08:00Z",
    "uptime": 99.6,
    "dataPoints": 19870,
    "syncFrequency": "Real-time",
    "location": "Dubai Healthcare City - Registration",
    "environment": "production",
    "dataExtracted": [
      "Admission timestamps",
      "Bed movement",
      "Discharge readiness scores",
      "Transfer reasons"
    ],
    "examples": [
      "Part of EMR or Oracle Healthcare"
    ],
    "connectionType": "HL7",
    "securityLevel": "High",
    "complianceStandards": [
      "HL7 ADT Standards",
      "UAE Healthcare Licensing",
      "JCI Access Standards"
    ],
    "maintenanceWindow": "Sunday 01:30-03:30 GST",
    "supportContact": "ADT Support Team (+971-4-XXX-XXXG)",
    "businessCriticality": "Critical",
    "dataVolume": "320GB daily",
    "errorRate": 0.04,
    "avgResponseTime": "150ms",
    "nextMaintenance": "2024-01-28T01:30:00Z"
  },
  {
    "id": "SYS011",
    "name": "HR/Staff Roster/Credentialing System",
    "category": "Human Resources",
    "purpose": "For physician benchmarking, shift-based analysis, and peer variance",
    "vendor": "SAP SuccessFactors",
    "version": "SF Q4 2023",
    "status": "maintenance",
    "lastSync": "2024-01-19T18:00:00Z",
    "uptime": 95.2,
    "dataPoints": 4580,
    "syncFrequency": "Daily",
    "location": "Dubai Healthcare City - HR Department",
    "environment": "production",
    "dataExtracted": [
      "Physician assignments",
      "Department shifts",
      "Role mapping",
      "Credentials for access-based views"
    ],
    "examples": [
      "SAP SuccessFactors",
      "Oracle HR",
      "Bespoke HRMS"
    ],
    "connectionType": "Database",
    "securityLevel": "High",
    "complianceStandards": [
      "UAE Labor Law",
      "DHA Licensing",
      "JCI Human Resources Standards"
    ],
    "maintenanceWindow": "Currently in maintenance",
    "supportContact": "HR Systems (+971-4-XXX-XXXH)",
    "businessCriticality": "Medium",
    "dataVolume": "45GB daily",
    "errorRate": 0.2,
    "avgResponseTime": "1200ms",
    "lastError": "Scheduled maintenance - credential sync updates",
    "nextMaintenance": "2024-01-21T06:00:00Z"
  }
];
  // Remove the API call and use mock data directly
  useEffect(() => {
    const loadSystems = async () => {
      try {
        // Simulate API call with a delay to mimic network request
        setTimeout(() => {
          setSystems(mockSystems);
          setFilteredSystems(mockSystems);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading source systems:', error);
        setLoading(false);
      }
    };
    loadSystems();
  }, []);

  useEffect(() => {
    let filtered = systems;

    // Apply filters
    if (activeFilters.status !== 'all') {
      filtered = filtered.filter(system => system.status === activeFilters.status);
    }
    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(system => system.category === activeFilters.category);
    }
    if (activeFilters.criticality !== 'all') {
      filtered = filtered.filter(system => system.businessCriticality === activeFilters.criticality);
    }
    if (activeFilters.environment !== 'all') {
      filtered = filtered.filter(system => system.environment === activeFilters.environment);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(system =>
        (system.name && system.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (system.vendor && system.vendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (system.category && system.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (system.purpose && system.purpose.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredSystems(filtered);
  }, [systems, activeFilters, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'maintenance':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'disconnected':
        return 'text-slate-700 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'maintenance':
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case 'disconnected':
        return <ExclamationCircleIcon className="h-5 w-5 text-slate-600" />;
      default:
        return <ServerIcon className="h-5 w-5 text-slate-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'clinical documentation':
        return <DocumentTextIcon className="h-6 w-6 text-blue-600" />;
      case 'laboratory':
        return <BeakerIcon className="h-6 w-6 text-green-600" />;
      case 'imaging':
        return <EyeIcon className="h-6 w-6 text-purple-600" />;
      case 'pharmacy':
        return <HeartIcon className="h-6 w-6 text-red-600" />;
      case 'quality & compliance':
        return <ShieldCheckIcon className="h-6 w-6 text-amber-600" />;
      case 'financial':
        return <CreditCardIcon className="h-6 w-6 text-indigo-600" />;
      case 'government integration':
        return <CloudIcon className="h-6 w-6 text-teal-600" />;
      case 'patient monitoring':
        return <SignalIcon className="h-6 w-6 text-orange-600" />;
      case 'risk management':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
      case 'patient flow':
        return <CalendarDaysIcon className="h-6 w-6 text-cyan-600" />;
      case 'human resources':
        return <UserGroupIcon className="h-6 w-6 text-pink-600" />;
      default:
        return <ServerIcon className="h-6 w-6 text-slate-600" />;
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'High':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Low':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSystemAction = (systemId: string, action: 'restart' | 'pause' | 'configure') => {
    // Mock system action
    console.log(`Performing ${action} on system ${systemId}`);
    // In real implementation, this would call an API
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Source Systems Integration</h1>
        <p className="text-slate-600">Monitor and manage healthcare system integrations for CDS data ingestion</p>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Systems</p>
              <p className="text-3xl font-bold text-slate-900">{systems.length}</p>
            </div>
            <ServerIcon className="h-8 w-8 text-slate-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Active integrations
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Connected</p>
              <p className="text-3xl font-bold text-green-600">
                {systems.filter(s => s.status === 'connected').length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Healthy connections
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Warnings</p>
              <p className="text-3xl font-bold text-amber-600">
                {systems.filter(s => s.status === 'warning' || s.status === 'maintenance').length}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Need attention
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg Uptime</p>
              <p className="text-3xl font-bold text-blue-600">
                {(systems.reduce((acc, s) => acc + s.uptime, 0) / systems.length).toFixed(1)}%
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Last 30 days
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <ServerIcon className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search systems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-64"
            />
          </div>
          <select
            value={activeFilters.status}
            onChange={(e) => setActiveFilters({...activeFilters, status: e.target.value})}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="connected">Connected</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="maintenance">Maintenance</option>
            <option value="disconnected">Disconnected</option>
          </select>
          <select
            value={activeFilters.category}
            onChange={(e) => setActiveFilters({...activeFilters, category: e.target.value})}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="Clinical Documentation">Clinical Documentation</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Imaging">Imaging</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Quality & Compliance">Quality & Compliance</option>
            <option value="Financial">Financial</option>
            <option value="Government Integration">Government Integration</option>
            <option value="Patient Monitoring">Patient Monitoring</option>
            <option value="Risk Management">Risk Management</option>
            <option value="Patient Flow">Patient Flow</option>
            <option value="Human Resources">Human Resources</option>
          </select>
          <select
            value={activeFilters.criticality}
            onChange={(e) => setActiveFilters({...activeFilters, criticality: e.target.value})}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Criticality</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="ml-auto text-sm text-slate-500">
            Showing {filteredSystems.length} of {systems.length} systems
          </div>
        </div>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSystems.map((system) => (
          <div key={system.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200">
            {/* System Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getCategoryIcon(system.category)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{system.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{system.purpose}</p>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span>{system.vendor}</span>
                    <span>•</span>
                    <span>{system.version}</span>
                    <span>•</span>
                    <span>{system.environment}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(system.status)}`}>
                  {getStatusIcon(system.status)}
                  {system.status.toUpperCase()}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getCriticalityColor(system.businessCriticality)}`}>
                  {system.businessCriticality}
                </span>
              </div>
            </div>

            {/* System Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">{system.uptime}%</div>
                <div className="text-xs text-slate-500">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">{system.dataPoints.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">{system.avgResponseTime}</div>
                <div className="text-xs text-slate-500">Response Time</div>
              </div>
            </div>

            {/* Connection Details */}
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Connection:</span>
                  <span className="ml-2 font-medium">{system.connectionType}</span>
                </div>
                <div>
                  <span className="text-slate-500">Sync:</span>
                  <span className="ml-2 font-medium">{system.syncFrequency}</span>
                </div>
                <div>
                  <span className="text-slate-500">Volume:</span>
                  <span className="ml-2 font-medium">{system.dataVolume}</span>
                </div>
                <div>
                  <span className="text-slate-500">Error Rate:</span>
                  <span className="ml-2 font-medium">{system.errorRate}%</span>
                </div>
              </div>
            </div>

            {/* Last Sync */}
            <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
              <span>Last sync: {new Date(system.lastSync).toLocaleString()}</span>
              <span>Next maintenance: {new Date(system.nextMaintenance).toLocaleDateString()}</span>
            </div>

            {/* Error Message */}
            {system.lastError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <ExclamationCircleIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Last Error</p>
                    <p className="text-sm text-red-700">{system.lastError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Expandable Sections */}
            <div className="space-y-2">
              {/* Data Extracted */}
              <div>
                <button
                  onClick={() => toggleSection(`${system.id}-data`)}
                  className="flex items-center justify-between w-full text-left p-2 hover:bg-slate-50 rounded-lg"
                >
                  <span className="font-medium text-slate-900">Data Extracted ({system.dataExtracted.length})</span>
                  {expandedSections[`${system.id}-data`] ? (
                    <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                {expandedSections[`${system.id}-data`] && (
                  <div className="pl-4 pb-2">
                    <ul className="space-y-1">
                      {system.dataExtracted.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Compliance Standards */}
              <div>
                <button
                  onClick={() => toggleSection(`${system.id}-compliance`)}
                  className="flex items-center justify-between w-full text-left p-2 hover:bg-slate-50 rounded-lg"
                >
                  <span className="font-medium text-slate-900">Compliance Standards</span>
                  {expandedSections[`${system.id}-compliance`] ? (
                    <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                {expandedSections[`${system.id}-compliance`] && (
                  <div className="pl-4 pb-2">
                    <div className="flex flex-wrap gap-2">
                      {system.complianceStandards.map((standard, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleSystemAction(system.id, 'restart')}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Restart
              </button>
              <button
                onClick={() => handleSystemAction(system.id, 'pause')}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm"
              >
                <PauseIcon className="h-4 w-4" />
                Pause
              </button>
              <button
                onClick={() => handleSystemAction(system.id, 'configure')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm"
              >
                <Cog6ToothIcon className="h-4 w-4" />
                Configure
              </button>
              <button
                onClick={() => setSelectedSystem(system)}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm ml-auto"
              >
                <InformationCircleIcon className="h-4 w-4" />
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSystems.length === 0 && (
        <div className="text-center py-12">
          <ServerIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No systems found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}

      {/* System Detail Modal */}
      {selectedSystem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                {selectedSystem.name} - System Details
              </h3>
              <button
                onClick={() => setSelectedSystem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Information */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">System Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Vendor:</span>
                      <span className="font-medium">{selectedSystem.vendor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Version:</span>
                      <span className="font-medium">{selectedSystem.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Environment:</span>
                      <span className="font-medium capitalize">{selectedSystem.environment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Location:</span>
                      <span className="font-medium">{selectedSystem.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Support Contact:</span>
                      <span className="font-medium">{selectedSystem.supportContact}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Technical Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Connection Type:</span>
                      <span className="font-medium">{selectedSystem.connectionType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Security Level:</span>
                      <span className="font-medium">{selectedSystem.securityLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sync Frequency:</span>
                      <span className="font-medium">{selectedSystem.syncFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Data Volume:</span>
                      <span className="font-medium">{selectedSystem.dataVolume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Maintenance Window:</span>
                      <span className="font-medium">{selectedSystem.maintenanceWindow}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Uptime</span>
                        <span className="font-medium">{selectedSystem.uptime}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${selectedSystem.uptime}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-600">Data Points:</span>
                        <div className="font-medium text-lg">{selectedSystem.dataPoints.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Error Rate:</span>
                        <div className="font-medium text-lg">{selectedSystem.errorRate}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Data Extracted</h4>
                  <ul className="space-y-1">
                    {selectedSystem.dataExtracted.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Compliance Standards</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSystem.complianceStandards.map((standard, idx) => (
                      <span key={idx} className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Test Connection
              </button>
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                View Logs
              </button>
              <button className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                Configure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}