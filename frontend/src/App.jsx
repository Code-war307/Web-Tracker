import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import WebsiteDetailsPage from './pages/WebsiteDetailsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import WebsitesPage from './pages/WebsitesPage';
import AlertPage from './pages/AlertPage';
import SettingsPage from './pages/SettingsPage';
import { AddWebsiteModal } from './components/AddWebsiteModal';
import { addWebsite as apiAddWebsite } from './services/api';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddWebsite = async (name, url, interval) => {
    try {
      await apiAddWebsite(name, url, interval);
      setIsModalOpen(false);
      // Ideally trigger a refresh in the context or query client
      // For now, we rely on the DashboardPage's polling to pick it up
      // window.location.reload(); // Removed to preserve mock state
    } catch (error) {
      console.error('Failed to add website', error);
      alert('Failed to add website');
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>}/>
        {/* Dashboard Layout with nested routes */}
        <Route
          path="/"
          element={
            <DashboardLayout onAddWebsite={() => setIsModalOpen(true)} />
          }
        >
          {/* Nested Routes inside DashboardLayout */}
          <Route index element={<DashboardPage />} />
          <Route path="websites" element={<WebsitesPage />} />
          <Route path="websites/:id" element={<WebsiteDetailsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="alerts" element={<AlertPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Route>
      </Routes>

      {/* Modal stays outside Routes */}
      <AddWebsiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddWebsite}
      />
    </Router>
  );
}

export default App;
