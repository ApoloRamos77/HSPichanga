import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { CanchasPage } from './pages/CanchasPage';
import { PartidosPage } from './pages/PartidosPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
import { LandingManagerPage } from './pages/LandingManagerPage';
import { PlayerPortalPage } from './pages/PlayerPortalPage';
import { WhatsAppSettingsPage } from './pages/WhatsAppSettingsPage';
import { ForceChangePassword } from './pages/ForceChangePassword';

const queryClient = new QueryClient();

/* ─── Obtener usuario del localStorage ──────────────────────────────────────── */
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') ?? '');
  } catch {
    return null;
  }
};



/* ─── Ruta solo para Administradores / Delegados ─────────────────────────────── */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  const user = getStoredUser();
  if (user?.requiereCambioPassword) return <ForceChangePassword />;
  
  const rol = user?.rol?.toLowerCase?.() ?? '';
  if (rol !== 'administrador' && rol !== 'delegado') {
    // Si es jugador, redirigir a su portal
    return <Navigate to="/player" replace />;
  }
  return <>{children}</>;
};

/* ─── Ruta solo para Jugadores ───────────────────────────────────────────────── */
const PlayerRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  const user = getStoredUser();
  if (user?.requiereCambioPassword) return <ForceChangePassword />;

  const rol = user?.rol?.toLowerCase?.() ?? '';
  if (rol === 'administrador' || rol === 'delegado') {
    // Si es admin, redirigir a su dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ── Públicas ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LandingPage />} />
          <Route path="/change-password" element={<ForceChangePassword />} />

          {/* ── Portal del Jugador ── */}
          <Route
            path="/player"
            element={
              <PlayerRoute>
                <PlayerPortalPage />
              </PlayerRoute>
            }
          />

          {/* ── Panel Administrativo ── */}
          <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
            <Route path="/dashboard" element={
              <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Bienvenido al Panel Administrativo</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Selecciona una opción en el menú lateral para comenzar.</p>
              </div>
            } />
            <Route path="/canchas" element={<CanchasPage />} />
            <Route path="/partidos" element={<PartidosPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
            <Route path="/landing-manager" element={<LandingManagerPage />} />
            <Route path="/whatsapp-settings" element={<WhatsAppSettingsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
