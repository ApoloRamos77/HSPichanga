import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { canchasService, uploadService, usuariosService } from '../services/api';
import { Plus, Edit2, Trash2, MapPin, Camera, Loader2, X, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to programmatically move the map
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const LocationPicker = ({ position, setPosition, onLocationChange }: { position: [number, number], setPosition: (p: [number, number]) => void, onLocationChange?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      if (onLocationChange) onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return <Marker position={position} />;
};

export const CanchasPage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCancha, setSelectedCancha] = useState<any>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    zonaId: '11111111-1111-1111-1111-111111111111', // Miraflores demo
    ubicacionGoogleMaps: '',
    fotosUrls: [] as string[],
    tieneLuz: false,
    tieneEstacionamiento: false,
    latitude: -12.046374, // Lima Center
    longitude: -77.042793,
    administradorId: ''
  });

  const { data: administradores } = useQuery({
    queryKey: ['usuarios-admin'],
    queryFn: () => usuariosService.getAll().then((r: any) => r.data.filter((u: any) => u.rol === 'Administrador'))
  });

  const { data: canchas, isLoading, error } = useQuery({
    queryKey: ['canchas-admin'],
    queryFn: () => canchasService.getAll().then(r => r.data),
    retry: (failureCount, error: any) => {
      if (error.response?.status === 401 || error.response?.status === 403) return false;
      return failureCount < 2;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => canchasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canchas-admin'] });
      setIsEditing(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => canchasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canchas-admin'] });
      setIsEditing(false);
      resetForm();
    }
  });

  const resetForm = () => {
    setFormData({
      nombre: '', descripcion: '', direccion: '', zonaId: '11111111-1111-1111-1111-111111111111',
      ubicacionGoogleMaps: '', fotosUrls: [], tieneLuz: false, tieneEstacionamiento: false,
      latitude: -12.046374, longitude: -77.042793, administradorId: ''
    });
    setSelectedCancha(null);
    setSearchTerm('');
  };

  const handleEdit = (cancha: any) => {
    setSelectedCancha(cancha);
    setFormData({
      nombre: cancha.nombre,
      descripcion: cancha.descripcion,
      direccion: cancha.direccion,
      zonaId: '11111111-1111-1111-1111-111111111111',
      ubicacionGoogleMaps: cancha.ubicacionGoogleMaps || '',
      fotosUrls: cancha.fotosUrls || [],
      tieneLuz: cancha.tieneLuz,
      tieneEstacionamiento: cancha.tieneEstacionamiento,
      latitude: cancha.latitude || -12.046374,
      longitude: cancha.longitude || -77.042793,
      administradorId: cancha.administradorId || ''
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCancha) {
      updateMutation.mutate({ id: selectedCancha.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
      const data = await response.json();
      if (data && data.display_name) {
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng, direccion: data.display_name }));
      } else {
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
      }
    } catch (err) {
      console.error("Error al obtener la dirección:", err);
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setFormData(prev => ({ ...prev, latitude: parseFloat(lat), longitude: parseFloat(lon), direccion: display_name }));
      } else {
        alert('No se encontró la dirección');
      }
    } catch (err) {
      console.error(err);
      alert('Error al buscar dirección');
    } finally {
      setSearching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingUpload(true);
    try {
      const { data } = await uploadService.upload(file);
      setFormData(prev => ({ ...prev, fotosUrls: [...prev.fotosUrls, data.url] }));
    } catch (err: any) {
      console.error('Upload error:', err);
      const msg = err.response?.data?.mensaje || err.response?.data || err.message;
      alert(`Error al subir imagen: ${msg}`);
    } finally {
      setLoadingUpload(false);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="animate-spin" /></div>;

  if (error) {
    const isAuthError = (error as any).response?.status === 401;
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--danger)' }}>
        <p style={{ fontSize: '1.25rem' }}>{isAuthError ? 'Tu sesión ha expirado' : 'Error al cargar canchas'}</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>{(error as any).message}</p>
        {isAuthError && <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="premium-btn" style={{ marginTop: '16px' }}>Ir al Login</button>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="page-title">Gestión de Canchas</h1>
          <p className="page-subtitle">Administra las sedes deportivas de la plataforma</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="premium-btn">
            <Plus size={20} /> Nueva Cancha
          </button>
        )}
      </header>

      {isEditing ? (
        <div className="premium-card glass" style={{ marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>{selectedCancha ? 'Editar Cancha' : 'Nueva Cancha'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <div className="input-group">
                  <label>Nombre de la Cancha</label>
                  <input type="text" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>Descripción</label>
                  <textarea rows={3} value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>Dirección física</label>
                  <input type="text" value={formData.direccion} onChange={e => setFormData({ ...formData, direccion: e.target.value })} required />
                </div>
                
                <div className="input-group" style={{ marginTop: '16px' }}>
                  <label>Administrador Responsable</label>
                  <select 
                    value={formData.administradorId} 
                    onChange={e => setFormData({ ...formData, administradorId: e.target.value })} 
                    className="form-input" 
                    required
                  >
                    <option value="">Seleccione un administrador...</option>
                    {administradores?.map((a: any) => (
                      <option key={a.id} value={a.id}>{a.nombreCompleto}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '24px', margin: '16px 0' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto' }}>
                      <input type="checkbox" checked={formData.tieneLuz} onChange={e => setFormData({ ...formData, tieneLuz: e.target.checked })} />
                      Tiene Luz
                   </label>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" checked={formData.tieneEstacionamiento} onChange={e => setFormData({ ...formData, tieneEstacionamiento: e.target.checked })} />
                      Estacionamiento
                   </label>
                </div>
              </div>

              <div>
                <div className="input-group">
                  <label>Geolocalización (Mapa Interactivo)</label>
                  
                  {/* Search Bar */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        placeholder="Buscar dirección (ej: Parque Kennedy, Lima)..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch(e as any)}
                        style={{ paddingLeft: '36px', height: '40px', fontSize: '0.875rem' }}
                      />
                    </div>
                    <button type="button" onClick={handleSearch} disabled={searching} className="premium-btn" style={{ height: '40px', padding: '0 16px', fontSize: '0.875rem' }}>
                      {searching ? <Loader2 size={16} className="animate-spin" /> : 'Buscar'}
                    </button>
                  </div>

                  <div style={{ height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '16px' }}>
                    <MapContainer 
                      center={[formData.latitude, formData.longitude]} 
                      zoom={14} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <MapController center={[formData.latitude, formData.longitude]} />
                      <LocationPicker 
                        position={[formData.latitude, formData.longitude]} 
                        setPosition={(pos) => setFormData(prev => ({ ...prev, latitude: pos[0], longitude: pos[1] }))} 
                        onLocationChange={reverseGeocode}
                      />
                    </MapContainer>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--surface-light)', borderRadius: '8px', fontSize: '0.875rem' }}>
                    <span>Lat: <b>{formData.latitude.toFixed(6)}</b></span>
                    <span>Lon: <b>{formData.longitude.toFixed(6)}</b></span>
                  </div>
                </div>

                <div className="input-group">
                  <label>Fotos</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {formData.fotosUrls.map((url, i) => (
                      <div key={i} style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                        <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, fotosUrls: prev.fotosUrls.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '2px' }}>
                          <X size={12} color="white" />
                        </button>
                      </div>
                    ))}
                    <label style={{ width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                      {loadingUpload ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} color="var(--text-muted)" />}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
              <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '12px 24px', color: 'var(--text-secondary)' }}>Cancelar</button>
              <button type="submit" className="premium-btn">Guardar Cancha</button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {canchas?.map((cancha: any) => {
            const foto = cancha.fotosUrls?.[0] || cancha.fotoUrl || null;
            return (
              <div key={cancha.id} className="premium-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                {/* Imagen de la cancha */}
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden', backgroundColor: '#E2F5E8' }}>
                  {foto ? (
                    <img
                      src={foto}
                      alt={cancha.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', gap: '8px' }}>
                      <MapPin size={40} color="#16A34A" strokeWidth={1.5} />
                      <span style={{ fontSize: '0.8rem', color: '#4D7A5E', fontWeight: '600' }}>Sin foto aún</span>
                    </div>
                  )}
                  {/* Overlay gradiente inferior */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)', pointerEvents: 'none' }} />
                  {/* Badges sobre imagen */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                    {cancha.tieneLuz && <span style={{ padding: '3px 8px', backgroundColor: 'rgba(22,163,74,0.9)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', color: 'white', backdropFilter: 'blur(4px)' }}>💡 Luz</span>}
                    {cancha.tieneEstacionamiento && <span style={{ padding: '3px 8px', backgroundColor: 'rgba(27,117,208,0.9)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', color: 'white', backdropFilter: 'blur(4px)' }}>🚗 Parking</span>}
                  </div>
                </div>

                {/* Contenido inferior */}
                <div style={{ flex: 1, padding: '18px 20px 16px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F2A1A', marginBottom: '6px', lineHeight: '1.3' }}>{cancha.nombre}</h3>
                  <p style={{ color: '#4D7A5E', fontSize: '0.8rem', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '5px', lineHeight: '1.4' }}>
                    <MapPin size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{cancha.direccion}</span>
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                    <button onClick={() => handleEdit(cancha)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(27,117,208,0.1)', color: '#1B75D0', fontWeight: '600', fontSize: '0.8rem', border: '1px solid rgba(27,117,208,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <Edit2 size={15} /> Editar
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.08)', color: '#DC2626', fontWeight: '600', fontSize: '0.8rem', border: '1px solid rgba(220,38,38,0.15)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <Trash2 size={15} /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

