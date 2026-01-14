# SitePulse - Real-time Website Monitoring Dashboard

**SitePulse** is a modern, high-performance dashboard for monitoring website uptime, response times, and health status in real-time. Built with React and designed with a premium dark-themed UI, it provides immediate visibility into your infrastructure's performance.

![SitePulse Dashboard](https://via.placeholder.com/800x400?text=SitePulse+Dashboard+Preview)

## 🚀 Features

- **Real-time Monitoring**: Track uptime status (UP/DOWN/SLOW) for multiple endpoints.
- **Interactive Dashboards**:
  - Global overview of total monitors, active incidents, and average response times.
  - Detailed analytics pages with historical response time charts.
  - Live "heatmap" style minute-by-minute uptime tracker.
- **Beautiful UI/UX**:
  - Modern "Glassmorphism" design with translucent cards and smooth gradients.
  - Fully responsive layout for desktop and mobile.
  - Animated status indicators and transitions.
- **In-Memory Mock Mode**: Currently runs as a pure frontend application with simulated API data for easy testing and demonstration.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Utilities**: `date-fns`, `clsx`, `tailwind-merge`

## 🏁 Getting Started

Follow these steps to get the application running locally on your machine.

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Navigate to the frontend directory** (if you aren't already there):
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
   > **Note**: The `--legacy-peer-deps` flag is recommended due to some peer dependency versions in the current ecosystem.

### Running the Application

Start the development server:
```bash
npm run dev
```
The application will be available at standard Vite port (usually `http://localhost:5173`).

### Building for Production

To create an optimized production build:
```bash
npm run build
```
The output will be in the `dist` folder.

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layout/         # Sidebar, TopBar, DashboardLayout
│   │   ├── StatusCard.jsx  # Website summary card
│   │   └── ...
│   ├── pages/              # Main application views
│   │   ├── DashboardPage.jsx      # Main overview
│   │   └── WebsiteDetailsPage.jsx # Individual monitor analytics
│   ├── services/           # Service layer
│   │   └── api.js          # Mock API implementation
│   ├── App.jsx             # Root component & Routing
│   └── index.css           # Global styles & Tailwind configuration
├── package.json
└── vite.config.js
```

## 🧪 Mock Data Usage

This version of the application uses a **Mock API Service** (`src/services/api.js`) instead of a real backend.
- **Data Persistence**: Data is stored **in-memory**. Reloading the page will reset the data to the initial seed state.
- **Simulation**: Network delays and random response times are simulated to demonstrate the UI's loading states and real-time feel.

---

Developed with ❤️ by the SitePulse Team.
# Tracker
