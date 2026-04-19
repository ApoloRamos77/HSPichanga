import { useNavigate, Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, MapPinned, Settings, LogOut, User as UserIcon, Calendar } from 'lucide-react';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '280px', padding: '24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>HSPichanga Admin</h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink to="/canchas" icon={<MapPinned size={20} />} label="Gestión de Canchas" />
          <SidebarLink to="/partidos" icon={<Calendar size={20} />} label="Control de Partidos" />
          <SidebarLink to="/usuarios" icon={<UserIcon size={20} />} label="Usuarios Registrados" />
          <SidebarLink to="/settings" icon={<Settings size={20} />} label="Configuración" />
        </nav>

        <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserIcon size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.nombreCompleto}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Administrador</p>
            </div>
          </div>
          <button onClick={handleLogout} className="premium-btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', boxShadow: 'none' }}>
            <LogOut size={18} /> Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }: { to: string, icon: any, label: string }) => (
  <Link to={to} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-secondary)', transition: 'all 0.2s' }} className="nav-link">
    {icon}
    <span style={{ fontWeight: '500' }}>{label}</span>
  </Link>
);
