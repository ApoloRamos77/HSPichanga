import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { usuariosService } from '../services/api';
import { User, Mail, Phone, Calendar, Loader2, Search } from 'lucide-react';

export const UsersPage = () => {
  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios-admin'],
    queryFn: () => usuariosService.getAll().then(r => r.data)
  });

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Usuarios Registrados</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Listado completo de personas registradas en la plataforma</p>
      </header>

      <div className="premium-card glass" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..." 
              style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem' }} 
            />
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Total: <b>{usuarios?.length}</b> usuarios
          </div>
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
                <tr key={u.id} style={{ borderTop: '1px solid var(--border)', transition: 'background-color 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {u.nombreCompleto.charAt(0)}
                      </div>
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
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      backgroundColor: u.rol === 'Administrador' ? '#3b82f622' : '#64748b22',
                      color: u.rol === 'Administrador' ? '#3b82f6' : '#64748b'
                    }}>
                      {u.rol}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} /> {new Date(u.fechaRegistro).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button style={{ color: 'var(--primary)', fontWeight: '600' }}>Ver detalle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
