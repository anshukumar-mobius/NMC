import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export function LogoutButton() {
  const { logout, user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
      >
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
        Sign Out
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Confirm Sign Out</h3>
                <p className="text-sm text-slate-600">Are you sure you want to sign out?</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-slate-700">
                <span className="font-medium">Signed in as:</span> {user?.name}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}