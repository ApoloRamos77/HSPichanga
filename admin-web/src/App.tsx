import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { CanchasPage } from './pages/CanchasPage';
import { PartidosPage } from './pages/PartidosPage';
import { UsersPage } from './pages/UsersPage';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={
              <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Bienvenido al Panel Administrativo</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Selecciona una opción en el menú lateral para comenzar.</p>
              </div>
            } />
            <Route path="canchas" element={<CanchasPage />} />
            <Route path="partidos" element={<PartidosPage />} />
            <Route path="usuarios" element={<UsersPage />} />
            <Route path="settings" element={<div>Próximamente...</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
