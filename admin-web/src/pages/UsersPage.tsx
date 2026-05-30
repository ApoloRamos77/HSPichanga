import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../services/api';
import {
  Mail, Phone, Calendar, Loader2, Search, X, Key, Save,
  UserPlus, UserCheck, UserX, ShieldAlert, CheckCircle2
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Usuario {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  rol: string;
  fechaRegistro: string;
  activo: boolean;
  requiereCambioPassword: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const rolColor = (rol: string) =>
  rol === 'Administrador'
    ? { bg: '#3b82f622', color: '#3b82f6' }
    : { bg: '#64748b22', color: '#64748b' };

export const UsersPage = () => {
  const queryClient = useQueryClient();

  // ── State ────────────────────────────────────────────────────────────────────
  const [search, setSearch]               = useState('');
  const [selectedUser, setSelectedUser]   = useState<Usuario | null>(null);
  const [showCreate, setShowCreate]       = useState(false);
  const [formData, setFormData]           = useState({ nombreCompleto: '', telefono: '', rol: 'Jugador' });
  const [createForm, setCreateForm]       = useState({ nombreCompleto: '', email: '', telefono: '', rol: 'Jugador' });
  const [toast, setToast]                 = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: usuarios = [], isLoading, error } = useQuery<Usuario[]>({
    queryKey: ['usuarios-admin'],
    queryFn: () => usuariosService.getAll().then((r: any) => r.data),
    retry: (failureCount, error: any) => {
      if (error.response?.status === 401 || error.response?.status === 403) return false;
      return failureCount < 2;
    },
  });

  const filteredUsuarios = useMemo(() => {
    const jugadores = usuarios.filter(u => u.rol === 'Jugador');
    if (!search.trim()) return jugadores;
    const q = search.toLowerCase();
    return jugadores.filter(
      (u) => u.nombreCompleto.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [usuarios, search]);

  // ── Mutations ────────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (data: any) => usuariosService.update(selectedUser!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      setSelectedUser(null);
      showToast('Usuario actualizado exitosamente.');
    },
    onError: (err: any) => showToast('Error al actualizar: ' + (err.response?.data?.mensaje ?? err.message), 'error'),
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const rolMap: Record<string, number> = { Jugador: 0, Administrador: 1 };
      return usuariosService.create({
        nombreCompleto: createForm.nombreCompleto,
        email: createForm.email,
        telefono: createForm.telefono,
        rol: rolMap[createForm.rol] ?? 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      setShowCreate(false);
      setCreateForm({ nombreCompleto: '', email: '', telefono: '', rol: 'Jugador' });
      showToast('Usuario creado. Se envió el email con la clave temporal.');
    },
    onError: (err: any) => showToast('Error al crear: ' + (err.response?.data?.mensaje ?? err.message), 'error'),
  });

  const toggleActivoMutation = useMutation({
    mutationFn: (id: string) => usuariosService.toggleActivo(id),
    onSuccess: (data: any, id) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      const activo = data.data?.activo;
      showToast(activo ? 'Usuario activado correctamente.' : 'Usuario desactivado correctamente.');
      // Update selected user state to reflect change
      if (selectedUser?.id === id) {
        setSelectedUser(prev => prev ? { ...prev, activo: !!activo } : null);
      }
    },
    onError: (err: any) => showToast('Error: ' + (err.response?.data?.mensaje ?? err.message), 'error'),
  });

  const resetPassMutation = useMutation({
    mutationFn: (id: string) => usuariosService.resetPasswordAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      showToast('Clave restablecida. Se envió un email al usuario con la clave temporal.');
      if (selectedUser) setSelectedUser(prev => prev ? { ...prev, requiereCambioPassword: true } : null);
    },
    onError: (err: any) => showToast('Error al resetear: ' + (err.response?.data?.mensaje ?? err.message), 'error'),
  });

  // ── Loading / Error states ───────────────────────────────────────────────────
  if (isLoading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <Loader2 className="animate-spin" size={36} color="var(--primary)" />
      </div>
    );

  if (error) {
    const isAuthError = (error as any).response?.status === 401;
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--danger)' }}>
        <p style={{ fontSize: '1.25rem' }}>{isAuthError ? 'Tu sesión ha expirado' : 'Error al cargar usuarios'}</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>{(error as any).message}</p>
        {isAuthError && (
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="premium-btn"
            style={{ marginTop: '16px' }}
          >
            Ir al Login
          </button>
        )}
      </div>
    );
  }

  const handleEditClick = (u: Usuario) => {
    setSelectedUser(u);
    setFormData({ nombreCompleto: u.nombreCompleto, telefono: u.telefono, rol: u.rol });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          padding: '14px 20px', borderRadius: '10px', maxWidth: '380px',
          backgroundColor: toast.type === 'success' ? '#22c55e22' : '#ef444422',
          border: `1px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`,
          color: toast.type === 'success' ? '#22c55e' : '#ef4444',
          display: 'flex', alignItems: 'center', gap: '10px',
          fontWeight: '600', fontSize: '0.875rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease',
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Gestión de Usuarios</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Administra cuentas, roles y accesos de la plataforma</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="premium-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <UserPlus size={18} /> Nuevo Usuario
        </button>
      </header>

      {/* ── Table Card ── */}
      <div className="premium-card glass" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem' }}
            />
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Total: <b>{filteredUsuarios.length}</b> usuario{filteredUsuarios.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--surface-light)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              <tr>
                <th style={{ padding: '16px 24px' }}>Usuario</th>
                <th style={{ padding: '16px 24px' }}>Contacto</th>
                <th style={{ padding: '16px 24px' }}>Rol</th>
                <th style={{ padding: '16px 24px' }}>Estado</th>
                <th style={{ padding: '16px 24px' }}>Registro</th>
                <th style={{ padding: '16px 24px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.875rem' }}>
              {filteredUsuarios.map((u) => {
                const rc = rolColor(u.rol);
                return (
                  <tr key={u.id} style={{ borderTop: '1px solid var(--border)', opacity: u.activo ? 1 : 0.6 }} className="table-row-hover">
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          backgroundColor: u.activo ? 'var(--primary)' : 'var(--text-muted)',
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                        }}>
                          {u.nombreCompleto.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600' }}>{u.nombreCompleto}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u.id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {u.email}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {u.telefono}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: rc.bg, color: rc.color }}>
                        {u.rol}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700',
                          backgroundColor: u.activo ? '#22c55e22' : '#ef444422',
                          color: u.activo ? '#22c55e' : '#ef4444',
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                        }}>
                          {u.activo ? <UserCheck size={11} /> : <UserX size={11} />}
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                        {u.requiereCambioPassword && (
                          <span style={{ fontSize: '0.65rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Key size={10} /> Cambio pendiente
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} />
                        {new Date(u.fechaRegistro).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <button
                        onClick={() => handleEditClick(u)}
                        style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none' }}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredUsuarios.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          MODAL: Crear Usuario
      ════════════════════════════════════════════════════ */}
      {showCreate && (
        <div style={overlayStyle}>
          <div className="premium-card glass" style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                <UserPlus size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                Nuevo Usuario
              </h2>
              <button onClick={() => setShowCreate(false)} style={closeBtnStyle}><X size={20} color="var(--text-muted)" /></button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Se enviará un email al usuario con su contraseña temporal. Al iniciar sesión se le pedirá que la cambie.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label style={labelStyle}>Nombre Completo *</label>
                <input
                  type="text"
                  className="form-input"
                  value={createForm.nombreCompleto}
                  onChange={(e) => setCreateForm({ ...createForm, nombreCompleto: e.target.value })}
                  required
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label style={labelStyle}>Correo Electrónico *</label>
                <input
                  type="email"
                  className="form-input"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  required
                  placeholder="usuario@email.com"
                />
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input
                  type="text"
                  className="form-input"
                  value={createForm.telefono}
                  onChange={(e) => setCreateForm({ ...createForm, telefono: e.target.value })}
                  placeholder="+51 999 000 000"
                />
              </div>
              <div>
                <label style={labelStyle}>Rol</label>
                <select
                  className="form-input"
                  value={createForm.rol}
                  onChange={(e) => setCreateForm({ ...createForm, rol: e.target.value })}
                >
                  <option value="Jugador">Jugador</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  style={cancelBtnStyle}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="premium-btn"
                  style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                >
                  <UserPlus size={16} />
                  {createMutation.isPending ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          MODAL: Editar / Detalle de Usuario
      ════════════════════════════════════════════════════ */}
      {selectedUser && (
        <div style={overlayStyle}>
          <div className="premium-card glass" style={{ ...modalStyle, maxWidth: '540px' }}>
            {/* Header */}
            <div style={modalHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  backgroundColor: selectedUser.activo ? 'var(--primary)' : 'var(--text-muted)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '1.25rem',
                }}>
                  {selectedUser.nombreCompleto.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedUser.nombreCompleto}</h2>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700',
                      backgroundColor: selectedUser.activo ? '#22c55e22' : '#ef444422',
                      color: selectedUser.activo ? '#22c55e' : '#ef4444',
                    }}>
                      {selectedUser.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    {selectedUser.requiereCambioPassword && (
                      <span style={{ fontSize: '0.7rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Key size={11} /> Cambio de clave pendiente
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={closeBtnStyle}><X size={20} color="var(--text-muted)" /></button>
            </div>

            {/* Edit Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const rolMap: Record<string, number> = { Jugador: 0, Administrador: 1 };
                updateMutation.mutate({ id: selectedUser.id, nombreCompleto: formData.nombreCompleto, telefono: formData.telefono, rol: rolMap[formData.rol] ?? 0 });
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}
            >
              <div>
                <label style={labelStyle}>Nombre Completo</label>
                <input type="text" className="form-input" value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Correo (Solo lectura)</label>
                <input type="text" className="form-input" value={selectedUser.email} disabled
                  style={{ backgroundColor: 'var(--surface-light)', cursor: 'not-allowed' }} />
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input type="text" className="form-input" value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Rol</label>
                <select className="form-input" value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
                  <option value="Jugador">Jugador</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
                <button type="button" onClick={() => setSelectedUser(null)} style={cancelBtnStyle}>Cancelar</button>
                <button type="submit" disabled={updateMutation.isPending} className="premium-btn"
                  style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Save size={16} /> {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div style={{ margin: '20px 0', borderTop: '1px solid var(--border)' }} />

            {/* Actions */}
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', color: 'var(--text-secondary)' }}>
              Acciones de Cuenta
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Toggle Activo */}
              <button
                type="button"
                disabled={toggleActivoMutation.isPending}
                onClick={() => {
                  const accion = selectedUser.activo ? 'desactivar' : 'activar';
                  if (confirm(`¿Deseas ${accion} al usuario ${selectedUser.nombreCompleto}?`)) {
                    toggleActivoMutation.mutate(selectedUser.id);
                  }
                }}
                style={{
                  padding: '11px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontWeight: '600', fontSize: '0.85rem',
                  backgroundColor: selectedUser.activo ? '#ef444422' : '#22c55e22',
                  color: selectedUser.activo ? '#ef4444' : '#22c55e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  transition: 'all 0.2s',
                }}
              >
                {selectedUser.activo ? <UserX size={15} /> : <UserCheck size={15} />}
                {toggleActivoMutation.isPending ? 'Procesando...' : selectedUser.activo ? 'Desactivar Usuario' : 'Activar Usuario'}
              </button>

              {/* Reset Password */}
              <button
                type="button"
                disabled={resetPassMutation.isPending}
                onClick={() => {
                  if (confirm(`¿Resetear la contraseña de ${selectedUser.nombreCompleto}?\n\nSe enviará un email con una clave temporal.`)) {
                    resetPassMutation.mutate(selectedUser.id);
                  }
                }}
                style={{
                  padding: '11px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontWeight: '600', fontSize: '0.85rem',
                  backgroundColor: '#f59e0b22', color: '#f59e0b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  transition: 'all 0.2s',
                }}
              >
                <Key size={15} />
                {resetPassMutation.isPending ? 'Reseteando...' : 'Resetear Clave'}
              </button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
              Al resetear la clave, el usuario recibirá un email y deberá cambiarla al iniciar sesión.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Shared styles ─────────────────────────────────────────────────────────────
const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  backdropFilter: 'blur(4px)',
};
const modalStyle: React.CSSProperties = {
  width: '100%', maxWidth: '500px', padding: '28px',
  maxHeight: '90vh', overflowY: 'auto',
};
const modalHeaderStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
};
const closeBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
};
const labelStyle: React.CSSProperties = {
  fontSize: '0.875rem', fontWeight: '600', marginBottom: '6px', display: 'block',
};
const cancelBtnStyle: React.CSSProperties = {
  padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)',
  background: 'transparent', cursor: 'pointer', fontWeight: '500',
};
