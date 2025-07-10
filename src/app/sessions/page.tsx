'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth, usePermissions } from '@/contexts/AuthContext';
import { formatDateTime, formatDuration, timeAgo } from '@/lib/utils';
import { TestSession, SessionStatus } from '@/types';

// Mock data for test sessions
const mockSessions: TestSession[] = [
  {
    id: '1',
    name: 'Routine Maintenance Check - Week 27',
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
    createdBy: {
      id: '2',
      email: 'manager@testbox.com',
      name: 'Manager Smith',
      role: 'maintenance_manager',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    assignedTo: {
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
    status: 'analysis_complete',
    notes: 'Regular maintenance check - all parameters within normal range',
    data: [],
    dataFiles: [
      {
        id: 'df1',
        sessionId: '1',
        fileName: 'hydraulic_data_20241127.json',
        filePath: '/uploads/sessions/1/hydraulic_data_20241127.json',
        fileSize: 2048576,
        uploadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        uploadedBy: {
          id: '1',
          email: 'tech1@testbox.com',
          name: 'John Technician',
          role: 'technician',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        dataFormat: 'json',
        recordCount: 7200,
      },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },  {
    id: '2',
    name: 'Conveyor System Monitoring',
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
    createdBy: {
      id: '2',
      email: 'manager@testbox.com',
      name: 'Manager Smith',
      role: 'maintenance_manager',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    assignedTo: {
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
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    samplingFrequency: 5,
    status: 'solution_submitted',
    notes: 'Belt alignment issues detected and resolved',
    data: [],
    dataFiles: [
      {
        id: 'df2',
        sessionId: '2',
        fileName: 'conveyor_motor_data.json',
        filePath: '/uploads/sessions/2/conveyor_motor_data.json',
        fileSize: 1572864,
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        uploadedBy: {
          id: '1',
          email: 'tech1@testbox.com',
          name: 'John Technician',
          role: 'technician',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        dataFormat: 'json',
        recordCount: 3600,
      },
    ],
    solution: {
      id: 'sol2',
      sessionId: '2',
      description: 'Realigned conveyor belt and adjusted motor speed controller settings.',
      stepsPerformed: [
        'Inspected belt alignment and found 2.5cm offset',
        'Adjusted conveyor tensioning system',
        'Recalibrated motor speed controller',
        'Performed test run to verify proper operation'
      ],
      recommendations: 'Schedule weekly belt alignment checks',
      submittedBy: {
        id: '1',
        email: 'tech1@testbox.com',
        name: 'John Technician',
        role: 'technician',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      approved: false,
    },    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'CNC Vibration Analysis',
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
    createdBy: {
      id: '2',
      email: 'manager@testbox.com',
      name: 'Manager Smith',
      role: 'maintenance_manager',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    assignedTo: {
      id: '3',
      email: 'tech3@testbox.com',
      name: 'Mike Wilson',
      role: 'technician',
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
    samplingFrequency: 20,    status: 'completed',
    notes: 'Investigating reported vibration issues - anomalies detected',
    data: [],
    dataFiles: [],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'created', label: 'Created' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'data_uploaded', label: 'Data Uploaded' },
  { value: 'analysis_complete', label: 'Analysis Complete' },
  { value: 'solution_submitted', label: 'Solution Submitted' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'error', label: 'Error' },
];

export default function SessionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sessions] = useState<TestSession[]>(mockSessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { hasPermission } = usePermissions();
  // Filter sessions based on search and filters
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.machine?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.machine?.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || session.status === statusFilter;
    
    // For technicians, only show sessions assigned to them
    if (user?.role === 'technician') {
      return matchesSearch && matchesStatus && session.assignedTo.id === user.id;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = sessions.reduce((acc, session) => {
      acc[session.status] = (acc[session.status] || 0) + 1;
      return acc;
    }, {} as Record<SessionStatus, number>);    return {
      created: stats.created || 0,
      assigned: stats.assigned || 0,
      in_progress: stats.in_progress || 0,
      data_uploaded: stats.data_uploaded || 0,
      analysis_complete: stats.analysis_complete || 0,
      solution_submitted: stats.solution_submitted || 0,
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
    <div className="space-y-6">      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Sessions</h1>
          <p className="text-gray-600">Monitor and manage data collection sessions</p>
        </div>        {user?.role === 'maintenance_manager' && hasPermission('create_sessions') && (
          <Button 
            onClick={() => router.push('/sessions/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2"
          >
            + Create New Session
          </Button>
        )}
      </div>      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <p className="text-sm text-gray-600">Analysis Ready</p>
                <p className="text-2xl font-bold text-orange-600">{stats.analysis_complete}</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Solution Submitted</p>
                <p className="text-2xl font-bold text-purple-600">{stats.solution_submitted}</p>
              </div>
              <div className="text-2xl">🔧</div>
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
                  </TableCell>                  <TableCell>
                    <div>
                      <div className="text-sm text-gray-900">{session.assignedTo.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{session.assignedTo.role.replace('_', ' ')}</div>
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
                  </TableCell>                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <Badge variant="status" status={session.status}>
                        {session.status.replace('_', ' ')}
                      </Badge>
                      {session.solution && (
                        <Badge variant="outline" className="text-xs">
                          {session.solution.approved ? '✅ Solution Approved' : '⏳ Solution Pending'}
                        </Badge>
                      )}
                      {session.closureRequest && (
                        <Badge variant="outline" className="text-xs">
                          {session.closureRequest.approved ? '🔒 Closure Approved' : '📋 Closure Requested'}
                        </Badge>
                      )}
                      {session.dataFiles && session.dataFiles.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          📊 {session.dataFiles.length} file{session.dataFiles.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </TableCell>                  <TableCell>
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/sessions/${session.id}`)}
                        >
                          View Details
                        </Button>
                        {session.status === 'in_progress' && hasPermission('edit_sessions') && (
                          <Button variant="danger" size="sm">
                            Stop
                          </Button>
                        )}
                      </div>
                      {user?.role === 'maintenance_manager' && (
                        <div className="flex space-x-2">
                          {session.solution && !session.solution.approved && hasPermission('review_solutions') && (
                            <Button 
                              size="sm" 
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                              onClick={() => router.push(`/sessions/${session.id}`)}
                            >
                              Review Solution
                            </Button>
                          )}
                          {session.closureRequest && !session.closureRequest.approved && hasPermission('close_sessions') && (
                            <Button 
                              size="sm" 
                              className="bg-red-600 hover:bg-red-700 text-white text-xs"
                              onClick={() => router.push(`/sessions/${session.id}`)}
                            >
                              Approve Closure
                            </Button>
                          )}
                        </div>
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
