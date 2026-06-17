import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/api';
import { Lock, ShieldCheck, AlertTriangle } from 'lucide-react';

export const ForceChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await usuariosService.changePassword(newPassword);
      
      // Actualizar el localstorage para reflejar el cambio
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.requiereCambioPassword = false;
        localStorage.setItem('user', JSON.stringify(user));

        // Redirigir según rol
        const rol = user?.rol?.toLowerCase?.() ?? '';
        if (rol === 'administrador' || rol === 'delegado') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/player', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }

    } catch (err: any) {
      setError(err.response?.data?.Mensaje || err.response?.data?.mensaje || err.message || 'Error al actualizar contraseña');
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

      {/* Card premium */}
      <div style={{
        width: '440px', background: 'rgba(255,255,255,0.97)', borderRadius: '24px', padding: '44px 40px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.6)',
        backdropFilter: 'blur(20px)', position: 'relative', zIndex: 1,
      }}>
        {/* Banner de Advertencia (sólo si es forzado) */}
        {(() => {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          return user.requiereCambioPassword ? (
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              backgroundColor: '#fef3c7', color: '#b45309', 
              padding: '12px', borderRadius: '12px', marginBottom: '24px',
              border: '1px solid #fde68a'
            }}>
              <AlertTriangle size={20} />
              <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Por seguridad, debes cambiar tu contraseña antes de continuar.</span>
            </div>
          ) : null;
        })()}

        {/* Icono */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 16px', color: '#16a34a' 
          }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#14532D', marginBottom: '8px' }}>Actualiza tu contraseña</h1>
          <p style={{ color: '#4D7A5E', fontSize: '0.875rem' }}>
            {(() => {
              const user = JSON.parse(localStorage.getItem('user') || '{}');
              return user.requiereCambioPassword 
                ? 'El administrador ha restablecido tu clave. Crea una nueva para continuar.'
                : 'Ingresa una nueva contraseña para tu cuenta.';
            })()}
          </p>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="input-group">
            <label style={{ color: '#1A4731', fontWeight: '600' }}>
              <Lock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className="input-group" style={{ marginTop: '20px' }}>
            <label style={{ color: '#1A4731', fontWeight: '600' }}>
              <Lock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita la nueva contraseña"
              required
              style={{
                borderColor: confirmPassword.length > 0 && confirmPassword !== newPassword ? '#ef4444' : ''
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#DC2626', marginBottom: '16px', fontSize: '0.875rem', background: '#FEE2E2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #FECACA' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="premium-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', letterSpacing: '0.04em', marginTop: '24px' }}
            disabled={loading}
          >
            {loading ? 'Actualizando…' : 'Actualizar Contraseña'}
          </button>
        </form>

      </div>
    </div>
  );
};
