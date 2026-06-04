import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LogIn, Lock, Mail } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authService.login({ identificador: email, password });
      if (data.usuario.rol !== 'Administrador') {
        throw new Error('No tienes permisos de administrador.');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.Mensaje || err.message || 'Error al iniciar sesión');
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

      {/* Card blanca premium */}
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
          <p style={{ color: '#4D7A5E', fontSize: '0.875rem' }}>Accede al panel de administración</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label style={{ color: '#1A4731', fontWeight: '600' }}><Mail size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />Correo o Celular</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chapatucancha.com o +51999999999"
              required
            />
          </div>

          <div className="input-group">
            <label style={{ color: '#1A4731', fontWeight: '600' }}><Lock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p style={{ color: '#DC2626', marginBottom: '16px', fontSize: '0.875rem', background: '#FEE2E2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #FECACA' }}>{error}</p>}

          <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', letterSpacing: '0.04em' }} disabled={loading}>
            {loading ? 'Iniciando...' : <><LogIn size={20} /> Ingresar al Panel</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.75rem', color: '#4D7A5E' }}>
          ChapatuCancha © 2026 · ADHSOFT SPORT
        </p>
      </div>
    </div>
  );
};
