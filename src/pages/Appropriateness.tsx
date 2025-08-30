import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockApi } from '../utils/mockApi';
import {
  DocumentMagnifyingGlassIcon,
  BeakerIcon,
  EyeIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  UserIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  HeartIcon,
  CpuChipIcon,
  ChartBarIcon,
  LightBulbIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  ClockIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  name: string;
  mrn: string;
  age: number;
  gender: string;
  weight: string;
  height: string;
  allergies: Array<{ allergen: string; severity: string; reaction: string }>;
  currentMedications: Array<{ medication: string; dosage: string; frequency: string; route: string }>;
  chronicConditions: Array<{ condition: string; icdCode: string }>;
  labResults: Array<{ test: string; value: string; unit: string; status: string; date: string }>;
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenSaturation: string;
    weight: string;
    height: string;
    bmi: string;
  };
}

interface MedicationReview {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  route: string;
  indication: string;
  prescriber: string;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  appropriatenessScore: number;
  issues: Array<{
    type: 'allergy' | 'interaction' | 'duplication' | 'contraindication' | 'dosing' | 'formulary';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }>;
  alternatives?: Array<{
    medication: string;
    rationale: string;
    costDifference: string;
  }>;
}

interface ImagingGuideline {
  id: string;
  name: string;
  category: string;
  description: string;
  criteria: Array<{
    factor: string;
    required: boolean;
    options: string[];
  }>;
  recommendation: string;
  evidence: string;
}

interface LabGuideline {
  id: string;
  test: string;
  category: string;
  indications: string[];
  contraindications: string[];
  frequency: string;
  costEffectiveness: string;
}

export function Appropriateness() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient');
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('medication');
  const [loading, setLoading] = useState(true);
  const [selectedMedication, setSelectedMedication] = useState<MedicationReview | null>(null);
  const [selectedGuideline, setSelectedGuideline] = useState<ImagingGuideline | null>(null);
  const [clinicalFactors, setClinicalFactors] = useState<Record<string, string>>({});
  const [appropriatenessResult, setAppropriatenessResult] = useState<string | null>(null);

  // Mock medication reviews
  const medicationReviews: MedicationReview[] = [
    {
      id: 'MR001',
      medication: 'Warfarin',
      dosage: '5mg',
      frequency: 'Daily',
      route: 'Oral',
      indication: 'Atrial Fibrillation',
      prescriber: 'Dr. Ahmed Al-Rashid',
      status: 'pending',
      appropriatenessScore: 65,
      issues: [
        {
          type: 'interaction',
          severity: 'critical',
          description: 'Dangerous interaction with concurrent Aspirin therapy',
          recommendation: 'Consider alternative antiplatelet or adjust Warfarin dosing with increased monitoring'
        },
        {
          type: 'dosing',
          severity: 'medium',
          description: 'Dose may be high for patient age (>75 years)',
          recommendation: 'Consider reducing initial dose to 2.5mg daily'
        }
      ],
      alternatives: [
        {
          medication: 'Apixaban 5mg BID',
          rationale: 'Lower bleeding risk, no routine monitoring required',
          costDifference: '+AED 180/month'
        },
        {
          medication: 'Rivaroxaban 20mg daily',
          rationale: 'Once daily dosing, predictable anticoagulation',
          costDifference: '+AED 150/month'
        }
      ]
    },
    {
      id: 'MR002',
      medication: 'Metformin',
      dosage: '1000mg',
      frequency: 'BID',
      route: 'Oral',
      indication: 'Type 2 Diabetes',
      prescriber: 'Dr. Ahmed Al-Rashid',
      status: 'rejected',
      appropriatenessScore: 25,
      issues: [
        {
          type: 'contraindication',
          severity: 'critical',
          description: 'Contraindicated with eGFR <30 mL/min/1.73m²',
          recommendation: 'Discontinue immediately. Consider insulin or DPP-4 inhibitor'
        },
        {
          type: 'dosing',
          severity: 'high',
          description: 'Current dose inappropriate for renal function',
          recommendation: 'If eGFR 30-45, maximum dose should be 1000mg daily'
        }
      ],
      alternatives: [
        {
          medication: 'Sitagliptin 25mg daily',
          rationale: 'Renal dose adjustment, safe in CKD',
          costDifference: '+AED 120/month'
        },
        {
          medication: 'Insulin glargine',
          rationale: 'No renal contraindications, effective glucose control',
          costDifference: '+AED 200/month'
        }
      ]
    },
    {
      id: 'MR003',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Daily',
      route: 'Oral',
      indication: 'Hypertension',
      prescriber: 'Dr. Ahmed Al-Rashid',
      status: 'approved',
      appropriatenessScore: 90,
      issues: [
        {
          type: 'dosing',
          severity: 'low',
          description: 'Monitor potassium levels closely',
          recommendation: 'Check K+ in 1-2 weeks after initiation'
        }
      ]
    },
    {
      id: 'MR004',
      medication: 'Omeprazole',
      dosage: '40mg',
      frequency: 'Daily',
      route: 'Oral',
      indication: 'GERD',
      prescriber: 'Dr. Sarah Thompson',
      status: 'modified',
      appropriatenessScore: 75,
      issues: [
        {
          type: 'duplication',
          severity: 'medium',
          description: 'Patient already on H2 blocker (Ranitidine)',
          recommendation: 'Discontinue Ranitidine or reduce PPI dose'
        },
        {
          type: 'dosing',
          severity: 'low',
          description: 'High dose for maintenance therapy',
          recommendation: 'Consider reducing to 20mg daily after 4-8 weeks'
        }
      ]
    },
    {
      id: 'MR005',
      medication: 'Atorvastatin',
      dosage: '80mg',
      frequency: 'Daily',
      route: 'Oral',
      indication: 'Hyperlipidemia',
      prescriber: 'Dr. Ahmed Al-Rashid',
      status: 'pending',
      appropriatenessScore: 80,
      issues: [
        {
          type: 'interaction',
          severity: 'medium',
          description: 'Potential interaction with Warfarin (increased bleeding risk)',
          recommendation: 'Monitor INR more frequently'
        },
        {
          type: 'formulary',
          severity: 'low',
          description: 'High-intensity statin - ensure clinical justification',
          recommendation: 'Document cardiovascular risk assessment'
        }
      ]
    }
  ];

  // Mock imaging guidelines
  const imagingGuidelines: ImagingGuideline[] = [
    {
      id: 'IMG001',
      name: 'Canadian CT Head Rule',
      category: 'Neuroimaging',
      description: 'Decision rule for CT head in minor head injury',
      criteria: [
        {
          factor: 'Age',
          required: true,
          options: ['≥65 years', '<65 years']
        },
        {
          factor: 'GCS Score',
          required: true,
          options: ['15', '14', '13', '<13']
        },
        {
          factor: 'Vomiting',
          required: false,
          options: ['≥2 episodes', '1 episode', 'None']
        },
        {
          factor: 'Amnesia',
          required: false,
          options: ['>30 minutes', '≤30 minutes', 'None']
        },
        {
          factor: 'Dangerous Mechanism',
          required: false,
          options: ['Pedestrian struck', 'Fall from height', 'High-speed MVA', 'Other']
        }
      ],
      recommendation: 'CT indicated if any high-risk factor present',
      evidence: 'Sensitivity 100% for need for neurological intervention'
    },
    {
      id: 'IMG002',
      name: 'Pulmonary Embolism Rule-out Criteria (PERC)',
      category: 'Chest Imaging',
      description: 'Rule to exclude PE without further testing',
      criteria: [
        {
          factor: 'Age',
          required: true,
          options: ['<50 years', '≥50 years']
        },
        {
          factor: 'Heart Rate',
          required: true,
          options: ['<100 bpm', '≥100 bpm']
        },
        {
          factor: 'O2 Saturation',
          required: true,
          options: ['≥95%', '<95%']
        },
        {
          factor: 'Hemoptysis',
          required: false,
          options: ['Present', 'Absent']
        },
        {
          factor: 'Estrogen Use',
          required: false,
          options: ['Yes', 'No']
        },
        {
          factor: 'Prior DVT/PE',
          required: false,
          options: ['Yes', 'No']
        }
      ],
      recommendation: 'If all PERC criteria negative, PE ruled out',
      evidence: 'Negative predictive value >99% when pre-test probability <15%'
    },
    {
      id: 'IMG003',
      name: 'ACR Appropriateness Criteria - Acute Chest Pain',
      category: 'Cardiac Imaging',
      description: 'Imaging recommendations for acute chest pain',
      criteria: [
        {
          factor: 'Chest Pain Type',
          required: true,
          options: ['Typical angina', 'Atypical angina', 'Non-cardiac']
        },
        {
          factor: 'Risk Factors',
          required: true,
          options: ['High risk', 'Intermediate risk', 'Low risk']
        },
        {
          factor: 'ECG Changes',
          required: true,
          options: ['ST elevation', 'ST depression', 'T-wave changes', 'Normal']
        },
        {
          factor: 'Troponin',
          required: true,
          options: ['Elevated', 'Normal', 'Not done']
        }
      ],
      recommendation: 'CT coronary angiography for intermediate risk with normal troponin',
      evidence: 'High sensitivity and specificity for coronary artery disease'
    }
  ];

  // Mock lab guidelines
  const labGuidelines: LabGuideline[] = [
    {
      id: 'LAB001',
      test: 'HbA1c',
      category: 'Diabetes Monitoring',
      indications: ['Diabetes diagnosis', 'Glycemic control monitoring', 'Pre-diabetes screening'],
      contraindications: ['Hemoglobinopathies', 'Recent blood transfusion', 'Severe anemia'],
      frequency: 'Every 3-6 months for diabetes, annually for pre-diabetes',
      costEffectiveness: 'High - prevents long-term complications'
    },
    {
      id: 'LAB002',
      test: 'Lipid Panel',
      category: 'Cardiovascular Risk',
      indications: ['Cardiovascular risk assessment', 'Statin therapy monitoring', 'Family history of CAD'],
      contraindications: ['Recent acute illness', 'Non-fasting state (for LDL calculation)'],
      frequency: 'Every 5 years for low risk, annually for high risk',
      costEffectiveness: 'High - guides preventive therapy'
    },
    {
      id: 'LAB003',
      test: 'Thyroid Function (TSH)',
      category: 'Endocrine',
      indications: ['Thyroid dysfunction symptoms', 'Routine screening >60 years', 'Medication monitoring'],
      contraindications: ['Recent iodine contrast exposure', 'Severe illness'],
      frequency: 'Every 5 years for screening, 6-8 weeks after dose changes',
      costEffectiveness: 'Moderate - high prevalence in elderly'
    },
    {
      id: 'LAB004',
      test: 'Complete Blood Count',
      category: 'General Screening',
      indications: ['Anemia evaluation', 'Infection screening', 'Medication monitoring'],
      contraindications: ['None significant'],
      frequency: 'As clinically indicated, annually for high-risk patients',
      costEffectiveness: 'High - broad diagnostic utility'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (patientId) {
          const patientData = await mockApi.getPatientById(patientId);
          setPatient(patientData);
        }
      } catch (error) {
        console.error('Error loading patient data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [patientId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'modified':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'pending':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
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
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-50';
    if (score >= 60) return 'text-amber-700 bg-amber-50';
    return 'text-red-700 bg-red-50';
  };

  const handleAppropriatenessCheck = (guideline: ImagingGuideline) => {
    // Simple logic for demonstration
    const factors = Object.keys(clinicalFactors);
    if (factors.length === 0) {
      setAppropriatenessResult('Please select clinical factors to assess appropriateness');
      return;
    }

    // Mock appropriateness logic
    if (guideline.id === 'IMG001') {
      const age = clinicalFactors['Age'];
      const gcs = clinicalFactors['GCS Score'];
      const vomiting = clinicalFactors['Vomiting'];
      
      if (age === '≥65 years' || gcs !== '15' || vomiting === '≥2 episodes') {
        setAppropriatenessResult('CT HEAD INDICATED - High risk factors present');
      } else {
        setAppropriatenessResult('CT HEAD NOT INDICATED - Low risk, consider observation');
      }
    } else {
      setAppropriatenessResult('Assessment completed based on selected criteria');
    }
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Appropriateness Check</h1>
        <p className="text-slate-600">Clinical appropriateness review for medications, imaging, and laboratory tests</p>
      </div>

      {/* Patient Context */}
      {patient && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                <p className="text-slate-600">MRN: {patient.mrn} • {patient.age}y {patient.gender}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span>Weight: {patient.vitals.weight}</span>
                  <span>BMI: {patient.vitals.bmi}</span>
                  <span>Allergies: {patient.allergies.length}</span>
                  <span>Medications: {patient.currentMedications.length}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-500">Reviews Pending:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {medicationReviews.filter(r => r.status === 'pending').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CpuChipIcon className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">AI Review Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Medication Reviews</p>
              <p className="text-3xl font-bold text-blue-600">{medicationReviews.length}</p>
            </div>
            <BeakerIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Pending: {medicationReviews.filter(r => r.status === 'pending').length} | 
            Approved: {medicationReviews.filter(r => r.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Imaging Guidelines</p>
              <p className="text-3xl font-bold text-green-600">{imagingGuidelines.length}</p>
            </div>
            <EyeIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Evidence-based protocols
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Lab Guidelines</p>
              <p className="text-3xl font-bold text-purple-600">{labGuidelines.length}</p>
            </div>
            <ClipboardDocumentCheckIcon className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Cost-effective ordering
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Compliance Rate</p>
              <p className="text-3xl font-bold text-emerald-600">94.2%</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Guideline adherence
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'medication', name: 'Medication Review', icon: BeakerIcon },
              { id: 'imaging', name: 'Imaging Guidelines', icon: EyeIcon },
              { id: 'laboratory', name: 'Laboratory Tests', icon: ClipboardDocumentCheckIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
          {/* Medication Review Tab */}
          {activeTab === 'medication' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Medication Appropriateness Review</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-slate-600">Approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-slate-600">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-slate-600">Rejected</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {medicationReviews.map((review) => (
                  <div key={review.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-slate-900">{review.medication}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
                            {review.status.toUpperCase()}
                          </span>
                          <div className={`px-2 py-1 rounded-lg text-sm font-medium ${getScoreColor(review.appropriatenessScore)}`}>
                            Score: {review.appropriatenessScore}%
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
                          <div>
                            <span className="font-medium">Dosage:</span> {review.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span> {review.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Route:</span> {review.route}
                          </div>
                          <div>
                            <span className="font-medium">Indication:</span> {review.indication}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">Prescribed by: {review.prescriber}</p>
                      </div>
                    </div>

                    {/* Issues */}
                    {review.issues.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-slate-900 mb-3">Identified Issues</h5>
                        <div className="space-y-3">
                          {review.issues.map((issue, idx) => (
                            <div key={idx} className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}>
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {issue.severity === 'critical' ? (
                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                                  ) : issue.severity === 'high' ? (
                                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
                                  ) : (
                                    <InformationCircleIcon className="h-5 w-5 text-amber-600" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium uppercase tracking-wide">
                                      {issue.type.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs font-medium uppercase">
                                      {issue.severity}
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium mb-1">{issue.description}</p>
                                  <div className="bg-white bg-opacity-50 rounded p-2 mt-2">
                                    <div className="flex items-start gap-2">
                                      <LightBulbIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                      <p className="text-sm">{issue.recommendation}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Alternatives */}
                    {review.alternatives && review.alternatives.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-slate-900 mb-3">Alternative Medications</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {review.alternatives.map((alt, idx) => (
                            <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h6 className="font-medium text-blue-900 mb-1">{alt.medication}</h6>
                              <p className="text-sm text-blue-800 mb-2">{alt.rationale}</p>
                              <p className="text-xs text-blue-600">Cost impact: {alt.costDifference}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      {review.status === 'pending' && (
                        <>
                          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                            <CheckCircleIcon className="h-4 w-4" />
                            Approve
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm">
                            <DocumentTextIcon className="h-4 w-4" />
                            Modify
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm">
                            <XCircleIcon className="h-4 w-4" />
                            Reject
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setSelectedMedication(review)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm"
                      >
                        <MagnifyingGlassIcon className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Imaging Guidelines Tab */}
          {activeTab === 'imaging' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Imaging Appropriateness Guidelines</h3>
                <div className="text-sm text-slate-500">Evidence-based decision support</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Guidelines List */}
                <div className="space-y-4">
                  {imagingGuidelines.map((guideline) => (
                    <div 
                      key={guideline.id} 
                      className={`border rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedGuideline?.id === guideline.id ? 'border-green-500 bg-green-50' : 'border-slate-200'
                      }`}
                      onClick={() => setSelectedGuideline(guideline)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-slate-900">{guideline.name}</h4>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          {guideline.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{guideline.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheckIcon className="h-4 w-4" />
                        {guideline.evidence}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Guideline Assessment */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  {selectedGuideline ? (
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">
                        {selectedGuideline.name} Assessment
                      </h4>
                      
                      <div className="space-y-4 mb-6">
                        {selectedGuideline.criteria.map((criterion, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <label className="font-medium text-slate-900">{criterion.factor}</label>
                              {criterion.required && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Required</span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {criterion.options.map((option, optIdx) => (
                                <label key={optIdx} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="radio"
                                    name={criterion.factor}
                                    value={option}
                                    checked={clinicalFactors[criterion.factor] === option}
                                    onChange={(e) => setClinicalFactors({
                                      ...clinicalFactors,
                                      [criterion.factor]: e.target.value
                                    })}
                                    className="text-green-600 focus:ring-green-500"
                                  />
                                  {option}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleAppropriatenessCheck(selectedGuideline)}
                        className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                      >
                        Assess Appropriateness
                      </button>

                      {appropriatenessResult && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h5 className="font-medium text-blue-900 mb-1">Assessment Result</h5>
                              <p className="text-blue-800 text-sm">{appropriatenessResult}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <EyeIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                      <h4 className="text-lg font-medium text-slate-900 mb-2">Select a Guideline</h4>
                      <p className="text-slate-600">Choose an imaging guideline to assess appropriateness</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Laboratory Tests Tab */}
          {activeTab === 'laboratory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Laboratory Test Guidelines</h3>
                <div className="text-sm text-slate-500">Cost-effective ordering protocols</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {labGuidelines.map((guideline) => (
                  <div key={guideline.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-slate-900">{guideline.test}</h4>
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                        {guideline.category}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-slate-900 mb-2">Indications</h5>
                        <ul className="space-y-1">
                          {guideline.indications.map((indication, idx) => (
                            <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {indication}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {guideline.contraindications.length > 0 && (
                        <div>
                          <h5 className="font-medium text-slate-900 mb-2">Contraindications</h5>
                          <ul className="space-y-1">
                            {guideline.contraindications.map((contraindication, idx) => (
                              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <XCircleIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                {contraindication}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">Frequency: {guideline.frequency}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ChartBarIcon className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">Cost-effectiveness: {guideline.costEffectiveness}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
                        Order Test
                      </button>
                      <button className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm">
                        View Protocol
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medication Detail Modal */}
      {selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Detailed Medication Review: {selectedMedication.medication}
              </h3>
              <button
                onClick={() => setSelectedMedication(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Medication Details */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Prescription Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Medication:</span>
                      <span className="font-medium">{selectedMedication.medication}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dosage:</span>
                      <span className="font-medium">{selectedMedication.dosage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Frequency:</span>
                      <span className="font-medium">{selectedMedication.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Route:</span>
                      <span className="font-medium">{selectedMedication.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Indication:</span>
                      <span className="font-medium">{selectedMedication.indication}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Prescriber:</span>
                      <span className="font-medium">{selectedMedication.prescriber}</span>
                    </div>
                  </div>
                </div>

                {/* Patient Factors */}
                {patient && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Patient-Specific Factors</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Age:</span>
                        <span className="font-medium">{patient.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Weight:</span>
                        <span className="font-medium">{patient.vitals.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">BMI:</span>
                        <span className="font-medium">{patient.vitals.bmi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Allergies:</span>
                        <span className="font-medium">{patient.allergies.length} documented</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Current Meds:</span>
                        <span className="font-medium">{patient.currentMedications.length} active</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Review Results */}
              <div className="space-y-4">
                <div className={`rounded-lg p-4 ${getScoreColor(selectedMedication.appropriatenessScore)}`}>
                  <h4 className="font-medium mb-2">Appropriateness Score</h4>
                  <div className="text-3xl font-bold mb-2">{selectedMedication.appropriatenessScore}%</div>
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div
                      className="bg-current h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedMedication.appropriatenessScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Detailed Issues */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">Detailed Analysis</h4>
                  {selectedMedication.issues.map((issue, idx) => (
                    <div key={idx} className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {issue.severity === 'critical' ? (
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                          ) : (
                            <InformationCircleIcon className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">
                            {issue.type.replace('_', ' ').toUpperCase()} - {issue.severity.toUpperCase()}
                          </div>
                          <p className="text-sm mb-2">{issue.description}</p>
                          <div className="bg-white bg-opacity-50 rounded p-2">
                            <p className="text-sm font-medium">Recommendation:</p>
                            <p className="text-sm">{issue.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Approve Medication
              </button>
              <button className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
                Request Modification
              </button>
              <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                Reject Medication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}