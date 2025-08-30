import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockApi } from '../utils/mockApi';
import {
  CreditCardIcon,
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  BeakerIcon,
  HeartIcon,
  CameraIcon,
  ScissorsIcon,
  PlusIcon,
  MinusIcon,
  LightBulbIcon,
  ExclamationCircleIcon,
  BellIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

interface Claim {
  id: string;
  patientId: string;
  patientName: string;
  patientMRN: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceTier: string;
  claimAmount: number;
  currency: string;
  serviceDate: string;
  submissionDate: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'partially_approved' | 'resubmitted';
  type: 'inpatient' | 'outpatient' | 'emergency' | 'surgery' | 'diagnostic';
  provider: string;
  department: string;
  services: Array<{
    code: string;
    description: string;
    amount: number;
    quantity: number;
    approved?: boolean;
    rejectionReason?: string;
    aiRecommendation?: string;
  }>;
  preAuthRequired: boolean;
  preAuthNumber?: string;
  estimatedTAT: string;
  actualTAT?: string;
  rejectionReasons?: string[];
  aiAnalysis: {
    coverageScore: number;
    riskScore: number;
    recommendations: string[];
    flaggedItems: Array<{
      item: string;
      reason: string;
      severity: 'high' | 'medium' | 'low';
    }>;
  };
  documents: Array<{
    type: string;
    name: string;
    status: 'uploaded' | 'verified' | 'missing';
  }>;
  timeline: Array<{
    date: string;
    action: string;
    actor: string;
    notes?: string;
  }>;
}

interface PreAuth {
  id: string;
  patientId: string;
  patientName: string;
  patientMRN: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  requestedAmount: number;
  currency: string;
  serviceType: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  approvalDate?: string;
  expiryDate?: string;
  validUntil?: string;
  authorizationNumber?: string;
  requestingProvider: string;
  department: string;
  clinicalJustification: string;
  aiAnalysis: {
    approvalProbability: number;
    coverageAlignment: number;
    recommendations: string[];
    requiredDocuments: string[];
  };
  documents: Array<{
    type: string;
    name: string;
    status: 'uploaded' | 'verified' | 'missing';
  }>;
  timeline: Array<{
    date: string;
    action: string;
    actor: string;
    notes?: string;
  }>;
}

interface InsuranceProvider {
  id: string;
  name: string;
  type: 'government' | 'private' | 'corporate';
  packages: Array<{
    id: string;
    name: string;
    tier: string;
    coverage: {
      inpatient: number;
      outpatient: number;
      emergency: number;
      maternity: number;
      dental: number;
    };
    exclusions: string[];
    preAuthRequired: string[];
  }>;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  avgTAT: string;
  approvalRate: number;
}

export function Claims() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient');
  
  const [claims, setClaims] = useState<Claim[]>([]);
  const [preAuths, setPreAuths] = useState<PreAuth[]>([]);
  const [insuranceProviders, setInsuranceProviders] = useState<InsuranceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('claims');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [selectedPreAuth, setSelectedPreAuth] = useState<PreAuth | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    provider: 'all',
    type: 'all',
    dateRange: '30d'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [showNewPreAuthModal, setShowNewPreAuthModal] = useState(false);

  // Mock data
  const mockClaims: Claim[] = [
    {
      id: 'CLM001',
      patientId: 'P0001',
      patientName: 'Omar Al-Mansouri',
      patientMRN: 'NMC2024001',
      insuranceProvider: 'ADNIC',
      insurancePolicyNumber: 'ADN123456789',
      insuranceTier: 'Gold',
      claimAmount: 15750.00,
      currency: 'AED',
      serviceDate: '2024-01-15',
      submissionDate: '2024-01-16',
      status: 'under_review',
      type: 'inpatient',
      provider: 'Dr. Ahmed Al-Rashid',
      department: 'Cardiology',
      services: [
        {
          code: '93010',
          description: 'Electrocardiogram (ECG)',
          amount: 250.00,
          quantity: 1,
          approved: true,
          aiRecommendation: 'Covered under cardiac diagnostic procedures'
        },
        {
          code: '93306',
          description: 'Echocardiography',
          amount: 1200.00,
          quantity: 1,
          approved: true,
          aiRecommendation: 'Medically necessary for cardiac evaluation'
        },
        {
          code: '99223',
          description: 'Initial hospital care - comprehensive',
          amount: 450.00,
          quantity: 3,
          approved: true,
          aiRecommendation: 'Standard inpatient care coverage'
        },
        {
          code: '36415',
          description: 'Blood draw for lab tests',
          amount: 50.00,
          quantity: 5,
          approved: false,
          rejectionReason: 'Excessive frequency not justified',
          aiRecommendation: 'Reduce to 3 draws maximum per policy'
        }
      ],
      preAuthRequired: true,
      preAuthNumber: 'PA2024001',
      estimatedTAT: '5-7 business days',
      actualTAT: '4 days',
      aiAnalysis: {
        coverageScore: 85,
        riskScore: 15,
        recommendations: [
          'Pre-authorization approved for cardiac procedures',
          'Consider bundling related diagnostic codes',
          'Review frequency of blood draws'
        ],
        flaggedItems: [
          {
            item: 'Multiple blood draws',
            reason: 'Exceeds policy guidelines for frequency',
            severity: 'medium'
          }
        ]
      },
      documents: [
        { type: 'Medical Records', name: 'Admission Notes', status: 'verified' },
        { type: 'Lab Reports', name: 'Cardiac Enzymes', status: 'verified' },
        { type: 'Imaging', name: 'Echo Report', status: 'verified' },
        { type: 'Discharge Summary', name: 'Final Summary', status: 'missing' }
      ],
      timeline: [
        { date: '2024-01-16T09:00:00Z', action: 'Claim Submitted', actor: 'Billing Department' },
        { date: '2024-01-16T14:30:00Z', action: 'AI Analysis Completed', actor: 'AEGLE AI' },
        { date: '2024-01-17T10:15:00Z', action: 'Under Review', actor: 'ADNIC Claims Team' },
        { date: '2024-01-18T16:45:00Z', action: 'Additional Documents Requested', actor: 'ADNIC Claims Team' }
      ]
    },
    {
      id: 'CLM002',
      patientId: 'P0002',
      patientName: 'Sarah Johnson',
      patientMRN: 'NMC2024002',
      insuranceProvider: 'DAMAN',
      insurancePolicyNumber: 'DMN987654321',
      insuranceTier: 'Premium',
      claimAmount: 8500.00,
      currency: 'AED',
      serviceDate: '2024-01-18',
      submissionDate: '2024-01-19',
      status: 'approved',
      type: 'outpatient',
      provider: 'Dr. Amina Hassan',
      department: 'Obstetrics & Gynecology',
      services: [
        {
          code: '99214',
          description: 'Office visit - established patient, moderate complexity',
          amount: 650.00,
          quantity: 1,
          approved: true,
          aiRecommendation: 'Standard prenatal care coverage'
        },
        {
          code: '76805',
          description: 'Ultrasound, pregnant uterus, real time',
          amount: 850.00,
          quantity: 1,
          approved: true,
          aiRecommendation: 'Covered under maternity benefits'
        },
        {
          code: '82947',
          description: 'Glucose tolerance test',
          amount: 200.00,
          quantity: 1,
          approved: true,
          aiRecommendation: 'Standard gestational diabetes screening'
        }
      ],
      preAuthRequired: false,
      estimatedTAT: '3-5 business days',
      actualTAT: '2 days',
      aiAnalysis: {
        coverageScore: 95,
        riskScore: 5,
        recommendations: [
          'All services align with maternity coverage',
          'No pre-authorization required',
          'Standard processing expected'
        ],
        flaggedItems: []
      },
      documents: [
        { type: 'Medical Records', name: 'Prenatal Visit Notes', status: 'verified' },
        { type: 'Lab Reports', name: 'GTT Results', status: 'verified' },
        { type: 'Imaging', name: 'Ultrasound Report', status: 'verified' }
      ],
      timeline: [
        { date: '2024-01-19T08:30:00Z', action: 'Claim Submitted', actor: 'Billing Department' },
        { date: '2024-01-19T11:00:00Z', action: 'AI Analysis Completed', actor: 'AEGLE AI' },
        { date: '2024-01-20T09:15:00Z', action: 'Approved', actor: 'DAMAN Claims Team' },
        { date: '2024-01-20T14:30:00Z', action: 'Payment Processed', actor: 'DAMAN Finance' }
      ]
    },
    {
      id: 'CLM003',
      patientId: 'P0003',
      patientName: 'Ahmed Hassan',
      patientMRN: 'NMC2024003',
      insuranceProvider: 'Thiqa',
      insurancePolicyNumber: 'THQ456789123',
      insuranceTier: 'Standard',
      claimAmount: 25600.00,
      currency: 'AED',
      serviceDate: '2024-01-12',
      submissionDate: '2024-01-13',
      status: 'partially_approved',
      type: 'surgery',
      provider: 'Dr. Hassan Mahmoud',
      department: 'Orthopedic Surgery',
      services: [
        {
          code: '27447',
          description: 'Total knee arthroplasty',
          amount: 18000.00,
          quantity: 1,
          approved: true,
          aiRecommendation: 'Medically necessary based on imaging and clinical notes'
        },
        {
          code: '00402',
          description: 'Anesthesia for knee surgery',
          amount: 2500.00,
          quantity: 1,
          approved: true,
          aiRecommendation: 'Standard anesthesia coverage for major surgery'
        },
        {
          code: '99232',
          description: 'Subsequent hospital care',
          amount: 350.00,
          quantity: 5,
          approved: false,
          rejectionReason: 'Exceeds standard length of stay for procedure',
          aiRecommendation: 'Reduce to 3 days maximum per policy guidelines'
        },
        {
          code: '73721',
          description: 'MRI knee without contrast',
          amount: 1200.00,
          quantity: 2,
          approved: false,
          rejectionReason: 'Duplicate imaging not justified',
          aiRecommendation: 'Single pre-operative MRI sufficient'
        }
      ],
      preAuthRequired: true,
      preAuthNumber: 'PA2024002',
      estimatedTAT: '7-10 business days',
      actualTAT: '8 days',
      rejectionReasons: [
        'Extended length of stay not justified',
        'Duplicate imaging studies'
      ],
      aiAnalysis: {
        coverageScore: 70,
        riskScore: 30,
        recommendations: [
          'Primary procedure approved with pre-authorization',
          'Review post-operative care duration',
          'Justify additional imaging studies'
        ],
        flaggedItems: [
          {
            item: 'Extended hospital stay',
            reason: 'Exceeds standard 3-day recovery period',
            severity: 'high'
          },
          {
            item: 'Duplicate MRI studies',
            reason: 'Second MRI not medically justified',
            severity: 'medium'
          }
        ]
      },
      documents: [
        { type: 'Medical Records', name: 'Surgical Notes', status: 'verified' },
        { type: 'Pre-Auth', name: 'Authorization Letter', status: 'verified' },
        { type: 'Imaging', name: 'Pre-op MRI', status: 'verified' },
        { type: 'Imaging', name: 'Post-op MRI', status: 'verified' },
        { type: 'Discharge Summary', name: 'Final Summary', status: 'verified' }
      ],
      timeline: [
        { date: '2024-01-13T10:00:00Z', action: 'Claim Submitted', actor: 'Billing Department' },
        { date: '2024-01-13T15:30:00Z', action: 'AI Analysis Completed', actor: 'AEGLE AI' },
        { date: '2024-01-15T09:00:00Z', action: 'Under Review', actor: 'Thiqa Claims Team' },
        { date: '2024-01-18T14:20:00Z', action: 'Partially Approved', actor: 'Thiqa Claims Team', notes: 'Surgery and anesthesia approved, extended stay and duplicate imaging rejected' },
        { date: '2024-01-19T11:30:00Z', action: 'Payment Processed', actor: 'Thiqa Finance', notes: 'AED 20,500 approved amount' }
      ]
    }
  ];

  const mockPreAuths: PreAuth[] = [
    {
      id: 'PA001',
      patientId: 'P0001',
      patientName: 'Omar Al-Mansouri',
      patientMRN: 'NMC2024001',
      insuranceProvider: 'ADNIC',
      insurancePolicyNumber: 'ADN123456789',
      requestedAmount: 35000.00,
      currency: 'AED',
      serviceType: 'Cardiac Catheterization with Stent Placement',
      urgency: 'urgent',
      requestDate: '2024-01-20',
      status: 'approved',
      approvalDate: '2024-01-21',
      validUntil: '2024-02-21',
      authorizationNumber: 'AUTH-2024-001234',
      requestingProvider: 'Dr. Ahmed Al-Rashid',
      department: 'Cardiology',
      clinicalJustification: 'Patient presents with unstable angina and 90% LAD stenosis on angiography. Urgent intervention required to prevent MI.',
      aiAnalysis: {
        approvalProbability: 92,
        coverageAlignment: 88,
        recommendations: [
          'Strong clinical justification provided',
          'Procedure covered under cardiac benefits',
          'Urgent classification appropriate'
        ],
        requiredDocuments: [
          'Angiography report',
          'ECG results',
          'Cardiac enzyme levels',
          'Clinical assessment notes'
        ]
      },
      documents: [
        { type: 'Angiography Report', name: 'Cardiac Cath Report', status: 'verified' },
        { type: 'ECG', name: '12-Lead ECG', status: 'verified' },
        { type: 'Lab Results', name: 'Cardiac Enzymes', status: 'verified' },
        { type: 'Clinical Notes', name: 'Cardiology Assessment', status: 'verified' }
      ],
      timeline: [
        { date: '2024-01-20T14:00:00Z', action: 'Pre-Auth Requested', actor: 'Dr. Ahmed Al-Rashid' },
        { date: '2024-01-20T14:30:00Z', action: 'AI Analysis Completed', actor: 'AEGLE AI' },
        { date: '2024-01-20T16:00:00Z', action: 'Submitted to ADNIC', actor: 'Pre-Auth Team' },
        { date: '2024-01-21T10:30:00Z', action: 'Approved', actor: 'ADNIC Medical Review', notes: 'Urgent cardiac intervention approved for 30 days' }
      ]
    },
    {
      id: 'PA002',
      patientId: 'P0004',
      patientName: 'Fatima Al-Zahra',
      patientMRN: 'NMC2024004',
      insuranceProvider: 'DAMAN',
      insurancePolicyNumber: 'DMN555666777',
      requestedAmount: 45000.00,
      currency: 'AED',
      serviceType: 'Laparoscopic Cholecystectomy',
      urgency: 'routine',
      requestDate: '2024-01-18',
      status: 'pending',
      requestingProvider: 'Dr. Sarah Thompson',
      department: 'General Surgery',
      clinicalJustification: 'Patient has symptomatic cholelithiasis with recurrent biliary colic. Conservative management failed. Surgical intervention indicated.',
      aiAnalysis: {
        approvalProbability: 78,
        coverageAlignment: 82,
        recommendations: [
          'Procedure typically covered under surgical benefits',
          'Consider providing ultrasound evidence',
          'Document failed conservative treatment'
        ],
        requiredDocuments: [
          'Abdominal ultrasound',
          'HIDA scan (if available)',
          'Conservative treatment records',
          'Surgical consultation notes'
        ]
      },
      documents: [
        { type: 'Ultrasound', name: 'Abdominal US', status: 'verified' },
        { type: 'Clinical Notes', name: 'Surgery Consult', status: 'verified' },
        { type: 'Treatment Records', name: 'Conservative Therapy', status: 'uploaded' },
        { type: 'HIDA Scan', name: 'Hepatobiliary Scan', status: 'missing' }
      ],
      timeline: [
        { date: '2024-01-18T09:00:00Z', action: 'Pre-Auth Requested', actor: 'Dr. Sarah Thompson' },
        { date: '2024-01-18T09:30:00Z', action: 'AI Analysis Completed', actor: 'AEGLE AI' },
        { date: '2024-01-18T11:00:00Z', action: 'Submitted to DAMAN', actor: 'Pre-Auth Team' },
        { date: '2024-01-19T14:00:00Z', action: 'Additional Documents Requested', actor: 'DAMAN Medical Review', notes: 'HIDA scan required for approval' }
      ]
    }
  ];

  const mockInsuranceProviders: InsuranceProvider[] = [
    {
      id: 'INS001',
      name: 'ADNIC (Abu Dhabi National Insurance Company)',
      type: 'government',
      packages: [
        {
          id: 'ADN_GOLD',
          name: 'Gold Package',
          tier: 'Premium',
          coverage: {
            inpatient: 500000,
            outpatient: 50000,
            emergency: 100000,
            maternity: 25000,
            dental: 5000
          },
          exclusions: ['Cosmetic surgery', 'Experimental treatments'],
          preAuthRequired: ['Surgery', 'Advanced imaging', 'Expensive medications']
        }
      ],
      contactInfo: {
        phone: '+971-2-123-4567',
        email: 'claims@adnic.ae',
        website: 'www.adnic.ae',
        address: 'Abu Dhabi, UAE'
      },
      avgTAT: '5-7 days',
      approvalRate: 87.5
    },
    {
      id: 'INS002',
      name: 'DAMAN',
      type: 'government',
      packages: [
        {
          id: 'DMN_PREMIUM',
          name: 'Premium Package',
          tier: 'Premium',
          coverage: {
            inpatient: 750000,
            outpatient: 75000,
            emergency: 150000,
            maternity: 35000,
            dental: 7500
          },
          exclusions: ['Pre-existing conditions (first year)', 'Cosmetic procedures'],
          preAuthRequired: ['Major surgery', 'Specialized treatments', 'High-cost diagnostics']
        }
      ],
      contactInfo: {
        phone: '+971-4-987-6543',
        email: 'preauth@daman.ae',
        website: 'www.daman.ae',
        address: 'Dubai, UAE'
      },
      avgTAT: '3-5 days',
      approvalRate: 91.2
    },
    {
      id: 'INS003',
      name: 'Thiqa',
      type: 'government',
      packages: [
        {
          id: 'THQ_STANDARD',
          name: 'Standard Package',
          tier: 'Standard',
          coverage: {
            inpatient: 300000,
            outpatient: 30000,
            emergency: 75000,
            maternity: 15000,
            dental: 3000
          },
          exclusions: ['Fertility treatments', 'Weight loss surgery', 'Cosmetic procedures'],
          preAuthRequired: ['Surgery', 'Specialized consultations', 'Advanced diagnostics']
        }
      ],
      contactInfo: {
        phone: '+971-6-555-7890',
        email: 'authorization@thiqa.ae',
        website: 'www.thiqa.ae',
        address: 'Sharjah, UAE'
      },
      avgTAT: '7-10 days',
      approvalRate: 82.8
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API calls
        setTimeout(() => {
          setClaims(mockClaims);
          setPreAuths(mockPreAuths);
          setInsuranceProviders(mockInsuranceProviders);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading claims data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'partially_approved':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'under_review':
      case 'pending':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'submitted':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'draft':
        return 'text-slate-700 bg-slate-50 border-slate-200';
      case 'expired':
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'rejected':
      case 'expired':
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      case 'partially_approved':
        return <ExclamationTriangleIcon className="h-4 w-4 text-amber-600" />;
      case 'under_review':
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-blue-600" />;
      case 'submitted':
        return <DocumentCheckIcon className="h-4 w-4 text-purple-600" />;
      case 'draft':
        return <DocumentTextIcon className="h-4 w-4 text-slate-600" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-slate-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'urgent':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'routine':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-50';
    if (score >= 60) return 'text-amber-700 bg-amber-50';
    return 'text-red-700 bg-red-50';
  };

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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Claims & Pre-Authorization</h1>
        <p className="text-slate-600">AI-powered insurance claim approvals and reimbursement management</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Claims</p>
              <p className="text-3xl font-bold text-slate-900">{claims.length}</p>
            </div>
            <CreditCardIcon className="h-8 w-8 text-slate-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            AED {claims.reduce((sum, claim) => sum + claim.claimAmount, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Approved Claims</p>
              <p className="text-3xl font-bold text-green-600">
                {claims.filter(c => c.status === 'approved' || c.status === 'partially_approved').length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {Math.round((claims.filter(c => c.status === 'approved' || c.status === 'partially_approved').length / claims.length) * 100)}% approval rate
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pre-Auths</p>
              <p className="text-3xl font-bold text-blue-600">{preAuths.length}</p>
            </div>
            <DocumentCheckIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {preAuths.filter(p => p.status === 'approved').length} approved
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">AI Efficiency</p>
              <p className="text-3xl font-bold text-purple-600">94.2%</p>
            </div>
            <CpuChipIcon className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Processing accuracy
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'claims', name: 'Claims Management', icon: CreditCardIcon, count: claims.length },
              { id: 'preauth', name: 'Pre-Authorization', icon: DocumentCheckIcon, count: preAuths.length },
              { id: 'providers', name: 'Insurance Providers', icon: BuildingOfficeIcon, count: insuranceProviders.length },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon, count: null }
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
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Claims Management Tab */}
          {activeTab === 'claims' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Claims Management</h3>
                <button
                  onClick={() => setShowNewClaimModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4" />
                  New Claim
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search claims..."
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
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="partially_approved">Partially Approved</option>
                </select>
                <select
                  value={activeFilters.provider}
                  onChange={(e) => setActiveFilters({...activeFilters, provider: e.target.value})}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Providers</option>
                  <option value="ADNIC">ADNIC</option>
                  <option value="DAMAN">DAMAN</option>
                  <option value="Thiqa">Thiqa</option>
                </select>
                <select
                  value={activeFilters.type}
                  onChange={(e) => setActiveFilters({...activeFilters, type: e.target.value})}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="inpatient">Inpatient</option>
                  <option value="outpatient">Outpatient</option>
                  <option value="emergency">Emergency</option>
                  <option value="surgery">Surgery</option>
                  <option value="diagnostic">Diagnostic</option>
                </select>
              </div>

              {/* Claims List */}
              <div className="space-y-4">
                {claims.map((claim) => (
                  <div key={claim.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                    {/* Claim Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-slate-900">Claim #{claim.id}</h4>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                            {getStatusIcon(claim.status)}
                            {claim.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {claim.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                          <div>
                            <span className="font-medium">Patient:</span> {claim.patientName}
                          </div>
                          <div>
                            <span className="font-medium">Provider:</span> {claim.provider}
                          </div>
                          <div>
                            <span className="font-medium">Insurance:</span> {claim.insuranceProvider}
                          </div>
                          <div>
                            <span className="font-medium">Service Date:</span> {new Date(claim.serviceDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {claim.currency} {claim.claimAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">
                          {claim.preAuthRequired && (
                            <span className="flex items-center gap-1 justify-end">
                              <ShieldCheckIcon className="h-4 w-4" />
                              Pre-Auth: {claim.preAuthNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CpuChipIcon className="h-5 w-5 text-purple-600" />
                        <h5 className="font-medium text-purple-900">AI Analysis</h5>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-purple-700">Coverage Score:</span>
                          <div className={`text-lg font-bold ${getScoreColor(claim.aiAnalysis.coverageScore)}`}>
                            {claim.aiAnalysis.coverageScore}%
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-purple-700">Risk Score:</span>
                          <div className={`text-lg font-bold ${getScoreColor(100 - claim.aiAnalysis.riskScore)}`}>
                            {claim.aiAnalysis.riskScore}%
                          </div>
                        </div>
                      </div>
                      {claim.aiAnalysis.flaggedItems.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-purple-900">Flagged Items:</span>
                          {claim.aiAnalysis.flaggedItems.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <ExclamationTriangleIcon className={`h-4 w-4 mt-0.5 ${
                                item.severity === 'high' ? 'text-red-500' :
                                item.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                              }`} />
                              <div>
                                <span className="font-medium text-purple-900">{item.item}:</span>
                                <span className="text-purple-700 ml-1">{item.reason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Services */}
                    <div className="mb-4">
                      <h5 className="font-medium text-slate-900 mb-3">Services ({claim.services.length})</h5>
                      <div className="space-y-2">
                        {claim.services.slice(0, 3).map((service, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900">{service.code}</span>
                                {service.approved !== undefined && (
                                  service.approved ? 
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" /> :
                                    <XCircleIcon className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600">{service.description}</p>
                              {service.rejectionReason && (
                                <p className="text-xs text-red-600 mt-1">{service.rejectionReason}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-slate-900">
                                {claim.currency} {service.amount.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500">
                                Qty: {service.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                        {claim.services.length > 3 && (
                          <div className="text-center text-sm text-slate-500 py-2">
                            +{claim.services.length - 3} more services
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View Details
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
                        <CpuChipIcon className="h-4 w-4" />
                        Re-analyze
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm">
                        <ArrowPathIcon className="h-4 w-4" />
                        Resubmit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pre-Authorization Tab */}
          {activeTab === 'preauth' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Pre-Authorization Requests</h3>
                <button
                  onClick={() => setShowNewPreAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4" />
                  New Pre-Auth
                </button>
              </div>

              {/* Pre-Auth List */}
              <div className="space-y-4">
                {preAuths.map((preAuth) => (
                  <div key={preAuth.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                    {/* Pre-Auth Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-slate-900">Pre-Auth #{preAuth.id}</h4>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(preAuth.status)}`}>
                            {getStatusIcon(preAuth.status)}
                            {preAuth.status.toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getUrgencyColor(preAuth.urgency)}`}>
                            {preAuth.urgency.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                          <div>
                            <span className="font-medium">Patient:</span> {preAuth.patientName}
                          </div>
                          <div>
                            <span className="font-medium">Provider:</span> {preAuth.requestingProvider}
                          </div>
                          <div>
                            <span className="font-medium">Insurance:</span> {preAuth.insuranceProvider}
                          </div>
                          <div>
                            <span className="font-medium">Request Date:</span> {new Date(preAuth.requestDate).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">
                          <span className="font-medium">Service:</span> {preAuth.serviceType}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {preAuth.currency} {preAuth.requestedAmount.toLocaleString()}
                        </div>
                        {preAuth.authorizationNumber && (
                          <div className="text-sm text-green-600 font-medium">
                            Auth: {preAuth.authorizationNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CpuChipIcon className="h-5 w-5 text-blue-600" />
                        <h5 className="font-medium text-blue-900">AI Analysis</h5>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-blue-700">Approval Probability:</span>
                          <div className={`text-lg font-bold ${getScoreColor(preAuth.aiAnalysis.approvalProbability)}`}>
                            {preAuth.aiAnalysis.approvalProbability}%
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-blue-700">Coverage Alignment:</span>
                          <div className={`text-lg font-bold ${getScoreColor(preAuth.aiAnalysis.coverageAlignment)}`}>
                            {preAuth.aiAnalysis.coverageAlignment}%
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-blue-900">AI Recommendations:</span>
                        <ul className="mt-1 space-y-1">
                          {preAuth.aiAnalysis.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                              <LightBulbIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Clinical Justification */}
                    <div className="mb-4">
                      <h5 className="font-medium text-slate-900 mb-2">Clinical Justification</h5>
                      <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">
                        {preAuth.clinicalJustification}
                      </p>
                    </div>

                    {/* Documents Status */}
                    <div className="mb-4">
                      <h5 className="font-medium text-slate-900 mb-2">Required Documents</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {preAuth.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {doc.status === 'verified' ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            ) : doc.status === 'uploaded' ? (
                              <ClockIcon className="h-4 w-4 text-amber-500" />
                            ) : (
                              <XCircleIcon className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`${
                              doc.status === 'missing' ? 'text-red-600' : 'text-slate-700'
                            }`}>
                              {doc.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => setSelectedPreAuth(preAuth)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View Details
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
                        <CpuChipIcon className="h-4 w-4" />
                        Re-analyze
                      </button>
                      {preAuth.status === 'pending' && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm">
                          <BellIcon className="h-4 w-4" />
                          Follow Up
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insurance Providers Tab */}
          {activeTab === 'providers' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Insurance Providers ({insuranceProviders.length})</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {insuranceProviders.map((provider) => (
                  <div key={provider.id} className="border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">{provider.name}</h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {provider.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{provider.approvalRate}%</div>
                        <div className="text-xs text-slate-500">Approval Rate</div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <ClockIcon className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">Avg TAT: {provider.avgTAT}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{provider.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{provider.contactInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <GlobeAltIcon className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{provider.contactInfo.website}</span>
                      </div>
                    </div>

                    {provider.packages.map((pkg) => (
                      <div key={pkg.id} className="bg-slate-50 rounded-lg p-4">
                        <h5 className="font-medium text-slate-900 mb-2">{pkg.name} ({pkg.tier})</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-600">Inpatient:</span>
                            <span className="ml-1 font-medium">AED {pkg.coverage.inpatient.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Outpatient:</span>
                            <span className="ml-1 font-medium">AED {pkg.coverage.outpatient.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Emergency:</span>
                            <span className="ml-1 font-medium">AED {pkg.coverage.emergency.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Maternity:</span>
                            <span className="ml-1 font-medium">AED {pkg.coverage.maternity.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Claims & Pre-Auth Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Approval Rates by Provider */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Approval Rates by Provider</h4>
                  <div className="space-y-3">
                    {insuranceProviders.map((provider) => (
                      <div key={provider.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">{provider.name}</span>
                          <span className="font-medium">{provider.approvalRate}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${provider.approvalRate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Claims by Status */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Claims by Status</h4>
                  <div className="space-y-3">
                    {['approved', 'under_review', 'partially_approved', 'rejected'].map((status) => {
                      const count = claims.filter(c => c.status === status).length;
                      const percentage = (count / claims.length) * 100;
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 capitalize">{status.replace('_', ' ')}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                status === 'approved' ? 'bg-green-500' :
                                status === 'rejected' ? 'bg-red-500' :
                                status === 'partially_approved' ? 'bg-amber-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Performance Metrics */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h4 className="font-medium text-slate-900 mb-4">AI Performance</h4>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">94.2%</div>
                      <div className="text-sm text-slate-500">Processing Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">2.3h</div>
                      <div className="text-sm text-slate-500">Avg Processing Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">87%</div>
                      <div className="text-sm text-slate-500">Prediction Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="font-medium text-slate-900 mb-4">Monthly Claims Trends</h4>
                <div className="h-64 flex items-end justify-between gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => {
                    const height = Math.random() * 200 + 50;
                    return (
                      <div key={month} className="flex flex-col items-center">
                        <div
                          className="bg-blue-500 rounded-t w-12 transition-all duration-300 hover:bg-blue-600"
                          style={{ height: `${height}px` }}
                        ></div>
                        <span className="text-xs text-slate-500 mt-2">{month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}