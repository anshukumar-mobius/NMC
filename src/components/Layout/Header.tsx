import { useState, useEffect } from 'react';
import { ChevronDownIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../auth/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  persona: string;
  department: string;
  avatar: string;
}

export function Header() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user: authUser, logout, switchUser } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await mockApi.getUsers();
        setUsers(usersData);
        
        // Use the authenticated user if available, otherwise default to first user
        if (authUser) {
          setCurrentUser({
            id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            persona: authUser.persona,
            department: authUser.department,
            avatar: authUser.avatar
          });
        } else {
          setCurrentUser(usersData[0]); // Default to first user
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadData();
  }, [authUser]);

  const handleUserSwitch = async (user: User) => {
    // Update the current displayed user
    setCurrentUser(user);
    
    // Also update the authenticated user in the auth context
    await switchUser(user.id);
    
    // Close the menu
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
                    <p className="text-sm font-medium text-slate-900">Switch Persona</p>
                    <p className="text-xs text-slate-500">Select a role to continue</p>
                  </div>
                  {users.map((user) => (
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
                  
                  {/* Logout button */}
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      className="w-full flex items-center gap-x-3 px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                      onClick={() => logout()}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <div className="font-medium">Logout</div>
                    </button>
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