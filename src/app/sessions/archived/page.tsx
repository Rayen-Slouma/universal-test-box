'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateTime, timeAgo } from '@/lib/utils';
import { TestSession } from '@/types';

// Mock archived sessions with solutions
const getMockArchivedSessions = (): TestSession[] => [
  {
    id: '1',
    name: 'CNC Vibration Analysis - Week 26',
    machineId: '3',
    machine: {
      id: '3',
      name: 'CNC Machine #3',
      location: 'Production Line B',
      type: 'CNC Machine',
      serialNumber: 'CNC-2024-003',
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
      { id: '6', name: 'Vibration Sensor', type: 'vibration', description: 'Vibration analysis', isActive: true },
      { id: '7', name: 'Temperature Sensor', type: 'temperature', description: 'Spindle temperature', isActive: true },
    ],
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    samplingFrequency: 20,
    status: 'completed',
    data: [],
    dataFiles: [
      {
        id: 'df1',
        sessionId: '1',
        fileName: 'cnc_vibration_analysis.json',
        filePath: '/uploads/sessions/1/cnc_vibration_analysis.json',
        fileSize: 3145728,
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        uploadedBy: {
          id: '1',
          email: 'tech1@testbox.com',
          name: 'John Technician',
          role: 'technician',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        dataFormat: 'json',
        recordCount: 14400,
      },
    ],
    solution: {
      id: 'sol1',
      sessionId: '1',
      description: 'Identified excessive vibration in spindle bearing. Replaced bearing assembly and recalibrated spindle alignment.',
      stepsPerformed: [
        'Analyzed vibration data and identified frequency patterns',
        'Inspected spindle bearing assembly',
        'Replaced worn bearing (Part #: SPB-4421)',
        'Recalibrated spindle alignment using laser alignment tool',
        'Performed test run and verified vibration levels within acceptable range'
      ],
      recommendations: 'Monitor spindle vibration weekly. Schedule bearing replacement every 2000 operating hours.',
      submittedBy: {
        id: '1',
        email: 'tech1@testbox.com',
        name: 'John Technician',
        role: 'technician',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      reviewedBy: {
        id: '2',
        email: 'manager@testbox.com',
        name: 'Manager Smith',
        role: 'maintenance_manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      approved: true,
    },
    closureRequest: {
      id: 'cr1',
      sessionId: '1',
      requestedBy: {
        id: '1',
        email: 'tech1@testbox.com',
        name: 'John Technician',
        role: 'technician',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      reason: 'Issue resolved successfully. Machine is operational and vibration levels are within normal parameters.',
      solutionId: 'sol1',
      approved: true,
      reviewedBy: {
        id: '2',
        email: 'manager@testbox.com',
        name: 'Manager Smith',
        role: 'maintenance_manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      comments: 'Excellent work. Solution is approved and effective.',
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Hydraulic System Pressure Check',
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
    ],
    startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    samplingFrequency: 10,
    status: 'completed',
    data: [],
    dataFiles: [
      {
        id: 'df2',
        sessionId: '2',
        fileName: 'hydraulic_pressure_data.json',
        filePath: '/uploads/sessions/2/hydraulic_pressure_data.json',
        fileSize: 2048576,
        uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        uploadedBy: {
          id: '1',
          email: 'tech1@testbox.com',
          name: 'John Technician',
          role: 'technician',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        dataFormat: 'json',
        recordCount: 10800,
      },
    ],
    solution: {
      id: 'sol2',
      sessionId: '2',
      description: 'Detected pressure drop in hydraulic system. Found and replaced faulty seal in main cylinder.',
      stepsPerformed: [
        'Monitored pressure readings during operation cycle',
        'Identified pressure drop pattern during compression phase',
        'Performed visual inspection of hydraulic cylinder',
        'Replaced main cylinder seal (Part #: HS-3301)',
        'Tested system and verified pressure stability'
      ],
      recommendations: 'Check hydraulic seals monthly. Replace hydraulic fluid every 6 months.',
      submittedBy: {
        id: '1',
        email: 'tech1@testbox.com',
        name: 'John Technician',
        role: 'technician',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      reviewedBy: {
        id: '2',
        email: 'manager@testbox.com',
        name: 'Manager Smith',
        role: 'maintenance_manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      reviewedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      approved: true,
    },
    closureRequest: {
      id: 'cr2',
      sessionId: '2',
      requestedBy: {
        id: '1',
        email: 'tech1@testbox.com',
        name: 'John Technician',
        role: 'technician',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      requestedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      reason: 'Hydraulic system repair completed. Pressure levels stabilized and within specifications.',
      solutionId: 'sol2',
      approved: true,
      reviewedBy: {
        id: '2',
        email: 'manager@testbox.com',
        name: 'Manager Smith',
        role: 'maintenance_manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      reviewedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      comments: 'Good diagnosis and repair. System is functioning properly.',
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
];

export default function ArchivedSessionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [machineFilter, setMachineFilter] = useState('');
  const [selectedSession, setSelectedSession] = useState<TestSession | null>(null);

  // Check access
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Please log in to view archived sessions.</div>
      </div>
    );
  }

  const archivedSessions = getMockArchivedSessions();
  
  // Filter sessions for technicians to only show their own
  const filteredSessions = archivedSessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.machine?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.solution?.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMachine = !machineFilter || session.machine?.name === machineFilter;
    
    // Technicians only see their own sessions
    if (user.role === 'technician') {
      return matchesSearch && matchesMachine && session.assignedTo.id === user.id;
    }
    
    // Managers see all sessions
    return matchesSearch && matchesMachine;
  });

  const machineOptions = [
    { value: '', label: 'All Machines' },
    ...Array.from(new Set(archivedSessions.map(s => s.machine?.name))).map(name => ({
      value: name!,
      label: name!
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Archived Sessions</h1>
          <p className="text-gray-600">View completed sessions and their solutions</p>
        </div>
        <Badge className="text-sm">{filteredSessions.length} sessions</Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search sessions, machines, or solutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={machineOptions}
              value={machineFilter}
              onChange={(e) => setMachineFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Sessions with Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No archived sessions found</h3>
              <p className="text-gray-600">Complete some sessions to see them archived here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Solution</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{session.name}</div>
                        <div className="text-sm text-gray-500">
                          {session.sensors.length} sensors • {session.samplingFrequency} Hz
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm text-gray-900">{session.machine?.name}</div>
                        <div className="text-xs text-gray-500">{session.machine?.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{session.assignedTo.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{formatDateTime(session.endTime!)}</div>
                      <div className="text-xs text-gray-500">{timeAgo(session.endTime!)}</div>
                    </TableCell>
                    <TableCell>
                      {session.solution ? (
                        <div>
                          <Badge variant="success" className="text-xs">
                            Solution Available
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {session.solution.stepsPerformed.length} steps
                          </div>
                        </div>
                      ) : (
                        <Badge variant="warning" className="text-xs">
                          No Solution
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSession(session)}
                        >
                          View Solution
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/sessions/${session.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Solution Detail Modal */}
      {selectedSession && selectedSession.solution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                🔧 Solution: {selectedSession.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Session Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Machine:</span>
                    <div className="font-medium">{selectedSession.machine?.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Completed:</span>
                    <div className="font-medium">{formatDateTime(selectedSession.endTime!)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Technician:</span>
                    <div className="font-medium">{selectedSession.assignedTo.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <div className="font-medium">
                      {Math.round((selectedSession.endTime!.getTime() - selectedSession.startTime.getTime()) / (1000 * 60))} minutes
                    </div>
                  </div>
                </div>
              </div>

              {/* Solution Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Problem Description</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {selectedSession.solution.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Steps Performed</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {selectedSession.solution.stepsPerformed.map((step, index) => (
                      <li key={index} className="text-gray-700 bg-green-50 p-2 rounded">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                
                {selectedSession.solution.recommendations && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                    <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">
                      {selectedSession.solution.recommendations}
                    </p>
                  </div>
                )}
              </div>

              {/* Approval Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Submitted by {selectedSession.solution.submittedBy.name} on{' '}
                      {formatDateTime(selectedSession.solution.submittedAt)}
                    </p>
                    {selectedSession.solution.reviewedBy && (
                      <p className="text-sm text-gray-600">
                        Reviewed by {selectedSession.solution.reviewedBy.name} on{' '}
                        {formatDateTime(selectedSession.solution.reviewedAt!)}
                      </p>
                    )}
                  </div>
                  <Badge variant={selectedSession.solution.approved ? 'success' : 'warning'}>
                    {selectedSession.solution.approved ? '✅ Approved' : '⏳ Pending Review'}
                  </Badge>
                </div>
              </div>

              {/* Data Files */}
              {selectedSession.dataFiles && selectedSession.dataFiles.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Data Files</h4>
                  <div className="space-y-2">
                    {selectedSession.dataFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="text-sm font-medium">{file.fileName}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(file.fileSize / (1024 * 1024)).toFixed(1)} MB)
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={() => setSelectedSession(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
