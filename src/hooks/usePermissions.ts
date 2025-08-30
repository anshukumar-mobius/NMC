import { useAuth } from '../contexts/AuthContext';

export function usePermissions() {
  const { user, hasPermission, hasRole } = useAuth();

  const canViewPatients = () => hasPermission('view_patients');
  const canEditPatients = () => hasPermission('edit_patients');
  const canPrescribe = () => hasPermission('prescribe');
  const canAccessCDS = () => hasPermission('cds_access');
  const canManageRules = () => hasPermission('rules_management');
  const canViewAudit = () => hasPermission('audit_access');
  const canAdminSystem = () => hasPermission('system_admin');
  const canManageUsers = () => hasPermission('user_management');
  const canViewQualityMetrics = () => hasPermission('quality_metrics');
  const canCodeICD = () => hasPermission('icd_coding');
  const canAdminMedication = () => hasPermission('medication_admin');
  const canCheckAppropriateness = () => hasPermission('appropriateness_check');
  const canViewImagingReports = () => hasPermission('imaging_reports');

  const isAdmin = () => hasRole('admin');
  const isPhysician = () => hasRole('attending_physician') || hasRole('resident');
  const isNurse = () => hasRole('nurse');
  const isQualityManager = () => hasRole('quality_manager');
  const isRadiologist = () => hasRole('radiologist');
  const isGuest = () => hasRole('guest');

  return {
    user,
    // Permission checks
    canViewPatients,
    canEditPatients,
    canPrescribe,
    canAccessCDS,
    canManageRules,
    canViewAudit,
    canAdminSystem,
    canManageUsers,
    canViewQualityMetrics,
    canCodeICD,
    canAdminMedication,
    canCheckAppropriateness,
    canViewImagingReports,
    // Role checks
    isAdmin,
    isPhysician,
    isNurse,
    isQualityManager,
    isRadiologist,
    isGuest,
    // Generic permission/role checks
    hasPermission,
    hasRole
  };
}