'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime, formatDuration } from '@/lib/utils';

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalMachines: 25,
    operationalMachines: 22,
    totalUptime: 94.5,
    avgRepairTime: 2.3,
    costSavings: 45600,
    predictedFailures: 3,
  },
  machinePerformance: [
    {
      machineId: 'machine-1',
      name: 'Production Line A',
      uptime: 96.2,
      failureCount: 2,
      lastMaintenance: new Date('2024-06-20'),
      nextMaintenance: new Date('2024-07-15'),
      efficiency: 92.1,
      status: 'operational',
    },
    {
      machineId: 'machine-2',
      name: 'Hydraulic Press B',
      uptime: 88.5,
      failureCount: 4,
      lastMaintenance: new Date('2024-06-25'),
      nextMaintenance: new Date('2024-07-10'),
      efficiency: 85.3,
      status: 'maintenance',
    },
    {
      machineId: 'machine-3',
      name: 'Cooling System A',
      uptime: 99.1,
      failureCount: 1,
      lastMaintenance: new Date('2024-06-15'),
      nextMaintenance: new Date('2024-08-01'),
      efficiency: 98.7,
      status: 'operational',
    },
  ],
  predictiveAlerts: [
    {
      id: '1',
      machineId: 'machine-4',
      machineName: 'Compressor Unit C',
      prediction: 'Bearing failure predicted',
      confidence: 87.5,
      timeToFailure: 14,
      severity: 'warning',
      createdAt: new Date('2024-06-26T08:30:00'),
    },
    {
      id: '2',
      machineId: 'machine-5',
      machineName: 'Conveyor Belt D',
      prediction: 'Motor overheating risk',
      confidence: 73.2,
      timeToFailure: 7,
      severity: 'critical',
      createdAt: new Date('2024-06-26T10:15:00'),
    },
    {
      id: '3',
      machineId: 'machine-6',
      machineName: 'Pump Station E',
      prediction: 'Seal degradation detected',
      confidence: 91.8,
      timeToFailure: 21,
      severity: 'warning',
      createdAt: new Date('2024-06-26T12:00:00'),
    },
  ],
  costAnalysis: {
    maintenanceCosts: {
      planned: 28500,
      unplanned: 15200,
      total: 43700,
    },
    costSavings: {
      predictiveMaintenance: 25300,
      reducedDowntime: 20300,
      total: 45600,
    },
  },
  trendData: {
    uptimeHistory: [
      { month: 'Jan', uptime: 92.1 },
      { month: 'Feb', uptime: 93.5 },
      { month: 'Mar', uptime: 91.8 },
      { month: 'Apr', uptime: 94.2 },
      { month: 'May', uptime: 95.1 },
      { month: 'Jun', uptime: 94.5 },
    ],
    failureHistory: [
      { month: 'Jan', failures: 8 },
      { month: 'Feb', failures: 6 },
      { month: 'Mar', failures: 9 },
      { month: 'Apr', failures: 4 },
      { month: 'May', failures: 3 },
      { month: 'Jun', failures: 5 },
    ],
  },
};

const timeRangeOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '1y', label: 'Last year' },
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMachine, setSelectedMachine] = useState('all');

  const { overview, machinePerformance, predictiveAlerts, costAnalysis, trendData } = mockAnalyticsData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">
            Predictive maintenance analytics and performance insights
          </p>
        </div>
        <div className="flex space-x-4">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={timeRangeOptions}
            className="w-40"
          />
          <Button variant="outline">
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🏭</div>
              <p className="text-sm font-medium text-gray-600">Total Machines</p>
              <p className="text-2xl font-bold text-gray-900">{overview.totalMachines}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm font-medium text-gray-600">Operational</p>
              <p className="text-2xl font-bold text-green-600">{overview.operationalMachines}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-2xl font-bold text-blue-600">{overview.totalUptime}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🔧</div>
              <p className="text-sm font-medium text-gray-600">Avg Repair Time</p>
              <p className="text-2xl font-bold text-yellow-600">{overview.avgRepairTime}h</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-sm font-medium text-gray-600">Cost Savings</p>
              <p className="text-2xl font-bold text-green-600">${overview.costSavings.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="text-sm font-medium text-gray-600">Predictions</p>
              <p className="text-2xl font-bold text-orange-600">{overview.predictedFailures}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Machine Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Machine Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {machinePerformance.map((machine) => (
                <div key={machine.machineId} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{machine.name}</h4>
                    <Badge variant="status" status={machine.status}>
                      {machine.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Uptime:</span>
                      <span className="ml-2 font-medium text-green-600">{machine.uptime}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Efficiency:</span>
                      <span className="ml-2 font-medium text-blue-600">{machine.efficiency}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Failures:</span>
                      <span className="ml-2 font-medium text-red-600">{machine.failureCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Service:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {formatDateTime(machine.nextMaintenance).split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictive Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Maintenance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictiveAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{alert.machineName}</h4>
                      <p className="text-sm text-gray-600">{alert.prediction}</p>
                    </div>
                    <Badge variant="status" status={alert.severity}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Confidence:</span>
                      <span className="ml-2 font-medium text-gray-900">{alert.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time to failure:</span>
                      <span className="ml-2 font-medium text-orange-600">{alert.timeToFailure} days</span>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline">
                      Schedule Maintenance
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Planned Maintenance</h4>
                <p className="text-2xl font-bold text-blue-600">
                  ${costAnalysis.maintenanceCosts.planned.toLocaleString()}
                </p>
                <p className="text-sm text-blue-700">Scheduled preventive maintenance</p>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Unplanned Maintenance</h4>
                <p className="text-2xl font-bold text-red-600">
                  ${costAnalysis.maintenanceCosts.unplanned.toLocaleString()}
                </p>
                <p className="text-sm text-red-700">Emergency repairs and breakdowns</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Total Maintenance Costs</h4>
                <p className="text-2xl font-bold text-gray-900">
                  ${costAnalysis.maintenanceCosts.total.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Combined maintenance expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Savings from Predictive Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Predictive Maintenance Savings</h4>
                <p className="text-2xl font-bold text-green-600">
                  ${costAnalysis.costSavings.predictiveMaintenance.toLocaleString()}
                </p>
                <p className="text-sm text-green-700">Prevented failures through early detection</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Reduced Downtime Savings</h4>
                <p className="text-2xl font-bold text-green-600">
                  ${costAnalysis.costSavings.reducedDowntime.toLocaleString()}
                </p>
                <p className="text-sm text-green-700">Avoided production losses</p>
              </div>
              
              <div className="p-4 bg-green-100 border-2 border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Total Savings</h4>
                <p className="text-3xl font-bold text-green-700">
                  ${costAnalysis.costSavings.total.toLocaleString()}
                </p>
                <p className="text-sm text-green-800">ROI from predictive maintenance system</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Charts Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Uptime Trend */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">System Uptime Trend</h4>
              <div className="space-y-2">
                {trendData.uptimeHistory.map((data) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${data.uptime}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{data.uptime}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Failure Trend */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Failure Count Trend</h4>
              <div className="space-y-2">
                {trendData.failureHistory.map((data) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(data.failures / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{data.failures}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
