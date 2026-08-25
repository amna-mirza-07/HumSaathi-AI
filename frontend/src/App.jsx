import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { I18nProvider } from './context/I18nContext';
import AppShell from './components/layout/AppShell';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import AssessmentPage from './pages/AssessmentPage';
import DashboardPage from './pages/DashboardPage';
import ActivityPage from './pages/ActivityPage';
import FeedbackPage from './pages/FeedbackPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import ParentPage from './pages/ParentPage';

function AppRoutes() {
  const { user, loading } = useUser();
  const language = user?.language || localStorage.getItem('humsaathi_language') || 'en';

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <I18nProvider language={language}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/assessment" element={<AppShell><AssessmentPage /></AppShell>} />
        <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
        <Route path="/activity/:id" element={<AppShell><ActivityPage /></AppShell>} />
        <Route path="/feedback" element={<AppShell><FeedbackPage /></AppShell>} />
        <Route path="/progress" element={<AppShell><ProgressPage /></AppShell>} />
        <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />
        <Route path="/parent" element={<AppShell><ParentPage /></AppShell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </I18nProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}
