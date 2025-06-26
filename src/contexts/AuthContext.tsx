'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '@/types';

// Mock user data (replace with actual API calls)
const MOCK_USERS = [
  {
    id: '1',
    email: 'tech1@testbox.com',
    name: 'John Technician',
    role: 'technician' as UserRole,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: '2',
    email: 'manager@testbox.com',
    name: 'Sarah Manager',
    role: 'maintenance_manager' as UserRole,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-25'),
  },
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication logic - trim whitespace and convert to lowercase for comparison
      const normalizedEmail = email.trim().toLowerCase();
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === normalizedEmail);
      
      if (!user) {
        dispatch({ type: 'LOGIN_FAILURE' });
        return { success: false, error: 'Invalid email or password' };
      }

      // In a real app, you would verify the password hash
      if (password !== 'password123') {
        dispatch({ type: 'LOGIN_FAILURE' });
        return { success: false, error: 'Invalid email or password' };
      }

      // Save user to localStorage (in a real app, you'd use secure tokens)
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: UserRole[]
) {
  return function ProtectedComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Hook to check permissions
export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Mock permission check (in a real app, this would come from your backend)
    const rolePermissions: Record<UserRole, string[]> = {
      technician: [
        'view_machines',
        'create_sessions',
        'view_sessions',
        'create_failures',
        'view_failures',
        'view_own_data',
        'export_basic_data',
      ],
      maintenance_manager: [
        'view_machines',
        'create_machines',
        'edit_machines',
        'delete_machines',
        'create_sessions',
        'view_sessions',
        'edit_sessions',
        'delete_sessions',
        'create_failures',
        'view_failures',
        'edit_failures',
        'delete_failures',
        'view_all_data',
        'view_analytics',
        'manage_users',
        'manage_sensors',
        'export_all_data',
        'view_knowledge_base',
        'edit_knowledge_base',
        'manage_alerts',
        'view_system_logs',
      ],
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    userRole: user?.role,
  };
}
