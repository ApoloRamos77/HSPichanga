import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AtSign, Mail, Lock, Shield, Eye, EyeOff, X } from 'lucide-react';
import { authService } from '../../services/api';
import './RegisterModal.css';

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

interface FormState {
  nombreCompleto: string;
  alias: string;
  email: string;
  telefono: string;
  prefijo: string;
  password: string;
  confirmarPassword: string;
}

interface FieldErrors {
  nombreCompleto?: string;
  email?: string;
  telefono?: string;
  password?: string;
  confirmarPassword?: string;
}

const GOOGLE_SVG = (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <path d="M43.611 20.083H42V20H24v8h11.303C33.977 32.082 29.415 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.806 0 5.367 1.054 7.322 2.778l5.657-5.657C33.284 7.307 28.84 5 24 5 13.507 5 5 13.507 5 24s8.507 19 19 19 19-8.507 19-19c0-1.274-.135-2.516-.389-3.917z" fill="#FFC107"/>
    <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19 13 24 13c2.806 0 5.367 1.054 7.322 2.778l5.657-5.657C33.284 7.307 28.84 5 24 5c-7.682 0-14.334 4.337-17.694 10.691z" fill="#FF3D00"/>
    <path d="M24 43c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 35c-5.392 0-9.944-2.888-11.298-7H6.18A18.97 18.97 0 0024 43z" fill="#4CAF50"/>
    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.801 43 35 43 24c0-1.274-.135-2.516-.389-3.917z" fill="#1976D2"/>
  </svg>
);

const FACEBOOK_SVG = (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="23" fill="#1877F2"/>
    <path d="M28.5 25h-3v13h-5V25h-2v-4.5h2v-2.75C20.5 15.4 22 14 25.25 14H29v4h-2.25c-.9 0-1.25.35-1.25 1.25V20.5H29L28.5 25z" fill="white"/>
  </svg>
);

export const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    nombreCompleto: '',
    alias: '',
    email: '',
    telefono: '',
    prefijo: '+51',
    password: '',
    confirmarPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (fieldErrors[field as keyof FieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    setGeneralError('');
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!form.nombreCompleto.trim()) {
      errors.nombreCompleto = 'El nombre completo es requerido.';
    }
    if (!form.email.trim() && !form.telefono.trim()) {
      errors.email = 'Debes ingresar correo o número de celular.';
      errors.telefono = 'Debes ingresar correo o número de celular.';
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Correo electrónico no válido.';
    }
    if (!form.password) {
      errors.password = 'La contraseña es requerida.';
    } else if (form.password.length < 6) {
      errors.password = 'Mínimo 6 caracteres.';
    }
    if (form.password !== form.confirmarPassword) {
      errors.confirmarPassword = 'Las contraseñas no coinciden.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setGeneralError('');
    try {
      const telefonoCompleto = form.telefono.trim()
        ? `${form.prefijo}${form.telefono.trim()}`
        : undefined;

      await authService.register({
        nombreCompleto: form.nombreCompleto.trim(),
        alias: form.alias.trim() || undefined,
        email: form.email.trim() || undefined,
        password: form.password,
        telefono: telefonoCompleto,
      });

      setSuccess(true);

      // Auto-login tras registro exitoso
      setTimeout(async () => {
        try {
          const identificador = form.email.trim() || `${form.prefijo}${form.telefono.trim()}`;
          const { data } = await authService.login({ identificador, password: form.password });
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.usuario));
          onClose();
          navigate('/player');
        } catch {
          // Si el auto-login falla, ir al login manual
          onClose();
          navigate('/login');
        }
      }, 1200);
    } catch (err: any) {
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.Mensaje ||
        err.response?.data?.Errores?.[0]?.Error ||
        'Error al crear la cuenta. Intenta nuevamente.';
      setGeneralError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (provider: string) => {
    setGeneralError(`El inicio de sesión con ${provider} estará disponible próximamente. Por favor usa el formulario.`);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="register-overlay" onClick={handleOverlayClick}>
      <div className="register-card" role="dialog" aria-modal="true" aria-label="Crear cuenta">
        <button className="register-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        {/* Cabecera */}
        <div className="register-header">
          <div className="register-avatar-wrapper">👤</div>
          <h2>Crear cuenta</h2>
          <p>Únete a la comunidad ChapatuCancha</p>
        </div>

        {/* Botones sociales */}
        <div className="social-buttons">
          <button
            type="button"
            id="btn-register-google"
            className="social-btn"
            onClick={() => handleSocialClick('Google')}
          >
            {GOOGLE_SVG}
            Google
          </button>
          <button
            type="button"
            id="btn-register-facebook"
            className="social-btn"
            onClick={() => handleSocialClick('Facebook')}
          >
            {FACEBOOK_SVG}
            Facebook
          </button>
        </div>

        <div className="register-divider">o continúa con tus datos</div>

        {/* Mensajes globales */}
        {generalError && (
          <div className="register-error-box" role="alert">
            <span>⚠️</span> {generalError}
          </div>
        )}
        {success && (
          <div className="register-success-box" role="status">
            <span>✅</span> ¡Cuenta creada! Iniciando sesión…
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Nombre completo */}
          <div className="register-field">
            <label htmlFor="reg-nombre">Nombre completo</label>
            <div className="register-input-wrap">
              <span className="register-input-icon"><User size={16} /></span>
              <input
                id="reg-nombre"
                type="text"
                className={`register-input${fieldErrors.nombreCompleto ? ' error' : form.nombreCompleto ? ' success' : ''}`}
                placeholder="Juan Pérez"
                value={form.nombreCompleto}
                onChange={handleChange('nombreCompleto')}
                autoComplete="name"
                autoFocus
              />
            </div>
            {fieldErrors.nombreCompleto && (
              <p className="field-error">⚠ {fieldErrors.nombreCompleto}</p>
            )}
          </div>

          {/* Alias */}
          <div className="register-field">
            <label htmlFor="reg-alias">Alias <span style={{ opacity: 0.55, fontWeight: 400 }}>(Opcional)</span></label>
            <div className="register-input-wrap">
              <span className="register-input-icon"><AtSign size={16} /></span>
              <input
                id="reg-alias"
                type="text"
                className="register-input"
                placeholder="Juan P."
                value={form.alias}
                onChange={handleChange('alias')}
                autoComplete="nickname"
              />
            </div>
          </div>

          {/* Correo */}
          <div className="register-field">
            <label htmlFor="reg-email">Correo electrónico</label>
            <div className="register-input-wrap">
              <span className="register-input-icon"><Mail size={16} /></span>
              <input
                id="reg-email"
                type="email"
                className={`register-input${fieldErrors.email ? ' error' : form.email && !fieldErrors.email ? ' success' : ''}`}
                placeholder="juan@correo.com"
                value={form.email}
                onChange={handleChange('email')}
                autoComplete="email"
              />
            </div>
            {fieldErrors.email && (
              <p className="field-error">⚠ {fieldErrors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="register-field">
            <label htmlFor="reg-telefono">Teléfono / Celular</label>
            <div className="phone-wrap">
              <select
                id="reg-prefijo"
                className="phone-prefix"
                value={form.prefijo}
                onChange={handleChange('prefijo')}
                aria-label="Código de país"
              >
                <option value="+51">🇵🇪 +51</option>
                <option value="+56">🇨🇱 +56</option>
                <option value="+57">🇨🇴 +57</option>
                <option value="+54">🇦🇷 +54</option>
                <option value="+591">🇧🇴 +591</option>
                <option value="+593">🇪🇨 +593</option>
                <option value="+595">🇵🇾 +595</option>
                <option value="+598">🇺🇾 +598</option>
              </select>
              <input
                id="reg-telefono"
                type="tel"
                className={`phone-number-input${fieldErrors.telefono ? ' error' : ''}`}
                placeholder="999 000 000"
                value={form.telefono}
                onChange={handleChange('telefono')}
                autoComplete="tel"
              />
            </div>
            {fieldErrors.telefono && !fieldErrors.email && (
              <p className="field-error">⚠ {fieldErrors.telefono}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="register-field">
            <label htmlFor="reg-password">Contraseña</label>
            <div className="register-input-wrap">
              <span className="register-input-icon"><Lock size={16} /></span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className={`register-input${fieldErrors.password ? ' error' : form.password.length >= 6 ? ' success' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange('password')}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="field-error">⚠ {fieldErrors.password}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="register-field">
            <label htmlFor="reg-confirm">Confirmar contraseña</label>
            <div className="register-input-wrap">
              <span className="register-input-icon"><Shield size={16} /></span>
              <input
                id="reg-confirm"
                type={showConfirm ? 'text' : 'password'}
                className={`register-input${fieldErrors.confirmarPassword ? ' error' : form.confirmarPassword && form.confirmarPassword === form.password ? ' success' : ''}`}
                placeholder="••••••••"
                value={form.confirmarPassword}
                onChange={handleChange('confirmarPassword')}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {fieldErrors.confirmarPassword && (
              <p className="field-error">⚠ {fieldErrors.confirmarPassword}</p>
            )}
          </div>

          <button
            id="btn-crear-cuenta"
            type="submit"
            className="register-btn"
            disabled={loading || success}
          >
            {loading ? (
              <><div className="register-spinner" /> Creando cuenta…</>
            ) : success ? (
              '✅ ¡Cuenta creada!'
            ) : (
              'CREAR MI CUENTA'
            )}
          </button>
        </form>

        <p className="register-login-link">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin ?? (() => { onClose(); navigate('/login'); })}
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
};
