# Universal Test Box - Technical Architecture & Implementation

## 🏗️ System Architecture Overview

This document provides comprehensive technical details about the Universal Test Box implementation, including code structure, data flow, component architecture, and integration patterns.

---

## 📁 Project Structure Analysis

### Frontend Architecture (Next.js 14 + TypeScript)

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles (Tailwind CSS)
│   └── [feature]/         # Feature-based routing
│       ├── layout.tsx     # Feature-specific layouts
│       ├── page.tsx       # Feature pages
│       └── [dynamic]/     # Dynamic routes
├── components/            # Reusable UI components
│   ├── Layout.tsx         # Main application layout
│   └── ui/               # UI component library
├── contexts/             # React Context providers
├── lib/                  # Utility functions and configs
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

### Component Architecture

#### 1. **Layout System**
```typescript
// app/layout.tsx - Root layout
- Authentication wrapper
- Navigation sidebar
- Main content area
- Responsive design
- Theme provider

// components/Layout.tsx - Application shell
- Header with user info
- Sidebar navigation
- Breadcrumb navigation
- Mobile responsiveness
```

#### 2. **UI Component Library**
Located in `src/components/ui/`, providing:

**Core Components**:
- `Button.tsx`: Multi-variant button system
- `Card.tsx`: Container component with header/content
- `Badge.tsx`: Status and category indicators
- `Input.tsx`: Form input with validation
- `Select.tsx`: Dropdown selection component
- `Table.tsx`: Data table with sorting/filtering

**Chart Components**:
- `FakeLineChart.tsx`: Time-series visualization
- `FakeBarChart.tsx`: Comparative data display
- `FakeGaugeChart.tsx`: Real-time metric gauges

#### 3. **Data Visualization Architecture**

**Chart Data Structure**:
```typescript
interface ChartDataPoint {
  timestamp: Date;
  temperature?: number;
  pressure?: number;
  vibration?: number;
  speed?: number;
  current?: number;
}

// Helper function for safe property access
function getMetricValue(dataPoint: ChartDataPoint, metric: string): number {
  switch (metric) {
    case 'temperature': return dataPoint.temperature ?? 0;
    case 'pressure': return dataPoint.pressure ?? 0;
    case 'vibration': return dataPoint.vibration ?? 0;
    case 'speed': return dataPoint.speed ?? 0;
    case 'current': return dataPoint.current ?? 0;
    default: return 0;
  }
}
```

**Gauge Chart Implementation**:
```typescript
interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  thresholds: {
    warning: number;
    critical: number;
  };
}

// Color determination logic
function getGaugeColor(value: number, thresholds: GaugeThresholds): string {
  if (value >= thresholds.critical) return '#EF4444'; // Red
  if (value >= thresholds.warning) return '#F59E0B';  // Yellow
  return '#10B981'; // Green
}
```

---

## 🔐 Authentication & Authorization

### Authentication Context
```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

// Role-based permission system
const ROLE_PERMISSIONS = {
  technician: [
    'view_machines',
    'view_assigned_sessions',
    'upload_session_data',
    'submit_solution',
    'report_failures'
  ],
  maintenance_manager: [
    // All technician permissions plus:
    'create_sessions',
    'assign_sessions',
    'view_all_sessions',
    'manage_users',
    'view_analytics'
  ]
};
```

### Permission Hook Implementation
```typescript
function usePermissions() {
  const { user } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  return { hasPermission };
}
```

---

## 📊 Data Management & State

### TypeScript Type System

**Core Entity Types**:
```typescript
// User Management
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

type UserRole = 'technician' | 'maintenance_manager';

// Machine Management
interface Machine {
  id: string;
  name: string;
  location: string;
  type: string;
  serialNumber: string;
  status: MachineStatus;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type MachineStatus = 'operational' | 'maintenance' | 'failure' | 'offline';

// Test Session Management
interface TestSession {
  id: string;
  name: string;
  machineId: string;
  machine: Machine;
  createdBy: User;
  assignedTo: User;
  sensors: SensorModule[];
  startTime: Date;
  endTime?: Date;
  samplingFrequency: number;
  status: SessionStatus;
  notes?: string;
  data: SensorData[];
  dataFiles: SessionDataFile[];
  solution?: SessionSolution;
  closureRequest?: SessionClosureRequest;
  createdAt: Date;
  updatedAt: Date;
}

type SessionStatus = 
  | 'created' 
  | 'assigned' 
  | 'in_progress' 
  | 'data_uploaded' 
  | 'analysis_complete' 
  | 'solution_submitted' 
  | 'completed' 
  | 'cancelled' 
  | 'error';
```

### Mock Data Architecture

**Data Generation Strategy**:
```typescript
// Centralized mock data generation
function generateMockChartData(): ChartDataPoint[] {
  const dataPoints: ChartDataPoint[] = [];
  const now = new Date();
  
  for (let i = 0; i < 100; i++) {
    dataPoints.push({
      timestamp: new Date(now.getTime() - (99 - i) * 60000), // 1-minute intervals
      temperature: 20 + Math.random() * 60,    // 20-80°C
      pressure: 2 + Math.random() * 6,         // 2-8 bar
      vibration: 0.5 + Math.random() * 2,      // 0.5-2.5g
      speed: 800 + Math.random() * 1400,       // 800-2200 RPM
      current: 10 + Math.random() * 20,        // 10-30A
    });
  }
  
  return dataPoints;
}

// Session-specific data generation
function getMockSession(id: string): TestSession | null {
  // Implementation includes realistic test scenarios
  // with proper status progression and data relationships
}
```

---

## 🎨 Styling & Design System

### Tailwind CSS Configuration
```typescript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
```

### Component Styling Patterns
```typescript
// Consistent component styling using Tailwind classes
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  ghost: 'hover:bg-gray-100 text-gray-700',
};

const statusColors = {
  operational: 'bg-green-100 text-green-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  failure: 'bg-red-100 text-red-800',
  offline: 'bg-gray-100 text-gray-800',
};
```

---

## 🔄 Component Integration Patterns

### Page Component Structure
```typescript
// Typical page component pattern
export default function SessionsPage() {
  // 1. State management
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // 2. Authentication & permissions
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  
  // 3. Data fetching and processing
  useEffect(() => {
    const loadSessions = () => {
      // Mock data loading
      const allSessions = getMockSessions();
      setSessions(allSessions);
    };
    loadSessions();
  }, []);
  
  // 4. Computed values
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // 5. Event handlers
  const handleCreateSession = () => {
    // Navigation or modal opening logic
  };
  
  // 6. Render with conditional UI based on permissions
  return (
    <div className="space-y-6">
      {/* Header with conditional actions */}
      {/* Statistics display */}
      {/* Filters */}
      {/* Data table */}
    </div>
  );
}
```

### Session Detail Chart Integration
```typescript
// Chart integration in session detail page
export default function SessionDetailPage({ params }: { params: { id: string } }) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  
  // Generate mock chart data
  useEffect(() => {
    const data = generateMockChartData();
    setChartData(data);
  }, []);
  
  // Safe metric value extraction
  const getMetricValue = (dataPoint: ChartDataPoint, metric: string): number => {
    switch (metric) {
      case 'temperature': return dataPoint.temperature ?? 0;
      case 'pressure': return dataPoint.pressure ?? 0;
      case 'vibration': return dataPoint.vibration ?? 0;
      case 'speed': return dataPoint.speed ?? 0;
      case 'current': return dataPoint.current ?? 0;
      default: return 0;
    }
  };
  
  // Statistics calculation
  const calculateStats = (metric: string) => {
    const values = chartData.map(d => getMetricValue(d, metric)).filter(v => v !== undefined);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    };
  };
  
  return (
    <div>
      {/* Metric selector */}
      <Select
        value={selectedMetric}
        onChange={setSelectedMetric}
        options={[
          { value: 'temperature', label: '🌡️ Temperature' },
          { value: 'pressure', label: '⏲️ Pressure' },
          { value: 'vibration', label: '📳 Vibration' },
          { value: 'speed', label: '🔄 Speed' },
          { value: 'current', label: '⚡ Current' },
        ]}
      />
      
      {/* Gauge chart display */}
      <FakeGaugeChart
        value={getMetricValue(chartData[chartData.length - 1] || {}, selectedMetric)}
        // ... other props
      />
      
      {/* Summary statistics */}
      <div>
        {['temperature', 'pressure', 'vibration', 'speed', 'current'].map(metric => {
          const stats = calculateStats(metric);
          return (
            <div key={metric}>
              <h4>{metric}</h4>
              <p>Min: {stats.min.toFixed(1)}</p>
              <p>Max: {stats.max.toFixed(1)}</p>
              <p>Avg: {stats.avg.toFixed(1)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 🚀 Build & Development Setup

### Package.json Configuration
```json
{
  "name": "universal-test-box",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "14.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

### Next.js Configuration
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    appDir: true, // Enable App Router
  },
  typescript: {
    // Enable strict type checking
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enable ESLint during builds
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🔧 Utility Functions & Helpers

### Date and Time Utilities
```typescript
// lib/utils.ts
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export function formatDuration(startTime: Date, endTime?: Date): string {
  const end = endTime || new Date();
  const diffMs = end.getTime() - startTime.getTime();
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  
  return `${hours}h ${minutes}m`;
}
```

### Status and Color Utilities
```typescript
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    operational: 'text-green-600',
    maintenance: 'text-yellow-600',
    failure: 'text-red-600',
    offline: 'text-gray-600',
    completed: 'text-green-600',
    in_progress: 'text-blue-600',
    error: 'text-red-600',
  };
  
  return colorMap[status] || 'text-gray-600';
}

export function getSeverityIcon(severity: string): string {
  const iconMap: Record<string, string> = {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    critical: '🔴',
  };
  
  return iconMap[severity] || '⚪';
}
```

### Data Export Utilities
```typescript
// lib/export.ts
export class DataExporter {
  static exportToCSV(data: any[], filename: string): void {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  
  static exportToJSON(data: any[], filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
```

---

## 📡 API Integration Architecture

### API Endpoint Structure (Future Implementation)
```typescript
// lib/api.ts - API client structure for future backend integration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
  MACHINES: {
    LIST: '/api/machines',
    CREATE: '/api/machines',
    GET: (id: string) => `/api/machines/${id}`,
    UPDATE: (id: string) => `/api/machines/${id}`,
    DELETE: (id: string) => `/api/machines/${id}`,
  },
  SESSIONS: {
    LIST: '/api/sessions',
    CREATE: '/api/sessions',
    GET: (id: string) => `/api/sessions/${id}`,
    UPDATE: (id: string) => `/api/sessions/${id}`,
    UPLOAD_DATA: (id: string) => `/api/sessions/${id}/data`,
    START: (id: string) => `/api/sessions/${id}/start`,
    STOP: (id: string) => `/api/sessions/${id}/stop`,
  },
  FAILURES: {
    LIST: '/api/failures',
    CREATE: '/api/failures',
    GET: (id: string) => `/api/failures/${id}`,
    UPDATE: (id: string) => `/api/failures/${id}`,
  },
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    MACHINE: (id: string) => `/api/analytics/machines/${id}`,
    PREDICTIONS: '/api/analytics/predictions',
  },
};

// Type-safe API client
class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
  
  // Additional methods for PUT, DELETE, file uploads, etc.
}
```

---

## 🔍 Error Handling & Validation

### Form Validation Patterns
```typescript
// Validation utility functions
export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

// Component-level validation
const useFormValidation = (initialValues: any, validationRules: any) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const error = rule(values[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return { values, setValues, errors, validate };
};
```

---

## 🚀 Performance Optimization

### Code Splitting and Lazy Loading
```typescript
// Dynamic imports for large components
import dynamic from 'next/dynamic';

const AnalyticsDashboard = dynamic(() => import('./AnalyticsDashboard'), {
  loading: () => <div>Loading analytics...</div>,
  ssr: false, // Disable SSR for client-heavy components
});

// Route-based code splitting automatically handled by Next.js App Router
```

### Memoization Patterns
```typescript
// Expensive calculations memoization
const calculateSessionStatistics = useMemo(() => {
  return sessions.reduce((stats, session) => {
    stats[session.status] = (stats[session.status] || 0) + 1;
    return stats;
  }, {} as Record<SessionStatus, number>);
}, [sessions]);

// Component memoization for performance
const SessionTableRow = memo(({ session }: { session: TestSession }) => {
  return (
    <TableRow>
      {/* Row content */}
    </TableRow>
  );
});
```

---

## 🔒 Security Considerations

### Client-Side Security
```typescript
// Input sanitization
export function sanitizeInput(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

// Permission checks in components
const ProtectedComponent = ({ children, requiredPermission }: {
  children: React.ReactNode;
  requiredPermission: string;
}) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(requiredPermission)) {
    return <div>Access denied</div>;
  }
  
  return <>{children}</>;
};
```

---

*This technical documentation provides comprehensive implementation details for developers working on or extending the Universal Test Box system. It covers all aspects from component architecture to future API integration patterns.*
