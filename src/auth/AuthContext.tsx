import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockApi } from '../utils/mockApi';

// Define user roles
export type UserRole = 'admin' | 'user' | 'guest';

// Define the shape of the user in the auth context
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  persona: string;
  department: string;
  avatar: string;
  role: UserRole;
  permissions: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  switchUser: async () => false,
  hasPermission: () => false,
  hasRole: () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock role mapping (we'll extend the existing user structure without modifying it)
const roleMapping: Record<string, UserRole> = {
  'attending_physician': 'user',
  'resident': 'user',
  'nurse': 'user',
  'quality_manager': 'admin',
  'radiologist': 'user',
  // Default role is guest
};

// Provider component that wraps the app and makes auth available
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Verify the user still exists in our system
          const verifiedUser = await mockApi.getUserById(parsedUser.id);
          
          if (verifiedUser) {
            // Assign role based on existing user data
            const role = roleMapping[verifiedUser.role] || 'guest';
            setUser({
              ...verifiedUser,
              role
            } as AuthUser);
          } else {
            // User no longer exists, clear the session
            localStorage.removeItem('auth_user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('auth_user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function - will validate credentials and set the user
  const login = async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, you'd make an API call to validate credentials
      // For this mock implementation, we'll just fetch users and find one with matching email
      const users = await mockApi.getUsers();
      const matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      
      // Simulate password validation (in a real app, you'd hash and compare)
      // For this mock, we'll accept any password for simplicity
      if (matchedUser) {
        // Assign role based on existing user data
        const role = roleMapping[matchedUser.role] || 'guest';
        
        const authUser = {
          ...matchedUser,
          role
        } as AuthUser;
        
        setUser(authUser);
        // Store in localStorage for session persistence
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  // Switch user function - allows switching between users without logging out
  const switchUser = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Find the user by ID
      const newUser = await mockApi.getUserById(userId);
      
      if (newUser) {
        // Assign role based on existing user data
        const role = roleMapping[newUser.role] || 'guest';
        
        const authUser = {
          ...newUser,
          role
        } as AuthUser;
        
        setUser(authUser);
        // Store in localStorage for session persistence
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('User switch error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  // Check if user has one of the specified roles
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  // Create the context value object
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchUser,
    hasPermission,
    hasRole,
  };

  // Provide the context to children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
