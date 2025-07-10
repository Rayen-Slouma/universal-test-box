'use client';

import React, { useState } from 'react';
import { useAuth, usePermissions } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Failure, FailureSeverity, FailureCategory, FailureStatus } from '@/types';
import { formatDateTime, timeAgo } from '@/lib/utils';
import { 
  FAILURE_SEVERITY_LABELS, 
  FAILURE_CATEGORY_LABELS, 
  FAILURE_STATUS_LABELS,
  MACHINE_STATUS_LABELS 
} from '@/lib/constants';
import { DataExporter } from '@/lib/export';

// Mock failure data
const mockFailures: Failure[] = [
  {
    id: '1',
    machineId: 'machine-1',
    machine: {
      id: 'machine-1',
      name: 'Production Line A',
      location: 'Factory Floor 1',
      type: 'Assembly Line',
      serialNumber: 'PLA-2024-001',
      status: 'failure',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-26'),
    },
    reportedBy: {
      id: '1',
      email: 'tech1@testbox.com',
      name: 'John Technician',
      role: 'technician',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-20'),
    },
    description: 'Conveyor belt motor making unusual grinding noise and vibrations detected',
    severity: 'high',
    category: 'mechanical',
    status: 'investigating',
    reportedAt: new Date('2024-06-25T10:30:00'),
    maintenanceActions: [],
    attachments: [],
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
    reportedBy: {
      id: '2',
      email: 'manager@testbox.com',
      name: 'Sarah Manager',
      role: 'maintenance_manager',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-06-25'),
    },
    description: 'Hydraulic fluid pressure dropping below normal operating range',
    severity: 'critical',
    category: 'hydraulic',
    status: 'in_progress',
    reportedAt: new Date('2024-06-24T14:15:00'),
    maintenanceActions: [],
    attachments: [],
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
    reportedBy: {
      id: '1',
      email: 'tech1@testbox.com',
      name: 'John Technician',
      role: 'technician',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-20'),
    },
    description: 'Temperature sensor readings inconsistent, possible calibration issue',
    severity: 'medium',
    category: 'electrical',
    status: 'resolved',
    reportedAt: new Date('2024-06-23T09:45:00'),
    resolvedAt: new Date('2024-06-24T16:30:00'),
    resolution: 'Sensor recalibrated and tested. Operating within normal parameters.',
    maintenanceActions: [],
    attachments: [],
  },
];

const severityOptions = Object.entries(FAILURE_SEVERITY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const categoryOptions = Object.entries(FAILURE_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const statusOptions = Object.entries(FAILURE_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function FailuresPage() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [failures, setFailures] = useState<Failure[]>(mockFailures);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<FailureSeverity | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<FailureCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<FailureStatus | ''>('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Filter failures based on search and filters
  const filteredFailures = failures.filter((failure) => {
    const matchesSearch = 
      failure.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      failure.machine?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      failure.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = !severityFilter || failure.severity === severityFilter;
    const matchesCategory = !categoryFilter || failure.category === categoryFilter;
    const matchesStatus = !statusFilter || failure.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
  });

  const handleCreateFailure = () => {
    // In a real app, this would open a modal or navigate to a form page
    alert('Create failure form would open here');
  };

  const handleViewDetails = (failure: Failure) => {
    // In a real app, this would navigate to failure details page
    alert(`View details for failure: ${failure.description}`);
  };

  const handleUpdateStatus = (failureId: string, newStatus: FailureStatus) => {
    setFailures(prev => 
      prev.map(failure => 
        failure.id === failureId 
          ? { ...failure, status: newStatus }
          : failure
      )
    );
  };

  // Statistics
  const stats = {
    total: failures.length,
    critical: failures.filter(f => f.severity === 'critical').length,
    inProgress: failures.filter(f => f.status === 'in_progress' || f.status === 'investigating').length,
    resolved: failures.filter(f => f.status === 'resolved').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Failure Management</h1>
          <p className="text-gray-600 mt-1">
            Track and manage equipment failures and maintenance actions
          </p>
        </div>
        {hasPermission('create_failures') && (
          <Button onClick={handleCreateFailure}>
            Report New Failure
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Failures</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🔧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
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
              placeholder="Search failures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as FailureSeverity)}
              options={[{ value: '', label: 'All Severities' }, ...severityOptions]}
            />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as FailureCategory)}
              options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FailureStatus)}
              options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSeverityFilter('');
                setCategoryFilter('');
                setStatusFilter('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Failures Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Failures ({filteredFailures.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Reported At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFailures.map((failure) => (
                <TableRow key={failure.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {failure.machine?.name || 'Unknown Machine'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {failure.machine?.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {failure.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="status" status={failure.severity}>
                      {FAILURE_SEVERITY_LABELS[failure.severity]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {FAILURE_CATEGORY_LABELS[failure.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="status" status={failure.status}>
                      {FAILURE_STATUS_LABELS[failure.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {failure.reportedBy.name}
                      </div>
                      <div className="text-gray-500">
                        {failure.reportedBy.role}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {formatDateTime(failure.reportedAt)}
                      </div>
                      <div className="text-gray-500">
                        {timeAgo(failure.reportedAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(failure)}
                      >
                        View
                      </Button>
                      {hasPermission('edit_failures') && failure.status !== 'resolved' && (
                        <Select
                          value={failure.status}
                          onChange={(e) => handleUpdateStatus(failure.id, e.target.value as FailureStatus)}
                          options={statusOptions}
                          className="w-auto"
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredFailures.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No failures found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
