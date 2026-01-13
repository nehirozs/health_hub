# Health Hub Kiosk Interface

A modern, interactive health kiosk application built with React and TypeScript. This application provides an intuitive interface for healthcare facilities to conduct basic health measurements and connect patients with telehealth services.

This project is a UI/UX and frontend prototype. All data is mock and no proprietary systems are included.


https://github.com/user-attachments/assets/689f8010-bcaa-4670-a725-79ec33e70934


## 🚀 Features

### Core Functionality
- **Multi-language Support**: Available in Turkish (TR), English (EN), and Finnish (FI)
- **Health Measurements**: Comprehensive health metric collection including:
  - Blood Pressure (Systolic/Diastolic)
  - SpO2 (Oxygen Saturation)
  - Weight & BMI Calculation
  - Body Temperature
- **Interactive Kiosk Interface**: Touch-optimized screens designed for public use
- **3D Visualizations**: Interactive 3D components using Three.js for enhanced user experience
- **Telehealth Integration**: Seamless connection to telehealth services
- **Results Dashboard**: Clear visualization of health metrics with actionable insights

### User Flow
1. **Attract Screen**: Engaging initial interface
2. **Language Selection**: Choose preferred language
3. **Welcome Screen**: User authentication/guest access
4. **Triage Screen**: Select service type (checkup, symptom analysis, emergency)
5. **Measurement Screen**: Interactive health metric collection
6. **Results Screen**: Detailed results with recommendations
7. **Telehealth Screen**: Connect with healthcare professionals

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### UI/UX Libraries
- **shadcn/ui** - High-quality component library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### 3D Graphics
- **Three.js** - 3D graphics library
- **Blender Tool
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js

### Additional Tools
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Recharts** - Charting library for data visualization

## 📋 Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **bun** package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nehirozs/health_hub.git
cd health_hub
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

### Build for Production

```bash
npm run build
# or
yarn build
# or
bun run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
bun run preview
```

## 📁 Project Structure

```
health_hub/
├── src/
│   ├── components/
│   │   ├── kiosk/          # Kiosk-specific components (gauges, 3D models, etc.)
│   │   ├── screens/        # Main screen components
│   │   └── ui/             # Reusable UI components (shadcn/ui)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   └── assets/             # Static assets (images, 3D models)
├── public/                 # Public assets
└── dist/                   # Production build output
```

## 🎨 Key Components

### Measurement Components
- `BloodPressureGauge` - Interactive blood pressure visualization
- `SpO2Gauge` - Oxygen saturation gauge
- `BMIGauge` - Body Mass Index calculator and display
- `TemperatureGauge` - Temperature measurement interface
- `WaveformChart` - Real-time health data visualization
- `RadarChart` - Multi-metric health comparison

### 3D Components
- `Model3D` - 3D model rendering
- `AIAvatar` - Interactive AI assistant avatar
- `DNAHelix` - Animated DNA visualization
- `HealthFlower` - Medical-themed 3D visualization

### Screen Components
- `AttractScreen` - Initial kiosk interface
- `WelcomeScreen` - User welcome and authentication
- `TriageScreen` - Service selection
- `MeasurementScreen` - Health metric collection
- `ResultsScreen` - Results display and recommendations
- `TelehealthScreen` - Telehealth connection interface

## 🔧 Development

### Linting

```bash
npm run lint
```

### Type Checking

The project uses TypeScript with strict type checking enabled.

## 📝 Notes

- This application is designed for kiosk use with touch-optimized interfaces
- All measurements are simulated/demo data for development purposes
- The application includes comprehensive error handling and user feedback
- Accessibility features are implemented throughout the UI

## 👤 Author

**Nehir Ozsunar**
- GitHub: [@nehirozs](https://github.com/nehirozs)

---

*Built using React, TypeScript, Blender, and modern web technologies*




