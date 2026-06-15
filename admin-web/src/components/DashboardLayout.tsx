import { useNavigate, Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, MapPinned, Settings, LogOut, User as UserIcon, Calendar, Smartphone } from 'lucide-react';

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
      {/* Sidebar - verde oscuro premium */}
      <aside style={{
        width: '272px',
        minWidth: '272px',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #166534 0%, #14532D 100%)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Logo + Brand */}
        <div style={{ marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '14px', padding: '8px 8px 20px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          {/* Contenedor del logo - fondo blanco para que el escudo se vea completo */}
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            backgroundColor: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(0,0,0,0.25), 0 0 0 2px rgba(6,182,212,0.5)',
            overflow: 'hidden',
            padding: '3px',
          }}>
            <img
              src="/logo.png"
              alt="ChapatuCancha"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.2', letterSpacing: '-0.01em' }}>ChapatuCancha</h2>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>Admin Panel</p>
          </div>
        </div>

        {/* Navegación */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <SidebarLink to="/dashboard"  icon={<LayoutDashboard size={19} />} label="Dashboard" />
          <SidebarLink to="/canchas"    icon={<MapPinned size={19} />}        label="Gestión de Canchas" />
          <SidebarLink to="/partidos"   icon={<Calendar size={19} />}         label="Control de Partidos" />
          <SidebarLink to="/usuarios"   icon={<UserIcon size={19} />}         label="Usuarios Registrados" />
          <SidebarLink to="/landing-manager" icon={<Smartphone size={19} />}  label="Gestión de Landing" />
          <SidebarLink to="/settings"   icon={<Settings size={19} />}         label="Configuración" />
        </nav>

        {/* Footer del sidebar */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #1B75D0, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserIcon size={18} color="white" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.825rem', fontWeight: '700', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.nombreCompleto}</p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '1px' }}>Administrador</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.35)', color: '#FCA5A5', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.15)'; }}
          >
            <LogOut size={17} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área de contenido - transparente sobre fondo verde */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }: { to: string; icon: any; label: string }) => (
  <Link
    to={to}
    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', color: 'rgba(255,255,255,0.75)', transition: 'all 0.2s', fontWeight: '500', fontSize: '0.875rem' }}
    className="nav-link"
  >
    {icon}
    <span>{label}</span>
  </Link>
);
