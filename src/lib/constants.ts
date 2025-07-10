import { SensorType, SensorModule } from '@/types';

// Application Configuration
export const APP_CONFIG = {
  name: 'Universal Test Box',
  version: '1.0.0',
  description: 'Predictive Maintenance Test Box System',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  defaultSamplingFrequency: 1, // Hz
  maxSamplingFrequency: 1000, // Hz
  sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
};

// User Roles and Permissions
export const USER_ROLES = {
  TECHNICIAN: 'technician',
  MAINTENANCE_MANAGER: 'maintenance_manager',
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.TECHNICIAN]: [
    'view_machines',
    'view_assigned_sessions',
    'view_all_sessions', // Allow technicians to access session pages (they'll see filtered content)
    'upload_session_data',
    'view_session_charts',
    'submit_solution',
    'request_session_closure',
    'view_archived_sessions',
    'view_session_solutions',
    'view_own_data',
    'export_basic_data',
  ],  [USER_ROLES.MAINTENANCE_MANAGER]: [
    'view_machines',
    'create_machines',
    'edit_machines',
    'delete_machines',
    'create_sessions',
    'assign_sessions',
    'view_all_sessions',
    'edit_sessions',
    'delete_sessions',
    'close_sessions',
    'review_solutions',
    'approve_closure_requests',
    'view_all_data',
    'view_analytics',
    'manage_users',
    'manage_sensors',
    'delete_sessions',
    'view_all_data',
    'view_analytics',
    'manage_users',
    'manage_sensors',
    'export_all_data',
    'view_knowledge_base',
    'edit_knowledge_base',
    'manage_alerts',
    'view_system_logs',
  ],
} as const;

// Machine Status Options
export const MACHINE_STATUS = {
  OPERATIONAL: 'operational',
  MAINTENANCE: 'maintenance',
  FAILURE: 'failure',
  OFFLINE: 'offline',
} as const;

export const MACHINE_STATUS_LABELS = {
  [MACHINE_STATUS.OPERATIONAL]: 'Operational',
  [MACHINE_STATUS.MAINTENANCE]: 'Under Maintenance',
  [MACHINE_STATUS.FAILURE]: 'Failed',
  [MACHINE_STATUS.OFFLINE]: 'Offline',
} as const;

// Session Status Options
export const SESSION_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ERROR: 'error',
} as const;

export const SESSION_STATUS_LABELS = {
  [SESSION_STATUS.IN_PROGRESS]: 'In Progress',
  [SESSION_STATUS.COMPLETED]: 'Completed',
  [SESSION_STATUS.CANCELLED]: 'Cancelled',
  [SESSION_STATUS.ERROR]: 'Error',
} as const;

// Failure Severity and Category Options
export const FAILURE_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const FAILURE_SEVERITY_LABELS = {
  [FAILURE_SEVERITY.LOW]: 'Low',
  [FAILURE_SEVERITY.MEDIUM]: 'Medium',
  [FAILURE_SEVERITY.HIGH]: 'High',
  [FAILURE_SEVERITY.CRITICAL]: 'Critical',
} as const;

export const FAILURE_CATEGORY = {
  MECHANICAL: 'mechanical',
  ELECTRICAL: 'electrical',
  HYDRAULIC: 'hydraulic',
  PNEUMATIC: 'pneumatic',
  SOFTWARE: 'software',
  THERMAL: 'thermal',
  VIBRATION: 'vibration',
  CONTAMINATION: 'contamination',
  WEAR: 'wear',
  OTHER: 'other',
} as const;

export const FAILURE_CATEGORY_LABELS = {
  [FAILURE_CATEGORY.MECHANICAL]: 'Mechanical',
  [FAILURE_CATEGORY.ELECTRICAL]: 'Electrical',
  [FAILURE_CATEGORY.HYDRAULIC]: 'Hydraulic',
  [FAILURE_CATEGORY.PNEUMATIC]: 'Pneumatic',
  [FAILURE_CATEGORY.SOFTWARE]: 'Software',
  [FAILURE_CATEGORY.THERMAL]: 'Thermal',
  [FAILURE_CATEGORY.VIBRATION]: 'Vibration',
  [FAILURE_CATEGORY.CONTAMINATION]: 'Contamination',
  [FAILURE_CATEGORY.WEAR]: 'Wear',
  [FAILURE_CATEGORY.OTHER]: 'Other',
} as const;

export const FAILURE_STATUS = {
  REPORTED: 'reported',
  INVESTIGATING: 'investigating',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const FAILURE_STATUS_LABELS = {
  [FAILURE_STATUS.REPORTED]: 'Reported',
  [FAILURE_STATUS.INVESTIGATING]: 'Investigating',
  [FAILURE_STATUS.IN_PROGRESS]: 'In Progress',
  [FAILURE_STATUS.RESOLVED]: 'Resolved',
  [FAILURE_STATUS.CLOSED]: 'Closed',
} as const;

// Sensor Types Configuration
export const SENSOR_TYPES: Record<SensorType, { name: string; description: string; unit?: string; icon: string }> = {
  temperature: {
    name: 'Temperature Sensor',
    description: 'Measures ambient temperature',
    unit: '°C',
    icon: '🌡️',
  },
  camera: {
    name: 'Camera',
    description: 'Visual inspection and monitoring',
    icon: '📷',
  },
  vibration: {
    name: 'Vibration Sensor',
    description: 'Detects mechanical anomalies and vibrations',
    unit: 'g',
    icon: '📳',
  },
  gas_detector: {
    name: 'Gas Detector',
    description: 'Monitors for gas leaks and dangerous atmospheres',
    unit: 'ppm',
    icon: '💨',
  },
  multimeter: {
    name: 'Portable Multimeter',
    description: 'Measures voltage, current, and resistance',
    unit: 'V/A/Ω',
    icon: '🔌',
  },
  pressure: {
    name: 'Pressure Sensor',
    description: 'Monitors hydraulic and pneumatic systems',
    unit: 'bar',
    icon: '⏲️',
  },
  humidity: {
    name: 'Humidity Sensor',
    description: 'Measures ambient humidity levels',
    unit: '%RH',
    icon: '💧',
  },
  current: {
    name: 'Current Sensor',
    description: 'Monitors electrical current consumption',
    unit: 'A',
    icon: '⚡',
  },
  voltage: {
    name: 'Voltage Sensor',
    description: 'Monitors electrical voltage levels',
    unit: 'V',
    icon: '🔋',
  },
  speed_rpm: {
    name: 'RPM Sensor',
    description: 'Measures rotation speed of motors and machinery',
    unit: 'RPM',
    icon: '🔄',
  },
  proximity: {
    name: 'Proximity Sensor',
    description: 'Detects object presence and positioning',
    unit: 'mm',
    icon: '📡',
  },
  load_cell: {
    name: 'Load Cell',
    description: 'Measures weight and mechanical loads',
    unit: 'kg',
    icon: '⚖️',
  },
  microphone: {
    name: 'Microphone',
    description: 'Detects abnormal sounds and acoustic patterns',
    unit: 'dB',
    icon: '🎤',
  },
  ir_temperature: {
    name: 'IR Temperature Sensor',
    description: 'Non-contact temperature measurement',
    unit: '°C',
    icon: '🔴',
  },
  light: {
    name: 'Light Sensor',
    description: 'Measures ambient light levels',
    unit: 'lux',
    icon: '💡',
  },
  ph: {
    name: 'pH Sensor',
    description: 'Monitors fluid acidity and alkalinity',
    unit: 'pH',
    icon: '🧪',
  },
  magnetic_field: {
    name: 'Magnetic Field Sensor',
    description: 'Detects electromagnetic anomalies',
    unit: 'mT',
    icon: '🧲',
  },
  water_leak: {
    name: 'Water Leak Detector',
    description: 'Detects water leaks and moisture',
    icon: '🚰',
  },
};

// Default Sensor Modules
export const DEFAULT_SENSOR_MODULES: Omit<SensorModule, 'id'>[] = [
  {
    name: 'Primary Temperature Monitor',
    type: 'temperature',
    description: 'Main temperature monitoring for operational zones',
    isActive: true,
  },
  {
    name: 'Vibration Analysis Unit',
    type: 'vibration',
    description: 'High-precision vibration monitoring for predictive maintenance',
    isActive: true,
  },
  {
    name: 'Visual Inspection Camera',
    type: 'camera',
    description: 'HD camera for visual inspection and documentation',
    isActive: true,
  },
  {
    name: 'Current Monitor',
    type: 'current',
    description: 'Monitors electrical current consumption patterns',
    isActive: true,
  },
  {
    name: 'Pressure Monitor',
    type: 'pressure',
    description: 'Hydraulic and pneumatic pressure monitoring',
    isActive: false,
  },
];

// Alert Types and Severities
export const ALERT_TYPES = {
  SENSOR_THRESHOLD: 'sensor_threshold',
  PREDICTIVE_MAINTENANCE: 'predictive_maintenance',
  FAILURE_DETECTED: 'failure_detected',
  MAINTENANCE_DUE: 'maintenance_due',
  SYSTEM_ERROR: 'system_error',
} as const;

export const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
} as const;

export const ALERT_SEVERITY_LABELS = {
  [ALERT_SEVERITY.INFO]: 'Info',
  [ALERT_SEVERITY.WARNING]: 'Warning',
  [ALERT_SEVERITY.ERROR]: 'Error',
  [ALERT_SEVERITY.CRITICAL]: 'Critical',
} as const;

// Export Formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  PDF: 'pdf',
  JSON: 'json',
} as const;

export const EXPORT_FORMAT_LABELS = {
  [EXPORT_FORMATS.CSV]: 'CSV',
  [EXPORT_FORMATS.EXCEL]: 'Excel',
  [EXPORT_FORMATS.PDF]: 'PDF',
  [EXPORT_FORMATS.JSON]: 'JSON',
} as const;

// Chart Colors
export const CHART_COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  secondary: '#6B7280',
  purple: '#8B5CF6',
  orange: '#F97316',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

// API Endpoints (will be used with backend)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
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
    DELETE: (id: string) => `/api/sessions/${id}`,
    START: (id: string) => `/api/sessions/${id}/start`,
    STOP: (id: string) => `/api/sessions/${id}/stop`,
  },
  FAILURES: {
    LIST: '/api/failures',
    CREATE: '/api/failures',
    GET: (id: string) => `/api/failures/${id}`,
    UPDATE: (id: string) => `/api/failures/${id}`,
    DELETE: (id: string) => `/api/failures/${id}`,
  },
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    MACHINE: (id: string) => `/api/analytics/machines/${id}`,
    PREDICTIONS: '/api/analytics/predictions',
  },
  EXPORT: {
    DATA: '/api/export/data',
    REPORTS: '/api/export/reports',
  },
} as const;
