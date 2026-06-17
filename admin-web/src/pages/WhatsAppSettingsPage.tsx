import React, { useState, useEffect } from 'react';
import { landingSettingsService } from '../services/api';
import { Save, Loader2, CheckCircle2, ShieldAlert, Smartphone, MessageSquare, Clock } from 'lucide-react';

export const WhatsAppSettingsPage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:3000/send');
  const [reminderHour, setReminderHour] = useState('8');
  const [msgConfirmacion, setMsgConfirmacion] = useState('¡Hola {Nombre}! ⚽\n\nTu pago ha sido validado y tu reserva para el partido en *{Cancha}* el {Fecha} está *CONFIRMADA*.\n\n¡Nos vemos en la cancha!');
  const [msgRecordatorio, setMsgRecordatorio] = useState('¡Hola {Nombre}! ⚽\n\nEste es un recordatorio de que *HOY* tienes tu pichanga en *{Cancha}* a las *{Hora}*.\n\n¡Te esperamos, no faltes!');
  const [msgRestauracion, setMsgRestauracion] = useState('Hola *{Nombre}*, el administrador ha restablecido tu contraseña en HSPichanga.\n\nClave temporal: *{ClaveTemporal}*\n\n⚠️ Al iniciar sesión deberás cambiar esta contraseña por una nueva.');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSettings = async () => {
    try {
      const response = await landingSettingsService.getAll();
      const data = response.data;
      if (data.whatsapp_api_url) setApiUrl(data.whatsapp_api_url);
      if (data.whatsapp_reminder_hour) setReminderHour(data.whatsapp_reminder_hour);
      if (data.whatsapp_msg_confirmacion) setMsgConfirmacion(data.whatsapp_msg_confirmacion);
      if (data.whatsapp_msg_recordatorio) setMsgRecordatorio(data.whatsapp_msg_recordatorio);
      if (data.whatsapp_msg_restauracion) setMsgRestauracion(data.whatsapp_msg_restauracion);
    } catch (err) {
      console.error('Error fetching whatsapp settings:', err);
      showToast('Error al cargar la configuración.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const settingsToUpdate = {
      whatsapp_api_url: apiUrl,
      whatsapp_reminder_hour: reminderHour,
      whatsapp_msg_confirmacion: msgConfirmacion,
      whatsapp_msg_recordatorio: msgRecordatorio,
      whatsapp_msg_restauracion: msgRestauracion,
    };

    try {
      await landingSettingsService.update(settingsToUpdate);
      showToast('Configuración de WhatsApp guardada exitosamente.');
    } catch (err) {
      console.error('Error saving whatsapp settings:', err);
      showToast('Ocurrió un error al guardar la configuración.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="animate-spin" size={36} color="var(--primary)" /></div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', paddingBottom: '40px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, padding: '14px 20px', borderRadius: '10px', backgroundColor: toast.type === 'success' ? '#22c55e22' : '#ef444422', border: `1px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`, color: toast.type === 'success' ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          {toast.msg}
        </div>
      )}

      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MessageSquare size={32} color="var(--primary)" /> WhatsApp (Bot)
          </h1>
          <p className="page-subtitle">Administra los mensajes automáticos y la conexión con el microservicio.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="premium-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Conexión con Microservicio */}
        <section className="premium-card glass" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={22} color="var(--primary)" /> Conexión con Microservicio
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div>
              <label style={labelStyle}>URL de la API de Node.js (Easypanel o Local)</label>
              <input
                type="text"
                className="form-input"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="Ej: https://whatsapp-api.tu-servidor.com/send"
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>La URL completa que apunta al endpoint <code>/send</code> del bot.</p>
            </div>
          </div>
        </section>

        {/* Plantillas de Mensajes */}
        <section className="premium-card glass" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={22} color="var(--primary)" /> Plantillas de Mensajes
          </h2>
          
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '8px' }}>Comodines Disponibles</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Usa estas variables en tus mensajes y el sistema las reemplazará automáticamente:<br/>
              <span style={pillStyle}>{"{Nombre}"}</span>
              <span style={pillStyle}>{"{Cancha}"}</span>
              <span style={pillStyle}>{"{Fecha}"}</span>
              <span style={pillStyle}>{"{Hora}"}</span>
              <span style={pillStyle}>{"{ClaveTemporal}"}</span>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div>
              <label style={labelStyle}>Mensaje de Restauración de Contraseña</label>
              <textarea
                className="form-input"
                rows={5}
                style={{ resize: 'vertical' }}
                value={msgRestauracion}
                onChange={(e) => setMsgRestauracion(e.target.value)}
              ></textarea>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Se envía cuando el Administrador restablece la contraseña. Comodines: <code>{"{Nombre}"}</code>, <code>{"{ClaveTemporal}"}</code>.</p>
            </div>

            <div>
              <label style={labelStyle}>Mensaje de Confirmación de Reserva</label>
              <textarea
                className="form-input"
                rows={5}
                style={{ resize: 'vertical' }}
                value={msgConfirmacion}
                onChange={(e) => setMsgConfirmacion(e.target.value)}
              ></textarea>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Se envía automáticamente cuando un Administrador valida el pago del jugador.</p>
            </div>

            <div>
              <label style={labelStyle}>
                <Clock size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
                Mensaje de Recordatorio (Día del Partido)
              </label>
              <textarea
                className="form-input"
                rows={5}
                style={{ resize: 'vertical' }}
                value={msgRecordatorio}
                onChange={(e) => setMsgRecordatorio(e.target.value)}
              ></textarea>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Se envía masivamente a todos los jugadores que tienen partido hoy.</p>
            </div>
            
            <div>
              <label style={labelStyle}>Hora de Envío de Recordatorios (Formato 24h)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: '120px' }}
                  min="0"
                  max="23"
                  value={reminderHour}
                  onChange={(e) => setReminderHour(e.target.value)}
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>: 00 hrs</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>El sistema ejecutará el envío a esta hora. (Ej: 8 para 8:00 AM).</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

// ─── Shared styles
const labelStyle: React.CSSProperties = { fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', display: 'block', color: 'var(--text-primary)' };
const pillStyle: React.CSSProperties = { display: 'inline-block', padding: '4px 8px', margin: '4px 4px 4px 0', backgroundColor: 'var(--surface-light)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' };
