'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { TestSession } from '@/types';
import { timeAgo, formatDateTime } from '@/lib/utils';

// Tab navigation options
type TabType = 'overview' | 'sessions' | 'upload' | 'data';

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
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
];

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const router = useRouter();  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingSessionId, setUploadingSessionId] = useState<string | null>(null);

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
  const completedSessions = assignedSessions.filter(s => s.status === 'completed');  const handleFileUpload = async (sessionId: string) => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    // Validate file type (JSON)
    if (!selectedFile.name.endsWith('.json')) {
      alert('Please upload a JSON file');
      return;
    }

    // Validate file size (max 50MB)
    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSizeInBytes) {
      alert('File size too large. Maximum allowed size is 50MB.');
      return;
    }

    setUploadingSessionId(sessionId);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, you would upload to your backend
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
      // Simulate starting session
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Starting session ${sessionId}`);
      alert('Session started successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error starting session. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Technician Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-green-600">{completedSessions.length}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>📤 Upload Session Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Upload collected data files (JSON format) for your assigned sessions.
            </p>
            
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept=".json"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="flex-1"
              />
              
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="text-xs text-gray-500">
                Make sure your JSON file contains sensor data in the correct format with timestamps and sensor values.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assigned Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>📋 My Assigned Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedSessions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-gray-600">No sessions assigned to you yet.</p>
                <p className="text-sm text-gray-500 mt-2">Check back later or contact your manager.</p>
              </div>
            ) : (
              assignedSessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.name}</h3>
                      <p className="text-sm text-gray-600">
                        {session.machine?.name} - {session.machine?.location}
                      </p>
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
                      
                      {(session.status === 'in_progress' || session.status === 'assigned') && selectedFile && (
                        <Button
                          onClick={() => handleFileUpload(session.id)}
                          size="sm"
                          variant="outline"
                          isLoading={uploadingSessionId === session.id}
                          disabled={!selectedFile}
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
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
