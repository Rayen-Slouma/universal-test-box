'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useAuth, usePermissions } from '@/contexts/AuthContext';
import { Machine, SensorModule, TestSession } from '@/types';
import { DEFAULT_SENSOR_MODULES } from '@/lib/constants';

// Mock technicians data
const mockTechnicians = [
  {
    id: '1',
    name: 'John Technician',
    email: 'tech1@testbox.com',
    role: 'technician' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Sarah Engineer',
    email: 'tech2@testbox.com',
    role: 'technician' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'tech3@testbox.com',
    role: 'technician' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock machines data
const mockMachines: Machine[] = [
  {
    id: '1',
    name: 'Hydraulic Press #1',
    location: 'Production Line A',
    type: 'Hydraulic Press',
    serialNumber: 'HP-2024-001',
    status: 'operational',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'CNC Machine #3',
    location: 'Manufacturing Floor',
    type: 'CNC Machine',
    serialNumber: 'CNC-2024-003',
    status: 'operational',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Conveyor System B',
    location: 'Assembly Line 2',
    type: 'Conveyor System',
    serialNumber: 'CS-2024-002',
    status: 'operational',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Water Pump #5',
    location: 'Utility Room',
    type: 'Water Pump',
    serialNumber: 'WP-2024-005',
    status: 'operational',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface NewSessionForm {
  name: string;
  machineId: string;
  assignedToId: string; // Technician to assign
  selectedSensors: string[];
  samplingFrequency: number;
  duration: number; // in minutes
  notes: string;
  autoStart: boolean;
  template?: string;
}

// Session Templates
const SESSION_TEMPLATES = [
  {
    id: 'routine',
    name: 'Routine Maintenance Check',
    description: 'Standard 1-hour monitoring with basic sensors',
    sensors: ['Primary Temperature Monitor', 'Vibration Analysis Unit'],
    frequency: 10,
    duration: 60,
  },
  {
    id: 'diagnostic',
    name: 'Diagnostic Deep Scan',
    description: 'Comprehensive 4-hour analysis with all sensors',
    sensors: ['Primary Temperature Monitor', 'Vibration Analysis Unit', 'Visual Inspection Camera', 'Current Monitor'],
    frequency: 50,
    duration: 240,
  },
  {
    id: 'quick',
    name: 'Quick Health Check',
    description: '15-minute rapid assessment',
    sensors: ['Primary Temperature Monitor', 'Current Monitor'],
    frequency: 5,
    duration: 15,
  },
];

export default function NewSessionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);
    const [form, setForm] = useState<NewSessionForm>({
    name: '',
    machineId: '',
    assignedToId: '',
    selectedSensors: [],
    samplingFrequency: 10,
    duration: 60,
    notes: '',
    autoStart: false,
    template: '',
  });

  // Only maintenance managers can create sessions
  if (!user || user.role !== 'maintenance_manager') {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            Only Maintenance Managers can create new test sessions.
          </p>
          <Button onClick={() => router.push('/sessions')}>
            Back to Sessions
          </Button>
        </div>
      </div>
    );
  }
  
  // Get available machines (only operational ones)
  const availableMachines = mockMachines.filter(machine => machine.status === 'operational');
  
  // Get selected machine
  const selectedMachine = availableMachines.find(m => m.id === form.machineId);
  
  // Get selected technician
  const selectedTechnician = mockTechnicians.find(t => t.id === form.assignedToId);

  // Get available sensor modules
  const availableSensors: SensorModule[] = DEFAULT_SENSOR_MODULES.map((sensor, index) => ({
    ...sensor,
    id: `sensor-${index + 1}`,
  })).filter((sensor) => sensor.isActive);

  const machineOptions = [
    { value: '', label: 'Select a machine...' },
    ...availableMachines.map(machine => ({
      value: machine.id,
      label: `${machine.name} (${machine.serialNumber})`,
    })),
  ];

  const technicianOptions = [
    { value: '', label: 'Assign to technician...' },
    ...mockTechnicians.map(tech => ({
      value: tech.id,
      label: tech.name,
    })),
  ];

  const frequencyOptions = [
    { value: '1', label: '1 Hz (Every second)' },
    { value: '5', label: '5 Hz (5 times per second)' },
    { value: '10', label: '10 Hz (10 times per second)' },
    { value: '20', label: '20 Hz (20 times per second)' },
    { value: '50', label: '50 Hz (50 times per second)' },
    { value: '100', label: '100 Hz (100 times per second)' },
  ];

  const durationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: '240', label: '4 hours' },
    { value: '480', label: '8 hours' },
    { value: '1440', label: '24 hours' },
  ];
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = 'Session name is required';
    }

    if (!form.machineId) {
      newErrors.machineId = 'Please select a machine';
    }

    if (!form.assignedToId) {
      newErrors.assignedToId = 'Please assign to a technician';
    }

    if (form.selectedSensors.length === 0) {
      newErrors.sensors = 'Please select at least one sensor';
    }

    // Check for sensor health warnings
    const selectedSensorHealth = form.selectedSensors.map(sensorName => ({
      name: sensorName,
      health: getSensorHealth(sensorName)
    }));
    
    const errorSensors = selectedSensorHealth.filter(s => s.health === 'error');
    if (errorSensors.length > 0) {
      newErrors.sensors = `Warning: ${errorSensors.map(s => s.name).join(', ')} ${errorSensors.length === 1 ? 'has' : 'have'} sensor errors. Please check before proceeding.`;
    }

    if (form.samplingFrequency < 1 || form.samplingFrequency > 1000) {
      newErrors.samplingFrequency = 'Sampling frequency must be between 1 and 1000 Hz';
    }

    if (form.duration < 1 || form.duration > 10080) { // max 1 week
      newErrors.duration = 'Duration must be between 1 minute and 1 week';
    }

    // Check for very large data collection warnings
    if (estimatedFileSize > 500) {
      newErrors.duration = `Warning: Estimated file size is ${estimatedFileSize.toFixed(1)} MB. Consider reducing frequency or duration.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSensorToggle = (sensorId: string) => {
    setForm(prev => ({
      ...prev,
      selectedSensors: prev.selectedSensors.includes(sensorId)
        ? prev.selectedSensors.filter(id => id !== sensorId)
        : [...prev.selectedSensors, sensorId],
    }));
  };

  const applyTemplate = (templateId: string) => {
    const template = SESSION_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setForm(prev => ({
        ...prev,
        selectedSensors: template.sensors,
        samplingFrequency: template.frequency,
        duration: template.duration,
        template: templateId,
        name: prev.name || `${template.name} - ${selectedMachine?.name || 'Machine'}`,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));      const selectedSensorModules = availableSensors.filter((sensor: SensorModule) => 
        form.selectedSensors.includes(sensor.name)
      );      const newSession: Partial<TestSession> = {
        name: form.name,
        machineId: form.machineId,
        machine: selectedMachine,
        createdBy: user,
        assignedTo: selectedTechnician!,
        sensors: selectedSensorModules,
        samplingFrequency: form.samplingFrequency,
        status: form.autoStart ? 'in_progress' : 'assigned',
        notes: form.notes,
        startTime: form.autoStart ? new Date() : new Date(),
        data: [],
        dataFiles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('New session created:', newSession);

      // In a real app, you would save to your backend here
      alert(`Session "${form.name}" created successfully!`);
      
      // Redirect back to sessions page
      router.push('/sessions');
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Error creating session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/sessions');
  };

  const estimatedDataPoints = form.samplingFrequency * form.duration * 60 * form.selectedSensors.length;
  const estimatedFileSize = (estimatedDataPoints * 20) / 1024 / 1024; // Rough estimate in MB
  // Sensor health simulation (in real app, this would be an API call)
  const getSensorHealth = (sensorName: string): 'good' | 'warning' | 'error' => {
    // Simulate sensor health based on sensor name for demo
    const hash = sensorName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const healthStates = ['good', 'good', 'good', 'warning', 'good']; // Mostly good
    return healthStates[hash % healthStates.length] as 'good' | 'warning' | 'error';
  };

  const getSensorHealthIcon = (health: 'good' | 'warning' | 'error') => {
    switch (health) {
      case 'good':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✗';
    }
  };

  const getSensorHealthColor = (health: 'good' | 'warning' | 'error') => {
    switch (health) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Test Session</h1>
          <p className="text-gray-600 mt-1">
            Configure a new data collection session for predictive maintenance
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          ← Back to Sessions
        </Button>
      </div>

      {/* Session Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Session Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Choose a pre-configured template to quickly set up common monitoring scenarios
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SESSION_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  form.template === template.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => applyTemplate(template.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  {form.template === template.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Sensors: {template.sensors.length}</div>
                  <div>Frequency: {template.frequency} Hz</div>
                  <div>Duration: {template.duration} min</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Session Name"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Routine Maintenance Check - Week 27"
                error={errors.name}
                required
              />
              
              <Select
                label="Target Machine"
                value={form.machineId}
                onChange={(e) => setForm(prev => ({ ...prev, machineId: e.target.value }))}
                options={machineOptions}
                error={errors.machineId}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Select
                label="Assign to Technician"
                value={form.assignedToId}
                onChange={(e) => setForm(prev => ({ ...prev, assignedToId: e.target.value }))}
                options={technicianOptions}
                error={errors.assignedToId}
                helperText="Select the technician who will perform this session"
                required
              />
              
              {selectedTechnician && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700">Technician Details:</span>
                  <div className="mt-1 text-sm text-gray-600">
                    <div>Name: {selectedTechnician.name}</div>
                    <div>Email: {selectedTechnician.email}</div>
                  </div>
                </div>
              )}
            </div>

            {selectedMachine && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Selected Machine Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-800">
                  <div>
                    <span className="font-medium">Location:</span> {selectedMachine.location}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {selectedMachine.type}
                  </div>
                  <div>
                    <span className="font-medium">Serial:</span> {selectedMachine.serialNumber}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <Badge variant="status" status={selectedMachine.status} className="ml-1">
                      {selectedMachine.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sensor Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Sensor Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {errors.sensors && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.sensors}</p>
              </div>
            )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">              {availableSensors.map((sensor: SensorModule) => {
                const health = getSensorHealth(sensor.name);
                return (
                <div
                  key={sensor.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    form.selectedSensors.includes(sensor.name)
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSensorToggle(sensor.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{sensor.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getSensorHealthColor(health)}`}>
                        {getSensorHealthIcon(health)}
                      </span>
                      {form.selectedSensors.includes(sensor.name) && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{sensor.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {sensor.type}
                    </Badge>
                    <span className={`text-xs ${getSensorHealthColor(health)}`}>
                      {health === 'good' ? 'Healthy' : health === 'warning' ? 'Warning' : 'Error'}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>

            {form.selectedSensors.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">
                  Selected Sensors ({form.selectedSensors.length})
                </h4>                <div className="flex flex-wrap gap-2">
                  {form.selectedSensors.map((sensorName) => {
                    const sensor = availableSensors.find((s: SensorModule) => s.name === sensorName);
                    const health = getSensorHealth(sensorName);
                    return (
                      <Badge key={sensorName} variant="status" status="operational">
                        <span className={getSensorHealthColor(health)}>
                          {getSensorHealthIcon(health)} {sensor?.name}
                        </span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Collection Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Data Collection Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Sampling Frequency"
                value={form.samplingFrequency.toString()}
                onChange={(e) => setForm(prev => ({ ...prev, samplingFrequency: parseInt(e.target.value) }))}
                options={frequencyOptions}
                error={errors.samplingFrequency}
                helperText="Higher frequencies provide more detailed data but increase storage requirements"
              />

              <Select
                label="Collection Duration"
                value={form.duration.toString()}
                onChange={(e) => setForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                options={durationOptions}
                error={errors.duration}
                helperText="Total time for data collection"
              />
            </div>

            {/* Data Estimation */}
            {form.selectedSensors.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Data Collection Estimates</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Data Points:</span>
                    <div className="font-medium text-gray-900">
                      {estimatedDataPoints.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Est. File Size:</span>
                    <div className="font-medium text-gray-900">
                      {estimatedFileSize.toFixed(1)} MB
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Sensors:</span>
                    <div className="font-medium text-gray-900">
                      {form.selectedSensors.length}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Frequency:</span>
                    <div className="font-medium text-gray-900">
                      {form.samplingFrequency} Hz
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Notes (Optional)"
                value={form.notes}
                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any relevant notes about this test session..."
                helperText="Describe the purpose, expected conditions, or special considerations"
              />

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="autoStart"
                  checked={form.autoStart}
                  onChange={(e) => setForm(prev => ({ ...prev, autoStart: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoStart" className="text-sm font-medium text-gray-700">
                  Start session immediately after creation
                </label>
              </div>
                {form.autoStart && (
                <div className="ml-7 text-sm text-gray-600">
                  The session will begin collecting data as soon as it&apos;s created. You can stop it manually from the sessions page.
                </div>
              )}
            </div>
          </CardContent>
        </Card>        {/* Action Buttons */}
        <div className="flex justify-between space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSummary(true)}
            disabled={!form.name || !form.machineId || form.selectedSensors.length === 0}
          >
            Preview Session
          </Button>
          
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting || !hasPermission('create_sessions')}
              isLoading={isSubmitting}
            >
              {form.autoStart ? 'Create & Start Session' : 'Create Session'}
            </Button>
          </div>
        </div>

        {/* Session Summary Modal/Preview */}
        {showSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Session Summary</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Session Name:</span>
                    <div className="text-gray-900">{form.name}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Machine:</span>
                    <div className="text-gray-900">{selectedMachine?.name}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <div className="text-gray-900">{form.duration} minutes</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Frequency:</span>
                    <div className="text-gray-900">{form.samplingFrequency} Hz</div>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Selected Sensors ({form.selectedSensors.length}):</span>
                  <div className="mt-2 space-y-2">
                    {form.selectedSensors.map(sensorName => {
                      const sensor = availableSensors.find(s => s.name === sensorName);
                      const health = getSensorHealth(sensorName);
                      return (
                        <div key={sensorName} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{sensor?.name}</span>
                          <span className={`text-sm ${getSensorHealthColor(health)}`}>
                            {getSensorHealthIcon(health)} {health}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Data Collection Estimates</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Data Points: {estimatedDataPoints.toLocaleString()}</div>
                    <div>File Size: {estimatedFileSize.toFixed(1)} MB</div>
                  </div>
                </div>

                {form.notes && (
                  <div>
                    <span className="font-medium text-gray-700">Notes:</span>
                    <div className="text-gray-900 mt-1">{form.notes}</div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Auto-start:</span>
                  <span className={form.autoStart ? 'text-green-600' : 'text-gray-500'}>
                    {form.autoStart ? 'Yes - will start immediately' : 'No - manual start required'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSummary(false)}
                >
                  Back to Edit
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowSummary(false);
                    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                  }}
                >
                  {form.autoStart ? 'Create & Start Session' : 'Create Session'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
