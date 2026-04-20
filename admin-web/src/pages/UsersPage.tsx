import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../services/api';
import { Mail, Phone, Calendar, Loader2, Search, X, Key, Save } from 'lucide-react';

export const UsersPage = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({ nombreCompleto: '', telefono: '', rol: '' });
  
  const { data: usuarios, isLoading, error } = useQuery({
    queryKey: ['usuarios-admin'],
    queryFn: () => usuariosService.getAll().then((r: any) => r.data),
    retry: (failureCount, error: any) => {
      if (error.response?.status === 401 || error.response?.status === 403) return false;
      return failureCount < 2;
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => usuariosService.update(selectedUser.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      setSelectedUser(null);
      alert('Usuario actualizado exitosamente.');
    },
    onError: (err: any) => alert('Error al actualizar: ' + err.message)
  });

  const passMutation = useMutation({
    mutationFn: (id: string) => usuariosService.generateTempPassword(id).then((r: any) => r.data),
    onSuccess: (data) => alert('Clave temporal generada satisfactoriamente:\n\n' + data.password + '\n\nCopia y envíala al usuario.'),
    onError: (err: any) => alert('Error al generar clave temporal: ' + err.message)
  });

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="animate-spin" /></div>;

  if (error) {
    const isAuthError = (error as any).response?.status === 401;
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--danger)' }}>
        <p style={{ fontSize: '1.25rem' }}>{isAuthError ? 'Tu sesión ha expirado' : 'Error al cargar usuarios'}</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>{(error as any).message}</p>
        {isAuthError && <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="premium-btn" style={{ marginTop: '16px' }}>Ir al Login</button>}
      </div>
    );
  }

  const handleEditClick = (u: any) => {
    setSelectedUser(u);
    setFormData({ nombreCompleto: u.nombreCompleto, telefono: u.telefono, rol: u.rol });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Usuarios Registrados</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Listado completo de personas registradas en la plataforma</p>
      </header>

      <div className="premium-card glass" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Buscar por nombre o email..." style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem' }} />
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total: <b>{usuarios?.length}</b> usuarios</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--surface-light)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              <tr>
                <th style={{ padding: '16px 24px' }}>Usuario</th>
                <th style={{ padding: '16px 24px' }}>Contacto</th>
                <th style={{ padding: '16px 24px' }}>Rol</th>
                <th style={{ padding: '16px 24px' }}>Registro</th>
                <th style={{ padding: '16px 24px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.875rem' }}>
              {usuarios?.map((u: any) => (
                <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }} className="table-row-hover">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{u.nombreCompleto.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{u.nombreCompleto}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u.id.substring(0,8)}</div>
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
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: u.rol === 'Administrador' ? '#3b82f622' : '#64748b22', color: u.rol === 'Administrador' ? '#3b82f6' : '#64748b' }}>{u.rol}</span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(u.fechaRegistro).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button onClick={() => handleEditClick(u)} style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none' }}>Ver detalle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="premium-card glass" style={{ width: '100%', maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Editar Usuario</h2>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="var(--text-muted)" /></button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: selectedUser.id, ...formData }); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Nombre Completo</label>
                <input type="text" className="form-input" value={formData.nombreCompleto} onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Correo (Solo lectura)</label>
                <input type="text" className="form-input" value={selectedUser.email} disabled style={{ backgroundColor: 'var(--surface-light)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Teléfono</label>
                <input type="text" className="form-input" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Rol</label>
                <select className="form-input" value={formData.rol} onChange={(e) => setFormData({...formData, rol: e.target.value})}>
                  <option value="Jugador">Jugador</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setSelectedUser(null)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent' }}>Cancelar</button>
                <button type="submit" disabled={updateMutation.isPending} className="premium-btn" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Save size={16} /> {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', color: 'var(--danger)' }}>Acciones de Seguridad</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Si el usuario ha perdido acceso a su correo, puedes generarle una nueva clave temporal desde aquí.
              </p>
              <button 
                type="button" 
                onClick={() => { if(confirm('¿Generar clave temporal para este usuario?')) passMutation.mutate(selectedUser.id); }}
                disabled={passMutation.isPending}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--danger)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
              >
                <Key size={16} /> {passMutation.isPending ? 'Generando...' : 'Generar Clave Temporal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
