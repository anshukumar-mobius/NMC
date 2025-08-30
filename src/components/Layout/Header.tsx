import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../Auth/LogoutButton';
import { mockApi } from '../../utils/mockApi';

interface User {
  id: string;
  name: string;
  email: string;
  persona: string;
  department: string;
  avatar: string;
}

export function Header() {
  const { user: currentAuthUser, hasPermission } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Set current user from auth context
    if (currentAuthUser) {
      setCurrentUser(currentAuthUser);
    }
    
    const loadData = async () => {
      try {
        const usersData = await mockApi.getUsers();
        setUsers(usersData);
        // Only set default user if no authenticated user
        if (!currentAuthUser) {
          setCurrentUser(usersData[0]);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadData();
  }, [currentAuthUser]);

  const handleUserSwitch = (user: User) => {
    // Only allow user switching if user has admin permissions
    if (hasPermission('user_management')) {
      setCurrentUser(user);
    }
    setShowUserMenu(false);
  };

  return (
    <div className="lg:pl-72">
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <span className="text-slate-500">NMC Healthcare</span>
                <span className="mx-2 text-slate-300">|</span>
                <span className="font-medium text-slate-900">Clinical Decision Platform</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
            {/* Persona Switcher */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-x-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {currentUser ? (
                  <>
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={currentUser.avatar}
                      alt={currentUser.name}
                    />
                    <div className="text-left">
                      <div className="font-medium text-slate-900">{currentUser.name}</div>
                      <div className="text-xs text-slate-500">{currentUser.persona}</div>
                    </div>
                    {currentAuthUser && (
                      <div className="flex items-center gap-1">
                        <ShieldCheckIcon className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">Authenticated</span>
                      </div>
                    )}
                    <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                  </>
                ) : (
                  <>
                    <UserIcon className="h-6 w-6 text-slate-400" />
                    <span>Loading...</span>
                  </>
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">
                      {hasPermission('user_management') ? 'Switch Persona' : 'User Profile'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {hasPermission('user_management') ? 'Select a role to continue' : 'Current session details'}
                    </p>
                  </div>
                  
                  {/* Current User Info */}
                  {currentAuthUser && (
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={currentAuthUser.avatar}
                          alt={currentAuthUser.name}
                        />
                        <div>
                          <div className="font-medium text-slate-900">{currentAuthUser.name}</div>
                          <div className="text-xs text-slate-500">{currentAuthUser.email}</div>
                          <div className="text-xs text-green-600">✓ Authenticated</div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {currentAuthUser.permissions.slice(0, 3).map((permission, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                        {currentAuthUser.permissions.length > 3 && (
                          <span className="text-xs text-slate-500">
                            +{currentAuthUser.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* User Switching (Admin Only) */}
                  {hasPermission('user_management') && users.map((user) => (
                    <button
                      key={user.id}
                      className={`w-full flex items-center gap-x-3 px-4 py-3 text-sm text-left hover:bg-slate-50 transition-colors duration-200 ${
                        currentUser?.id === user.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                      }`}
                      onClick={() => handleUserSwitch(user)}
                    >
                      <img
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        src={user.avatar}
                        alt={user.name}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{user.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user.persona}</div>
                        <div className="text-xs text-slate-400 truncate">{user.department}</div>
                      </div>
                      {currentUser?.id === user.id && (
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      )}
                    </button>
                  ))}
                  
                  {/* Logout Button */}
                  <div className="px-4 py-2 border-t border-slate-100">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}