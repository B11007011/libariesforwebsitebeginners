import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  GoogleAuthProvider: class MockGoogleAuthProvider {
    constructor() {}
    addScope() {}
    setCustomParameters() {}
  },
  connectAuthEmulator: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  connectFirestoreEmulator: vi.fn()
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn().mockResolvedValue(true)
}));

// Setup test environment
const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  it('renders app header', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Mindful Moments')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
