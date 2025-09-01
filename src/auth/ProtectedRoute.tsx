import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from './AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles = ['admin', 'user', 'guest'],
  requiredPermissions = [],
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Show nothing while checking authentication status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role-based access
  const hasAllowedRole = hasRole(allowedRoles);
  if (!hasAllowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for permission-based access (if specified)
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children if all checks pass
  return children;
};
