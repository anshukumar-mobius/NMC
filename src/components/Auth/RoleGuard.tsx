import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL permissions; if false, user needs ANY permission
}

export function RoleGuard({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [], 
  fallback = null,
  requireAll = false 
}: RoleGuardProps) {
  const { user, hasPermission, hasRole } = useAuth();

  // Check role access
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  // Check permission access
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every(permission => hasPermission(permission))
      : requiredPermissions.some(permission => hasPermission(permission));
    
    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}