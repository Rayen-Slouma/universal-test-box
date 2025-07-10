'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { usePermissions } from '@/contexts/AuthContext';
import { formatDate, timeAgo } from '@/lib/utils';
import { Machine, MachineStatus } from '@/types';
import { DataExporter } from '@/lib/export';

// Mock data for machines
const mockMachines: Machine[] = [
  {
    id: '1',
    name: 'Hydraulic Press #1',
    location: 'Production Line A',
    type: 'Hydraulic Press',
    serialNumber: 'HP-2024-001',
    manufacturer: 'HydroTech',
    model: 'HP-500X',
    installationDate: new Date('2024-01-15'),
    status: 'operational',
    lastMaintenanceDate: new Date('2024-06-15'),
    nextMaintenanceDate: new Date('2024-07-15'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: '2',
    name: 'Conveyor Belt A',
    location: 'Warehouse',
    type: 'Conveyor System',
    serialNumber: 'CB-2024-002',
    manufacturer: 'ConveyoCorp',
    model: 'CB-1200',
    installationDate: new Date('2024-02-01'),
    status: 'maintenance',
    lastMaintenanceDate: new Date('2024-06-20'),
    nextMaintenanceDate: new Date('2024-08-01'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-06-25'),
  },
  {
    id: '3',
    name: 'CNC Machine #3',
    location: 'Production Line B',
    type: 'CNC Machine',
    serialNumber: 'CNC-2024-003',
    manufacturer: 'PrecisionMach',
    model: 'PM-750CNC',
    installationDate: new Date('2024-03-01'),
    status: 'failure',
    lastMaintenanceDate: new Date('2024-05-30'),
    nextMaintenanceDate: new Date('2024-07-30'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-06-26'),
  },
  {
    id: '4',
    name: 'Pump Station B',
    location: 'Utility Room',
    type: 'Water Pump',
    serialNumber: 'PS-2024-004',
    manufacturer: 'FlowMaster',
    model: 'FM-300W',
    installationDate: new Date('2024-01-20'),
    status: 'operational',
    lastMaintenanceDate: new Date('2024-06-10'),
    nextMaintenanceDate: new Date('2024-08-10'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-10'),
  },
  {
    id: '5',
    name: 'Compressor Unit #2',
    location: 'Production Line A',
    type: 'Air Compressor',
    serialNumber: 'AC-2024-005',
    manufacturer: 'AirFlow',
    model: 'AF-150HP',
    installationDate: new Date('2024-04-01'),
    status: 'offline',
    lastMaintenanceDate: new Date('2024-06-01'),
    nextMaintenanceDate: new Date('2024-08-01'),
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-06-01'),
  },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'operational', label: 'Operational' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'failure', label: 'Failure' },
  { value: 'offline', label: 'Offline' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'Hydraulic Press', label: 'Hydraulic Press' },
  { value: 'Conveyor System', label: 'Conveyor System' },
  { value: 'CNC Machine', label: 'CNC Machine' },
  { value: 'Water Pump', label: 'Water Pump' },
  { value: 'Air Compressor', label: 'Air Compressor' },
];

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const { hasPermission } = usePermissions();

  // Filter machines based on search and filters
  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         machine.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         machine.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || machine.status === statusFilter;
    const matchesType = !typeFilter || machine.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusStats = () => {
    const stats = machines.reduce((acc, machine) => {
      acc[machine.status] = (acc[machine.status] || 0) + 1;
      return acc;
    }, {} as Record<MachineStatus, number>);

    return {
      operational: stats.operational || 0,
      maintenance: stats.maintenance || 0,
      failure: stats.failure || 0,
      offline: stats.offline || 0,
    };
  };
  const stats = getStatusStats();

  const handleExportMachines = (format: 'csv' | 'json') => {
    DataExporter.exportMachines(filteredMachines, format);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Machines</h1>
          <p className="text-gray-600">Manage and monitor your industrial equipment</p>
        </div>
        <div className="flex space-x-2">
          <Select
            value=""
            onChange={(e) => handleExportMachines(e.target.value as 'csv' | 'json')}
            options={[
              { value: '', label: 'Export Data...' },
              { value: 'csv', label: 'Export as CSV' },
              { value: 'json', label: 'Export as JSON' },
            ]}
            className="w-40"
          />
          {hasPermission('create_machines') && (
            <Button>
              Add Machine
            </Button>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Operational</p>
                <p className="text-2xl font-bold text-green-600">{stats.operational}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
              </div>
              <div className="text-2xl">🔧</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failures</p>
                <p className="text-2xl font-bold text-red-600">{stats.failure}</p>
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-gray-600">{stats.offline}</p>
              </div>
              <div className="text-2xl">⏸️</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search machines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Machines Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Machines ({filteredMachines.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Next Maintenance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{machine.name}</div>
                      <div className="text-sm text-gray-500">{machine.serialNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{machine.location}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{machine.type}</div>
                    {machine.manufacturer && (
                      <div className="text-xs text-gray-500">{machine.manufacturer}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="status" status={machine.status}>
                      {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {machine.lastMaintenanceDate ? formatDate(machine.lastMaintenanceDate) : 'Never'}
                    </div>
                    {machine.lastMaintenanceDate && (
                      <div className="text-xs text-gray-500">
                        {timeAgo(machine.lastMaintenanceDate)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {machine.nextMaintenanceDate ? formatDate(machine.nextMaintenanceDate) : 'Not scheduled'}
                    </div>
                    {machine.nextMaintenanceDate && (
                      <div className="text-xs text-gray-500">
                        {machine.nextMaintenanceDate > new Date() ? 'Due in ' : 'Overdue by '}
                        {Math.abs(Math.ceil((machine.nextMaintenanceDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} days
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {hasPermission('create_sessions') && (
                        <Button size="sm">
                          Test
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
