import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  HeartIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  InformationCircleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  EyeIcon,
  CpuChipIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  FireIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface QualityKPI {
  id: string;
  name: string;
  category: 'patient_safety' | 'operational' | 'financial' | 'regulatory';
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
  riskDomain: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  lastUpdated: string;
  dataSource: string;
  owner: string;
  mitigationActions: string[];
  complianceStandards: string[];
  benchmarkValue?: number;
  yearToDateTrend: number[];
}

interface RiskRegisterEntry {
  id: string;
  kpiId: string;
  riskDescription: string;
  potentialConsequences: string[];
  currentControls: string[];
  residualRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  actionPlan: string;
  owner: string;
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Overdue';
  lastReview: string;
  nextReview: string;
}

export function QualityMetrics() {
  const [kpis, setKpis] = useState<QualityKPI[]>([]);
  const [riskRegister, setRiskRegister] = useState<RiskRegisterEntry[]>([]);
  const [filteredKpis, setFilteredKpis] = useState<QualityKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedKpi, setSelectedKpi] = useState<QualityKPI | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    riskLevel: 'all',
    trend: 'all',
    owner: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Mock Quality KPIs with Risk Assessment
  const mockKpis: QualityKPI[] = [
    // Patient Safety Risks
    {
      id: 'QM001',
      name: 'Sentinel Events Rate',
      category: 'patient_safety',
      value: 0.02,
      unit: 'per 1000 patient days',
      target: 0.0,
      trend: 'stable',
      change: '0.00',
      riskDomain: 'Patient Safety',
      likelihood: 2,
      impact: 5,
      riskScore: 10,
      riskLevel: 'High',
      description: 'Unexpected occurrences involving death or serious physical/psychological injury',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Quality Management System',
      owner: 'Dr. Hassan Mahmoud',
      mitigationActions: [
        'Root cause analysis for all events',
        'Staff training and competency validation',
        'Process improvement initiatives',
        'Enhanced monitoring protocols'
      ],
      complianceStandards: ['JCI Patient Safety Goals', 'NABIDH Quality Standards'],
      benchmarkValue: 0.01,
      yearToDateTrend: [0.03, 0.02, 0.02, 0.02, 0.02, 0.02]
    },
    {
      id: 'QM002',
      name: 'Medication Error Rate',
      category: 'patient_safety',
      value: 2.1,
      unit: 'per 1000 medication doses',
      target: 1.5,
      trend: 'down',
      change: '-0.4',
      riskDomain: 'Patient Safety',
      likelihood: 3,
      impact: 4,
      riskScore: 12,
      riskLevel: 'High',
      description: 'Errors in medication prescribing, dispensing, or administration',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Medication Management System',
      owner: 'Dr. Fatima Al-Zahra',
      mitigationActions: [
        'Barcode medication administration',
        'Clinical pharmacist rounds',
        'Medication reconciliation protocols',
        'Staff education programs'
      ],
      complianceStandards: ['JCI Medication Management', 'UAE Pharmacy Standards'],
      benchmarkValue: 2.5,
      yearToDateTrend: [3.2, 2.8, 2.5, 2.3, 2.1, 2.1]
    },
    {
      id: 'QM003',
      name: 'Patient Falls with Injury',
      category: 'patient_safety',
      value: 0.8,
      unit: 'per 1000 patient days',
      target: 0.5,
      trend: 'up',
      change: '+0.2',
      riskDomain: 'Patient Safety',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      riskLevel: 'Medium',
      description: 'Patient falls resulting in injury requiring medical intervention',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Incident Reporting System',
      owner: 'Nurse Manager ICU',
      mitigationActions: [
        'Fall risk assessment protocols',
        'Hourly rounding programs',
        'Environmental safety measures',
        'Patient and family education'
      ],
      complianceStandards: ['JCI Patient Safety Goals', 'NABIDH Safety Standards'],
      benchmarkValue: 0.6,
      yearToDateTrend: [0.5, 0.6, 0.7, 0.8, 0.8, 0.8]
    },
    {
      id: 'QM004',
      name: 'Central Line-Associated BSI (CLABSI)',
      category: 'patient_safety',
      value: 1.2,
      unit: 'per 1000 central line days',
      target: 0.0,
      trend: 'down',
      change: '-0.3',
      riskDomain: 'Patient Safety',
      likelihood: 2,
      impact: 4,
      riskScore: 8,
      riskLevel: 'Medium',
      description: 'Bloodstream infections associated with central venous catheters',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Infection Control System',
      owner: 'Dr. Infection Control',
      mitigationActions: [
        'Central line insertion bundles',
        'Daily line necessity review',
        'Proper maintenance protocols',
        'Staff competency validation'
      ],
      complianceStandards: ['CDC Guidelines', 'JCI Infection Prevention'],
      benchmarkValue: 1.8,
      yearToDateTrend: [2.1, 1.8, 1.5, 1.3, 1.2, 1.2]
    },
    {
      id: 'QM005',
      name: 'Surgical Site Infection Rate',
      category: 'patient_safety',
      value: 2.8,
      unit: '%',
      target: 2.0,
      trend: 'stable',
      change: '0.0',
      riskDomain: 'Patient Safety',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      riskLevel: 'Medium',
      description: 'Infections occurring at surgical incision sites',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Surgical Services System',
      owner: 'Dr. Chief of Surgery',
      mitigationActions: [
        'Antibiotic prophylaxis protocols',
        'Surgical site preparation standards',
        'Post-operative wound care',
        'Surveillance and monitoring'
      ],
      complianceStandards: ['WHO Surgical Safety', 'JCI Surgery Standards'],
      benchmarkValue: 3.2,
      yearToDateTrend: [3.1, 2.9, 2.8, 2.8, 2.8, 2.8]
    },

    // Operational Risks
    {
      id: 'QM006',
      name: 'Hand Hygiene Compliance',
      category: 'operational',
      value: 94.2,
      unit: '%',
      target: 95.0,
      trend: 'up',
      change: '+2.1%',
      riskDomain: 'Operational Excellence',
      likelihood: 2,
      impact: 3,
      riskScore: 6,
      riskLevel: 'Medium',
      description: 'Compliance with hand hygiene protocols across all units',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Infection Control Monitoring',
      owner: 'Infection Control Team',
      mitigationActions: [
        'Regular auditing and feedback',
        'Staff education campaigns',
        'Alcohol-based hand rub availability',
        'Leadership engagement'
      ],
      complianceStandards: ['WHO Hand Hygiene', 'JCI Infection Prevention'],
      benchmarkValue: 89.4,
      yearToDateTrend: [88.5, 90.2, 92.1, 93.5, 94.2, 94.2]
    },
    {
      id: 'QM007',
      name: 'Handover Compliance Rate',
      category: 'operational',
      value: 87.5,
      unit: '%',
      target: 95.0,
      trend: 'up',
      change: '+3.2%',
      riskDomain: 'Communication & Handover',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      riskLevel: 'Medium',
      description: 'Compliance with structured handover protocols (SBAR)',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Quality Audit System',
      owner: 'Nursing Director',
      mitigationActions: [
        'SBAR training programs',
        'Handover checklists',
        'Regular compliance audits',
        'Feedback and coaching'
      ],
      complianceStandards: ['JCI Communication Standards', 'NABIDH Quality'],
      benchmarkValue: 82.3,
      yearToDateTrend: [78.2, 81.5, 84.3, 86.1, 87.5, 87.5]
    },
    {
      id: 'QM008',
      name: 'Surgical Safety Checklist Compliance',
      category: 'operational',
      value: 98.7,
      unit: '%',
      target: 100.0,
      trend: 'stable',
      change: '+0.1%',
      riskDomain: 'Surgical Safety',
      likelihood: 1,
      impact: 4,
      riskScore: 4,
      riskLevel: 'Low',
      description: 'Compliance with WHO Surgical Safety Checklist',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Operating Room Management',
      owner: 'OR Director',
      mitigationActions: [
        'Mandatory checklist completion',
        'Regular training updates',
        'Peer review processes',
        'Technology integration'
      ],
      complianceStandards: ['WHO Surgical Safety', 'JCI Surgery Standards'],
      benchmarkValue: 96.8,
      yearToDateTrend: [97.2, 98.1, 98.5, 98.6, 98.7, 98.7]
    },
    {
      id: 'QM009',
      name: 'Critical Value Reporting Time',
      category: 'operational',
      value: 8.2,
      unit: 'minutes',
      target: 10.0,
      trend: 'down',
      change: '-1.8 min',
      riskDomain: 'Laboratory Communication',
      likelihood: 2,
      impact: 3,
      riskScore: 6,
      riskLevel: 'Medium',
      description: 'Time to report critical lab values to clinicians',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Laboratory Information System',
      owner: 'Lab Director',
      mitigationActions: [
        'Automated alert systems',
        'Direct communication protocols',
        'Backup notification procedures',
        'Regular system testing'
      ],
      complianceStandards: ['CAP Standards', 'JCI Laboratory Standards'],
      benchmarkValue: 15.3,
      yearToDateTrend: [12.5, 11.2, 9.8, 8.9, 8.2, 8.2]
    },

    // Financial Risks
    {
      id: 'QM010',
      name: 'Unplanned Readmission Rate',
      category: 'financial',
      value: 8.3,
      unit: '%',
      target: 7.0,
      trend: 'down',
      change: '-1.2%',
      riskDomain: 'Financial Performance',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      riskLevel: 'Medium',
      description: '30-day unplanned readmission rate',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Hospital Information System',
      owner: 'CMO',
      mitigationActions: [
        'Discharge planning protocols',
        'Post-discharge follow-up',
        'Care coordination programs',
        'Patient education initiatives'
      ],
      complianceStandards: ['CMS Quality Measures', 'NABIDH Performance'],
      benchmarkValue: 12.1,
      yearToDateTrend: [11.2, 10.1, 9.5, 8.8, 8.3, 8.3]
    },
    {
      id: 'QM011',
      name: 'Re-do Surgery Rate',
      category: 'financial',
      value: 1.8,
      unit: '%',
      target: 1.0,
      trend: 'stable',
      change: '0.0%',
      riskDomain: 'Surgical Quality & Cost',
      likelihood: 2,
      impact: 4,
      riskScore: 8,
      riskLevel: 'Medium',
      description: 'Rate of surgical procedures requiring revision',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Surgical Services System',
      owner: 'Chief of Surgery',
      mitigationActions: [
        'Surgical technique standardization',
        'Peer review processes',
        'Equipment maintenance',
        'Surgeon credentialing'
      ],
      complianceStandards: ['JCI Surgery Standards', 'Professional Standards'],
      benchmarkValue: 2.3,
      yearToDateTrend: [2.1, 1.9, 1.8, 1.8, 1.8, 1.8]
    },
    {
      id: 'QM012',
      name: 'Average Length of Stay',
      category: 'financial',
      value: 3.8,
      unit: 'days',
      target: 3.5,
      trend: 'down',
      change: '-0.3',
      riskDomain: 'Resource Utilization',
      likelihood: 2,
      impact: 2,
      riskScore: 4,
      riskLevel: 'Low',
      description: 'Average patient length of stay across all departments',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Bed Management System',
      owner: 'Operations Director',
      mitigationActions: [
        'Discharge planning optimization',
        'Care pathway standardization',
        'Bed management protocols',
        'Multidisciplinary rounds'
      ],
      complianceStandards: ['Efficiency Standards', 'Cost Management'],
      benchmarkValue: 4.5,
      yearToDateTrend: [4.3, 4.1, 3.9, 3.8, 3.8, 3.8]
    },
    {
      id: 'QM013',
      name: 'Hospital Mortality Rate',
      category: 'financial',
      value: 1.2,
      unit: '%',
      target: 1.0,
      trend: 'stable',
      change: '0.0%',
      riskDomain: 'Clinical Outcomes & Reputation',
      likelihood: 1,
      impact: 5,
      riskScore: 5,
      riskLevel: 'Medium',
      description: 'Risk-adjusted hospital mortality rate',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Clinical Information System',
      owner: 'CMO',
      mitigationActions: [
        'Mortality review committees',
        'Clinical pathway optimization',
        'Early warning systems',
        'Quality improvement initiatives'
      ],
      complianceStandards: ['JCI Quality Standards', 'NABIDH Outcomes'],
      benchmarkValue: 1.8,
      yearToDateTrend: [1.4, 1.3, 1.2, 1.2, 1.2, 1.2]
    },

    // Regulatory & Compliance Risks
    {
      id: 'QM014',
      name: 'Patient Identification Errors',
      category: 'regulatory',
      value: 0.3,
      unit: 'per 1000 patient encounters',
      target: 0.0,
      trend: 'down',
      change: '-0.1',
      riskDomain: 'Patient Safety & Compliance',
      likelihood: 2,
      impact: 4,
      riskScore: 8,
      riskLevel: 'Medium',
      description: 'Errors in patient identification leading to wrong patient events',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Quality Management System',
      owner: 'Quality Director',
      mitigationActions: [
        'Two-identifier verification',
        'Barcode patient identification',
        'Staff training programs',
        'Technology enhancements'
      ],
      complianceStandards: ['JCI Patient Safety Goals', 'NABIDH Standards'],
      benchmarkValue: 0.8,
      yearToDateTrend: [0.6, 0.5, 0.4, 0.3, 0.3, 0.3]
    },
    {
      id: 'QM015',
      name: 'Emergency C-Section Rate',
      category: 'regulatory',
      value: 18.5,
      unit: '%',
      target: 15.0,
      trend: 'up',
      change: '+1.2%',
      riskDomain: 'Maternal Safety & Compliance',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      riskLevel: 'Medium',
      description: 'Rate of emergency cesarean sections',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'Obstetrics Information System',
      owner: 'OB/GYN Director',
      mitigationActions: [
        'Fetal monitoring protocols',
        'Decision-making guidelines',
        'Staff competency programs',
        'Quality review processes'
      ],
      complianceStandards: ['ACOG Guidelines', 'JCI Maternal Safety'],
      benchmarkValue: 20.2,
      yearToDateTrend: [16.8, 17.2, 17.8, 18.1, 18.5, 18.5]
    },
    {
      id: 'QM016',
      name: 'Occupational Safety Incidents',
      category: 'regulatory',
      value: 2.1,
      unit: 'per 100 FTE',
      target: 1.5,
      trend: 'down',
      change: '-0.4',
      riskDomain: 'Staff Safety & Compliance',
      likelihood: 3,
      impact: 2,
      riskScore: 6,
      riskLevel: 'Medium',
      description: 'Work-related injuries and incidents per 100 full-time employees',
      lastUpdated: '2024-01-20T08:00:00Z',
      dataSource: 'HR Safety System',
      owner: 'Safety Officer',
      mitigationActions: [
        'Safety training programs',
        'Hazard identification',
        'Personal protective equipment',
        'Incident investigation'
      ],
      complianceStandards: ['OSHA Standards', 'UAE Labor Law'],
      benchmarkValue: 3.2,
      yearToDateTrend: [3.1, 2.8, 2.5, 2.3, 2.1, 2.1]
    }
  ];

  // Mock Risk Register Entries
  const mockRiskRegister: RiskRegisterEntry[] = [
    {
      id: 'RR001',
      kpiId: 'QM001',
      riskDescription: 'Potential for sentinel events due to communication failures and process gaps',
      potentialConsequences: [
        'Patient harm or death',
        'Legal liability and litigation',
        'Regulatory sanctions',
        'Reputation damage',
        'Staff morale impact'
      ],
      currentControls: [
        'Incident reporting system',
        'Root cause analysis protocols',
        'Staff training programs',
        'Quality committees'
      ],
      residualRisk: 'High',
      actionPlan: 'Implement enhanced communication protocols and real-time monitoring systems',
      owner: 'Dr. Hassan Mahmoud',
      dueDate: '2024-03-31',
      status: 'In Progress',
      lastReview: '2024-01-15',
      nextReview: '2024-02-15'
    },
    {
      id: 'RR002',
      kpiId: 'QM002',
      riskDescription: 'High medication error rates leading to patient safety incidents',
      potentialConsequences: [
        'Adverse drug events',
        'Patient harm',
        'Increased length of stay',
        'Additional treatment costs',
        'Regulatory compliance issues'
      ],
      currentControls: [
        'Barcode medication administration',
        'Clinical pharmacist reviews',
        'Medication reconciliation',
        'Staff education'
      ],
      residualRisk: 'Medium',
      actionPlan: 'Deploy AI-powered medication safety system and enhance clinical decision support',
      owner: 'Dr. Fatima Al-Zahra',
      dueDate: '2024-04-30',
      status: 'In Progress',
      lastReview: '2024-01-10',
      nextReview: '2024-02-10'
    },
    {
      id: 'RR003',
      kpiId: 'QM003',
      riskDescription: 'Increasing patient falls with injury impacting safety outcomes',
      potentialConsequences: [
        'Patient injuries and complications',
        'Extended hospital stays',
        'Increased healthcare costs',
        'Family dissatisfaction',
        'Legal implications'
      ],
      currentControls: [
        'Fall risk assessments',
        'Hourly rounding',
        'Environmental modifications',
        'Patient education'
      ],
      residualRisk: 'Medium',
      actionPlan: 'Implement smart bed technology and enhanced monitoring systems',
      owner: 'Nurse Manager ICU',
      dueDate: '2024-05-31',
      status: 'Open',
      lastReview: '2024-01-12',
      nextReview: '2024-02-12'
    },
    {
      id: 'RR004',
      kpiId: 'QM010',
      riskDescription: 'Unplanned readmissions affecting financial performance and patient outcomes',
      potentialConsequences: [
        'Revenue loss from penalties',
        'Increased operational costs',
        'Poor patient experience',
        'Reputation impact',
        'Regulatory scrutiny'
      ],
      currentControls: [
        'Discharge planning protocols',
        'Post-discharge follow-up',
        'Care coordination',
        'Patient education'
      ],
      residualRisk: 'Medium',
      actionPlan: 'Enhance predictive analytics for readmission risk and improve care transitions',
      owner: 'CMO',
      dueDate: '2024-06-30',
      status: 'In Progress',
      lastReview: '2024-01-08',
      nextReview: '2024-02-08'
    },
    {
      id: 'RR005',
      kpiId: 'QM015',
      riskDescription: 'Rising emergency C-section rates indicating potential maternal safety risks',
      potentialConsequences: [
        'Maternal complications',
        'Increased surgical risks',
        'Higher healthcare costs',
        'Patient dissatisfaction',
        'Regulatory compliance issues'
      ],
      currentControls: [
        'Fetal monitoring protocols',
        'Clinical guidelines',
        'Physician training',
        'Quality reviews'
      ],
      residualRisk: 'Medium',
      actionPlan: 'Implement advanced fetal monitoring technology and decision support tools',
      owner: 'OB/GYN Director',
      dueDate: '2024-07-31',
      status: 'Open',
      lastReview: '2024-01-05',
      nextReview: '2024-02-05'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setKpis(mockKpis);
          setRiskRegister(mockRiskRegister);
          setFilteredKpis(mockKpis);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading quality metrics:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = kpis;

    // Apply filters
    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(kpi => kpi.category === activeFilters.category);
    }
    if (activeFilters.riskLevel !== 'all') {
      filtered = filtered.filter(kpi => kpi.riskLevel === activeFilters.riskLevel);
    }
    if (activeFilters.trend !== 'all') {
      filtered = filtered.filter(kpi => kpi.trend === activeFilters.trend);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(kpi =>
        kpi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kpi.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kpi.riskDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kpi.owner.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredKpis(filtered);
  }, [kpis, activeFilters, searchQuery]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'patient_safety':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'operational':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'financial':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'regulatory':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'patient_safety':
        return <HeartIcon className="h-5 w-5 text-red-600" />;
      case 'operational':
        return <CpuChipIcon className="h-5 w-5 text-blue-600" />;
      case 'financial':
        return <CurrencyDollarIcon className="h-5 w-5 text-green-600" />;
      case 'regulatory':
        return <DocumentCheckIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <ChartBarIcon className="h-5 w-5 text-slate-600" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'text-red-800 bg-red-100 border-red-300';
      case 'High':
        return 'text-orange-800 bg-orange-100 border-orange-300';
      case 'Medium':
        return 'text-amber-800 bg-amber-100 border-amber-300';
      case 'Low':
        return 'text-green-800 bg-green-100 border-green-300';
      default:
        return 'text-slate-800 bg-slate-100 border-slate-300';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'Critical':
        return <FireIcon className="h-4 w-4 text-red-600" />;
      case 'High':
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />;
      case 'Medium':
        return <ExclamationCircleIcon className="h-4 w-4 text-amber-600" />;
      case 'Low':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4" />;
      case 'down':
        return <ArrowDownIcon className="h-4 w-4" />;
      default:
        return <MinusIcon className="h-4 w-4" />;
    }
  };

  const getTrendColor = (kpi: QualityKPI) => {
    // For metrics where lower is better
    const lowerIsBetter = ['Rate', 'Error', 'Time', 'Days', 'Incidents'].some(term => 
      kpi.name.includes(term) || kpi.unit.includes('per') || kpi.unit.includes('days') || kpi.unit.includes('minutes')
    );
    
    if (lowerIsBetter) {
      switch (kpi.trend) {
        case 'up':
          return 'text-red-700 bg-red-50';
        case 'down':
          return 'text-green-700 bg-green-50';
        default:
          return 'text-slate-700 bg-slate-50';
      }
    } else {
      switch (kpi.trend) {
        case 'up':
          return 'text-green-700 bg-green-50';
        case 'down':
          return 'text-red-700 bg-red-50';
        default:
          return 'text-slate-700 bg-slate-50';
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'In Progress':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Closed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Overdue':
        return 'text-orange-700 bg-orange-50 border-orange-200';
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Quality Metrics & Risk Management</h1>
        <p className="text-slate-600">KPI Impact Analysis and Risk Register for comprehensive quality management</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total KPIs</p>
              <p className="text-3xl font-bold text-slate-900">{kpis.length}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-slate-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across 4 risk domains
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Critical Risks</p>
              <p className="text-3xl font-bold text-red-600">
                {kpis.filter(k => k.riskLevel === 'Critical').length}
              </p>
            </div>
            <FireIcon className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Requiring immediate attention
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">High Risks</p>
              <p className="text-3xl font-bold text-orange-600">
                {kpis.filter(k => k.riskLevel === 'High').length}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Active monitoring required
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">On Target</p>
              <p className="text-3xl font-bold text-green-600">
                {kpis.filter(k => {
                  const lowerIsBetter = ['Rate', 'Error', 'Time', 'Days', 'Incidents'].some(term => 
                    k.name.includes(term) || k.unit.includes('per') || k.unit.includes('days') || k.unit.includes('minutes')
                  );
                  return lowerIsBetter ? k.value <= k.target : k.value >= k.target;
                }).length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Meeting performance targets
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dashboard', name: 'KPI Dashboard', icon: ChartBarIcon },
              { id: 'risk-register', name: 'Risk Register', icon: ExclamationTriangleIcon },
              { id: 'analytics', name: 'Risk Analytics', icon: CpuChipIcon }
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
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* KPI Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Filters and Search */}
              <div className="flex flex-wrap gap-4 items-center bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search KPIs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-64"
                  />
                </div>
                <select
                  value={activeFilters.category}
                  onChange={(e) => setActiveFilters({...activeFilters, category: e.target.value})}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="patient_safety">Patient Safety</option>
                  <option value="operational">Operational</option>
                  <option value="financial">Financial</option>
                  <option value="regulatory">Regulatory</option>
                </select>
                <select
                  value={activeFilters.riskLevel}
                  onChange={(e) => setActiveFilters({...activeFilters, riskLevel: e.target.value})}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select
                  value={activeFilters.trend}
                  onChange={(e) => setActiveFilters({...activeFilters, trend: e.target.value})}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Trends</option>
                  <option value="up">Trending Up</option>
                  <option value="down">Trending Down</option>
                  <option value="stable">Stable</option>
                </select>
                <div className="ml-auto text-sm text-slate-500">
                  Showing {filteredKpis.length} of {kpis.length} KPIs
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredKpis.map((kpi) => (
                  <div key={kpi.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                    {/* KPI Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getCategoryIcon(kpi.category)}
                          <h3 className="text-lg font-semibold text-slate-900">{kpi.name}</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{kpi.description}</p>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(kpi.category)}`}>
                            {kpi.category.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskLevelColor(kpi.riskLevel)}`}>
                            {getRiskLevelIcon(kpi.riskLevel)}
                            {kpi.riskLevel.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* KPI Value and Trend */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900 mb-1">
                          {kpi.value}
                        </div>
                        <div className="text-sm text-slate-500">{kpi.unit}</div>
                      </div>
                      <div className="text-center">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${getTrendColor(kpi)}`}>
                          {getTrendIcon(kpi.trend)}
                          {kpi.change}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">vs Target: {kpi.target}{kpi.unit}</div>
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-slate-900 mb-3">Risk Assessment</h4>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900">{kpi.likelihood}</div>
                          <div className="text-xs text-slate-500">Likelihood</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900">{kpi.impact}</div>
                          <div className="text-xs text-slate-500">Impact</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900">{kpi.riskScore}</div>
                          <div className="text-xs text-slate-500">Risk Score</div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Sections */}
                    <div className="space-y-2">
                      {/* Mitigation Actions */}
                      <div>
                        <button
                          onClick={() => toggleSection(`${kpi.id}-mitigation`)}
                          className="flex items-center justify-between w-full text-left p-2 hover:bg-slate-50 rounded-lg"
                        >
                          <span className="font-medium text-slate-900">Mitigation Actions ({kpi.mitigationActions.length})</span>
                          {expandedSections[`${kpi.id}-mitigation`] ? (
                            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                        {expandedSections[`${kpi.id}-mitigation`] && (
                          <div className="pl-4 pb-2">
                            <ul className="space-y-1">
                              {kpi.mitigationActions.map((action, idx) => (
                                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                  <LightBulbIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Compliance Standards */}
                      <div>
                        <button
                          onClick={() => toggleSection(`${kpi.id}-compliance`)}
                          className="flex items-center justify-between w-full text-left p-2 hover:bg-slate-50 rounded-lg"
                        >
                          <span className="font-medium text-slate-900">Compliance Standards</span>
                          {expandedSections[`${kpi.id}-compliance`] ? (
                            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                        {expandedSections[`${kpi.id}-compliance`] && (
                          <div className="pl-4 pb-2">
                            <div className="flex flex-wrap gap-2">
                              {kpi.complianceStandards.map((standard, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {standard}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-slate-500 mt-4 pt-4 border-t border-slate-200">
                      <span>Owner: {kpi.owner}</span>
                      <span>Updated: {new Date(kpi.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredKpis.length === 0 && (
                <div className="text-center py-12">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No KPIs found</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Try adjusting your filters or search query.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Risk Register Tab */}
          {activeTab === 'risk-register' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Risk Register</h3>
                <div className="text-sm text-slate-500">{riskRegister.length} risk entries</div>
              </div>

              <div className="space-y-4">
                {riskRegister.map((risk) => {
                  const relatedKpi = kpis.find(k => k.id === risk.kpiId);
                  return (
                    <div key={risk.id} className="bg-white border border-slate-200 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-slate-900">
                              {relatedKpi?.name || 'Unknown KPI'}
                            </h4>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskLevelColor(risk.residualRisk)}`}>
                              {getRiskLevelIcon(risk.residualRisk)}
                              {risk.residualRisk.toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(risk.status)}`}>
                              {risk.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{risk.riskDescription}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Potential Consequences */}
                        <div>
                          <h5 className="font-medium text-slate-900 mb-2">Potential Consequences</h5>
                          <ul className="space-y-1">
                            {risk.potentialConsequences.map((consequence, idx) => (
                              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <ExclamationTriangleIcon className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                {consequence}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Current Controls */}
                        <div>
                          <h5 className="font-medium text-slate-900 mb-2">Current Controls</h5>
                          <ul className="space-y-1">
                            {risk.currentControls.map((control, idx) => (
                              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <ShieldCheckIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {control}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Plan */}
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">Action Plan</h5>
                        <p className="text-sm text-blue-800">{risk.actionPlan}</p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-slate-500 mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-4">
                          <span>Owner: {risk.owner}</span>
                          <span>Due: {new Date(risk.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>Last Review: {new Date(risk.lastReview).toLocaleDateString()}</span>
                          <span>Next Review: {new Date(risk.nextReview).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Risk Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Risk Analytics Dashboard</h3>
              
              {/* Risk Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {['Critical', 'High', 'Medium', 'Low'].map(level => {
                  const count = kpis.filter(k => k.riskLevel === level).length;
                  const percentage = ((count / kpis.length) * 100).toFixed(1);
                  return (
                    <div key={level} className="bg-white border border-slate-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-slate-900">{level} Risk</h4>
                        {getRiskLevelIcon(level)}
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-2">{count}</div>
                      <div className="text-sm text-slate-500">{percentage}% of total KPIs</div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                        <div
                          className={`h-2 rounded-full ${
                            level === 'Critical' ? 'bg-red-500' :
                            level === 'High' ? 'bg-orange-500' :
                            level === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Category Risk Analysis */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-6">Risk by Category</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['patient_safety', 'operational', 'financial', 'regulatory'].map(category => {
                    const categoryKpis = kpis.filter(k => k.category === category);
                    const avgRiskScore = categoryKpis.reduce((acc, k) => acc + k.riskScore, 0) / categoryKpis.length;
                    const highRiskCount = categoryKpis.filter(k => k.riskLevel === 'High' || k.riskLevel === 'Critical').length;
                    
                    return (
                      <div key={category} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {getCategoryIcon(category)}
                          <h5 className="font-medium text-slate-900 capitalize">
                            {category.replace('_', ' ')}
                          </h5>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900">{categoryKpis.length}</div>
                            <div className="text-xs text-slate-500">Total KPIs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900">{avgRiskScore.toFixed(1)}</div>
                            <div className="text-xs text-slate-500">Avg Risk Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900">{highRiskCount}</div>
                            <div className="text-xs text-slate-500">High/Critical</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Risk KPIs */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-6">Top Risk KPIs</h4>
                <div className="space-y-4">
                  {kpis
                    .sort((a, b) => b.riskScore - a.riskScore)
                    .slice(0, 5)
                    .map((kpi, idx) => (
                      <div key={kpi.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-bold text-slate-600">#{idx + 1}</div>
                          <div>
                            <h5 className="font-medium text-slate-900">{kpi.name}</h5>
                            <p className="text-sm text-slate-600">{kpi.riskDomain}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900">{kpi.riskScore}</div>
                            <div className="text-xs text-slate-500">Risk Score</div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskLevelColor(kpi.riskLevel)}`}>
                            {getRiskLevelIcon(kpi.riskLevel)}
                            {kpi.riskLevel}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}