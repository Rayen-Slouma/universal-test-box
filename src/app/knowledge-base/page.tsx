'use client';

import React, { useState } from 'react';
import { useAuth, usePermissions } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { KnowledgeBaseEntry, FailureCategory } from '@/types';
import { formatDateTime, timeAgo } from '@/lib/utils';
import { FAILURE_CATEGORY_LABELS } from '@/lib/constants';

// Mock knowledge base data
const mockKnowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: '1',
    title: 'Conveyor Belt Motor Vibration Analysis',
    content: `# Conveyor Belt Motor Vibration Issues

## Common Symptoms
- Unusual grinding or rumbling noises
- Excessive vibration during operation
- Reduced belt speed consistency
- Increased power consumption

## Possible Causes
1. **Bearing Wear**: Most common cause, especially in high-usage environments
2. **Misalignment**: Belt or pulley misalignment causing uneven load distribution
3. **Contamination**: Dust, debris, or moisture affecting motor components
4. **Electrical Issues**: Voltage fluctuations or phase imbalances

## Diagnostic Steps
1. Check vibration levels using accelerometer sensors
2. Inspect belt alignment and tension
3. Monitor electrical parameters (voltage, current, frequency)
4. Listen for unusual sounds during operation
5. Check bearing temperature

## Solutions
### For Bearing Issues:
- Replace worn bearings immediately
- Ensure proper lubrication schedule
- Monitor bearing temperature regularly

### For Alignment Issues:
- Realign belt and pulleys
- Check mounting bolts for looseness
- Verify proper belt tension

### For Contamination:
- Clean motor housing and components
- Improve environmental sealing
- Implement regular cleaning schedule

## Preventive Measures
- Schedule regular vibration monitoring
- Maintain proper lubrication
- Keep environment clean and dry
- Monitor electrical parameters continuously`,
    category: 'mechanical',
    tags: ['vibration', 'motor', 'bearing', 'conveyor', 'maintenance'],
    machineTypes: ['Conveyor System', 'Assembly Line'],
    symptoms: ['vibration', 'noise', 'speed issues', 'power consumption'],
    solutions: ['bearing replacement', 'alignment adjustment', 'cleaning', 'lubrication'],
    attachments: [],
    createdBy: {
      id: '2',
      email: 'manager@testbox.com',
      name: 'Sarah Manager',
      role: 'maintenance_manager',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-06-25'),
    },
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-06-20'),
    views: 145,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Hydraulic Pressure Loss Troubleshooting',
    content: `# Hydraulic System Pressure Loss

## Overview
Hydraulic pressure loss is a critical issue that can lead to reduced machine performance and potential equipment damage. This guide covers systematic troubleshooting approaches.

## Common Indicators
- Pressure gauge readings below normal operating range
- Slow or inconsistent actuator movement
- Pump working harder (increased noise/heat)
- Fluid temperature elevation

## Systematic Diagnosis
### 1. External Leak Check
- Inspect all visible hydraulic lines
- Check fittings and connections
- Look for oil stains or puddles
- Examine cylinder seals

### 2. Internal Leak Assessment
- Monitor pump performance
- Check relief valve operation
- Test cylinder bypass
- Evaluate filter condition

### 3. System Component Testing
- Pressure test at multiple points
- Flow rate measurements
- Temperature monitoring
- Contamination analysis

## Common Solutions
### For External Leaks:
1. Tighten loose fittings
2. Replace damaged seals
3. Repair or replace damaged hoses
4. Clean and inspect all connections

### For Internal Leaks:
1. Adjust or replace relief valves
2. Rebuild or replace cylinders
3. Service or replace pump
4. Clean or replace filters

### For System Issues:
1. Check fluid levels and quality
2. Verify proper fluid viscosity
3. Ensure adequate cooling
4. Monitor electrical supply to pump

## Maintenance Schedule
- Daily: Visual leak inspection
- Weekly: Pressure and temperature checks
- Monthly: Filter inspection/replacement
- Quarterly: Full system pressure testing
- Annually: Complete fluid analysis`,
    category: 'hydraulic',
    tags: ['hydraulic', 'pressure', 'leak', 'pump', 'troubleshooting'],
    machineTypes: ['Hydraulic Press', 'Lift System', 'Injection Molding'],
    symptoms: ['pressure loss', 'slow movement', 'overheating', 'noise'],
    solutions: ['seal replacement', 'valve adjustment', 'filter cleaning', 'fluid replacement'],
    attachments: [],
    createdBy: {
      id: '1',
      email: 'tech1@testbox.com',
      name: 'John Technician',
      role: 'technician',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-20'),
    },
    createdAt: new Date('2024-04-02'),
    updatedAt: new Date('2024-06-18'),
    views: 89,
    rating: 4.5,
  },
  {
    id: '3',
    title: 'Temperature Sensor Calibration Procedures',
    content: `# Temperature Sensor Calibration Guide

## Equipment Required
- Calibrated reference thermometer
- Temperature calibrator/bath
- Multimeter
- Documentation forms

## Pre-Calibration Checks
1. Verify sensor model and specifications
2. Check physical condition of sensor and cables
3. Review previous calibration records
4. Ensure environmental conditions are stable

## Calibration Procedure

### Step 1: Preparation
- Allow equipment to stabilize for 30 minutes
- Set up temperature bath at first test point
- Connect sensor and reference equipment

### Step 2: Multi-Point Calibration
Test at minimum 3 points across operating range:
- Low point (typically 10-20% of range)
- Mid point (50% of range)
- High point (80-90% of range)

### Step 3: Data Collection
For each test point:
1. Allow temperature to stabilize (5-10 minutes)
2. Record reference temperature
3. Record sensor output (voltage/current/digital)
4. Calculate error and drift
5. Document environmental conditions

### Step 4: Acceptance Criteria
- Error within ±0.5°C or ±0.1% of reading
- Drift less than 0.2°C from previous calibration
- Consistent readings across multiple measurements

## Common Issues and Solutions

### High Error Readings:
- Check sensor wiring and connections
- Verify power supply voltage
- Inspect for physical damage
- Consider sensor replacement if beyond tolerance

### Drift Issues:
- Clean sensor probe
- Check for moisture ingress
- Verify mounting stability
- Review environmental factors

### Inconsistent Readings:
- Check for electromagnetic interference
- Verify proper grounding
- Inspect cable routing
- Test with different measurement equipment

## Documentation Requirements
- Calibration certificate
- Before/after readings
- Environmental conditions
- Technician identification
- Next calibration due date

## Frequency
- Standard: Every 12 months
- Critical applications: Every 6 months
- After repair or replacement: Immediate
- After exposure to extreme conditions: As needed`,
    category: 'electrical',
    tags: ['temperature', 'sensor', 'calibration', 'electrical', 'measurement'],
    machineTypes: ['All systems with temperature monitoring'],
    symptoms: ['inaccurate readings', 'sensor drift', 'measurement errors'],
    solutions: ['calibration', 'cleaning', 'replacement', 'rewiring'],
    attachments: [],
    createdBy: {
      id: '2',
      email: 'manager@testbox.com',
      name: 'Sarah Manager',
      role: 'maintenance_manager',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-06-25'),
    },
    createdAt: new Date('2024-05-10'),
    updatedAt: new Date('2024-06-15'),
    views: 67,
    rating: 4.9,
  },
];

const categoryOptions = Object.entries(FAILURE_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most_viewed', label: 'Most Viewed' },
  { value: 'highest_rated', label: 'Highest Rated' },
  { value: 'title', label: 'Title A-Z' },
];

export default function KnowledgeBasePage() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>(mockKnowledgeBase);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FailureCategory | ''>('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeBaseEntry | null>(null);

  // Filter and sort entries
  const filteredEntries = entries
    .filter((entry) => {
      const matchesSearch = 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        entry.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !categoryFilter || entry.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'most_viewed':
          return b.views - a.views;
        case 'highest_rated':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleViewEntry = (entry: KnowledgeBaseEntry) => {
    // Increment view count
    setEntries(prev => 
      prev.map(e => 
        e.id === entry.id ? { ...e, views: e.views + 1 } : e
      )
    );
    setSelectedEntry(entry);
  };

  const handleCreateEntry = () => {
    // In a real app, this would open a form modal or navigate to a create page
    alert('Create new knowledge base entry form would open here');
  };

  const formatRating = (rating: number) => {
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return `${stars} (${rating}/5)`;
  };

  if (selectedEntry) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedEntry(null)}
          >
            ← Back to Knowledge Base
          </Button>
          <div className="flex space-x-2">
            {hasPermission('edit_knowledge_base') && (
              <Button variant="outline">
                Edit Entry
              </Button>
            )}
            <Button variant="outline">
              Share
            </Button>
          </div>
        </div>

        {/* Entry Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{selectedEntry.title}</CardTitle>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>By {selectedEntry.createdBy.name}</span>
                  <span>•</span>
                  <span>{formatDateTime(selectedEntry.createdAt)}</span>
                  <span>•</span>
                  <span>{selectedEntry.views} views</span>
                  <span>•</span>
                  <span>{formatRating(selectedEntry.rating)}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Badge variant="outline">
                  {FAILURE_CATEGORY_LABELS[selectedEntry.category]}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tags */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Machine Types */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Applicable Machine Types:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.machineTypes.map((type) => (
                  <Badge key={type} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
                {selectedEntry.content}
              </div>
            </div>

            {/* Quick Reference */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Common Symptoms:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {selectedEntry.symptoms.map((symptom) => (
                    <li key={symptom}>• {symptom}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Solutions:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  {selectedEntry.solutions.map((solution) => (
                    <li key={solution}>• {solution}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600 mt-1">
            Troubleshooting guides, procedures, and maintenance documentation
          </p>
        </div>
        {hasPermission('edit_knowledge_base') && (
          <Button onClick={handleCreateEntry}>
            Create New Entry
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👁️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-green-600">
                  {entries.reduce((sum, entry) => sum + entry.views, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(entries.reduce((sum, entry) => sum + entry.rating, 0) / entries.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as FailureCategory)}
              options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setSortBy('newest');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{entry.title}</CardTitle>
                <Badge variant="outline">
                  {FAILURE_CATEGORY_LABELS[entry.category]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Preview */}
                <p className="text-sm text-gray-600 line-clamp-3">
                  {entry.content.substring(0, 150)}...
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {entry.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {entry.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{entry.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{entry.views} views</span>
                  <span>{formatRating(entry.rating).split(' ')[0]}</span>
                  <span>{timeAgo(entry.createdAt)}</span>
                </div>

                {/* Action */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewEntry(entry)}
                >
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-2">📖</div>
            <p className="text-gray-500">No knowledge base entries found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
