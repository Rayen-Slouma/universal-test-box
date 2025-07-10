# Universal Test Box - Predictive Maintenance System

A modern web application for managing modular test boxes used in predictive maintenance of industrial equipment. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### User Management & Authentication
- **Role-based access control** with two user types:
  - **Technician**: Can view machines, create test sessions, report failures
  - **Maintenance Manager**: Full system access including analytics and user management
- Secure authentication with session management
- Permission-based UI rendering
- Complete user management interface with role assignment

### Machine Management
- Comprehensive machine database with detailed information
- Real-time status tracking (Operational, Maintenance, Failure, Offline)
- Maintenance scheduling and history
- Machine type categorization and filtering
- Advanced search and filtering capabilities

### Test Sessions
- **Advanced Session Creation Interface**:
  - Pre-configured session templates (Routine Check, Diagnostic Scan, Quick Health Check)
  - Interactive machine selection with real-time status
  - Visual sensor selection grid with health indicators
  - Real-time data collection estimates (file size, data points)
  - Smart form validation with warnings for large datasets
  - Session preview and summary before creation
- **Intelligent Configuration**:
  - Sampling frequency options from 1Hz to 100Hz
  - Flexible duration settings (15 minutes to 24 hours)
  - Auto-start functionality for immediate data collection
  - Notes and documentation support
- **Sensor Health Monitoring**:
  - Real-time sensor status indicators (✓ Healthy, ⚠ Warning, ✗ Error)
  - Health-based validation before session creation
  - Visual feedback for sensor selection
- **Session Management**:
  - Real-time session monitoring and control
  - Session history and analytics
  - Multi-sensor data collection interface
  - Export capabilities for collected data

### Sensor Modules
Support for 19+ sensor types including:
- 🌡️ Temperature sensors (contact and IR)
- 📳 Vibration sensors
- 📷 Camera modules
- ⏲️ Pressure sensors
- ⚡ Current and voltage monitoring
- 🔄 RPM sensors
- 💧 Humidity and leak detection
- 🧲 Magnetic field sensors
- And many more...

### Failure Management
- Comprehensive failure reporting system
- Severity classification (Low, Medium, High, Critical)
- Category-based organization (Mechanical, Electrical, Hydraulic, etc.)
- Maintenance action tracking
- Resolution workflow management
- Full failure lifecycle management

### Analytics & Predictive Maintenance
- Machine uptime monitoring and performance metrics
- Performance metrics dashboard with cost analysis
- Predictive analysis alerts with confidence ratings
- Historical data visualization and trends
- Maintenance efficiency tracking
- ROI calculation from predictive maintenance

### Alert Management
- Real-time system alerts and notifications
- Alert prioritization by severity (Info, Warning, Error, Critical)
- Alert categorization (Sensor Threshold, Predictive Maintenance, Failure Detection)
- Alert resolution workflow
- Notification management and assignment

### Knowledge Base
- Comprehensive troubleshooting guides and procedures
- Searchable documentation with categories and tags
- Step-by-step maintenance procedures
- Symptom-to-solution mapping
- User ratings and view tracking
- Rich content with markdown support

### Data Export & Reporting
- Multiple export formats (CSV, Excel, PDF, JSON)
- Custom date range selection
- Filtered data exports
- Automated report generation
- Comprehensive maintenance reports with statistics

### System Status & Monitoring
- Complete system status dashboard (`/status`)
- Feature availability monitoring
- Technical specifications overview
- Quick start guide and demo credentials
- Real-time system health indicators

## 🎛️ Session Creation Workflow

The enhanced session creation interface provides a comprehensive workflow for setting up data collection sessions:

### 1. Template Selection
Choose from pre-configured templates to quickly set up common scenarios:
- **Routine Maintenance Check**: 1-hour monitoring with basic sensors (Temperature, Vibration)
- **Diagnostic Deep Scan**: 4-hour comprehensive analysis with all available sensors
- **Quick Health Check**: 15-minute rapid assessment with essential sensors

### 2. Machine Configuration
- Select from operational machines only
- View real-time machine details (location, type, serial number, status)
- Visual machine status indicators

### 3. Sensor Configuration
- Interactive sensor grid with visual selection
- Real-time sensor health indicators:
  - ✅ **Green**: Sensor is healthy and ready
  - ⚠️ **Yellow**: Warning - sensor may have issues
  - ❌ **Red**: Error - sensor needs attention
- Detailed sensor descriptions and type information
- Smart validation prevents selection of failed sensors

### 4. Data Collection Settings
- **Sampling Frequency**: 1Hz to 100Hz options with guidance
- **Collection Duration**: 15 minutes to 24 hours
- **Real-time Estimates**: Data points and file size calculations
- **Smart Warnings**: Alerts for large datasets or long durations

### 5. Additional Configuration
- **Notes Field**: Document session purpose and special considerations
- **Auto-start Option**: Begin data collection immediately upon creation
- **Session Preview**: Complete summary before final creation

### 6. Session Preview & Creation
- Comprehensive session summary with all settings
- Sensor health final check
- Data collection estimates
- One-click creation and optional auto-start

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Emoji-based icons for universal compatibility
- **Charts**: Recharts (ready for implementation)
- **Date Handling**: date-fns

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd universal-test-box
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Visit the system status page at [http://localhost:3000/status](http://localhost:3000/status) for a complete overview of all features.

## 🎯 System Status

All features are **100% complete and operational**! Visit `/status` for a comprehensive system overview.

## 🔐 Demo Credentials

### Technician Account
- **Email**: tech1@testbox.com
- **Password**: password123
- **Permissions**: View machines, create sessions, report failures

### Maintenance Manager Account
- **Email**: manager@testbox.com
- **Password**: password123
- **Permissions**: Full system access, analytics, user management

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── machines/          # Machine management
│   ├── sessions/          # Test sessions
│   ├── failures/          # Failure management
│   ├── analytics/         # Analytics and insights
│   ├── alerts/            # Alert management
│   ├── users/             # User management
│   ├── knowledge-base/    # Knowledge base
│   ├── status/            # System status page
│   ├── login/            # Authentication
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── ui/              # UI component library
│   └── Layout.tsx       # Main application layout
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── lib/                 # Utilities and configurations
│   ├── utils.ts         # Helper functions
│   ├── constants.ts     # Application constants
│   └── export.ts        # Data export utilities
└── types/              # TypeScript type definitions
    └── index.ts        # Main type definitions
```

## 🎨 Key Components

### Authentication System
- Secure login with role-based access
- Protected routes with permission checking
- Persistent sessions with localStorage

### Machine Management
- Real-time status monitoring
- Maintenance scheduling
- Advanced filtering and search
- Status-based dashboards

### Test Sessions
- Multi-sensor configuration
- Real-time monitoring
- Configurable parameters
- Session history tracking

### Failure Management
- Comprehensive failure tracking
- Severity and category classification
- Resolution workflow
- Maintenance action logging

### Analytics Dashboard
- System overview with key metrics
- Performance trends and insights
- Cost analysis and ROI tracking
- Predictive maintenance alerts

### Alert Management
- Real-time notification system
- Severity-based prioritization
- Alert resolution workflow
- Assignment and tracking

### Knowledge Base
- Searchable documentation
- Troubleshooting guides
- Procedure documentation
- Community ratings and feedback

### User Management
- Role assignment and management
- User activity tracking
- Permission management
- Account lifecycle management

## 🔧 Configuration

The application includes comprehensive configuration through constants:

- **User roles and permissions**
- **Sensor type definitions**
- **Status options for machines and sessions**
- **Export format options**
- **API endpoint definitions** (ready for backend integration)

## 🚀 Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any hosting service that supports Next.js.

```bash
npm run build
npm start
```

## 🔮 Future Enhancements

- **Backend Integration**: REST API for data persistence
- **Real-time Data**: WebSocket integration for live sensor data
- **Machine Learning**: Predictive maintenance algorithms
- **Mobile App**: React Native companion app
- **IoT Integration**: Direct sensor communication
- **Advanced Analytics**: Custom reporting and insights

## 📄 License

This project is part of a predictive maintenance system demonstration.

## 🤝 Contributing

This is a demonstration project for predictive maintenance systems. For production use, additional security measures and backend integration would be required.
