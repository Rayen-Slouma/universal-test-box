import { ExportFormat, Failure, Machine, TestSession, User } from '@/types';

/**
 * Export data to various formats
 */
export class DataExporter {
  static exportToCSV(data: any[], filename: string): void {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  static exportToJSON(data: any[], filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  static exportMachines(machines: Machine[], format: ExportFormat = 'csv'): void {
    const exportData = machines.map(machine => ({
      id: machine.id,
      name: machine.name,
      location: machine.location,
      type: machine.type,
      serialNumber: machine.serialNumber,
      manufacturer: machine.manufacturer || '',
      model: machine.model || '',
      status: machine.status,
      installationDate: machine.installationDate?.toISOString() || '',
      lastMaintenanceDate: machine.lastMaintenanceDate?.toISOString() || '',
      nextMaintenanceDate: machine.nextMaintenanceDate?.toISOString() || '',
      createdAt: machine.createdAt.toISOString(),
      updatedAt: machine.updatedAt.toISOString(),
    }));

    if (format === 'csv') {
      this.exportToCSV(exportData, 'machines');
    } else if (format === 'json') {
      this.exportToJSON(exportData, 'machines');
    }
  }

  static exportFailures(failures: Failure[], format: ExportFormat = 'csv'): void {
    const exportData = failures.map(failure => ({
      id: failure.id,
      machineId: failure.machineId,
      machineName: failure.machine?.name || '',
      description: failure.description,
      severity: failure.severity,
      category: failure.category,
      status: failure.status,
      reportedBy: failure.reportedBy.name,
      reportedByEmail: failure.reportedBy.email,
      reportedAt: failure.reportedAt.toISOString(),
      resolvedAt: failure.resolvedAt?.toISOString() || '',
      resolution: failure.resolution || '',
    }));

    if (format === 'csv') {
      this.exportToCSV(exportData, 'failures');
    } else if (format === 'json') {
      this.exportToJSON(exportData, 'failures');
    }
  }

  static exportSessions(sessions: TestSession[], format: ExportFormat = 'csv'): void {
    const exportData = sessions.map(session => ({
      id: session.id,
      name: session.name,
      machineId: session.machineId,
      machineName: session.machine?.name || '',
      status: session.status,
      createdBy: session.createdBy.name,
      createdByEmail: session.createdBy.email,
      startTime: session.startTime?.toISOString() || '',
      endTime: session.endTime?.toISOString() || '',
      duration: session.duration || 0,
      sensorModules: session.sensorModules.length,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    }));

    if (format === 'csv') {
      this.exportToCSV(exportData, 'test-sessions');
    } else if (format === 'json') {
      this.exportToJSON(exportData, 'test-sessions');
    }
  }

  static exportUsers(users: User[], format: ExportFormat = 'csv'): void {
    const exportData = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    if (format === 'csv') {
      this.exportToCSV(exportData, 'users');
    } else if (format === 'json') {
      this.exportToJSON(exportData, 'users');
    }
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Generate reports based on data
 */
export class ReportGenerator {
  static generateMaintenanceReport(
    machines: Machine[], 
    failures: Failure[], 
    sessions: TestSession[]
  ): string {
    const now = new Date();
    const report = `
MAINTENANCE REPORT
Generated: ${now.toLocaleString()}

SUMMARY:
- Total Machines: ${machines.length}
- Operational: ${machines.filter(m => m.status === 'operational').length}
- Under Maintenance: ${machines.filter(m => m.status === 'maintenance').length}
- Failed: ${machines.filter(m => m.status === 'failure').length}
- Offline: ${machines.filter(m => m.status === 'offline').length}

FAILURE ANALYSIS:
- Total Failures: ${failures.length}
- Critical: ${failures.filter(f => f.severity === 'critical').length}
- High: ${failures.filter(f => f.severity === 'high').length}
- Medium: ${failures.filter(f => f.severity === 'medium').length}
- Low: ${failures.filter(f => f.severity === 'low').length}

TEST SESSIONS:
- Total Sessions: ${sessions.length}
- Completed: ${sessions.filter(s => s.status === 'completed').length}
- In Progress: ${sessions.filter(s => s.status === 'in_progress').length}
- Cancelled: ${sessions.filter(s => s.status === 'cancelled').length}
- Error: ${sessions.filter(s => s.status === 'error').length}

MACHINE STATUS DETAILS:
${machines.map(machine => `
${machine.name} (${machine.serialNumber}):
  Status: ${machine.status}
  Location: ${machine.location}
  Last Maintenance: ${machine.lastMaintenanceDate?.toLocaleDateString() || 'N/A'}
  Next Maintenance: ${machine.nextMaintenanceDate?.toLocaleDateString() || 'N/A'}
`).join('')}

RECENT FAILURES:
${failures.slice(0, 10).map(failure => `
${failure.machine?.name || 'Unknown Machine'}:
  Description: ${failure.description}
  Severity: ${failure.severity}
  Status: ${failure.status}
  Reported: ${failure.reportedAt.toLocaleDateString()}
`).join('')}
`;

    return report;
  }

  static downloadMaintenanceReport(
    machines: Machine[], 
    failures: Failure[], 
    sessions: TestSession[]
  ): void {
    const report = this.generateMaintenanceReport(machines, failures, sessions);
    const filename = `maintenance-report-${new Date().toISOString().split('T')[0]}.txt`;
    DataExporter['downloadFile'](report, filename, 'text/plain');
  }
}
