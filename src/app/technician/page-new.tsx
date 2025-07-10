'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { useAuth } from '@/contexts/AuthContext';
import { TestSession } from '@/types';
import { timeAgo, formatDateTime } from '@/lib/utils';

// Tab navigation types
type TabType = 'overview' | 'sessions' | 'upload' | 'data';

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
  count?: number;
}

// Mock assigned sessions for technician
const getAssignedSessions = (technicianId: string): TestSession[] => [
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
      id: technicianId,
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
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    samplingFrequency: 10,
    status: 'assigned',
    data: [],
    dataFiles: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
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
      id: technicianId,
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
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    samplingFrequency: 5,
    status: 'in_progress',
    data: [],
    dataFiles: [],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
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
      id: technicianId,
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
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    samplingFrequency: 20,
    status: 'completed',
    data: [],
    dataFiles: [
      {
        id: 'df1',
        sessionId: '3',
        fileName: 'cnc_vibration_data.json',
        filePath: '/uploads/sessions/3/cnc_vibration_data.json',
        fileSize: 3145728, // 3MB
        uploadedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        uploadedBy: {
          id: technicianId,
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
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
];

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingSessionId, setUploadingSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!user || user.role !== 'technician') {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible by technicians.</p>
        </div>
      </div>
    );
  }

  const assignedSessions = getAssignedSessions(user.id);
  const activeSessions = assignedSessions.filter(s => s.status === 'in_progress');
  const pendingSessions = assignedSessions.filter(s => s.status === 'assigned');
  const completedSessions = assignedSessions.filter(s => s.status === 'completed');
  const dataUploadedSessions = assignedSessions.filter(s => s.dataFiles && s.dataFiles.length > 0);

  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'sessions', label: 'My Sessions', icon: '📋', count: assignedSessions.length },
    { id: 'upload', label: 'Upload Data', icon: '📤', count: activeSessions.length + pendingSessions.length },
    { id: 'data', label: 'My Data', icon: '💾', count: dataUploadedSessions.length },
  ];

  const handleFileUpload = async (sessionId: string) => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    if (!selectedFile.name.endsWith('.json')) {
      alert('Please upload a JSON file');
      return;
    }

    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSizeInBytes) {
      alert('File size too large. Maximum allowed size is 50MB.');
      return;
    }

    setUploadingSessionId(sessionId);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Uploading file ${selectedFile.name} for session ${sessionId}`);
      alert(`Data file "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploadingSessionId(null);
    }
  };

  const startSession = async (sessionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Starting session ${sessionId}`);
      alert('Session started successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error starting session. Please try again.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Render Overview Tab
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Sessions</p>
                <p className="text-3xl font-bold text-orange-600">{pendingSessions.length}</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-3xl font-bold text-blue-600">{activeSessions.length}</p>
              </div>
              <div className="text-3xl">🔄</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedSessions.length}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Files</p>
                <p className="text-3xl font-bold text-purple-600">{dataUploadedSessions.length}</p>
              </div>
              <div className="text-3xl">💾</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>🕒 Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{session.name}</h4>
                  <p className="text-sm text-gray-600">{session.machine?.name} - {session.machine?.location}</p>
                  <p className="text-xs text-gray-500">{timeAgo(session.updatedAt)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="status" status={session.status}>
                    {session.status.replace('_', ' ')}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push(`/sessions/${session.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => setActiveTab('sessions')}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <span className="text-2xl">📋</span>
              <span>View My Sessions</span>
            </Button>
            <Button 
              onClick={() => setActiveTab('upload')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <span className="text-2xl">📤</span>
              <span>Upload Data</span>
            </Button>
            <Button 
              onClick={() => setActiveTab('data')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <span className="text-2xl">💾</span>
              <span>View My Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Sessions Tab
  const renderSessionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Assigned Sessions</h2>
        <Badge className="text-sm">{assignedSessions.length} sessions</Badge>
      </div>

      {assignedSessions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions assigned</h3>
            <p className="text-gray-600">Check back later or contact your manager for new assignments.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignedSessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{session.name}</h3>
                    <p className="text-gray-600">{session.machine?.name} - {session.machine?.location}</p>
                  </div>
                  <Badge variant="status" status={session.status}>
                    {session.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Machine:</span>
                    <div className="font-medium">{session.machine?.serialNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Frequency:</span>
                    <div className="font-medium">{session.samplingFrequency} Hz</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Sensors:</span>
                    <div className="font-medium">{session.sensors.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <div className="font-medium">{timeAgo(session.createdAt)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {session.sensors.map((sensor) => (
                      <Badge key={sensor.id} variant="outline" className="text-xs">
                        {sensor.type.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    {session.status === 'assigned' && (
                      <Button
                        onClick={() => startSession(session.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Start Session
                      </Button>
                    )}
                    
                    {(session.status === 'in_progress' || session.status === 'assigned') && (
                      <Button
                        onClick={() => setActiveTab('upload')}
                        size="sm"
                        variant="outline"
                      >
                        Upload Data
                      </Button>
                    )}

                    <Button
                      onClick={() => router.push(`/sessions/${session.id}`)}
                      size="sm"
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // Render Upload Tab
  const renderUploadTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Upload Session Data</h2>
        <Badge className="text-sm">{activeSessions.length + pendingSessions.length} sessions available</Badge>
      </div>

      {/* File Upload Interface */}
      <Card>
        <CardHeader>
          <CardTitle>📁 Select Data File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-gray-400 text-6xl mb-4">📁</div>
                <p className="text-lg text-gray-600 mb-2">
                  Click to select a JSON data file
                </p>
                <p className="text-sm text-gray-500">
                  Maximum file size: 50MB
                </p>
              </label>
            </div>
            
            {selectedFile && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">{selectedFile.name}</p>
                    <p className="text-sm text-blue-700">
                      Size: {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Sessions for Upload */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Available Sessions for Data Upload</CardTitle>
        </CardHeader>
        <CardContent>
          {(activeSessions.length + pendingSessions.length) === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-600">No active sessions available for data upload.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...pendingSessions, ...activeSessions].map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{session.name}</h4>
                    <p className="text-sm text-gray-600">{session.machine?.name}</p>
                    <div className="flex gap-2 mt-2">
                      {session.sensors.map((sensor) => (
                        <Badge key={sensor.id} variant="outline" className="text-xs">
                          {sensor.type.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="status" status={session.status}>
                      {session.status.replace('_', ' ')}
                    </Badge>
                    <Button
                      onClick={() => handleFileUpload(session.id)}
                      size="sm"
                      disabled={!selectedFile}
                      isLoading={uploadingSessionId === session.id}
                    >
                      Upload Data
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Render Data Tab
  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Uploaded Data</h2>
        <Badge className="text-sm">{dataUploadedSessions.length} sessions with data</Badge>
      </div>

      {dataUploadedSessions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">💾</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data uploaded yet</h3>
            <p className="text-gray-600 mb-4">Start uploading data files for your sessions to see them here.</p>
            <Button onClick={() => setActiveTab('upload')}>
              Upload Data Files
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>📊 Data Files</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataUploadedSessions.map((session) =>
                  session.dataFiles?.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{session.name}</div>
                          <div className="text-sm text-gray-500">{session.machine?.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{file.fileName}</div>
                        <Badge className="text-xs mt-1 uppercase">{file.dataFormat}</Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                      <TableCell>{file.recordCount?.toLocaleString() || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDateTime(file.uploadedAt)}</div>
                        <div className="text-xs text-gray-500">{timeAgo(file.uploadedAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => router.push(`/sessions/${session.id}`)}
                          >
                            View Charts
                          </Button>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Technician Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <Badge className="ml-2 text-xs">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'sessions' && renderSessionsTab()}
      {activeTab === 'upload' && renderUploadTab()}
      {activeTab === 'data' && renderDataTab()}
    </div>
  );
}
