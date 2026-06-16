import React, { useState, useEffect } from 'react';
import { landingSettingsService } from '../services/api';

export const WhatsAppSettingsPage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:3000/send');
  const [reminderHour, setReminderHour] = useState('8');
  const [msgConfirmacion, setMsgConfirmacion] = useState('¡Hola {Nombre}! ⚽\n\nTu pago ha sido validado y tu reserva para el partido en *{Cancha}* el {Fecha} está *CONFIRMADA*.\n\n¡Nos vemos en la cancha!');
  const [msgRecordatorio, setMsgRecordatorio] = useState('¡Hola {Nombre}! ⚽\n\nEste es un recordatorio de que *HOY* tienes tu pichanga en *{Cancha}* a las *{Hora}*.\n\n¡Te esperamos, no faltes!');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await landingSettingsService.getAll();
      const data = response.data;
      if (data.whatsapp_api_url) setApiUrl(data.whatsapp_api_url);
      if (data.whatsapp_reminder_hour) setReminderHour(data.whatsapp_reminder_hour);
      if (data.whatsapp_msg_confirmacion) setMsgConfirmacion(data.whatsapp_msg_confirmacion);
      if (data.whatsapp_msg_recordatorio) setMsgRecordatorio(data.whatsapp_msg_recordatorio);
    } catch (err) {
      console.error('Error fetching whatsapp settings:', err);
      setMessage({ type: 'error', text: 'Error al cargar la configuración.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    const settingsToUpdate = {
      whatsapp_api_url: apiUrl,
      whatsapp_reminder_hour: reminderHour,
      whatsapp_msg_confirmacion: msgConfirmacion,
      whatsapp_msg_recordatorio: msgRecordatorio,
    };

    try {
      await landingSettingsService.update(settingsToUpdate);
      setMessage({ type: 'success', text: 'Configuración guardada correctamente.' });
    } catch (err) {
      console.error('Error saving whatsapp settings:', err);
      setMessage({ type: 'error', text: 'Ocurrió un error al guardar la configuración.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Configuración de Notificaciones (WhatsApp)</h2>
        <p>Administra los mensajes y la conexión con el microservicio de WhatsApp.</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-card">
        <h3>Conexión con Microservicio</h3>
        <div className="form-group">
          <label>URL de la API de Node.js (easypanel o local):</label>
          <input
            type="text"
            className="form-control"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Ej: https://whatsapp-api.tu-servidor.com/send"
          />
          <small>La URL completa al endpoint <code>/send</code>.</small>
        </div>

        <div className="form-group">
          <label>Hora de Recordatorio Automático (Formato 24h):</label>
          <input
            type="number"
            className="form-control"
            min="0"
            max="23"
            value={reminderHour}
            onChange={(e) => setReminderHour(e.target.value)}
          />
          <small>El sistema enviará el mensaje a los jugadores a esta hora (Ej: 8 para 8:00 AM).</small>
        </div>
      </div>

      <div className="settings-card mt-4">
        <h3>Plantillas de Mensajes</h3>
        <p>
          Puedes usar los siguientes comodines para que el sistema los reemplace automáticamente:<br/>
          <code>{"{Nombre}"}</code>, <code>{"{Cancha}"}</code>, <code>{"{Fecha}"}</code>, <code>{"{Hora}"}</code>
        </p>

        <div className="form-group">
          <label>Mensaje de Confirmación de Reserva:</label>
          <textarea
            className="form-control"
            rows={5}
            value={msgConfirmacion}
            onChange={(e) => setMsgConfirmacion(e.target.value)}
          ></textarea>
          <small>Se envía automáticamente cuando un Administrador valida el pago del jugador.</small>
        </div>

        <div className="form-group">
          <label>Mensaje de Recordatorio (Día del Partido):</label>
          <textarea
            className="form-control"
            rows={5}
            value={msgRecordatorio}
            onChange={(e) => setMsgRecordatorio(e.target.value)}
          ></textarea>
          <small>Se envía masivamente todos los días a la hora configurada arriba.</small>
        </div>
      </div>

      <div className="settings-actions mt-4">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};
