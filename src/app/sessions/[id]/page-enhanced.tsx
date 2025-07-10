'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { useAuth, usePermissions } from '@/contexts/AuthContext';
import { formatDateTime, formatDuration, timeAgo } from '@/lib/utils';
import { TestSession, SessionDataFile, SessionSolution, SessionClosureRequest } from '@/types';

// Mock session detail data with enhanced workflow
const getMockSession = (id: string): TestSession | null => {
  const sessions: TestSession[] = [
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
          fileSize: 2048576, // 2MB
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
    },
    {
      id: '2',
      name: 'CNC Vibration Analysis - Completed',
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
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      samplingFrequency: 20,
      status: 'completed',
      data: [],
      dataFiles: [
        {
          id: 'df2',
          sessionId: '2',
          fileName: 'cnc_vibration_analysis.json',
          filePath: '/uploads/sessions/2/cnc_vibration_analysis.json',
          fileSize: 3145728, // 3MB
          uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
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
        sessionId: '2',
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
        submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        reviewedBy: {
          id: '2',
          email: 'manager@testbox.com',
          name: 'Manager Smith',
          role: 'maintenance_manager',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        reviewedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        approved: true,
      },
      closureRequest: {
        id: 'cr1',
        sessionId: '2',
        requestedBy: {
          id: '1',
          email: 'tech1@testbox.com',
          name: 'John Technician',
          role: 'technician',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        requestedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
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
        reviewedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        comments: 'Excellent work. Solution is approved and effective.',
      },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ];

  return sessions.find(s => s.id === id) || null;
};

// Mock chart data generator
const generateChartData = (dataFile: SessionDataFile) => {
  const records = dataFile.recordCount || 100;
  const data = [];
  
  for (let i = 0; i < Math.min(records, 50); i++) {
    data.push({
      timestamp: new Date(Date.now() - (50 - i) * 60 * 1000),
      temperature: 20 + Math.random() * 10,
      pressure: 100 + Math.random() * 50,
      vibration: Math.random() * 5,
      speed: 1800 + Math.random() * 200,
      current: 10 + Math.random() * 5,
    });
  }
  
  return data;
};

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [session, setSession] = useState<TestSession | null>(null);
  const [selectedDataFile, setSelectedDataFile] = useState<SessionDataFile | null>(null);
  const [chartData, setChartData] = useState<Array<{
    timestamp: Date;
    temperature?: number;
    pressure?: number;
    vibration?: number;
    speed?: number;
    current?: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Solution submission state
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [solutionDescription, setSolutionDescription] = useState('');
  const [stepsPerformed, setStepsPerformed] = useState(['']);
  const [recommendations, setRecommendations] = useState('');
  const [closureReason, setClosureReason] = useState('');

  const sessionId = params?.id as string;

  useEffect(() => {
    if (sessionId) {
      const mockSession = getMockSession(sessionId);
      setSession(mockSession);
      setIsLoading(false);
      
      // Auto-select first data file for chart
      if (mockSession?.dataFiles && mockSession.dataFiles.length > 0) {
        setSelectedDataFile(mockSession.dataFiles[0]);
        setChartData(generateChartData(mockSession.dataFiles[0]));
      }
    }
  }, [sessionId]);

  // Check access permissions
  const canViewSession = () => {
    if (!session || !user) return false;
    
    // Technicians can only view their assigned sessions
    if (user.role === 'technician') {
      return session.assignedTo.id === user.id;
    }
    
    // Managers can view all sessions
    return hasPermission('view_all_sessions');
  };

  const canEditSession = () => {
    return hasPermission('edit_sessions') && session?.status !== 'completed';
  };

  const canSubmitSolution = () => {
    if (!session || !user) return false;
    
    // Only assigned technician can submit solution after data upload
    if (user.role === 'technician') {
      return session.assignedTo.id === user.id && 
             (session.status === 'data_uploaded' || session.status === 'analysis_complete') &&
             !session.solution;
    }
    
    return false;
  };

  const canRequestClosure = () => {
    if (!session || !user) return false;
    
    // Only assigned technician can request closure after submitting solution
    if (user.role === 'technician') {
      return session.assignedTo.id === user.id && 
             session.solution && 
             !session.closureRequest;
    }
    
    return false;
  };

  const canClosureSession = () => {
    return hasPermission('close_sessions') && 
           session?.closureRequest && 
           !session.closureRequest.approved;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateDuration = (): string => {
    if (!session) return '';
    
    if (session.endTime) {
      const duration = session.endTime.getTime() - session.startTime.getTime();
      return formatDuration(Math.floor(duration / (1000 * 60)));
    } else {
      const duration = new Date().getTime() - session.startTime.getTime();
      return formatDuration(Math.floor(duration / (1000 * 60))) + ' (ongoing)';
    }
  };

  const handleMarkAnalysisComplete = () => {
    if (session) {
      setSession({
        ...session,
        status: 'analysis_complete',
        updatedAt: new Date(),
      });
    }
  };

  const addStep = () => {
    setStepsPerformed([...stepsPerformed, '']);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...stepsPerformed];
    newSteps[index] = value;
    setStepsPerformed(newSteps);
  };

  const removeStep = (index: number) => {
    if (stepsPerformed.length > 1) {
      setStepsPerformed(stepsPerformed.filter((_, i) => i !== index));
    }
  };

  const handleSubmitSolution = async () => {
    if (!session || !user) return;

    const filteredSteps = stepsPerformed.filter(step => step.trim() !== '');
    
    if (!solutionDescription.trim() || filteredSteps.length === 0) {
      alert('Please provide a description and at least one step performed.');
      return;
    }

    try {
      // Simulate solution submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSolution: SessionSolution = {
        id: 'sol_' + Date.now(),
        sessionId: session.id,
        description: solutionDescription,
        stepsPerformed: filteredSteps,
        recommendations: recommendations || undefined,
        submittedBy: user,
        submittedAt: new Date(),
        approved: false,
      };

      setSession({
        ...session,
        solution: newSolution,
        status: 'solution_submitted',
        updatedAt: new Date(),
      });

      setShowSolutionForm(false);
      alert('Solution submitted successfully!');
    } catch (error) {
      console.error('Error submitting solution:', error);
      alert('Error submitting solution. Please try again.');
    }
  };

  const handleRequestClosure = async () => {
    if (!session || !user || !session.solution) return;

    if (!closureReason.trim()) {
      alert('Please provide a reason for closure.');
      return;
    }

    try {
      // Simulate closure request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClosureRequest: SessionClosureRequest = {
        id: 'cr_' + Date.now(),
        sessionId: session.id,
        requestedBy: user,
        requestedAt: new Date(),
        reason: closureReason,
        solutionId: session.solution.id,
        approved: false,
      };

      setSession({
        ...session,
        closureRequest: newClosureRequest,
        updatedAt: new Date(),
      });

      setClosureReason('');
      alert('Closure request submitted successfully!');
    } catch (error) {
      console.error('Error requesting closure:', error);
      alert('Error submitting closure request. Please try again.');
    }
  };

  const handleApproveClosureRequest = async () => {
    if (!session || !session.closureRequest) return;

    try {
      // Simulate approval
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSession({
        ...session,
        status: 'completed',
        endTime: new Date(),
        closureRequest: {
          ...session.closureRequest,
          approved: true,
          reviewedBy: user!,
          reviewedAt: new Date(),
          comments: 'Session closed successfully.',
        },
        updatedAt: new Date(),
      });

      alert('Session closed successfully!');
    } catch (error) {
      console.error('Error closing session:', error);
      alert('Error closing session. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading session details...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-gray-600">Session not found</div>
        <Button onClick={() => router.push('/sessions')}>
          Back to Sessions
        </Button>
      </div>
    );
  }

  if (!canViewSession()) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600">You don&apos;t have permission to view this session</div>
        <Button onClick={() => router.push('/sessions')}>
          Back to Sessions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/sessions')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Sessions
            </Button>
            <Badge variant="status" status={session.status}>
              {session.status.replace('_', ' ')}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
          <p className="text-gray-600">{session.machine?.name} - {session.machine?.location}</p>
        </div>
        
        <div className="flex space-x-2">
          {session.status === 'data_uploaded' && canSubmitSolution() && (
            <Button 
              onClick={handleMarkAnalysisComplete}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Mark Analysis Complete
            </Button>
          )}
          {canSubmitSolution() && (
            <Button 
              onClick={() => setShowSolutionForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit Solution
            </Button>
          )}
          {canClosureSession() && (
            <Button 
              onClick={handleApproveClosureRequest}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Approve & Close Session
            </Button>
          )}
        </div>
      </div>

      {/* Session Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Info */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Machine</label>
              <p className="text-gray-900">{session.machine?.name}</p>
              <p className="text-sm text-gray-500">{session.machine?.serialNumber}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Assigned Technician</label>
              <p className="text-gray-900">{session.assignedTo.name}</p>
              <p className="text-sm text-gray-500">{session.assignedTo.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="text-gray-900">{session.createdBy.name}</p>
              <p className="text-sm text-gray-500">{session.createdBy.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Sampling Frequency</label>
              <p className="text-gray-900">{session.samplingFrequency} Hz</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Duration</label>
              <p className="text-gray-900">{calculateDuration()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timing */}
        <Card>
          <CardHeader>
            <CardTitle>Timing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">{formatDateTime(session.createdAt)}</p>
              <p className="text-sm text-gray-500">{timeAgo(session.createdAt)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Started</label>
              <p className="text-gray-900">{formatDateTime(session.startTime)}</p>
              <p className="text-sm text-gray-500">{timeAgo(session.startTime)}</p>
            </div>
            
            {session.endTime && (
              <div>
                <label className="text-sm font-medium text-gray-500">Ended</label>
                <p className="text-gray-900">{formatDateTime(session.endTime)}</p>
                <p className="text-sm text-gray-500">{timeAgo(session.endTime)}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900">{formatDateTime(session.updatedAt)}</p>
              <p className="text-sm text-gray-500">{timeAgo(session.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sensors */}
        <Card>
          <CardHeader>
            <CardTitle>Sensors ({session.sensors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {session.sensors.map((sensor) => (
                <div key={sensor.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sensor.name}</p>
                    <p className="text-xs text-gray-500">{sensor.description}</p>
                  </div>
                  <Badge className="text-xs">
                    {sensor.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {session.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900">{session.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Solution Section */}
      {session.solution && (
        <Card>
          <CardHeader>
            <CardTitle>🔧 Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{session.solution.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Steps Performed</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {session.solution.stepsPerformed.map((step, index) => (
                    <li key={index} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
              
              {session.solution.recommendations && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                  <p className="text-gray-700">{session.solution.recommendations}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">
                    Submitted by {session.solution.submittedBy.name} on {formatDateTime(session.solution.submittedAt)}
                  </p>
                  {session.solution.reviewedBy && (
                    <p className="text-sm text-gray-600">
                      Reviewed by {session.solution.reviewedBy.name} on {formatDateTime(session.solution.reviewedAt!)}
                    </p>
                  )}
                </div>
                <Badge variant={session.solution.approved ? 'success' : 'warning'}>
                  {session.solution.approved ? 'Approved' : 'Pending Review'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Closure Request Section */}
      {session.closureRequest && (
        <Card>
          <CardHeader>
            <CardTitle>🏁 Closure Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Reason for Closure</h4>
                <p className="text-gray-700">{session.closureRequest.reason}</p>
              </div>
              
              {session.closureRequest.comments && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Manager Comments</h4>
                  <p className="text-gray-700">{session.closureRequest.comments}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">
                    Requested by {session.closureRequest.requestedBy.name} on {formatDateTime(session.closureRequest.requestedAt)}
                  </p>
                  {session.closureRequest.reviewedBy && (
                    <p className="text-sm text-gray-600">
                      Reviewed by {session.closureRequest.reviewedBy.name} on {formatDateTime(session.closureRequest.reviewedAt!)}
                    </p>
                  )}
                </div>
                <Badge variant={session.closureRequest.approved ? 'success' : 'warning'}>
                  {session.closureRequest.approved ? 'Approved' : 'Pending Review'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Files */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Data Files ({session.dataFiles?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {session.dataFiles && session.dataFiles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Upload Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {session.dataFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{file.fileName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="text-xs uppercase">
                        {file.dataFormat}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                    <TableCell>{file.recordCount?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{file.uploadedBy.name}</div>
                      <div className="text-xs text-gray-500">{file.uploadedBy.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{formatDateTime(file.uploadedAt)}</div>
                      <div className="text-xs text-gray-500">{timeAgo(file.uploadedAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedDataFile(file);
                            setChartData(generateChartData(file));
                          }}
                        >
                          View Chart
                        </Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p>No data files uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Visualization */}
      {selectedDataFile && chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Visualization - {selectedDataFile.fileName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing sample data from {selectedDataFile.fileName} 
                ({chartData.length} of {selectedDataFile.recordCount} records)
              </p>
            </div>
            
            {/* Simple data table as placeholder for charts */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">Sample Data Points:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {chartData.slice(0, 3).map((point, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg">
                    <div className="text-xs text-gray-500">
                      {formatDateTime(point.timestamp)}
                    </div>
                    <div className="mt-2 space-y-1">
                      {point.temperature && (
                        <div className="flex justify-between">
                          <span className="text-sm">Temperature:</span>
                          <span className="text-sm font-medium">{point.temperature.toFixed(2)}°C</span>
                        </div>
                      )}
                      {point.pressure && (
                        <div className="flex justify-between">
                          <span className="text-sm">Pressure:</span>
                          <span className="text-sm font-medium">{point.pressure.toFixed(2)} bar</span>
                        </div>
                      )}
                      {point.vibration && (
                        <div className="flex justify-between">
                          <span className="text-sm">Vibration:</span>
                          <span className="text-sm font-medium">{point.vibration.toFixed(2)} m/s²</span>
                        </div>
                      )}
                      {point.speed && (
                        <div className="flex justify-between">
                          <span className="text-sm">Speed:</span>
                          <span className="text-sm font-medium">{point.speed.toFixed(0)} RPM</span>
                        </div>
                      )}
                      {point.current && (
                        <div className="flex justify-between">
                          <span className="text-sm">Current:</span>
                          <span className="text-sm font-medium">{point.current.toFixed(2)} A</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  📈 Interactive charts and detailed analytics will be implemented in the next phase
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons for Technicians */}
      {user?.role === 'technician' && session.assignedTo.id === user.id && (
        <Card>
          <CardHeader>
            <CardTitle>🎯 Available Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {canSubmitSolution() && (
                <Button 
                  onClick={() => setShowSolutionForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit Solution
                </Button>
              )}
              
              {canRequestClosure() && (
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Reason for closure request..."
                    value={closureReason}
                    onChange={(e) => setClosureReason(e.target.value)}
                    className="min-w-80"
                  />
                  <Button 
                    onClick={handleRequestClosure}
                    className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                  >
                    Request Closure
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solution Submission Form Modal */}
      {showSolutionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Submit Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Solution Description *
                </label>
                <textarea
                  value={solutionDescription}
                  onChange={(e) => setSolutionDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Describe the problem identified and how it was resolved..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Steps Performed *
                </label>
                {stepsPerformed.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                    <Input
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder="Describe the step performed..."
                      className="flex-1"
                    />
                    {stepsPerformed.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeStep(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addStep}>
                  Add Step
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recommendations (Optional)
                </label>
                <textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Any recommendations for future maintenance or monitoring..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowSolutionForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitSolution}>
                  Submit Solution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
