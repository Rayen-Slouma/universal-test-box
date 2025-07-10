'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { timeAgo } from '@/lib/utils';

// Mock data for dashboard
const mockStats = {
  totalMachines: 24,
  activeSessions: 3,
  pendingFailures: 7,
  criticalAlerts: 2,
  machineUptime: 94.5,
  maintenanceEfficiency: 87.2,
};

const mockRecentSessions = [
  {
    id: '1',
    machineName: 'Hydraulic Press #1',
    technician: 'John Technician',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'in_progress',
    sensors: ['temperature', 'pressure', 'vibration'],
  },
  {
    id: '2',
    machineName: 'Conveyor Belt A',
    technician: 'John Technician',
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'completed',
    sensors: ['speed_rpm', 'current'],
  },
  {
    id: '3',
    machineName: 'CNC Machine #3',
    technician: 'Sarah Manager',
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: 'completed',
    sensors: ['vibration', 'temperature', 'current'],
  },
];

const mockRecentFailures = [
  {
    id: '1',
    machineName: 'Pump Station B',
    description: 'Unusual vibration detected during operation',
    severity: 'high',
    reportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    status: 'investigating',
  },
  {
    id: '2',
    machineName: 'Compressor Unit #2',
    description: 'Temperature exceeding normal operating range',
    severity: 'medium',
    reportedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: 'in_progress',
  },
  {
    id: '3',
    machineName: 'Hydraulic Press #1',
    description: 'Pressure drop in hydraulic system',
    severity: 'critical',
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: 'resolved',
  },
];

const mockAlerts = [
  {
    id: '1',
    machineName: 'Generator #1',
    message: 'Predictive maintenance recommended',
    severity: 'warning',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: '2',
    machineName: 'Cooling System A',
    message: 'Temperature sensor threshold exceeded',
    severity: 'critical',
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect technicians to their specialized dashboard
  React.useEffect(() => {
    if (user?.role === 'technician') {
      router.push('/technician');
    }
  }, [user, router]);

  // Return early for technicians while redirect is happening
  if (user?.role === 'technician') {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to technician dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening with your maintenance operations today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🏭</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Machines</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalMachines}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🔬</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{mockStats.activeSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">⚠️</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Failures</p>
                <p className="text-2xl font-bold text-orange-600">{mockStats.pendingFailures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🔔</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{mockStats.criticalAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Machine Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-3xl font-bold text-green-600">
                  {mockStats.machineUptime}%
                </div>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-3xl font-bold text-blue-600">
                  {mockStats.maintenanceEfficiency}%
                </div>
                <p className="text-sm text-gray-500">Resolution rate</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{session.machineName}</h4>
                    <p className="text-sm text-gray-600">by {session.technician}</p>
                    <p className="text-xs text-gray-500">{timeAgo(session.startTime)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="status" status={session.status}>
                      {session.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Failures */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentFailures.map((failure) => (
                <div key={failure.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{failure.machineName}</h4>
                    <p className="text-sm text-gray-600">{failure.description}</p>
                    <p className="text-xs text-gray-500">{timeAgo(failure.reportedAt)}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant="status" status={failure.severity}>
                      {failure.severity}
                    </Badge>
                    <Badge variant="status" status={failure.status}>
                      {failure.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-xl mr-3">
                    {alert.severity === 'critical' ? '🚨' : '⚠️'}
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.machineName}</h4>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="status" status={alert.severity}>
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-gray-500">{timeAgo(alert.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
