import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RoleGuard } from '../Auth/RoleGuard';
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

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: HomeIcon,
    requiredPermissions: ['view_dashboard']
  },
  { 
    name: 'Patients', 
    href: '/patients', 
    icon: UserGroupIcon,
    requiredPermissions: ['view_patients']
  },
  { 
    name: 'CDS Console', 
    href: '/cds', 
    icon: ShieldCheckIcon,
    requiredPermissions: ['cds_access']
  },
  { 
    name: 'Appropriateness', 
    href: '/appropriateness', 
    icon: DocumentMagnifyingGlassIcon,
    requiredPermissions: ['appropriateness_check']
  },
  { 
    name: 'ICD Mapping', 
    href: '/icd', 
    icon: CodeBracketIcon,
    requiredPermissions: ['icd_coding']
  },
  { 
    name: 'Claims & Pre-Auth', 
    href: '/claims', 
    icon: CreditCardIcon,
    requiredPermissions: ['view_patients']
  },
  { 
    name: 'Rules Library', 
    href: '/rules', 
    icon: Cog6ToothIcon,
    requiredPermissions: ['rules_management']
  },
  { 
    name: 'Audit Trail', 
    href: '/audit', 
    icon: ClipboardDocumentListIcon,
    requiredPermissions: ['audit_access']
  },
  { 
    name: 'Source Systems', 
    href: '/sources', 
    icon: ServerIcon,
    requiredPermissions: ['system_admin']
  },
  { 
    name: 'Agents Console', 
    href: '/agents', 
    icon: CpuChipIcon,
    requiredPermissions: ['system_admin']
  },
  { 
    name: 'Risk Register', 
    href: '/risk-register', 
    icon: ChartBarIcon,
    requiredPermissions: ['quality_metrics']
  },
];

export function Sidebar() {
  const location = useLocation();
  const { hasPermission } = useAuth();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-slate-200">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
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
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  
                  // Check if user has required permissions
                  const hasAccess = item.requiredPermissions.some(permission => 
                    hasPermission(permission)
                  );
                  
                  if (!hasAccess) {
                    return null;
                  }
                  
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
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
          </ul>
        </nav>
      </div>
    </div>
  );
}