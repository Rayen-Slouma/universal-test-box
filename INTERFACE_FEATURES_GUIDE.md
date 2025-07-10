# Universal Test Box - Interface Features & Components

## 📋 Complete Interface Component Breakdown

This document provides detailed information about every UI component, feature, and interactive element across all interfaces in the Universal Test Box system.

---

## 🎨 UI Component Library

### Core Components

#### 1. **Card Component**
- **Purpose**: Container for grouped content
- **Variants**: Standard, with header, with actions
- **Usage**: Statistics display, content grouping, form containers
- **Styling**: Rounded corners, shadow, responsive padding

#### 2. **Button Component**
- **Variants**: 
  - `primary`: Main action buttons (blue)
  - `outline`: Secondary actions (border only)
  - `ghost`: Minimal styling
- **Sizes**: `sm`, `md`, `lg`
- **States**: Normal, hover, disabled, loading

#### 3. **Badge Component**
- **Variants**:
  - `status`: Color-coded status indicators
  - `outline`: Bordered badges
  - `solid`: Filled background badges
- **Status Colors**:
  - Green: Operational, completed, resolved
  - Yellow: Warning, maintenance, in progress
  - Red: Critical, failed, error
  - Blue: Info, assigned, analysis
  - Gray: Offline, cancelled, archived

#### 4. **Table Component**
- **Features**: Sortable columns, responsive design, action buttons
- **Components**: TableHeader, TableBody, TableRow, TableHead, TableCell
- **Styling**: Striped rows, hover effects, sticky headers

#### 5. **Input Components**
- **Text Input**: Standard text fields with validation
- **Select Dropdown**: Single and multi-select options
- **File Upload**: Drag-and-drop file upload areas
- **Date Picker**: Date and time selection
- **Search Input**: Real-time search functionality

#### 6. **Chart Components**
- **FakeLineChart**: Time-series data visualization
- **FakeBarChart**: Comparative data display
- **FakeGaugeChart**: Real-time metric gauges with color coding

---

## 🔐 1. Login Interface (`/login`)

### Visual Elements
- **Layout**: Centered card on gradient background
- **Branding**: Universal Test Box logo and title
- **Color Scheme**: Professional blue and white theme

### Interactive Components
- **Email Input**:
  - Type: Email validation
  - Placeholder: "Enter your email"
  - Required field validation
- **Password Input**:
  - Type: Password (hidden characters)
  - Placeholder: "Enter your password"
  - Show/hide password toggle
- **Login Button**:
  - Variant: Primary (blue)
  - Full width
  - Loading state during authentication
- **Error Display**:
  - Red alert banner for login failures
  - Specific error messages

### Responsive Design
- **Desktop**: Centered card layout
- **Tablet**: Maintained center alignment
- **Mobile**: Full-width card with adjusted padding

---

## 🏠 2. Main Dashboard (`/dashboard`)

### Header Section
- **Page Title**: "Dashboard" with subtitle
- **User Greeting**: Personalized welcome message
- **Last Update**: Real-time timestamp

### Statistics Grid
**Layout**: 4-column responsive grid (2x2 on mobile)

#### Stat Card 1: Total Machines
- **Icon**: 🏭 Factory emoji
- **Value**: 24 (dynamic)
- **Label**: "Total Machines"
- **Color**: Gray text

#### Stat Card 2: Active Sessions
- **Icon**: 🔬 Microscope emoji
- **Value**: 3 (dynamic)
- **Label**: "Active Sessions"
- **Color**: Blue accent

#### Stat Card 3: Pending Failures
- **Icon**: ⚠️ Warning emoji
- **Value**: 7 (dynamic)
- **Label**: "Pending Failures"
- **Color**: Orange accent

#### Stat Card 4: Critical Alerts
- **Icon**: 🔔 Bell emoji
- **Value**: 2 (dynamic)
- **Label**: "Critical Alerts"
- **Color**: Red accent

### Performance Metrics Section
**Layout**: 2-column grid

#### Machine Uptime Card
- **Title**: "Machine Uptime"
- **Value**: 94.5% (large, green)
- **Subtitle**: "Last 30 days"
- **Icon**: 📈 Chart emoji
- **Progress Visual**: Circular progress indicator

#### Maintenance Efficiency Card
- **Title**: "Maintenance Efficiency"
- **Value**: 87.2% (large, blue)
- **Subtitle**: "Resolution rate"
- **Icon**: ⚡ Lightning emoji
- **Progress Visual**: Circular progress indicator

### Activity Sections
**Layout**: 2-column grid

#### Recent Test Sessions
- **Header**: "Recent Test Sessions"
- **List Items**:
  - Machine name (bold)
  - Technician name
  - Start time (relative)
  - Status badge
  - Sensor icons
- **Actions**: View details buttons

#### Recent Failures
- **Header**: "Recent Failures"
- **List Items**:
  - Machine name (bold)
  - Failure description
  - Severity badge
  - Status badge
  - Time ago
- **Actions**: View details buttons

### Active Alerts Section
- **Header**: "Active Alerts"
- **Alert Items**:
  - Alert icon (severity-based)
  - Machine name
  - Alert message
  - Severity badge
  - Timestamp
- **Background**: Yellow highlight for visibility

---

## 🏭 3. Machines Management (`/machines`)

### Header Controls
- **Page Title**: "Machines"
- **Subtitle**: "Manage and monitor your industrial equipment"
- **Add Button**: "Add New Machine" (Manager only)
- **Export Buttons**: CSV/JSON export options

### Statistics Dashboard
**Layout**: 4-column responsive grid

#### Operational Machines
- **Icon**: ✅ Check mark
- **Value**: 22 (green)
- **Label**: "Operational"

#### Under Maintenance
- **Icon**: 🔧 Wrench
- **Value**: 1 (yellow)
- **Label**: "Maintenance"

#### Failed Machines
- **Icon**: ⚠️ Warning
- **Value**: 1 (red)
- **Label**: "Failures"

#### Offline Machines
- **Icon**: ⏸️ Pause
- **Value**: 0 (gray)
- **Label**: "Offline"

### Filter Section
**Layout**: 3-column responsive grid

- **Search Input**: Machine name/location search
- **Status Filter**: Dropdown with all status options
- **Location Filter**: Dropdown with location options

### Machines Table
**Columns**:
1. **Machine**: Name, type, serial number
2. **Location**: Physical location
3. **Status**: Color-coded status badge
4. **Last Maintenance**: Date and relative time
5. **Actions**: View, edit, create session buttons

**Features**:
- Sortable columns
- Row hover effects
- Responsive design (stacked on mobile)
- Pagination for large datasets

### Machine Detail Modal
- **Machine Information**: Complete specifications
- **Maintenance History**: Historical records
- **Active Sessions**: Current test sessions
- **Sensor Configuration**: Available sensors
- **Actions**: Edit, create session, schedule maintenance

---

## 🔬 4. Test Sessions Management (`/sessions`)

### Header Controls
- **Page Title**: "Test Sessions"
- **Create Button**: "Create New Session" (Manager only)
- **Export Options**: Multiple format downloads

### Status Statistics
**Layout**: 3-row, 3-column grid (9 total cards)

#### Row 1: Active States
- **Created**: Blue badge, count
- **Assigned**: Blue badge, count
- **In Progress**: Yellow badge, count

#### Row 2: Data States
- **Data Uploaded**: Blue badge, count
- **Analysis Complete**: Green badge, count
- **Solution Submitted**: Purple badge, count

#### Row 3: Final States
- **Completed**: Green badge, count
- **Cancelled**: Gray badge, count
- **Errors**: Red badge, count

### Filter Controls
**Layout**: 2-column responsive grid

- **Search Bar**: Session name/machine search
- **Status Filter**: Multi-select dropdown with all statuses

### Sessions Table
**Columns**:
1. **Session**: Name, machine details, creation date
2. **Assigned To**: Technician name, role, contact
3. **Sensors**: Sensor badges, sampling frequency
4. **Timeline**: Start time, duration, end time
5. **Status**: Color-coded status progression
6. **Actions**: View details, upload data, submit solution

**Features**:
- Expandable rows for mobile
- Status progression indicators
- Time-based sorting
- Real-time status updates

### Session Creation Modal
**Sections**:
1. **Basic Information**: Name, description, objectives
2. **Machine Selection**: Dropdown with machine filter
3. **Sensor Configuration**: Multi-select checkboxes
4. **Sampling Settings**: Frequency slider, duration input
5. **Assignment**: Technician dropdown
6. **Scheduling**: Start time picker

---

## 📊 5. Session Details View (`/sessions/[id]`)

### Session Header
- **Session Name**: Large title with machine link
- **Status Badge**: Current session status
- **Timeline**: Start time, duration, progress bar
- **Assigned Technician**: Name, role, contact info

### Data Upload Section
**Features**:
- **Drag-and-Drop Zone**: File upload area
- **Supported Formats**: JSON, CSV, Excel indicators
- **Upload Progress**: Progress bar with percentage
- **File Validation**: Real-time format checking
- **Success Confirmation**: Upload completion message

### Chart Visualization Section
**Components**:

#### Metric Selector
- **Dropdown Options**:
  - Temperature (🌡️)
  - Pressure (⏲️)
  - Vibration (📳)
  - Speed (🔄)
  - Current (⚡)
- **Auto-refresh**: Real-time data updates

#### Gauge Charts
- **Temperature Gauge**:
  - Range: 0-100°C
  - Color zones: Green (0-70), Yellow (70-85), Red (85-100)
  - Current value display
  - Status indicator
- **Pressure Gauge**:
  - Range: 0-10 bar
  - Color zones: Green (0-7), Yellow (7-8.5), Red (8.5-10)
- **Vibration Gauge**:
  - Range: 0-5g
  - Color zones: Green (0-2), Yellow (2-3.5), Red (3.5-5)
- **Speed Gauge**:
  - Range: 0-3000 RPM
  - Color zones: Green (0-2000), Yellow (2000-2500), Red (2500-3000)
- **Current Gauge**:
  - Range: 0-50A
  - Color zones: Green (0-30), Yellow (30-40), Red (40-50)

### Summary Statistics Panel
**Metrics Display**:
- **Temperature Stats**: Min: 22°C, Max: 78°C, Avg: 45°C
- **Pressure Stats**: Min: 2.1 bar, Max: 7.8 bar, Avg: 5.2 bar
- **Vibration Stats**: Min: 0.8g, Max: 2.3g, Avg: 1.4g
- **Speed Stats**: Min: 850 RPM, Max: 2100 RPM, Avg: 1425 RPM
- **Current Stats**: Min: 12A, Max: 28A, Avg: 18A

### Action Controls
- **Export Button**: Download processed data
- **Solution Form**: Technician findings submission
- **Closure Request**: Session completion request
- **Manager Review**: Approval/rejection controls

---

## ⚠️ 6. Failure Management (`/failures`)

### Header Controls
- **Page Title**: "Failure Management"
- **Subtitle**: "Track and manage equipment failures"
- **Report Button**: "Report New Failure"
- **Export Options**: CSV, PDF, Excel downloads

### Statistics Dashboard
**Layout**: 4-column grid

#### Total Failures
- **Icon**: 📊 Chart
- **Value**: 3 (gray)
- **Label**: "Total Failures"

#### Critical Failures
- **Icon**: 🚨 Siren
- **Value**: 1 (red)
- **Label**: "Critical"

#### In Progress
- **Icon**: 🔧 Wrench
- **Value**: 1 (yellow)
- **Label**: "In Progress"

#### Resolved
- **Icon**: ✅ Check
- **Value**: 1 (green)
- **Label**: "Resolved"

### Filter Controls
**Layout**: 5-column responsive grid

- **Search Bar**: Failure description search
- **Severity Filter**: Low/Medium/High/Critical
- **Category Filter**: Mechanical/Electrical/Hydraulic/etc.
- **Status Filter**: Reported/Investigating/In Progress/Resolved
- **Machine Filter**: Specific machine selection

### Failures Table
**Columns**:
1. **Machine**: Name, location, machine type
2. **Description**: Failure symptoms (truncated with expansion)
3. **Severity**: Color-coded severity badges
4. **Category**: Failure type badges
5. **Status**: Status progression badges
6. **Reported By**: User name and role
7. **Reported At**: Date and relative time
8. **Actions**: View, edit, assign, resolve buttons

### Failure Detail Modal
**Sections**:
1. **Failure Information**: Complete description, photos
2. **Investigation Notes**: Technician findings
3. **Maintenance Actions**: Performed actions log
4. **Resolution**: Final solution and verification
5. **Timeline**: Complete failure lifecycle

---

## 📈 7. Analytics Dashboard (`/analytics`)

### Time Range Selector
- **Options**: Last 7 days, 30 days, 3 months, 6 months, 1 year
- **Custom Range**: Date picker for custom periods

### Overview Metrics Grid
**Layout**: 6-column responsive grid

#### Total Machines
- **Icon**: 🏭 Factory
- **Value**: 25
- **Label**: "Total Machines"

#### Operational Machines
- **Icon**: ✅ Check
- **Value**: 22 (green)
- **Label**: "Operational"

#### System Uptime
- **Icon**: ⏱️ Stopwatch
- **Value**: 94.5% (blue)
- **Label**: "System Uptime"

#### Average Repair Time
- **Icon**: 🔧 Wrench
- **Value**: 2.3h (yellow)
- **Label**: "Avg Repair Time"

#### Cost Savings
- **Icon**: 💰 Money
- **Value**: $45,600 (green)
- **Label**: "Cost Savings"

#### Predicted Failures
- **Icon**: ⚠️ Warning
- **Value**: 3 (orange)
- **Label**: "Predictions"

### Machine Performance Section
**Layout**: Scrollable card list

Each machine card includes:
- **Machine Name**: With status badge
- **Uptime Percentage**: Green progress bar
- **Efficiency Rating**: Blue progress bar
- **Failure Count**: Red indicator
- **Last Maintenance**: Date display
- **Next Maintenance**: Scheduled date

### Predictive Alerts Section
**Layout**: Expandable alert cards

Each alert includes:
- **Machine Name**: With prediction type
- **Prediction Description**: Detailed failure prediction
- **Confidence Level**: Percentage with color coding
- **Time to Failure**: Days remaining estimate
- **Severity Badge**: Warning/Critical indicator
- **Action Buttons**: Schedule maintenance, view details

### Cost Analysis Section
**Layout**: 2-column grid

#### Maintenance Costs
- **Planned Maintenance**: $28,500 (blue background)
- **Unplanned Maintenance**: $15,200 (red background)
- **Total Costs**: $43,700 (gray background)

#### Cost Savings
- **Predictive Maintenance Savings**: $25,300 (green)
- **Reduced Downtime Savings**: $20,300 (green)
- **Total Savings**: $45,600 (large, green, highlighted)

### Trend Charts Section
**Layout**: 2-column grid

#### System Uptime Trend
- **Chart Type**: Horizontal bar chart
- **Data**: Monthly uptime percentages
- **Color**: Green progress bars
- **Labels**: Jan-Jun with percentage values

#### Failure Count Trend
- **Chart Type**: Horizontal bar chart
- **Data**: Monthly failure counts
- **Color**: Red progress bars
- **Labels**: Jan-Jun with count values

---

## 🔔 8. Alerts & Notifications (`/alerts`)

### Alert Categories
- **Sensor Threshold**: Blue icon, automatic triggers
- **Predictive Maintenance**: Orange icon, AI predictions
- **Failure Detected**: Red icon, critical failures
- **System Errors**: Purple icon, technical issues

### Alert Priority Levels
- **Info**: Blue background, informational alerts
- **Warning**: Yellow background, attention needed
- **Error**: Orange background, action required
- **Critical**: Red background, immediate response

### Alert List Interface
**Layout**: Chronological list with priority sorting

Each alert item includes:
- **Priority Icon**: Color-coded severity indicator
- **Alert Title**: Descriptive headline
- **Machine Name**: Affected equipment
- **Description**: Detailed alert information
- **Timestamp**: Occurrence time with relative display
- **Actions**: Acknowledge, assign, resolve buttons

### Alert Filters
- **Priority Filter**: Multi-select priority levels
- **Category Filter**: Alert type selection
- **Date Range**: Time period selection
- **Machine Filter**: Specific equipment filter
- **Status Filter**: Active/acknowledged/resolved

---

## 👥 9. User Management (`/users`)

### User Statistics
- **Total Users**: Count with growth indicator
- **Active Users**: Currently logged in
- **Role Distribution**: Technicians vs Managers pie chart

### User Table
**Columns**:
1. **User**: Name, email, profile photo
2. **Role**: Role badge with permissions indicator
3. **Status**: Active/inactive status
4. **Last Login**: Date and relative time
5. **Department**: Work assignment
6. **Actions**: Edit, change role, deactivate buttons

### User Creation Form
**Sections**:
1. **Personal Information**: Name, email, phone
2. **Role Assignment**: Technician/Manager selection
3. **Department**: Work location assignment
4. **Permissions**: Granular permission checkboxes
5. **Account Settings**: Password, activation status

### Role Management
**Technician Permissions**:
- ✅ View assigned machines
- ✅ Manage assigned sessions
- ✅ Upload session data
- ✅ Submit solutions
- ✅ Report failures
- ❌ Create sessions
- ❌ Manage users
- ❌ Access analytics

**Manager Permissions**:
- ✅ All technician permissions
- ✅ Create and assign sessions
- ✅ Manage all data
- ✅ Access analytics
- ✅ Manage users
- ✅ System configuration

---

## 📚 10. Knowledge Base (`/knowledge-base`)

### Category Navigation
**Sidebar Categories**:
- **Equipment Types**: Machine-specific guides
- **Failure Categories**: Problem-type organization
- **Procedures**: Step-by-step instructions
- **Troubleshooting**: Diagnostic guides
- **Safety**: Safety protocols and guidelines

### Search Interface
- **Global Search**: Full-text search across all articles
- **Category Filter**: Limit search to specific categories
- **Tag Filter**: Search by article tags
- **Recent Articles**: Recently viewed/updated content

### Article Display
**Article Structure**:
- **Title**: Large, descriptive headline
- **Metadata**: Author, date, category, tags
- **Table of Contents**: Navigable section links
- **Content**: Rich text with images and diagrams
- **Related Articles**: Suggested additional reading
- **Rating System**: User feedback on article quality

### Content Management
- **Add Article**: Rich text editor for new content
- **Edit Mode**: Inline editing for managers
- **Version Control**: Article revision history
- **Approval Workflow**: Manager review for new content

---

## 🔧 11. Technician Dashboard (`/technician`)

### Simplified Layout
**Design Focus**: Mobile-first, simplified interface

### My Sessions Section
- **Today's Sessions**: Sessions scheduled for today
- **In Progress**: Currently active sessions
- **Pending Upload**: Sessions awaiting data upload
- **Pending Review**: Sessions with submitted solutions

### Quick Actions Panel
**Large Button Grid**:
- **Start New Session**: Begin data collection
- **Upload Data**: File upload shortcut
- **Report Failure**: Quick failure reporting
- **View Machines**: Equipment status check

### Equipment Status
- **Assigned Machines**: Machines under technician care
- **Status Indicators**: Color-coded machine status
- **Maintenance Due**: Upcoming maintenance alerts
- **Recent Changes**: Status change notifications

### Personal Activity Summary
- **Today's Progress**: Completed tasks count
- **This Week**: Weekly performance summary
- **Notifications**: Personal alerts and messages
- **Next Actions**: Upcoming scheduled tasks

---

## 📁 12. Archived Sessions (`/sessions/archived`)

### Archive Statistics
- **Total Archived**: Complete session count
- **Data Volume**: Total stored data size
- **Date Range**: Earliest to latest session dates
- **Success Rate**: Percentage of successful sessions

### Search and Filter
**Advanced Filtering**:
- **Date Range Picker**: Custom time periods
- **Machine Filter**: Multi-select machine types
- **Technician Filter**: User selection
- **Status Filter**: Final session status
- **Data Type Filter**: Sensor type selection

### Archive Table
**Columns**:
1. **Session**: Name with archive date
2. **Machine**: Equipment details
3. **Technician**: Assigned user
4. **Date Range**: Session period
5. **Data Size**: File size information
6. **Actions**: View, download, restore options

### Data Export
- **Bulk Export**: Multiple session download
- **Format Options**: CSV, JSON, Excel
- **Compression**: ZIP file creation for large datasets
- **Metadata Inclusion**: Session details with data

---

## ⚡ 13. System Status (`/status`)

### System Health Overview
**Status Grid**:
- **Overall Status**: Green/yellow/red indicator
- **Uptime**: System availability percentage
- **Response Time**: Average API response time
- **Active Users**: Current user count

### Service Status Indicators
**Individual Services**:
- **Authentication Service**: Login system status
- **Database**: Data storage system status
- **File Storage**: Upload/download system status
- **Analytics Engine**: Processing system status
- **Notification Service**: Alert system status

### Performance Metrics
**Real-time Displays**:
- **CPU Usage**: Server processor utilization
- **Memory Usage**: RAM consumption
- **Disk Space**: Storage capacity
- **Network Traffic**: Data transfer rates

### Maintenance Information
- **Scheduled Maintenance**: Upcoming downtime
- **Maintenance History**: Recent system updates
- **Known Issues**: Current system limitations
- **Support Contact**: Help desk information

---

## 🎨 Design System & Styling

### Color Palette
**Primary Colors**:
- Blue: #3B82F6 (primary actions, info states)
- Green: #10B981 (success, operational status)
- Yellow: #F59E0B (warnings, maintenance)
- Red: #EF4444 (errors, critical states)
- Gray: #6B7280 (neutral, disabled states)

**Background Colors**:
- White: #FFFFFF (main background)
- Light Gray: #F9FAFB (section backgrounds)
- Blue Tint: #EFF6FF (info backgrounds)
- Green Tint: #ECFDF5 (success backgrounds)
- Yellow Tint: #FFFBEB (warning backgrounds)
- Red Tint: #FEF2F2 (error backgrounds)

### Typography
**Font Family**: System font stack (San Francisco, Segoe UI, etc.)
**Font Sizes**:
- Heading 1: 2rem (32px) - Page titles
- Heading 2: 1.5rem (24px) - Section titles
- Heading 3: 1.25rem (20px) - Subsection titles
- Body: 1rem (16px) - Regular text
- Small: 0.875rem (14px) - Secondary text
- Extra Small: 0.75rem (12px) - Labels, captions

### Spacing System
**Margin/Padding Scale**:
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

*This comprehensive interface documentation covers every visual element, interactive component, and design detail across the Universal Test Box system, providing complete reference for users, developers, and stakeholders.*
