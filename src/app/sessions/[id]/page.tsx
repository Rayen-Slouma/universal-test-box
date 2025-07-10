'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FakeLineChart } from '@/components/ui/FakeLineChart';
import { FakeBarChart } from '@/components/ui/FakeBarChart';
import { FakeGaugeChart } from '@/components/ui/FakeGaugeChart';
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

// Helper function to safely get metric value from chart data
const getMetricValue = (
  dataPoint: { timestamp: Date; temperature?: number; pressure?: number; vibration?: number; speed?: number; current?: number; },
  metric: string
): number => {
  switch (metric) {
    case 'temperature': return dataPoint.temperature || 0;
    case 'pressure': return dataPoint.pressure || 0;
    case 'vibration': return dataPoint.vibration || 0;
    case 'speed': return dataPoint.speed || 0;
    case 'current': return dataPoint.current || 0;
    default: return 0;
  }
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
    // Solution submission form state
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [solutionFormData, setSolutionFormData] = useState({
    description: '',
    stepsPerformed: [''],
    recommendations: '',
  });
  
  // Closure request form state
  const [showClosureForm, setShowClosureForm] = useState(false);
  const [closureReason, setClosureReason] = useState('');
  
  // Chart visualization state
  const [selectedMetric, setSelectedMetric] = useState<string>('temperature');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'gauge'>('line');

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
  const canUploadData = () => {
    if (!session || !user) return false;
    
    // Only assigned technician can upload data
    if (user.role === 'technician') {
      return session.assignedTo.id === user.id && session.status !== 'completed';
    }
    
    return false;
  };

  const canSubmitSolution = () => {
    if (!session || !user) return false;
    
    // Only assigned technician can submit solutions
    if (user.role === 'technician') {
      return session.assignedTo.id === user.id && 
             session.status === 'analysis_complete' && 
             !session.solution &&
             hasPermission('submit_solution');
    }
    
    return false;
  };

  const canRequestClosure = () => {
    if (!session || !user) return false;
    
    // Only assigned technician can request closure
    if (user.role === 'technician') {
      return session.assignedTo.id === user.id && 
             session.status === 'solution_submitted' && 
             session.solution?.approved &&
             !session.closureRequest &&
             hasPermission('request_session_closure');
    }
    
    return false;
  };

  const canReviewSolution = () => {
    if (!session || !user) return false;
    
    // Only managers can review solutions
    if (user.role === 'maintenance_manager') {
      return session.solution && 
             !session.solution.approved &&
             hasPermission('review_solutions');
    }
    
    return false;
  };

  const canCloseSessions = () => {
    if (!session || !user) return false;
    
    // Only managers can close sessions
    if (user.role === 'maintenance_manager') {
      return session.closureRequest && 
             !session.closureRequest.approved &&
             hasPermission('close_sessions');
    }
    
    return false;
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

  const handleStopSession = () => {
    if (session) {
      setSession({
        ...session,
        status: 'completed',
        endTime: new Date(),
        updatedAt: new Date(),
      });
    }
  };
  const handleDeleteSession = () => {
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      router.push('/sessions');
    }
  };

  const handleSubmitSolution = () => {
    if (!session || !user) return;
    
    const solution: SessionSolution = {
      id: `sol_${Date.now()}`,
      sessionId: session.id,
      description: solutionFormData.description,
      stepsPerformed: solutionFormData.stepsPerformed.filter(step => step.trim() !== ''),
      recommendations: solutionFormData.recommendations,
      submittedBy: user,
      submittedAt: new Date(),
      approved: false,
    };
    
    setSession({
      ...session,
      status: 'solution_submitted',
      solution,
      updatedAt: new Date(),
    });
    
    setShowSolutionForm(false);
    setSolutionFormData({
      description: '',
      stepsPerformed: [''],
      recommendations: '',
    });
  };  const handleRequestClosure = () => {
    if (!session || !user) return;
    
    const closureRequest: SessionClosureRequest = {
      id: `cr_${Date.now()}`,
      sessionId: session.id,
      requestedBy: user,
      requestedAt: new Date(),
      reason: closureReason,
      solutionId: session.solution?.id,
      approved: false,
    };
    
    setSession({
      ...session,
      closureRequest,
      updatedAt: new Date(),
    });
    
    setShowClosureForm(false);
    setClosureReason('');
  };

  const handleApproveSolution = () => {
    if (!session || !session.solution || !user) return;
    
    const updatedSolution: SessionSolution = {
      ...session.solution,
      approved: true,
      reviewedBy: user,
      reviewedAt: new Date(),
    };
    
    setSession({
      ...session,
      solution: updatedSolution,
      updatedAt: new Date(),
    });
  };

  const handleApproveClosureRequest = () => {
    if (!session || !session.closureRequest || !user) return;
    
    const updatedClosureRequest: SessionClosureRequest = {
      ...session.closureRequest,
      approved: true,
      reviewedBy: user,
      reviewedAt: new Date(),
    };
    
    setSession({
      ...session,
      status: 'completed',
      closureRequest: updatedClosureRequest,
      endTime: new Date(),
      updatedAt: new Date(),
    });
  };

  const addSolutionStep = () => {
    setSolutionFormData({
      ...solutionFormData,
      stepsPerformed: [...solutionFormData.stepsPerformed, ''],
    });
  };

  const removeSolutionStep = (index: number) => {
    setSolutionFormData({
      ...solutionFormData,
      stepsPerformed: solutionFormData.stepsPerformed.filter((_, i) => i !== index),
    });
  };

  const updateSolutionStep = (index: number, value: string) => {
    const updatedSteps = [...solutionFormData.stepsPerformed];
    updatedSteps[index] = value;
    setSolutionFormData({
      ...solutionFormData,
      stepsPerformed: updatedSteps,
    });
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
          {canUploadData() && (
            <Button 
              onClick={() => router.push(`/technician?session=${session.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Upload Data
            </Button>
          )}
          {canSubmitSolution() && (
            <Button 
              onClick={() => setShowSolutionForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Submit Solution
            </Button>
          )}
          {canRequestClosure() && (
            <Button 
              onClick={() => setShowClosureForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Request Closure
            </Button>
          )}
          {canReviewSolution() && (
            <Button 
              onClick={handleApproveSolution}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Approve Solution
            </Button>
          )}
          {canCloseSessions() && (
            <Button 
              onClick={handleApproveClosureRequest}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Close Session
            </Button>
          )}
          {session.status === 'in_progress' && canEditSession() && (
            <Button 
              variant="danger"
              onClick={handleStopSession}
            >
              Stop Session
            </Button>
          )}
          {canEditSession() && (
            <Button 
              variant="danger"
              onClick={handleDeleteSession}
            >
              Delete
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
          </CardContent>        </Card>
      )}

      {/* Solution Section */}
      {session.solution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Solution</span>              <div className="flex items-center space-x-2">
                <Badge variant="status" status={session.solution.approved ? 'approved' : 'pending'}>
                  {session.solution.approved ? 'Approved' : 'Pending Review'}
                </Badge>
                {session.solution.reviewedBy && (
                  <span className="text-sm text-gray-500">
                    Reviewed by {session.solution.reviewedBy.name}
                  </span>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1">{session.solution.description}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Steps Performed</label>
              <ol className="mt-1 space-y-1">
                {session.solution.stepsPerformed.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 text-sm mr-2">{index + 1}.</span>
                    <span className="text-gray-900">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            {session.solution.recommendations && (
              <div>
                <label className="text-sm font-medium text-gray-500">Recommendations</label>
                <p className="text-gray-900 mt-1">{session.solution.recommendations}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Submitted by {session.solution.submittedBy.name}</span>
              <span>•</span>
              <span>{timeAgo(session.solution.submittedAt)}</span>
              {session.solution.reviewedAt && (
                <>
                  <span>•</span>
                  <span>Reviewed {timeAgo(session.solution.reviewedAt)}</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Closure Request Section */}
      {session.closureRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Closure Request</span>              <div className="flex items-center space-x-2">
                <Badge variant="status" status={session.closureRequest.approved ? 'approved' : 'pending'}>
                  {session.closureRequest.approved ? 'Approved' : 'Pending Review'}
                </Badge>
                {session.closureRequest.reviewedBy && (
                  <span className="text-sm text-gray-500">
                    Reviewed by {session.closureRequest.reviewedBy.name}
                  </span>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Reason</label>
              <p className="text-gray-900 mt-1">{session.closureRequest.reason}</p>
            </div>
            
            {session.closureRequest.comments && (
              <div>
                <label className="text-sm font-medium text-gray-500">Manager Comments</label>
                <p className="text-gray-900 mt-1">{session.closureRequest.comments}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Requested by {session.closureRequest.requestedBy.name}</span>
              <span>•</span>
              <span>{timeAgo(session.closureRequest.requestedAt)}</span>
              {session.closureRequest.reviewedAt && (
                <>
                  <span>•</span>
                  <span>Reviewed {timeAgo(session.closureRequest.reviewedAt)}</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solution Submission Modal */}
      {showSolutionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Submit Solution</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowSolutionForm(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution Description *
                </label>
                <textarea
                  value={solutionFormData.description}
                  onChange={(e) => setSolutionFormData({
                    ...solutionFormData,
                    description: e.target.value
                  })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the solution implemented..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Steps Performed *
                </label>
                {solutionFormData.stepsPerformed.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <span className="text-gray-400 text-sm">{index + 1}.</span>
                    <Input
                      value={step}
                      onChange={(e) => updateSolutionStep(index, e.target.value)}
                      placeholder="Describe step performed..."
                      className="flex-1"
                    />
                    {solutionFormData.stepsPerformed.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeSolutionStep(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addSolutionStep}
                  className="mt-2"
                >
                  Add Step
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendations
                </label>
                <textarea
                  value={solutionFormData.recommendations}
                  onChange={(e) => setSolutionFormData({
                    ...solutionFormData,
                    recommendations: e.target.value
                  })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Future recommendations..."
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSolutionForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitSolution}
                  disabled={!solutionFormData.description.trim() || 
                           solutionFormData.stepsPerformed.every(step => !step.trim())}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Solution
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Closure Request Modal */}
      {showClosureForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Request Session Closure</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowClosureForm(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Closure *
                </label>
                <textarea
                  value={closureReason}
                  onChange={(e) => setClosureReason(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Explain why this session should be closed..."
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowClosureForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRequestClosure}
                  disabled={!closureReason.trim()}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Submit Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Files*/}
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
              {canUploadData() && (
                <Button 
                  className="mt-4"
                  onClick={() => router.push(`/technician?session=${session.id}`)}
                >
                  Upload Data Files
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>      {/* Data Visualization */}
      {selectedDataFile && chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Visualization - {selectedDataFile.fileName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Showing sample data from {selectedDataFile.fileName} 
                ({chartData.length} of {selectedDataFile.recordCount} records)
              </p>
              
              {/* Chart Controls */}
              <div className="flex flex-wrap gap-4 mb-6">                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Metric:</label>
                  <Select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="w-40"
                    options={[
                      { value: 'temperature', label: 'Temperature' },
                      { value: 'pressure', label: 'Pressure' },
                      { value: 'vibration', label: 'Vibration' },
                      { value: 'speed', label: 'Speed' },
                      { value: 'current', label: 'Current' }
                    ]}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Chart Type:</label>                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={chartType === 'line' ? 'primary' : 'outline'}
                      onClick={() => setChartType('line')}
                    >
                      📈 Line
                    </Button>
                    <Button
                      size="sm"
                      variant={chartType === 'bar' ? 'primary' : 'outline'}
                      onClick={() => setChartType('bar')}
                    >
                      📊 Bar
                    </Button>
                    <Button
                      size="sm"
                      variant={chartType === 'gauge' ? 'primary' : 'outline'}
                      onClick={() => setChartType('gauge')}
                    >
                      🎯 Gauge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chart Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chartType === 'line' && (
                <>
                  <FakeLineChart
                    data={chartData}
                    dataKey={selectedMetric}
                    title={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Over Time`}
                    color="#3B82F6"
                    unit={selectedMetric === 'temperature' ? '°C' : 
                          selectedMetric === 'pressure' ? ' bar' :
                          selectedMetric === 'vibration' ? ' m/s²' :
                          selectedMetric === 'speed' ? ' RPM' :
                          selectedMetric === 'current' ? ' A' : ''}
                  />
                  <FakeLineChart
                    data={chartData}
                    dataKey={selectedMetric === 'temperature' ? 'pressure' : 'temperature'}
                    title={`${selectedMetric === 'temperature' ? 'Pressure' : 'Temperature'} Correlation`}
                    color="#10B981"
                    unit={selectedMetric === 'temperature' ? ' bar' : '°C'}
                  />
                </>
              )}
              
              {chartType === 'bar' && (
                <>
                  <FakeBarChart
                    data={chartData}
                    dataKey={selectedMetric}
                    title={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Distribution`}
                    color="#10B981"
                    unit={selectedMetric === 'temperature' ? '°C' : 
                          selectedMetric === 'pressure' ? ' bar' :
                          selectedMetric === 'vibration' ? ' m/s²' :
                          selectedMetric === 'speed' ? ' RPM' :
                          selectedMetric === 'current' ? ' A' : ''}
                  />
                  <FakeBarChart
                    data={chartData}
                    dataKey={selectedMetric === 'temperature' ? 'vibration' : 'temperature'}
                    title={`${selectedMetric === 'temperature' ? 'Vibration' : 'Temperature'} Analysis`}
                    color="#F59E0B"
                    unit={selectedMetric === 'temperature' ? ' m/s²' : '°C'}
                  />
                </>
              )}
              
              {chartType === 'gauge' && (
                <>                  <FakeGaugeChart
                    value={chartData.length > 0 ? getMetricValue(chartData[chartData.length - 1], selectedMetric) : 0}
                    min={Math.min(...chartData.map(d => getMetricValue(d, selectedMetric)).filter(v => v !== undefined))}
                    max={Math.max(...chartData.map(d => getMetricValue(d, selectedMetric)).filter(v => v !== undefined))}
                    title={`Current ${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}`}
                    unit={selectedMetric === 'temperature' ? '°C' : 
                          selectedMetric === 'pressure' ? ' bar' :
                          selectedMetric === 'vibration' ? ' m/s²' :
                          selectedMetric === 'speed' ? ' RPM' :
                          selectedMetric === 'current' ? ' A' : ''}
                    thresholds={
                      selectedMetric === 'temperature' ? { low: 20, high: 30 } :
                      selectedMetric === 'pressure' ? { low: 100, high: 140 } :
                      selectedMetric === 'vibration' ? { low: 0, high: 3 } :
                      selectedMetric === 'speed' ? { low: 1800, high: 2000 } :
                      selectedMetric === 'current' ? { low: 10, high: 14 } :
                      undefined
                    }
                  />
                  <div className="space-y-4">
                    <FakeGaugeChart
                      value={chartData.length > 0 ? chartData[chartData.length - 1].pressure as number : 0}
                      min={Math.min(...chartData.map(d => d.pressure as number).filter(v => v !== undefined))}
                      max={Math.max(...chartData.map(d => d.pressure as number).filter(v => v !== undefined))}
                      title="System Pressure"
                      unit=" bar"
                      color="#EF4444"
                      thresholds={{ low: 100, high: 140 }}
                    />
                    <FakeGaugeChart
                      value={chartData.length > 0 ? chartData[chartData.length - 1].vibration as number : 0}
                      min={0}
                      max={5}
                      title="Vibration Level"
                      unit=" m/s²"
                      color="#F59E0B"
                      thresholds={{ low: 0, high: 3 }}
                    />
                  </div>
                </>
              )}
            </div>
              {/* Summary Statistics */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold mb-3 text-gray-900">Data Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['temperature', 'pressure', 'vibration', 'speed', 'current'].map(metric => {
                  const values = chartData.map(d => getMetricValue(d, metric)).filter(v => v !== undefined);
                  if (values.length === 0) return null;
                  
                  const min = Math.min(...values);
                  const max = Math.max(...values);
                  const avg = values.reduce((a, b) => a + b, 0) / values.length;
                  const unit = metric === 'temperature' ? '°C' : 
                              metric === 'pressure' ? ' bar' :
                              metric === 'vibration' ? ' m/s²' :
                              metric === 'speed' ? ' RPM' :
                              metric === 'current' ? ' A' : '';
                  
                  return (
                    <div key={metric} className="bg-white p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 capitalize">{metric}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <div>Min: {min.toFixed(1)}{unit}</div>
                        <div>Max: {max.toFixed(1)}{unit}</div>
                        <div>Avg: {avg.toFixed(1)}{unit}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
