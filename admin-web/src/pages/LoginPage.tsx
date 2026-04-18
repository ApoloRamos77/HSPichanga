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
      const { data } = await authService.login({ email, password });
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="premium-card glass" style={{ width: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>HSPichanga Admin</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label><Mail size={16} /> Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@hspichanga.com"
              required 
            />
          </div>

          <div className="input-group">
            <label><Lock size={16} /> Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          {error && <p style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.875rem' }}>{error}</p>}

          <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Iniciando...' : <><LogIn size={20} /> Entrar</>}
          </button>
        </form>
      </div>
    </div>
  );
};
