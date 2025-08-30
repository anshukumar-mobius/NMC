export interface User {
  id: string;
  name: string;
  email: string;
  persona: string;
  department: string;
  role: string;
  avatar: string;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export type UserRole = 'admin' | 'attending_physician' | 'resident' | 'nurse' | 'quality_manager' | 'radiologist' | 'guest';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'view_dashboard',
    'view_patients',
    'edit_patients',
    'prescribe',
    'cds_access',
    'icd_coding',
    'medication_admin',
    'audit_access',
    'quality_metrics',
    'jci_access',
    'rules_management',
    'imaging_reports',
    'appropriateness_check',
    'system_admin',
    'user_management'
  ],
  attending_physician: [
    'view_dashboard',
    'view_patients',
    'edit_patients',
    'prescribe',
    'cds_access',
    'icd_coding',
    'imaging_reports',
    'appropriateness_check'
  ],
  resident: [
    'view_dashboard',
    'view_patients',
    'cds_access',
    'icd_coding'
  ],
  nurse: [
    'view_dashboard',
    'view_patients',
    'medication_admin',
    'cds_access'
  ],
  quality_manager: [
    'view_dashboard',
    'audit_access',
    'quality_metrics',
    'jci_access',
    'rules_management',
    'view_patients'
  ],
  radiologist: [
    'view_dashboard',
    'view_patients',
    'imaging_reports',
    'appropriateness_check',
    'cds_access'
  ],
  guest: [
    'view_dashboard'
  ]
};