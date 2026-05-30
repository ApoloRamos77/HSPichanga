import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService, uploadService } from '../services/api';
import {
  Mail, Loader2, Search, X, Save,
  UserPlus, UserCheck, UserX, ShieldAlert, CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

interface UsuarioAdmin {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  rol: string;
  activo: boolean;
  yapeNumero?: string;
  yapeQrUrl?: string;
  plinNumero?: string;
  plinQrUrl?: string;
}

export const SettingsPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UsuarioAdmin | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '', telefono: '', rol: 'Administrador',
    yapeNumero: '', yapeQrUrl: '',
    plinNumero: '', plinQrUrl: ''
  });
  const [createForm, setCreateForm] = useState({
    nombreCompleto: '', email: '', telefono: '', rol: 'Administrador'
  });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [uploadingQR, setUploadingQR] = useState<'yape' | 'plin' | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const { data: usuarios = [], isLoading } = useQuery<UsuarioAdmin[]>({
    queryKey: ['usuarios-admin'],
    queryFn: () => usuariosService.getAll().then((r: any) => r.data)
  });

  const admins = useMemo(() => {
    const adminUsers = usuarios.filter(u => u.rol === 'Administrador');
    if (!search.trim()) return adminUsers;
    const q = search.toLowerCase();
    return adminUsers.filter(u => u.nombreCompleto.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [usuarios, search]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => usuariosService.update(selectedUser!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      setSelectedUser(null);
      showToast('Administrador y medios de pago guardados exitosamente.');
    },
    onError: (err: any) => showToast('Error al actualizar: ' + (err.response?.data?.mensaje ?? err.message), 'error'),
  });

  const createMutation = useMutation({
    mutationFn: () => usuariosService.create({ ...createForm, rol: 1 }), // 1 = Administrador
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      setShowCreate(false);
      setCreateForm({ nombreCompleto: '', email: '', telefono: '', rol: 'Administrador' });
      showToast('Administrador creado con éxito.');
    },
    onError: (err: any) => showToast('Error al crear: ' + (err.response?.data?.mensaje ?? err.message), 'error'),
  });

  const toggleActivoMutation = useMutation({
    mutationFn: (id: string) => usuariosService.toggleActivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      showToast('Estado cambiado correctamente.');
    },
    onError: (err: any) => showToast('Error: ' + (err.response?.data?.mensaje ?? err.message), 'error'),
  });

  const handleEditClick = (u: UsuarioAdmin) => {
    setSelectedUser(u);
    setFormData({
      nombreCompleto: u.nombreCompleto, telefono: u.telefono || '', rol: u.rol,
      yapeNumero: u.yapeNumero || '', yapeQrUrl: u.yapeQrUrl || '',
      plinNumero: u.plinNumero || '', plinQrUrl: u.plinQrUrl || ''
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'yape' | 'plin') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQR(type);
    try {
      const { data } = await uploadService.upload(file);
      if (type === 'yape') setFormData(prev => ({ ...prev, yapeQrUrl: data.url }));
      if (type === 'plin') setFormData(prev => ({ ...prev, plinQrUrl: data.url }));
    } catch (err: any) {
      showToast(`Error al subir imagen: ${err.message}`, 'error');
    } finally {
      setUploadingQR(null);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="animate-spin" size={36} color="var(--primary)" /></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, padding: '14px 20px', borderRadius: '10px', backgroundColor: toast.type === 'success' ? '#22c55e22' : '#ef444422', border: `1px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`, color: toast.type === 'success' ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          {toast.msg}
        </div>
      )}

      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Configuración</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Administra los responsables de sede y sus métodos de cobro</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="premium-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={18} /> Nuevo Administrador
        </button>
      </header>

      <div className="premium-card glass" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Buscar administrador..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--surface-light)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              <tr>
                <th style={{ padding: '16px 24px' }}>Administrador</th>
                <th style={{ padding: '16px 24px' }}>Medios de Pago</th>
                <th style={{ padding: '16px 24px' }}>Estado</th>
                <th style={{ padding: '16px 24px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.875rem' }}>
              {admins.map((u) => (
                <tr key={u.id} style={{ borderTop: '1px solid var(--border)', opacity: u.activo ? 1 : 0.6 }} className="table-row-hover">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: u.activo ? '#a855f7' : 'var(--text-muted)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {u.nombreCompleto.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{u.nombreCompleto}</div>
                        <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}><Mail size={12}/> {u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {u.yapeNumero ? <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#a855f722', color: '#a855f7', fontSize: '0.75rem' }}>Yape: {u.yapeNumero}</span> : <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Sin Yape</span>}
                      {u.plinNumero ? <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#3b82f622', color: '#3b82f6', fontSize: '0.75rem' }}>Plin: {u.plinNumero}</span> : <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Sin Plin</span>}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button onClick={() => toggleActivoMutation.mutate(u.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', backgroundColor: u.activo ? '#22c55e22' : '#ef444422', color: u.activo ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {u.activo ? <UserCheck size={11} /> : <UserX size={11} />} {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </button>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button onClick={() => handleEditClick(u)} style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none' }}>Editar y Pagos</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div style={overlayStyle}>
          <div className="premium-card glass" style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Nuevo Administrador</h2>
              <button onClick={() => setShowCreate(false)} style={closeBtnStyle}><X size={20} color="var(--text-muted)" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={labelStyle}>Nombre Completo *</label><input type="text" className="form-input" value={createForm.nombreCompleto} onChange={(e) => setCreateForm({ ...createForm, nombreCompleto: e.target.value })} required /></div>
              <div><label style={labelStyle}>Correo Electrónico *</label><input type="email" className="form-input" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} required /></div>
              <div><label style={labelStyle}>Teléfono</label><input type="text" className="form-input" value={createForm.telefono} onChange={(e) => setCreateForm({ ...createForm, telefono: e.target.value })} /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}><button type="button" onClick={() => setShowCreate(false)} style={cancelBtnStyle}>Cancelar</button><button type="submit" className="premium-btn">Crear Administrador</button></div>
            </form>
          </div>
        </div>
      )}

      {selectedUser && (
        <div style={overlayStyle}>
          <div className="premium-card glass" style={{ ...modalStyle, maxWidth: '650px' }}>
            <div style={modalHeaderStyle}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Configuración de Administrador</h2>
              <button onClick={() => setSelectedUser(null)} style={closeBtnStyle}><X size={20} color="var(--text-muted)" /></button>
            </div>

            <form onSubmit={(e) => { 
              e.preventDefault(); 
              updateMutation.mutate({
                ...formData,
                id: selectedUser.id,
                rol: formData.rol === 'Administrador' ? 1 : 0
              }); 
            }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Nombre Completo</label><input type="text" className="form-input" value={formData.nombreCompleto} onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })} required /></div>
                <div><label style={labelStyle}>Teléfono</label><input type="text" className="form-input" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} /></div>
              </div>

              <div style={{ margin: '10px 0', borderTop: '1px solid var(--border)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Métodos de Cobro</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Yape */}
                <div style={{ padding: '16px', backgroundColor: '#a855f711', borderRadius: '12px', border: '1px solid #a855f744' }}>
                  <h4 style={{ color: '#a855f7', fontWeight: 'bold', marginBottom: '12px' }}>Yape</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Celular Yape</label>
                    <input type="text" className="form-input" style={{ backgroundColor: 'white' }} value={formData.yapeNumero} onChange={(e) => setFormData({ ...formData, yapeNumero: e.target.value })} placeholder="Ej: 999888777" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Código QR</label>
                    {formData.yapeQrUrl ? (
                      <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden' }}>
                        <img src={formData.yapeQrUrl} style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'white' }} />
                        <button type="button" onClick={() => setFormData({ ...formData, yapeQrUrl: '' })} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}><X size={14} /></button>
                      </div>
                    ) : (
                      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', border: '2px dashed #a855f7', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'yape')} />
                        {uploadingQR === 'yape' ? <Loader2 size={24} className="animate-spin" color="#a855f7" /> : <><ImageIcon size={24} color="#a855f7" style={{ marginBottom: '8px' }} /><span style={{ fontSize: '0.75rem', color: '#a855f7' }}>Subir QR</span></>}
                      </label>
                    )}
                  </div>
                </div>

                {/* Plin */}
                <div style={{ padding: '16px', backgroundColor: '#3b82f611', borderRadius: '12px', border: '1px solid #3b82f644' }}>
                  <h4 style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '12px' }}>Plin</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Celular Plin</label>
                    <input type="text" className="form-input" style={{ backgroundColor: 'white' }} value={formData.plinNumero} onChange={(e) => setFormData({ ...formData, plinNumero: e.target.value })} placeholder="Ej: 999888777" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Código QR</label>
                    {formData.plinQrUrl ? (
                      <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden' }}>
                        <img src={formData.plinQrUrl} style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'white' }} />
                        <button type="button" onClick={() => setFormData({ ...formData, plinQrUrl: '' })} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}><X size={14} /></button>
                      </div>
                    ) : (
                      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', border: '2px dashed #3b82f6', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'plin')} />
                        {uploadingQR === 'plin' ? <Loader2 size={24} className="animate-spin" color="#3b82f6" /> : <><ImageIcon size={24} color="#3b82f6" style={{ marginBottom: '8px' }} /><span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Subir QR</span></>}
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setSelectedUser(null)} style={cancelBtnStyle}>Cancelar</button>
                <button type="submit" disabled={updateMutation.isPending} className="premium-btn" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Save size={16} /> {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Shared styles
const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
const modalStyle: React.CSSProperties = { width: '100%', maxWidth: '500px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' };
const modalHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const closeBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' };
const labelStyle: React.CSSProperties = { fontSize: '0.875rem', fontWeight: '600', marginBottom: '6px', display: 'block' };
const cancelBtnStyle: React.CSSProperties = { padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontWeight: '500' };
