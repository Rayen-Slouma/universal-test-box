# Universal Test Box - Predictive Maintenance System

A modern web application for managing modular test boxes used in predictive maintenance of industrial equipment. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### User Management & Authentication
- **Role-based access control** with two user types:
  - **Technician**: Can view machines, create test sessions, report failures
  - **Maintenance Manager**: Full system access including analytics and user management
- Secure authentication with session management
- Permission-based UI rendering

### Machine Management
- Comprehensive machine database with detailed information
- Real-time status tracking (Operational, Maintenance, Failure, Offline)
- Maintenance scheduling and history
- Machine type categorization and filtering

### Test Sessions
- Create and manage data collection sessions
- Configure multiple sensor modules per session
- Real-time session monitoring
- Configurable sampling frequencies
- Session history and analytics

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
- Category-based organization
- Maintenance action tracking
- Resolution workflow management

### Analytics & Predictive Maintenance
- Machine uptime monitoring
- Performance metrics dashboard
- Predictive analysis alerts
- Historical data visualization
- Maintenance efficiency tracking

### Data Export & Reporting
- Multiple export formats (CSV, Excel, PDF, JSON)
- Custom date range selection
- Filtered data exports
- Automated report generation

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
│   ├── login/            # Authentication
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── ui/              # UI component library
│   └── Layout.tsx       # Main application layout
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── lib/                 # Utilities and configurations
│   ├── utils.ts         # Helper functions
│   └── constants.ts     # Application constants
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

### Dashboard
- System overview with key metrics
- Recent activity monitoring
- Alert management
- Performance indicators

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
