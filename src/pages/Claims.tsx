import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CreditCardIcon,
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  CpuChipIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PlusIcon,
  LightBulbIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useGetInstanceQuery } from '../api/query';

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

  const ClaimSchema = import.meta.env.VITE_CLAIM_ID;
  const {data: Claim} = useGetInstanceQuery(ClaimSchema);

  const PreAuthSchema = import.meta.env.VITE_PREAUTH_ID;
  const {data: preAuth} = useGetInstanceQuery(PreAuthSchema);

  const InsuranceProviderSchema = import.meta.env.VITE_INSURANCE_PROVIDER_ID;
  const {data: insuranceProvidersData} = useGetInstanceQuery(InsuranceProviderSchema);

  useEffect(() => {
      try {
          setClaims(Claim || []);
          setPreAuths(preAuth || []);
          setInsuranceProviders(insuranceProvidersData || []);
          setLoading(false);
      } catch (error) {
        console.error('Error loading claims data:', error);
        setLoading(false);
      }
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