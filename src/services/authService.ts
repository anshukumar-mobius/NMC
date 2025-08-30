import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { mockApi } from '../utils/mockApi';
import { User, LoginCredentials, UserRole, ROLE_PERMISSIONS } from '../types/auth';

const JWT_SECRET = 'nmc-healthcare-secret-key-2024'; // In production, use environment variable
const TOKEN_EXPIRY = '24h';
const COOKIE_NAME = 'nmc_auth_token';

// Mock password database (in production, this would be in a secure database)
const USER_PASSWORDS: Record<string, string> = {
  'ahmed.alrashid@nmc.ae': '$2a$10$rQJ8vQZ9Xm5YQZ9Xm5YQZ9Xm5YQZ9Xm5YQZ9Xm5YQZ9Xm5YQZ9Xm5Y', // password123
  'sarah.thompson@nmc.ae': '$2a$10$sRK9wRA0Yn6ZRA0Yn6ZRA0Yn6ZRA0Yn6ZRA0Yn6ZRA0Yn6ZRA0Yn6Z', // password123
  'fatima.alzahra@nmc.ae': '$2a$10$tSL0xSB1Zo7aSB1Zo7aSB1Zo7aSB1Zo7aSB1Zo7aSB1Zo7aSB1Zo7a', // password123
  'hassan.mahmoud@nmc.ae': '$2a$10$uTM1yTC2Ap8bTC2Ap8bTC2Ap8bTC2Ap8bTC2Ap8bTC2Ap8bTC2Ap8b', // password123
  'priya.sharma@nmc.ae': '$2a$10$vUN2zUD3Bq9cUD3Bq9cUD3Bq9cUD3Bq9cUD3Bq9cUD3Bq9cUD3Bq9c', // password123
  'admin@nmc.ae': '$2a$10$wVO3AUE4Cr0dVE4Cr0dVE4Cr0dVE4Cr0dVE4Cr0dVE4Cr0dVE4Cr0d', // admin123
  'guest@nmc.ae': '$2a$10$xWP4BVF5Ds1eWF5Ds1eWF5Ds1eWF5Ds1eWF5Ds1eWF5Ds1eWF5Ds1e' // guest123
};

class AuthService {
  private currentUser: User | null = null;

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get user from mock API
      const users = await mockApi.getUsers();
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const hashedPassword = USER_PASSWORDS[credentials.email];
      if (!hashedPassword) {
        throw new Error('Invalid email or password');
      }

      // For demo purposes, we'll accept any password that starts with the user's role
      // In production, use proper bcrypt comparison
      const isValidPassword = credentials.password === 'password123' || 
                             credentials.password === 'admin123' || 
                             credentials.password === 'guest123';

      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Add permissions based on role
      const userRole = user.role as UserRole;
      const userWithPermissions = {
        ...user,
        permissions: ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.guest
      };

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          permissions: userWithPermissions.permissions
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      // Store token in cookie
      Cookies.set(COOKIE_NAME, token, { 
        expires: 1, // 1 day
        secure: false, // Set to true in production with HTTPS
        sameSite: 'strict'
      });

      this.currentUser = userWithPermissions;
      return userWithPermissions;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    Cookies.remove(COOKIE_NAME);
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = Cookies.get(COOKIE_NAME);
      if (!token) {
        return null;
      }

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Get fresh user data
      const users = await mockApi.getUsers();
      const user = users.find(u => u.id === decoded.userId);
      
      if (!user) {
        this.logout();
        return null;
      }

      // Add permissions based on role
      const userRole = user.role as UserRole;
      const userWithPermissions = {
        ...user,
        permissions: ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.guest
      };

      this.currentUser = userWithPermissions;
      return userWithPermissions;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) || false;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!Cookies.get(COOKIE_NAME);
  }

  // Demo accounts for testing
  getDemoAccounts() {
    return [
      { email: 'admin@nmc.ae', password: 'admin123', role: 'System Administrator' },
      { email: 'ahmed.alrashid@nmc.ae', password: 'password123', role: 'Attending Physician' },
      { email: 'sarah.thompson@nmc.ae', password: 'password123', role: 'Resident Doctor' },
      { email: 'fatima.alzahra@nmc.ae', password: 'password123', role: 'Nurse' },
      { email: 'hassan.mahmoud@nmc.ae', password: 'password123', role: 'Quality Manager' },
      { email: 'priya.sharma@nmc.ae', password: 'password123', role: 'Radiologist' },
      { email: 'guest@nmc.ae', password: 'guest123', role: 'Guest User' }
    ];
  }
}

export const authService = new AuthService();