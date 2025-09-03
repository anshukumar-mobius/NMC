import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../auth/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
  CodeBracketIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ServerIcon,
  CpuChipIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Define navigation with permissions
const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, requiredRole: ['admin', 'user', 'guest'] as UserRole[], permissions: [] },
  { name: 'Patients', href: '/patients', icon: UserGroupIcon, requiredRole: ['admin', 'user'] as UserRole[], permissions: ['view_patients'] },
  { name: 'CDS Console', href: '/cds', icon: ShieldCheckIcon, requiredRole: ['admin', 'user'] as UserRole[], permissions: ['cds_access'] },
  { name: 'Appropriateness', href: '/appropriateness', icon: DocumentMagnifyingGlassIcon, requiredRole: ['admin', 'user'] as UserRole[], permissions: ['appropriateness_check'] },
  { name: 'ICD Mapping', href: '/icd', icon: CodeBracketIcon, requiredRole: ['admin', 'user'] as UserRole[], permissions: ['icd_coding'] },
  // { name: 'Claims & Pre-Auth', href: '/claims', icon: CreditCardIcon, requiredRole: ['admin', 'user'] as UserRole[], permissions: [] },
  { name: 'Rules Library', href: '/rules', icon: Cog6ToothIcon, requiredRole: ['admin'] as UserRole[], permissions: ['rules_management'] },
  // { name: 'Audit Trail', href: '/audit', icon: ClipboardDocumentListIcon, requiredRole: ['admin'] as UserRole[], permissions: ['audit_access'] },
  { name: 'Source Systems', href: '/sources', icon: ServerIcon, requiredRole: ['admin'] as UserRole[], permissions: [] },
  { name: 'Agents Console', href: '/agents', icon: CpuChipIcon, requiredRole: ['admin'] as UserRole[], permissions: [] },
  { name: 'Risk Register', href: '/risk-register', icon: ChartBarIcon, requiredRole: ['admin'] as UserRole[], permissions: ['quality_metrics'] },
];

export function Sidebar() {
  const location = useLocation();
  const { user, hasRole, hasPermission } = useAuth();

  // Filter navigation based on user role and permissions
  const filteredNavigation = navigation.filter(item => {
    // Check if user has required role
    const hasRequiredRole = hasRole(item.requiredRole);
    
    // Check if user has all required permissions
    const hasAllPermissions = item.permissions.length === 0 || 
      item.permissions.every(permission => hasPermission(permission));
    
    return hasRequiredRole && hasAllPermissions;
  });

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-white to-blue-50 px-6 pb-4 border-r border-slate-200 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-30 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-tr-full opacity-30 -z-10"></div>
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AEGLE</h1>
              <p className="text-xs text-slate-500">Clinical Decision Platform</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  
                  // Check if user has required permissions
                  // Permissions are already checked in filteredNavigation, so always true here
                  const hasAccess = true;
                  
                  if (!hasAccess) {
                    return null;
                  }
                  
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-white/70 backdrop-blur-sm text-blue-700 border border-blue-200 shadow-sm'
                            : 'text-slate-700 hover:text-blue-700 hover:bg-white/50 hover:backdrop-blur-sm hover:shadow-sm'
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${
                            isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            
            {user && (
              <li className="mt-auto">
                <div className="relative rounded-lg p-4 overflow-hidden">
                  <div className="absolute -right-5 -bottom-5 w-20 h-20 rounded-full"></div>
                  <div className="absolute -left-5 -top-5 w-16 h-16 rounded-full blur-md"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-2">
                      
                      <div className="text-sm font-medium text-blue-700">
                        Role: {user.persona}
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center">
                      <span className="h-4 w-0.5 bg-green-500 mr-1 animate-pulse"></span>
                      Powered by Mobius
                    </div>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}