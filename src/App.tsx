import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { RoleGuard } from './components/Auth/RoleGuard';
import { SessionManager } from './components/Auth/SessionManager';
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
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <SessionManager>
            <div className="min-h-screen bg-slate-50">
              <Sidebar />
              <Header />
              
              <main className="lg:pl-72">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <RoleGuard requiredPermissions={['view_dashboard']}>
                        <Dashboard />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/patients" 
                    element={
                      <RoleGuard requiredPermissions={['view_patients']}>
                        <Patients />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/cds" 
                    element={
                      <RoleGuard requiredPermissions={['cds_access']}>
                        <CDS />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/appropriateness" 
                    element={
                      <RoleGuard requiredPermissions={['appropriateness_check']}>
                        <Appropriateness />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/icd" 
                    element={
                      <RoleGuard requiredPermissions={['icd_coding']}>
                        <ICD />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/claims" 
                    element={
                      <RoleGuard requiredPermissions={['view_patients']}>
                        <Claims />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/rules" 
                    element={
                      <RoleGuard requiredPermissions={['rules_management']}>
                        <Rules />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/audit" 
                    element={
                      <RoleGuard requiredPermissions={['audit_access']}>
                        <AuditTrail />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/sources" 
                    element={
                      <RoleGuard requiredPermissions={['system_admin']}>
                        <SourceSystems />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/agents" 
                    element={
                      <RoleGuard requiredPermissions={['system_admin']}>
                        <Agents />
                      </RoleGuard>
                    } 
                  />
                  <Route 
                    path="/risk-register" 
                    element={
                      <RoleGuard requiredPermissions={['quality_metrics']}>
                        <RiskRegister />
                      </RoleGuard>
                    } 
                  />
                </Routes>
              </main>
            </div>
          </SessionManager>
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;