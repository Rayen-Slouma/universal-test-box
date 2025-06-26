'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { usePermissions } from '@/contexts/AuthContext';
import { formatDateTime, formatDuration, timeAgo } from '@/lib/utils';
import { TestSession, SessionStatus } from '@/types';

// Mock data for test sessions
const mockSessions: TestSession[] = [
  {
    id: '1',
    machineId: '1',
    machine: {
      id: '1',
      name: 'Hydraulic Press #1',
      location: 'Production Line A',
      type: 'Hydraulic Press',
      serialNumber: 'HP-2024-001',
      status: 'operational',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    technician: {
      id: '1',
      email: 'tech1@testbox.com',
      name: 'John Technician',
      role: 'technician',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    sensors: [
      { id: '1', name: 'Temperature Sensor', type: 'temperature', description: 'Main temperature monitoring', isActive: true },
      { id: '2', name: 'Pressure Monitor', type: 'pressure', description: 'Hydraulic pressure monitoring', isActive: true },
      { id: '3', name: 'Vibration Sensor', type: 'vibration', description: 'Vibration analysis', isActive: true },
    ],
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    samplingFrequency: 10,
    status: 'completed',
    notes: 'Regular maintenance check - all parameters within normal range',
    data: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2',
    machineId: '2',
    machine: {
      id: '2',
      name: 'Conveyor Belt A',
      location: 'Warehouse',
      type: 'Conveyor System',
      serialNumber: 'CB-2024-002',
      status: 'operational',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    technician: {
      id: '1',
      email: 'tech1@testbox.com',
      name: 'John Technician',
      role: 'technician',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    sensors: [
      { id: '4', name: 'RPM Sensor', type: 'speed_rpm', description: 'Motor speed monitoring', isActive: true },
      { id: '5', name: 'Current Monitor', type: 'current', description: 'Motor current monitoring', isActive: true },
    ],
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    samplingFrequency: 5,
    status: 'in_progress',
    data: [],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '3',
    machineId: '3',
    machine: {
      id: '3',
      name: 'CNC Machine #3',
      location: 'Production Line B',
      type: 'CNC Machine',
      serialNumber: 'CNC-2024-003',
      status: 'failure',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    technician: {
      id: '2',
      email: 'manager@testbox.com',
      name: 'Sarah Manager',
      role: 'maintenance_manager',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    sensors: [
      { id: '6', name: 'Vibration Sensor', type: 'vibration', description: 'Vibration analysis', isActive: true },
      { id: '7', name: 'Temperature Sensor', type: 'temperature', description: 'Spindle temperature', isActive: true },
      { id: '8', name: 'Current Monitor', type: 'current', description: 'Motor current', isActive: true },
    ],
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    samplingFrequency: 20,
    status: 'completed',
    notes: 'Investigating reported vibration issues - anomalies detected',
    data: [],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'error', label: 'Error' },
];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<TestSession[]>(mockSessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { hasPermission } = usePermissions();

  // Filter sessions based on search and filters
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.machine?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.machine?.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = sessions.reduce((acc, session) => {
      acc[session.status] = (acc[session.status] || 0) + 1;
      return acc;
    }, {} as Record<SessionStatus, number>);

    return {
      in_progress: stats.in_progress || 0,
      completed: stats.completed || 0,
      cancelled: stats.cancelled || 0,
      error: stats.error || 0,
    };
  };

  const stats = getStatusStats();

  const calculateDuration = (session: TestSession): string => {
    if (session.endTime) {
      const duration = session.endTime.getTime() - session.startTime.getTime();
      return formatDuration(Math.floor(duration / (1000 * 60)));
    } else {
      const duration = new Date().getTime() - session.startTime.getTime();
      return formatDuration(Math.floor(duration / (1000 * 60))) + ' (ongoing)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Sessions</h1>
          <p className="text-gray-600">Monitor and manage data collection sessions</p>
        </div>
        {hasPermission('create_sessions') && (
          <Button>
            New Session
          </Button>
        )}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
              </div>
              <div className="text-2xl">🔄</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
              </div>
              <div className="text-2xl">⏹️</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
              </div>
              <div className="text-2xl">❌</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sessions ({filteredSessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Sensors</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{session.machine?.name}</div>
                      <div className="text-sm text-gray-500">{session.machine?.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-gray-900">{session.technician.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{session.technician.role.replace('_', ' ')}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {session.sensors.slice(0, 2).map((sensor) => (
                        <Badge key={sensor.id} className="text-xs">
                          {sensor.type.replace('_', ' ')}
                        </Badge>
                      ))}
                      {session.sensors.length > 2 && (
                        <Badge className="text-xs">
                          +{session.sensors.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {session.samplingFrequency} Hz
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {formatDateTime(session.startTime)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {timeAgo(session.startTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {calculateDuration(session)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="status" status={session.status}>
                      {session.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {session.status === 'in_progress' && hasPermission('edit_sessions') && (
                        <Button variant="danger" size="sm">
                          Stop
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
