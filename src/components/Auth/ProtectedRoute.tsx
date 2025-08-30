import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginScreen } from './LoginScreen';
import { 
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  LockClosedIcon 
} from '@heroicons/react/24/outline';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission, hasRole, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldExclamationIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">
            You don't have the required role to access this resource.
          </p>
          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-slate-700">
              <span className="font-medium">Required Role:</span> {requiredRole}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium">Your Role:</span> {user?.role || 'Unknown'}
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Insufficient Permissions</h2>
          <p className="text-slate-600 mb-4">
            You don't have the required permissions to access this feature.
          </p>
          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-slate-700">
              <span className="font-medium">Required Permission:</span> {requiredPermission}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium">Your Role:</span> {user?.persona || 'Unknown'}
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Contact your administrator to request additional permissions.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}