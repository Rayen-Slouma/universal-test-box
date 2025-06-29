'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, usePermissions } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: string;
  permission?: string;
  roles?: string[];
}

const navigation: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    permission: 'view_machines',
  },
  {
    href: '/machines',
    label: 'Machines',
    icon: '🏭',
    permission: 'view_machines',
  },
  {
    href: '/sessions',
    label: 'Test Sessions',
    icon: '🔬',
    permission: 'view_sessions',
  },
  {
    href: '/failures',
    label: 'Failures',
    icon: '⚠️',
    permission: 'view_failures',
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: '📈',
    permission: 'view_analytics',
  },
  {
    href: '/knowledge-base',
    label: 'Knowledge Base',
    icon: '📚',
    permission: 'view_knowledge_base',
  },
  {
    href: '/alerts',
    label: 'Alerts',
    icon: '🔔',
    permission: 'manage_alerts',
  },
  {
    href: '/users',
    label: 'Users',
    icon: '👥',
    permission: 'manage_users',
  },
];

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredNavigation = navigation.filter(item => {
    if (item.permission) {
      return hasPermission(item.permission);
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={cn(
        'bg-white shadow-lg transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="text-2xl">🔧</div>
              {isSidebarOpen && (
                <div className="ml-2">
                  <h1 className="text-lg font-semibold text-gray-900">Test Box</h1>
                  <p className="text-xs text-gray-500">Predictive Maintenance</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1"
            >
              {isSidebarOpen ? '←' : '→'}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            {isSidebarOpen ? (
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="p-1 text-xs"
                >
                  ↩
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {navigation.find(item => item.href === pathname)?.label || 'Universal Test Box'}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Quick actions */}
                <div className="flex items-center space-x-2">
                  {hasPermission('create_sessions') && (
                    <Button size="sm" onClick={() => router.push('/sessions/new')}>
                      New Session
                    </Button>
                  )}
                  {hasPermission('create_failures') && (
                    <Button variant="outline" size="sm" onClick={() => router.push('/failures/new')}>
                      Report Failure
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
