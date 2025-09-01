import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Auth related imports
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Login } from './auth/Login';
import { Unauthorized } from './auth/Unauthorized';

// Define permission requirements for each route
const routePermissions = {
  '/patients': ['view_patients'],
  '/cds': ['cds_access'],
  '/appropriateness': ['appropriateness_check'],
  '/icd': ['icd_coding'],
  '/claims': [],
  '/rules': ['rules_management'],
  '/audit': ['audit_access'],
  '/sources': [],
  '/agents': [],
  '/risk-register': ['quality_metrics'],
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute allowedRoles={['admin', 'user', 'guest']}>
                <div className="min-h-screen bg-slate-50">
                  <Sidebar />
                  <Header />
                  
                  <main className="lg:pl-72">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      
                      <Route 
                        path="/patients" 
                        element={
                          <ProtectedRoute allowedRoles={['admin', 'user']} requiredPermissions={routePermissions['/patients']}>
                            <Patients />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/cds" 
                        element={
                          <ProtectedRoute allowedRoles={['admin', 'user']} requiredPermissions={routePermissions['/cds']}>
                            <CDS />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/appropriateness" 
                        element={
                          <ProtectedRoute allowedRoles={['admin', 'user']} requiredPermissions={routePermissions['/appropriateness']}>
                            <Appropriateness />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/icd" 
                        element={
                          <ProtectedRoute allowedRoles={['admin', 'user']} requiredPermissions={routePermissions['/icd']}>
                            <ICD />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/claims" 
                        element={
                          <ProtectedRoute allowedRoles={['admin', 'user']} requiredPermissions={routePermissions['/claims']}>
                            <Claims />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/rules" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']} requiredPermissions={routePermissions['/rules']}>
                            <Rules />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/audit" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']} requiredPermissions={routePermissions['/audit']}>
                            <AuditTrail />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/sources" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']} requiredPermissions={routePermissions['/sources']}>
                            <SourceSystems />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/agents" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']} requiredPermissions={routePermissions['/agents']}>
                            <Agents />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/risk-register" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']} requiredPermissions={routePermissions['/risk-register']}>
                            <RiskRegister />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Catch-all redirect to dashboard */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;