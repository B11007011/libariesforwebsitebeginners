import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { createTestUserIfNeeded } from './utils/auth-helpers';
import CalendarPage from './pages/CalendarPage';
import HealthyDietPage from './pages/HealthyDietPage';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const DiaryPage = React.lazy(() => import('./pages/DiaryPage'));
const WellbeingPage = React.lazy(() => import('./pages/WellbeingPage'));
const WellbeingQuestionsPage = React.lazy(() => import('./pages/WellbeingQuestionsPage'));
const ResponsePage = React.lazy(() => import('./pages/ResponsePage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Loading fallback
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Loading...
  </div>
);

const App: React.FC = () => {
  useEffect(() => {
    // Development test user creation
    if (import.meta.env.MODE === 'development') {
      createTestUserIfNeeded();
    }

    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/wellbeing" element={<WellbeingQuestionsPage />} />
              <Route path="/response" element={<ResponsePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/diet" element={<HealthyDietPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
