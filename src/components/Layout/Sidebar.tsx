import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Patients', href: '/patients', icon: UserGroupIcon },
  { name: 'CDS Console', href: '/cds', icon: ShieldCheckIcon },
  { name: 'Appropriateness', href: '/appropriateness', icon: DocumentMagnifyingGlassIcon },
  { name: 'ICD Mapping', href: '/icd', icon: CodeBracketIcon },
  { name: 'Claims & Pre-Auth', href: '/claims', icon: CreditCardIcon },
  { name: 'Rules Library', href: '/rules', icon: Cog6ToothIcon },
  { name: 'Audit Trail', href: '/audit', icon: ClipboardDocumentListIcon },
  { name: 'Source Systems', href: '/sources', icon: ServerIcon },
  { name: 'Agents Console', href: '/agents', icon: CpuChipIcon },
  { name: 'Risk Register', href: '/risk-register', icon: ChartBarIcon },
];

export function Sidebar() {
  const location = useLocation();

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