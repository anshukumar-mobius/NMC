import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { CDS } from './pages/CDS';
import { Appropriateness } from './pages/Appropriateness';
import { SourceSystems } from './pages/SourceSystems';
import { RiskRegister } from './pages/RiskRegister';

// Placeholder components for missing pages
// Import actual components
import { Claims } from './pages/Claims';
import { ICD } from './pages/ICD';
import { Rules } from './pages/Rules';
import { AuditTrail } from './pages/AuditTrail';
import { Agents } from './pages/Agents';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <Header />
        
        <main className="lg:pl-72">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/cds" element={<CDS />} />
            <Route path="/appropriateness" element={<Appropriateness />} />
            <Route path="/icd" element={<ICD />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/audit" element={<AuditTrail />} />
            <Route path="/sources" element={<SourceSystems />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/risk-register" element={<RiskRegister />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;