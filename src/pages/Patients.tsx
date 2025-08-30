import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockApi } from '../utils/mockApi';
import {
  MagnifyingGlassIcon,
  UserIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
  CreditCardIcon,
  HeartIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  IdentificationIcon,
  GlobeAltIcon,
  HomeIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  mrn: string;
  name: string;
  nameArabic?: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  phone: string;
  email: string;
  bloodType: string;
  maritalStatus: string;
  occupation: string;
  preferredLanguage: string;
  religion: string;
  riskFlags: string[];
  lastVisit: string;
  nextAppointment: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insuranceNumber: string;
  insuranceTier: string;
  allergies: Array<{
    allergen: string;
    severity: string;
    reaction: string;
    dateReported: string;
  }>;
  chronicConditions: Array<{
    condition: string;
    icdCode: string;
    diagnosedDate: string;
    status: string;
    severity: string;
  }>;
  currentMedications: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    route: string;
    indication: string;
  }>;
  vitals: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    oxygenSaturation: string;
    weight: string;
    height: string;
    bmi: string;
    painScore: string;
    lastRecorded: string;
  };
  labResults: Array<{
    test: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: string;
    date: string;
  }>;
  careTeam: Array<{
    name: string;
    role: string;
    department: string;
  }>;
}

export function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    demographics: true,
    clinical: false,
    medications: false,
    labs: false,
    careTeam: false
  });

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await mockApi.getPatients();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  const getRiskFlagColor = (flag: string) => {
    if (flag.includes('Diabetes') || flag.includes('Hypertension')) {
      return 'bg-amber-100 text-amber-800';
    }
    if (flag.includes('Pregnancy')) {
      return 'bg-purple-100 text-purple-800';
    }
    if (flag.includes('COPD') || flag.includes('Fall Risk')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'severe':
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'moderate':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'mild':
      case 'low':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getLabStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'high':
      case 'elevated':
        return 'text-red-700 bg-red-50';
      case 'low':
        return 'text-amber-700 bg-amber-50';
      case 'normal':
      case 'therapeutic':
        return 'text-green-700 bg-green-50';
      default:
        return 'text-slate-700 bg-slate-50';
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Management</h1>
        <p className="text-slate-600">Search and manage patient records with comprehensive profiles</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search by patient name or MRN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Patients ({filteredPatients.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-200">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-6 hover:bg-slate-50 cursor-pointer transition-colors duration-200 ${
                    selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{patient.name}</h3>
                        {patient.nameArabic && (
                          <span className="text-sm text-slate-500 font-arabic">{patient.nameArabic}</span>
                        )}
                        <span className="text-sm text-slate-500">MRN: {patient.mrn}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          {patient.age}y, {patient.gender}
                        </span>
                        <span className="flex items-center gap-1">
                          <HeartIcon className="h-4 w-4" />
                          {patient.bloodType}
                        </span>
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="h-4 w-4" />
                          {patient.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <GlobeAltIcon className="h-4 w-4" />
                          {patient.nationality}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <span>{patient.insuranceProvider} - {patient.insuranceTier}</span>
                        <span>Dr. {patient.primaryPhysician}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {patient.riskFlags.map((flag, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskFlagColor(flag)}`}
                          >
                            <ExclamationTriangleIcon className="h-3 w-3" />
                            {flag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="h-3 w-3" />
                          Last: {new Date(patient.lastVisit).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="h-3 w-3" />
                          Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Details Panel */}
        <div className="lg:col-span-1">
          {selectedPatient ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Patient Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h3>
                    {selectedPatient.nameArabic && (
                      <p className="text-sm text-slate-600 font-arabic mb-1">{selectedPatient.nameArabic}</p>
                    )}
                    <p className="text-sm text-slate-600">MRN: {selectedPatient.mrn}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskFlagColor(selectedPatient.riskFlags[0] || 'Normal')}`}>
                        {selectedPatient.riskFlags.length} Risk Factors
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Last visit: {new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-slate-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview', icon: UserIcon },
                    { id: 'clinical', name: 'Clinical', icon: HeartIcon },
                    { id: 'medications', name: 'Medications', icon: BeakerIcon },
                    { id: 'labs', name: 'Labs', icon: ClipboardDocumentListIcon }
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

              {/* Tab Content */}
              <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Demographics */}
                    <div>
                      <button
                        onClick={() => toggleSection('demographics')}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <IdentificationIcon className="h-5 w-5" />
                          Demographics
                        </h4>
                        {expandedSections.demographics ? (
                          <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-slate-400" />
                        )}
                      </button>
                      {expandedSections.demographics && (
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Date of Birth:</span>
                            <span className="ml-2 font-medium">{new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Age:</span>
                            <span className="ml-2 font-medium">{selectedPatient.age} years</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Gender:</span>
                            <span className="ml-2 font-medium">{selectedPatient.gender}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Blood Type:</span>
                            <span className="ml-2 font-medium">{selectedPatient.bloodType}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Nationality:</span>
                            <span className="ml-2 font-medium">{selectedPatient.nationality}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Marital Status:</span>
                            <span className="ml-2 font-medium">{selectedPatient.maritalStatus}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Occupation:</span>
                            <span className="ml-2 font-medium">{selectedPatient.occupation}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Language:</span>
                            <span className="ml-2 font-medium">{selectedPatient.preferredLanguage}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500">Email:</span>
                            <span className="ml-2 font-medium">{selectedPatient.email}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Insurance */}
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <CreditCardIcon className="h-5 w-5" />
                        Insurance Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Provider:</span>
                          <span className="ml-2 font-medium">{selectedPatient.insuranceProvider}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Tier:</span>
                          <span className="ml-2 font-medium">{selectedPatient.insuranceTier}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500">Policy Number:</span>
                          <span className="ml-2 font-medium">{selectedPatient.insuranceNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Current Vitals */}
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <HeartIcon className="h-5 w-5" />
                        Current Vitals
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <span className="text-slate-500 block">Temperature</span>
                          <span className="font-semibold text-lg">{selectedPatient.vitals.temperature}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <span className="text-slate-500 block">Blood Pressure</span>
                          <span className="font-semibold text-lg">{selectedPatient.vitals.bloodPressure}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <span className="text-slate-500 block">Heart Rate</span>
                          <span className="font-semibold text-lg">{selectedPatient.vitals.heartRate}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <span className="text-slate-500 block">O2 Saturation</span>
                          <span className="font-semibold text-lg">{selectedPatient.vitals.oxygenSaturation}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <span className="text-slate-500 block">BMI</span>
                          <span className="font-semibold text-lg">{selectedPatient.vitals.bmi}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <span className="text-slate-500 block">Pain Score</span>
                          <span className="font-semibold text-lg">{selectedPatient.vitals.painScore}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Last recorded: {new Date(selectedPatient.vitals.lastRecorded).toLocaleString()}
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <Link
                          to={`/cds?patient=${selectedPatient.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
                        >
                          <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-slate-900">Open CDS Console</span>
                        </Link>
                        <Link
                          to={`/icd?patient=${selectedPatient.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
                        >
                          <CodeBracketIcon className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-slate-900">ICD Coding</span>
                        </Link>
                        <Link
                          to={`/claims?patient=${selectedPatient.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
                        >
                          <CreditCardIcon className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-slate-900">Claims Management</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'clinical' && (
                  <div className="space-y-6">
                    {/* Allergies */}
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                        Allergies
                      </h4>
                      <div className="space-y-3">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <div key={index} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-semibold text-slate-900">{allergy.allergen}</h5>
                                <p className="text-sm text-slate-600">{allergy.reaction}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(allergy.severity)}`}>
                                {allergy.severity}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              Reported: {new Date(allergy.dateReported).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chronic Conditions */}
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />
                        Chronic Conditions
                      </h4>
                      <div className="space-y-3">
                        {selectedPatient.chronicConditions.map((condition, index) => (
                          <div key={index} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-semibold text-slate-900">{condition.condition}</h5>
                                <p className="text-sm text-slate-600">ICD-10: {condition.icdCode}</p>
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(condition.severity)}`}>
                                  {condition.severity}
                                </span>
                                <p className="text-xs text-slate-500 mt-1">{condition.status}</p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Care Team */}
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <UserGroupIcon className="h-5 w-5 text-green-500" />
                        Care Team
                      </h4>
                      <div className="space-y-3">
                        {selectedPatient.careTeam.map((member, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-slate-900">{member.name}</h5>
                              <p className="text-sm text-slate-600">{member.role}</p>
                              <p className="text-xs text-slate-500">{member.department}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'medications' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <BeakerIcon className="h-5 w-5 text-purple-500" />
                      Current Medications
                    </h4>
                    {selectedPatient.currentMedications.map((medication, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-semibold text-slate-900">{medication.medication}</h5>
                            <p className="text-sm text-slate-600">{medication.dosage} - {medication.frequency}</p>
                            <p className="text-sm text-slate-500">Route: {medication.route}</p>
                          </div>
                          <div className="text-right text-xs text-slate-500">
                            <p>For: {medication.indication}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'labs' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <ClipboardDocumentListIcon className="h-5 w-5 text-green-500" />
                      Recent Lab Results
                    </h4>
                    {selectedPatient.labResults.map((lab, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-semibold text-slate-900">{lab.test}</h5>
                            <p className="text-sm text-slate-600">Reference: {lab.referenceRange}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-900">
                              {lab.value} {lab.unit}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLabStatusColor(lab.status)}`}>
                              {lab.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Date: {new Date(lab.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No patient selected</h3>
              <p className="mt-1 text-sm text-slate-500">
                Select a patient from the list to view their profile and available actions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}