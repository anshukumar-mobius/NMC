import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SessionManagerProps {
  children: React.ReactNode;
}

export function SessionManager({ children }: SessionManagerProps) {
  const { user, logout } = useAuth();
  const [sessionWarning, setSessionWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Session timeout warning (23 hours = 82800 seconds)
    const warningTime = 82800; // 23 hours in seconds
    const sessionDuration = 86400; // 24 hours in seconds

    let warningTimer: NodeJS.Timeout;
    let logoutTimer: NodeJS.Timeout;

    // Set warning timer
    warningTimer = setTimeout(() => {
      setSessionWarning(true);
      setTimeLeft(sessionDuration - warningTime);
      
      // Start countdown
      const countdownInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Auto logout after session expires
      logoutTimer = setTimeout(() => {
        clearInterval(countdownInterval);
        logout();
      }, (sessionDuration - warningTime) * 1000);
    }, warningTime * 1000);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [user, logout]);

  const extendSession = () => {
    setSessionWarning(false);
    setTimeLeft(0);
    // In a real implementation, you would refresh the JWT token here
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {children}
      
      {/* Session Warning Modal */}
      {sessionWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Session Expiring Soon</h3>
                <p className="text-sm text-slate-600">Your session will expire in {formatTime(timeLeft)}</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800">
                    You will be automatically logged out when the timer reaches zero.
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Click "Extend Session" to continue working.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={extendSession}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Extend Session
              </button>
              <button
                onClick={logout}
                className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                Sign Out Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}