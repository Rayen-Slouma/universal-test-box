// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'technician' | 'maintenance_manager';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Machine Types
export interface Machine {
  id: string;
  name: string;
  location: string;
  type: string;
  serialNumber: string;
  manufacturer?: string;
  model?: string;
  installationDate?: Date;
  status: MachineStatus;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type MachineStatus = 'operational' | 'maintenance' | 'failure' | 'offline';

// Sensor Module Types
export interface SensorModule {
  id: string;
  name: string;
  type: SensorType;
  description: string;
  isActive: boolean;
}

export type SensorType = 
  | 'temperature'
  | 'camera'
  | 'vibration'
  | 'gas_detector'
  | 'multimeter'
  | 'pressure'
  | 'humidity'
  | 'current'
  | 'voltage'
  | 'speed_rpm'
  | 'proximity'
  | 'load_cell'
  | 'microphone'
  | 'ir_temperature'
  | 'light'
  | 'ph'
  | 'magnetic_field'
  | 'water_leak';

// Test Session Types
export interface TestSession {
  id: string;
  name: string;
  machineId: string;
  machine?: Machine;
  createdBy: User; // Manager who created the session
  assignedTo: User; // Technician assigned to the session
  sensors: SensorModule[];
  startTime: Date;
  endTime?: Date;
  samplingFrequency: number; // in Hz
  status: SessionStatus;
  notes?: string;
  data: SensorData[];
  dataFiles?: SessionDataFile[]; // Uploaded data files
  solution?: SessionSolution; // Solution submitted by technician
  closureRequest?: SessionClosureRequest; // Closure request from technician
  createdAt: Date;
  updatedAt: Date;
}

// Session Data File Types
export interface SessionDataFile {
  id: string;
  sessionId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: User;
  dataFormat: 'json' | 'csv' | 'xlsx';
  recordCount?: number;
}

export type SessionStatus = 'created' | 'assigned' | 'in_progress' | 'data_uploaded' | 'analysis_complete' | 'solution_submitted' | 'completed' | 'cancelled' | 'error';

// Session Solution Types
export interface SessionSolution {
  id: string;
  sessionId: string;
  description: string;
  stepsPerformed: string[];
  recommendations?: string;
  submittedBy: User;
  submittedAt: Date;
  reviewedBy?: User;
  reviewedAt?: Date;
  approved: boolean;
}

// Session Closure Request
export interface SessionClosureRequest {
  id: string;
  sessionId: string;
  requestedBy: User;
  requestedAt: Date;
  reason: string;
  solutionId?: string;
  approved?: boolean;
  reviewedBy?: User;
  reviewedAt?: Date;
  comments?: string;
}

// Sensor Data Types
export interface SensorData {
  id: string;
  sessionId: string;
  sensorId: string;
  timestamp: Date;
  value: number | string | boolean;
  unit?: string;
}

// Failure and Maintenance Types
export interface Failure {
  id: string;
  machineId: string;
  machine?: Machine;
  reportedBy: User;
  description: string;
  severity: FailureSeverity;
  category: FailureCategory;
  status: FailureStatus;
  reportedAt: Date;
  resolvedAt?: Date;
  resolution?: string;
  associatedSessionId?: string;
  associatedSession?: TestSession;
  maintenanceActions: MaintenanceAction[];
  attachments: Attachment[];
}

export type FailureSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FailureCategory = 
  | 'mechanical'
  | 'electrical'
  | 'hydraulic'
  | 'pneumatic'
  | 'software'
  | 'thermal'
  | 'vibration'
  | 'contamination'
  | 'wear'
  | 'other';

export type FailureStatus = 'reported' | 'investigating' | 'in_progress' | 'resolved' | 'closed';

export interface MaintenanceAction {
  id: string;
  failureId: string;
  description: string;
  performedBy: User;
  performedAt: Date;
  duration: number; // in minutes
  parts?: string[];
  cost?: number;
}

// File and Attachment Types
export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date;
  description?: string;
}

// Analytics and Reporting Types
export interface AnalyticsData {
  machineId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    uptime: number; // percentage
    failureCount: number;
    maintenanceHours: number;
    averageRepairTime: number; // in hours
    costSavings?: number;
  };
  trends: {
    sensorType: SensorType;
    values: { timestamp: Date; value: number }[];
  }[];
  predictions: PredictiveAnalysis[];
}

export interface PredictiveAnalysis {
  machineId: string;
  sensorType: SensorType;
  prediction: 'normal' | 'warning' | 'alert' | 'critical';
  confidence: number; // 0-1
  timeToFailure?: number; // in days
  recommendedActions: string[];
  createdAt: Date;
}

// Knowledge Base Types
export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  content: string;
  category: FailureCategory;
  tags: string[];
  machineTypes: string[];
  symptoms: string[];
  solutions: string[];
  attachments: Attachment[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  rating: number; // 1-5
}

// Notification and Alert Types
export interface Alert {
  id: string;
  machineId: string;
  machine?: Machine;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  description?: string;
  isRead: boolean;
  createdAt: Date;
  resolvedAt?: Date;
  assignedTo?: User[];
}

export type AlertType = 
  | 'sensor_threshold'
  | 'predictive_maintenance'
  | 'failure_detected'
  | 'maintenance_due'
  | 'system_error';

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

// Export Configuration Types
export interface ExportConfig {
  format: ExportFormat;
  dateRange: {
    start: Date;
    end: Date;
  };
  machines?: string[];
  sensors?: SensorType[];
  includeAnalytics: boolean;
  includeFailures: boolean;
}

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface MachineForm {
  name: string;
  location: string;
  type: string;
  serialNumber: string;
  manufacturer?: string;
  model?: string;
  installationDate?: string;
}

export interface TestSessionForm {
  machineId: string;
  sensors: string[];
  samplingFrequency: number;
  duration?: number; // in minutes
  notes?: string;
}

export interface FailureForm {
  machineId: string;
  description: string;
  severity: FailureSeverity;
  category: FailureCategory;
  sessionId?: string;
}

// Dashboard and Chart Types
export interface DashboardStats {
  totalMachines: number;
  activeSessions: number;
  pendingFailures: number;
  criticalAlerts: number;
  machineUptime: number; // percentage
  maintenanceEfficiency: number; // percentage
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Search and Filter Types
export interface SearchFilters {
  machines?: string[];
  sensors?: SensorType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  severity?: string[];
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}
