'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function SystemStatusPage() {
  const features = [
    {
      name: 'Authentication System',
      status: 'operational',
      description: 'Role-based login with technician and manager roles',
      routes: ['/login'],
    },
    {
      name: 'Dashboard',
      status: 'operational', 
      description: 'System overview with metrics and recent activity',
      routes: ['/dashboard'],
    },
    {
      name: 'Machine Management',
      status: 'operational',
      description: 'Complete machine lifecycle management with status tracking',
      routes: ['/machines'],
    },
    {
      name: 'Test Sessions',
      status: 'operational',
      description: 'Multi-sensor data collection and monitoring',
      routes: ['/sessions'],
    },
    {
      name: 'Failure Management', 
      status: 'operational',
      description: 'Comprehensive failure tracking and resolution workflow',
      routes: ['/failures'],
    },
    {
      name: 'Analytics & Insights',
      status: 'operational',
      description: 'Predictive maintenance analytics and performance metrics',
      routes: ['/analytics'],
    },
    {
      name: 'Alert Management',
      status: 'operational', 
      description: 'Real-time notifications and alert resolution',
      routes: ['/alerts'],
    },
    {
      name: 'User Management',
      status: 'operational',
      description: 'Complete user administration and role management',
      routes: ['/users'],
    },
    {
      name: 'Knowledge Base',
      status: 'operational',
      description: 'Searchable documentation and troubleshooting guides',
      routes: ['/knowledge-base'],
    },
  ];

  const demoCredentials = [
    {
      role: 'Technician',
      email: 'tech1@testbox.com',
      password: 'password123',
      permissions: ['View machines', 'Create sessions', 'Report failures', 'Access knowledge base'],
    },
    {
      role: 'Maintenance Manager', 
      email: 'manager@testbox.com',
      password: 'password123',
      permissions: ['Full system access', 'Analytics', 'User management', 'Alert management'],
    },
  ];

  const technicalSpecs = [
    { label: 'Framework', value: 'Next.js 15' },
    { label: 'Language', value: 'TypeScript' },
    { label: 'Styling', value: 'Tailwind CSS' },
    { label: 'State Management', value: 'React Context API' },
    { label: 'Authentication', value: 'Role-based Access Control' },
    { label: 'Data Export', value: 'CSV, JSON formats' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Universal Test Box - Predictive Maintenance System
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Complete web interface for industrial equipment monitoring and maintenance
          </p>
          <Badge variant="status" status="operational" className="text-lg px-4 py-2">
            ✅ All Systems Operational
          </Badge>
        </div>

        {/* Demo Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>🔐 Demo Login Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoCredentials.map((cred) => (
                <div key={cred.role} className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">{cred.role}</h3>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div><strong>Email:</strong> {cred.email}</div>
                    <div><strong>Password:</strong> {cred.password}</div>
                  </div>
                  <div className="mt-3">
                    <strong className="text-blue-900">Permissions:</strong>
                    <ul className="list-disc list-inside text-xs text-blue-700 mt-1">
                      {cred.permissions.map((perm) => (
                        <li key={perm}>{perm}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Status */}
        <Card>
          <CardHeader>
            <CardTitle>📊 System Features Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div key={feature.name} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{feature.name}</h3>
                    <Badge variant="status" status={feature.status}>
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {feature.routes.map((route) => (
                      <a
                        key={route}
                        href={route}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        {route}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {technicalSpecs.map((spec) => (
                  <div key={spec.label} className="flex justify-between">
                    <span className="font-medium text-gray-700">{spec.label}:</span>
                    <span className="text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎯 Key Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Role-based authentication and permissions
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Real-time machine status monitoring
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Multi-sensor data collection (19+ sensor types)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Comprehensive failure tracking
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Predictive maintenance analytics
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Alert management and notifications
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Knowledge base with troubleshooting guides
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Data export (CSV, JSON formats)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Responsive design for all devices
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">1️⃣</div>
                <h3 className="font-semibold mb-2">Login</h3>
                <p className="text-sm text-gray-600">
                  Use demo credentials to access the system with different role permissions
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">2️⃣</div>
                <h3 className="font-semibold mb-2">Explore Features</h3>
                <p className="text-sm text-gray-600">
                  Navigate through machines, sessions, failures, analytics, and more
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">3️⃣</div>
                <h3 className="font-semibold mb-2">Test Functionality</h3>
                <p className="text-sm text-gray-600">
                  Create test sessions, report failures, manage alerts, and export data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-gray-500">
            Universal Test Box - Predictive Maintenance System | Built with Next.js & TypeScript
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Complete frontend implementation ready for backend integration
          </p>
        </div>
      </div>
    </div>
  );
}
