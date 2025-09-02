import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CodeBracketIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CpuChipIcon,
  LightBulbIcon,
  BeakerIcon,
  ClockIcon,
  HeartIcon,
  EyeIcon,
  ScissorsIcon,
  ClipboardDocumentListIcon,
  FunnelIcon,
  ArrowPathIcon,
  PlusIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { getInstance, getJoinInstance } from '../api/axios';

interface ICDCode {
  id: string;
  code: string;
  description: string;
  category: string;
  chapter: string;
  confidence: number;
  suggested: boolean;
  clinicalNotes: string;
  relatedCodes: string[];
  aiRecommendation: string;
  usage: number;
  accuracy: number;
}

interface CPTCode {
  id: string;
  code: string;
  description: string;
  category: string;
  rvu: number;
  suggested: boolean;
  modifiers: string[];
  bundlingRules: string[];
  aiRecommendation: string;
  reimbursementRate: number;
}

interface Patient {
  id: string;
  name: string;
  mrn: string;
  age: number;
  gender: string;
  diagnosis: string[];
  procedures: string[];
  medications: string[];
}

export function ICD() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient');
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [icdCodes, setIcdCodes] = useState<ICDCode[]>([]);
  const [cptCodes, setCptCodes] = useState<CPTCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('icd');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [clinicalText, setClinicalText] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  // Mock data
  const mockICDCodes: ICDCode[] = [
    {
      id: 'ICD001',
      code: 'E11.9',
      description: 'Type 2 diabetes mellitus without complications',
      category: 'Endocrine, nutritional and metabolic diseases',
      chapter: 'Chapter IV (E00-E89)',
      confidence: 0.95,
      suggested: true,
      clinicalNotes: 'Patient presents with well-controlled Type 2 diabetes, HbA1c 7.2%',
      relatedCodes: ['E11.65', 'E11.40', 'Z79.4'],
      aiRecommendation: 'Primary diagnosis supported by lab values and clinical presentation',
      usage: 1250,
      accuracy: 94.2
    },
    {
      id: 'ICD002',
      code: 'I10',
      description: 'Essential (primary) hypertension',
      category: 'Diseases of the circulatory system',
      chapter: 'Chapter IX (I00-I99)',
      confidence: 0.92,
      suggested: true,
      clinicalNotes: 'Blood pressure consistently elevated, on antihypertensive therapy',
      relatedCodes: ['I11.9', 'I12.9', 'I13.10'],
      aiRecommendation: 'Well-documented hypertension with medication management',
      usage: 980,
      accuracy: 96.8
    },
    {
      id: 'ICD003',
      code: 'Z87.891',
      description: 'Personal history of nicotine dependence',
      category: 'Factors influencing health status',
      chapter: 'Chapter XXI (Z00-Z99)',
      confidence: 0.78,
      suggested: false,
      clinicalNotes: 'Former smoker, quit 5 years ago',
      relatedCodes: ['F17.210', 'Z72.0'],
      aiRecommendation: 'Consider as secondary diagnosis for risk stratification',
      usage: 340,
      accuracy: 88.5
    },
    {
      id: 'ICD004',
      code: 'M79.3',
      description: 'Panniculitis, unspecified',
      category: 'Diseases of the musculoskeletal system',
      chapter: 'Chapter XIII (M00-M99)',
      confidence: 0.65,
      suggested: false,
      clinicalNotes: 'Patient reports muscle pain and inflammation',
      relatedCodes: ['M60.9', 'M79.1'],
      aiRecommendation: 'Requires additional clinical documentation for accuracy',
      usage: 125,
      accuracy: 72.3
    }
  ];

  const mockCPTCodes: CPTCode[] = [
    {
      id: 'CPT001',
      code: '99213',
      description: 'Office or outpatient visit, established patient, low complexity',
      category: 'Evaluation and Management',
      rvu: 1.3,
      suggested: true,
      modifiers: ['25', '57'],
      bundlingRules: ['Cannot be billed with 99214 on same day'],
      aiRecommendation: 'Appropriate for routine follow-up visit',
      reimbursementRate: 125.50
    },
    {
      id: 'CPT002',
      code: '80053',
      description: 'Comprehensive metabolic panel',
      category: 'Laboratory',
      rvu: 0.17,
      suggested: true,
      modifiers: ['90', '91'],
      bundlingRules: ['Includes glucose, BUN, creatinine, electrolytes'],
      aiRecommendation: 'Standard lab panel for diabetes monitoring',
      reimbursementRate: 28.75
    },
    {
      id: 'CPT003',
      code: '93000',
      description: 'Electrocardiogram, routine ECG with interpretation',
      category: 'Cardiovascular',
      rvu: 0.17,
      suggested: false,
      modifiers: ['26', 'TC'],
      bundlingRules: ['Professional and technical components available'],
      aiRecommendation: 'Consider if cardiac symptoms present',
      reimbursementRate: 45.20
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (patientId) {
          const [ICDCodes, CPTCodes] = await Promise.all([
            getInstance(import.meta.env.VITE_ICD_CODE, undefined),
            getInstance(import.meta.env.VITE_CPT_CODE, undefined),
          ]);
          setIcdCodes(ICDCodes);
          setCptCodes(CPTCodes);
        } else {
          // If no patientId, use mock data instead
          setIcdCodes(mockICDCodes);
          setCptCodes(mockCPTCodes);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading ICD data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, [patientId]);

  const handleAIAnalysis = () => {
    if (!clinicalText.trim()) return;
    
    // Simulate AI analysis
    setLoading(true);
    setTimeout(() => {
      const suggestions = [
        {
          type: 'ICD',
          code: 'E11.9',
          description: 'Type 2 diabetes mellitus without complications',
          confidence: 0.94,
          reasoning: 'Clinical text mentions diabetes management and HbA1c values'
        },
        {
          type: 'CPT',
          code: '99213',
          description: 'Office visit, established patient',
          confidence: 0.89,
          reasoning: 'Routine follow-up visit pattern identified'
        }
      ];
      setAiSuggestions(suggestions);
      setLoading(false);
    }, 1500);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-700 bg-green-50';
    if (confidence >= 0.7) return 'text-amber-700 bg-amber-50';
    return 'text-red-700 bg-red-50';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">ICD & CPT Coding</h1>
        <p className="text-slate-600">AI-powered medical coding and mapping system</p>
      </div>

      {/* Patient Context */}
      {patient && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                <p className="text-slate-600">MRN: {patient.mrn} • {patient.age}y {patient.gender}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-500">Active Codes:</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                  {icdCodes.filter(c => c.suggested).length + cptCodes.filter(c => c.suggested).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CpuChipIcon className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">AI Coding Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CpuChipIcon className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">AI-Powered Code Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Clinical Documentation
            </label>
            <textarea
              value={clinicalText}
              onChange={(e) => setClinicalText(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter clinical notes, diagnosis, procedures, or treatment details..."
            />
            <button
              onClick={handleAIAnalysis}
              disabled={!clinicalText.trim() || loading}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 transition-colors duration-200"
            >
              <CpuChipIcon className="h-4 w-4" />
              {loading ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">AI Suggestions</h4>
            {aiSuggestions.length > 0 ? (
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            suggestion.type === 'ICD' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {suggestion.type}
                          </span>
                          <span className="font-medium text-slate-900">{suggestion.code}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{suggestion.description}</p>
                        <p className="text-xs text-slate-500 mt-1">{suggestion.reasoning}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                        {Math.round(suggestion.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <LightBulbIcon className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Enter clinical text to get AI-powered coding suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'icd', name: 'ICD-10 Codes', icon: BookOpenIcon, count: icdCodes.length },
              { id: 'cpt', name: 'CPT Codes', icon: ClipboardDocumentListIcon, count: cptCodes.length },
              { id: 'analytics', name: 'Coding Analytics', icon: ChartBarIcon, count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* ICD Codes Tab */}
          {activeTab === 'icd' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">ICD-10 Diagnosis Codes</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-slate-600">AI Suggested</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                    <span className="text-slate-600">Additional</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ICD codes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-64"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Endocrine, nutritional and metabolic diseases">Endocrine & Metabolic</option>
                  <option value="Diseases of the circulatory system">Circulatory System</option>
                  <option value="Factors influencing health status">Health Status Factors</option>
                  <option value="Diseases of the musculoskeletal system">Musculoskeletal</option>
                </select>
              </div>

              {/* ICD Codes List */}
              <div className="space-y-4">
                {icdCodes.map((code) => (
                  <div key={code.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-slate-900">{code.code}</h4>
                          {code.suggested && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              AI Suggested
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(code.confidence)}`}>
                            {Math.round(code.confidence * 100)}% Confidence
                          </span>
                        </div>
                        <p className="text-slate-700 mb-2">{code.description}</p>
                        <div className="text-sm text-slate-600 mb-3">
                          <span className="font-medium">Category:</span> {code.category}
                        </div>
                        <div className="text-sm text-slate-600 mb-3">
                          <span className="font-medium">Chapter:</span> {code.chapter}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500 mb-1">Usage: {code.usage}</div>
                        <div className="text-sm text-slate-500">Accuracy: {code.accuracy}%</div>
                      </div>
                    </div>

                    {/* Clinical Notes */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <h5 className="font-medium text-blue-900 mb-1">Clinical Notes</h5>
                      <p className="text-blue-800 text-sm">{code.clinicalNotes}</p>
                    </div>

                    {/* AI Recommendation */}
                    <div className="bg-purple-50 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <CpuChipIcon className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-purple-900 mb-1">AI Recommendation</h5>
                          <p className="text-purple-800 text-sm">{code.aiRecommendation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Related Codes */}
                    <div className="mb-4">
                      <h5 className="font-medium text-slate-900 mb-2">Related Codes</h5>
                      <div className="flex flex-wrap gap-2">
                        {code.relatedCodes.map((relatedCode, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                            {relatedCode}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                        <CheckCircleIcon className="h-4 w-4" />
                        Accept Code
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm">
                        <EyeIcon className="h-4 w-4" />
                        View Details
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
                        <CpuChipIcon className="h-4 w-4" />
                        Re-analyze
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CPT Codes Tab */}
          {activeTab === 'cpt' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">CPT Procedure Codes</h3>
                <div className="text-sm text-slate-500">
                  Total RVU: {cptCodes.reduce((sum, code) => sum + code.rvu, 0).toFixed(2)}
                </div>
              </div>

              {/* CPT Codes List */}
              <div className="space-y-4">
                {cptCodes.map((code) => (
                  <div key={code.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-slate-900">{code.code}</h4>
                          {code.suggested && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              AI Suggested
                            </span>
                          )}
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {code.category}
                          </span>
                        </div>
                        <p className="text-slate-700 mb-3">{code.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          AED {code.reimbursementRate.toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-500">RVU: {code.rvu}</div>
                      </div>
                    </div>

                    {/* Modifiers */}
                    <div className="mb-4">
                      <h5 className="font-medium text-slate-900 mb-2">Available Modifiers</h5>
                      <div className="flex flex-wrap gap-2">
                        {code.modifiers.map((modifier, idx) => (
                          <span key={idx} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                            {modifier}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bundling Rules */}
                    <div className="mb-4">
                      <h5 className="font-medium text-slate-900 mb-2">Bundling Rules</h5>
                      <ul className="space-y-1">
                        {code.bundlingRules.map((rule, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                            <InformationCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Recommendation */}
                    <div className="bg-purple-50 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <CpuChipIcon className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-purple-900 mb-1">AI Recommendation</h5>
                          <p className="text-purple-800 text-sm">{code.aiRecommendation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                        <CheckCircleIcon className="h-4 w-4" />
                        Accept Code
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm">
                        <EyeIcon className="h-4 w-4" />
                        View Details
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm">
                        <PlusIcon className="h-4 w-4" />
                        Add Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Coding Analytics & Performance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Coding Accuracy</p>
                      <p className="text-3xl font-bold text-green-600">94.2%</p>
                    </div>
                    <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    AI-assisted coding
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Processing Time</p>
                      <p className="text-3xl font-bold text-blue-600">2.3s</p>
                    </div>
                    <ClockIcon className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Average per case
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Cost Savings</p>
                      <p className="text-3xl font-bold text-purple-600">AED 45K</p>
                    </div>
                    <ChartBarIcon className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Monthly reduction
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Compliance Rate</p>
                      <p className="text-3xl font-bold text-amber-600">98.7%</p>
                    </div>
                    <ShieldCheckIcon className="h-8 w-8 text-amber-500" />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Regulatory compliance
                  </div>
                </div>
              </div>

              {/* Top Codes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Most Used ICD Codes</h4>
                  <div className="space-y-3">
                    {icdCodes.slice(0, 5).map((code) => (
                      <div key={code.id} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-slate-900">{code.code}</span>
                          <p className="text-sm text-slate-600">{code.description.substring(0, 40)}...</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-slate-900">{code.usage}</div>
                          <div className="text-xs text-slate-500">{code.accuracy}% accuracy</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Top Revenue CPT Codes</h4>
                  <div className="space-y-3">
                    {cptCodes.slice(0, 5).map((code) => (
                      <div key={code.id} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-slate-900">{code.code}</span>
                          <p className="text-sm text-slate-600">{code.description.substring(0, 40)}...</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">AED {code.reimbursementRate}</div>
                          <div className="text-xs text-slate-500">{code.rvu} RVU</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}