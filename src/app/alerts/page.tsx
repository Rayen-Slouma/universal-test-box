'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert, AlertType, AlertSeverity } from '@/types';
import { formatDateTime, timeAgo } from '@/lib/utils';

// Mock alert data
const mockAlerts: Alert[] = [
  {
    id: '1',
    machineId: 'machine-1',
    machine: {
      id: 'machine-1',
      name: 'Production Line A',
      location: 'Factory Floor 1',
      type: 'Assembly Line',
      serialNumber: 'PLA-2024-001',
      status: 'operational',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-26'),
    },
    type: 'sensor_threshold',
    severity: 'warning',
    message: 'Vibration sensor threshold exceeded',
    description: 'Vibration levels have exceeded normal operating parameters for the past 15 minutes. Recommend inspection.',
    isRead: false,
    createdAt: new Date('2024-06-26T09:30:00'),
    assignedTo: [],
  },
  {
    id: '2',
    machineId: 'machine-2',
    machine: {
      id: 'machine-2',
      name: 'Hydraulic Press B',
      location: 'Factory Floor 2',
      type: 'Hydraulic Press',
      serialNumber: 'HPB-2024-002',
      status: 'maintenance',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-06-26'),
    },
    type: 'predictive_maintenance',
    severity: 'critical',
    message: 'Bearing failure predicted within 7 days',
    description: 'Machine learning analysis indicates high probability of bearing failure. Schedule immediate maintenance.',
    isRead: false,
    createdAt: new Date('2024-06-26T08:15:00'),
    assignedTo: [],
  },
  {
    id: '3',
    machineId: 'machine-3',
    machine: {
      id: 'machine-3',
      name: 'Cooling System A',
      location: 'Factory Floor 1',
      type: 'Cooling System',
      serialNumber: 'CSA-2024-003',
      status: 'operational',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-06-26'),
    },
    type: 'maintenance_due',
    severity: 'info',
    message: 'Scheduled maintenance due in 3 days',
    description: 'Regular maintenance schedule indicates service is due on June 29, 2024.',
    isRead: true,
    createdAt: new Date('2024-06-26T07:00:00'),
    assignedTo: [],
  },
  {
    id: '4',
    machineId: 'machine-4',
    machine: {
      id: 'machine-4',
      name: 'Compressor Unit C',
      location: 'Factory Floor 2',
      type: 'Compressor',
      serialNumber: 'CUC-2024-004',
      status: 'operational',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-06-26'),
    },
    type: 'failure_detected',
    severity: 'error',
    message: 'Abnormal temperature readings detected',
    description: 'Temperature sensors show readings 15°C above normal operating range. Immediate attention required.',
    isRead: false,
    createdAt: new Date('2024-06-26T11:45:00'),
    assignedTo: [],
  },
  {
    id: '5',
    machineId: 'machine-5',
    machine: {
      id: 'machine-5',
      name: 'Conveyor Belt D',
      location: 'Factory Floor 1',
      type: 'Conveyor System',
      serialNumber: 'CBD-2024-005',
      status: 'operational',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-06-26'),
    },
    type: 'system_error',
    severity: 'warning',
    message: 'Communication timeout with sensor module',
    description: 'Lost communication with temperature sensor module. Check network connection and sensor status.',
    isRead: true,
    createdAt: new Date('2024-06-25T16:20:00'),
    resolvedAt: new Date('2024-06-26T08:30:00'),
    assignedTo: [],
  },
];

const alertTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'sensor_threshold', label: 'Sensor Threshold' },
  { value: 'predictive_maintenance', label: 'Predictive Maintenance' },
  { value: 'failure_detected', label: 'Failure Detected' },
  { value: 'maintenance_due', label: 'Maintenance Due' },
  { value: 'system_error', label: 'System Error' },
];

const severityOptions = [
  { value: '', label: 'All Severities' },
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'critical', label: 'Critical' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'resolved', label: 'Resolved' },
];

export default function AlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<AlertType | ''>('');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | ''>('');
  const [statusFilter, setStatusFilter] = useState<'unread' | 'read' | 'resolved' | ''>('');

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = 
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.machine?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || alert.type === typeFilter;
    const matchesSeverity = !severityFilter || alert.severity === severityFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'unread') matchesStatus = !alert.isRead && !alert.resolvedAt;
    else if (statusFilter === 'read') matchesStatus = alert.isRead && !alert.resolvedAt;
    else if (statusFilter === 'resolved') matchesStatus = !!alert.resolvedAt;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  // Statistics
  const stats = {
    total: alerts.length,
    unread: alerts.filter(a => !a.isRead && !a.resolvedAt).length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolvedAt).length,
    resolved: alerts.filter(a => !!a.resolvedAt).length,
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, isRead: true, resolvedAt: new Date() }
          : alert
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, isRead: true }))
    );
  };

  const getAlertIcon = (type: AlertType, severity: AlertSeverity) => {
    if (severity === 'critical') return '🚨';
    if (type === 'failure_detected') return '❌';
    if (type === 'predictive_maintenance') return '🔮';
    if (type === 'maintenance_due') return '🔧';
    if (type === 'sensor_threshold') return '📊';
    return '⚠️';
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'error': return 'text-red-500 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage system alerts and notifications
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
          <Button>
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as AlertType)}
              options={alertTypeOptions}
            />
            <Select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity)}
              options={severityOptions}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              options={statusOptions}
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
                setSeverityFilter('');
                setStatusFilter('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Alerts ({filteredAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 border rounded-lg ${
                  !alert.isRead && !alert.resolvedAt 
                    ? 'bg-blue-50 border-blue-200' 
                    : alert.resolvedAt
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">
                      {getAlertIcon(alert.type, alert.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{alert.message}</h4>
                        {!alert.isRead && !alert.resolvedAt && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{alert.machine?.name}</span>
                        <span>•</span>
                        <span>{formatDateTime(alert.createdAt)}</span>
                        <span>•</span>
                        <span>{timeAgo(alert.createdAt)}</span>
                        {alert.resolvedAt && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">
                              Resolved {timeAgo(alert.resolvedAt)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="status" status={alert.severity}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline">
                      {alert.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                {/* Actions */}
                {!alert.resolvedAt && (
                  <div className="mt-3 flex space-x-2">
                    {!alert.isRead && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                    <Button size="sm" variant="outline">
                      View Machine
                    </Button>
                    {alert.type === 'predictive_maintenance' && (
                      <Button size="sm">
                        Schedule Maintenance
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {filteredAlerts.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔕</div>
                <p className="text-gray-500">No alerts found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
