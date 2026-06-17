import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { LogIn, Lock, Mail } from 'lucide-react';

export const LoginPage = () => {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authService.login({ identificador, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));

      // Redirigir según rol
      const rol = data.usuario?.rol?.toLowerCase?.() ?? '';
      if (rol === 'administrador' || rol === 'delegado') {
        navigate('/dashboard');
      } else {
        // Jugador u otro rol → portal del jugador
        navigate('/player');
      }
    } catch (err: any) {
      setError(err.response?.data?.Mensaje || err.response?.data?.mensaje || err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      background: 'linear-gradient(135deg, #14532D 0%, #16A34A 40%, #15803D 70%, #166534 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Círculos decorativos de fondo */}
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(6,182,212,0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(27,117,208,0.08)', pointerEvents: 'none' }} />

      {/* Card premium */}
      <div style={{
        width: '440px', background: 'rgba(255,255,255,0.97)', borderRadius: '24px', padding: '44px 40px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.6)',
        backdropFilter: 'blur(20px)', position: 'relative', zIndex: 1,
      }}>
        {/* Logo y marca */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
            <div style={{
              width: '108px', height: '108px', borderRadius: '20px',
              backgroundColor: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(22,163,74,0.3), 0 0 0 3px rgba(22,163,74,0.25)',
              overflow: 'hidden', padding: '4px',
            }}>
              <img
                src="/logo.png"
                alt="ChapatuCancha"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#14532D', marginBottom: '4px', letterSpacing: '-0.02em' }}>ChapatuCancha</h1>
          <p style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Pichangas Deportivas</p>
          <p style={{ color: '#4D7A5E', fontSize: '0.875rem' }}>Ingresa con tu cuenta de jugador o administrador</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Tabs para seleccionar método */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => { setLoginType('email'); setIdentificador(''); }}
              style={{
                flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                backgroundColor: loginType === 'email' ? 'var(--primary-light)' : 'var(--surface-light)',
                color: loginType === 'email' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: loginType === 'email' ? 'bold' : 'normal', transition: 'all 0.2s'
              }}
            >
              Con Correo
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('phone'); setIdentificador('+51 '); }}
              style={{
                flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                backgroundColor: loginType === 'phone' ? 'var(--primary-light)' : 'var(--surface-light)',
                color: loginType === 'phone' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: loginType === 'phone' ? 'bold' : 'normal', transition: 'all 0.2s'
              }}
            >
              Con Celular
            </button>
          </div>

          <div className="input-group">
            <label style={{ color: '#1A4731', fontWeight: '600' }}>
              <Mail size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {loginType === 'email' ? 'Correo Electrónico' : 'Teléfono Celular'}
            </label>
            
            {loginType === 'email' ? (
              <input
                id="login-email"
                type="email"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                placeholder="correo@email.com"
                required
              />
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  style={{ width: '100px', padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.95rem' }}
                  value={identificador.split(' ')[0] || '+51'}
                  onChange={(e) => {
                    const number = identificador.substring(identificador.indexOf(' ') + 1) || '';
                    setIdentificador(`${e.target.value} ${number}`.trim());
                  }}
                >
                  <option value="+51">🇵🇪 +51</option>
                  <option value="+54">🇦🇷 +54</option>
                  <option value="+56">🇨🇱 +56</option>
                  <option value="+57">🇨🇴 +57</option>
                  <option value="+52">🇲🇽 +52</option>
                  <option value="+593">🇪🇨 +593</option>
                  <option value="+591">🇧🇴 +591</option>
                </select>
                <input
                  id="login-phone"
                  type="tel"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.95rem' }}
                  value={identificador.substring(identificador.indexOf(' ') + 1)}
                  onChange={(e) => {
                    const prefix = identificador.split(' ')[0] || '+51';
                    setIdentificador(`${prefix} ${e.target.value}`.trim());
                  }}
                  placeholder="999 000 000"
                  required
                />
              </div>
            )}
          </div>

          <div className="input-group">
            <label style={{ color: '#1A4731', fontWeight: '600' }}>
              <Lock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p style={{ color: '#DC2626', marginBottom: '16px', fontSize: '0.875rem', background: '#FEE2E2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #FECACA' }}>
              {error}
            </p>
          )}

          <button
            id="btn-login"
            type="submit"
            className="premium-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', letterSpacing: '0.04em' }}
            disabled={loading}
          >
            {loading ? 'Iniciando…' : <><LogIn size={20} /> Iniciar Sesión</>}
          </button>
        </form>

        {/* Link a registro */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: '#4D7A5E' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color: '#16A34A', fontWeight: '700', textDecoration: 'none' }}>
            Crear cuenta gratis
          </Link>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.72rem', color: '#9CA3AF', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
          ChapatuCancha © 2026 · ADHSOFT SPORT
        </p>
      </div>
    </div>
  );
};
