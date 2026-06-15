import { useState, useEffect } from 'react';
import { Upload, Save, Image as ImageIcon, Smartphone, Activity } from 'lucide-react';
import { landingSettingsService, uploadService } from '../services/api';

export const LandingManagerPage = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apkProgress, setApkProgress] = useState(0);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await landingSettingsService.getAll();
      setSettings(res.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const res = await uploadService.upload(file);
      setSettings(prev => ({ ...prev, [key]: res.data.url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleApkUpload = async (file: File) => {
    if (!file.name.endsWith('.apk')) {
      alert('Por favor, selecciona un archivo .apk válido');
      return;
    }
    setUploadingKey('apk_file');
    setApkProgress(0);
    try {
      const res = await uploadService.uploadApk(file, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setApkProgress(percent);
        }
      });
      setSettings(prev => ({ ...prev, apk_file: res.data.url }));
      alert('APK subido correctamente. Recuerda guardar los cambios.');
    } catch (error) {
      console.error('Error uploading APK:', error);
      alert('Error al subir el APK. Verifica el tamaño del archivo.');
    } finally {
      setUploadingKey(null);
      setApkProgress(0);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await landingSettingsService.update(settings);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const ImageUploader = ({ label, settingKey, icon: Icon }: { label: string, settingKey: string, icon: any }) => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: 'rgba(22,163,74,0.1)', padding: '8px', borderRadius: '8px', color: '#166534' }}>
          <Icon size={20} />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>{label}</h3>
      </div>
      
      {settings[settingKey] ? (
        <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <img src={settings[settingKey]} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ width: '100%', height: '160px', borderRadius: '8px', border: '2px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Sin imagen
        </div>
      )}

      <label style={{ cursor: uploadingKey === settingKey ? 'not-allowed' : 'pointer', background: uploadingKey === settingKey ? '#e5e7eb' : '#f3f4f6', color: uploadingKey === settingKey ? '#9ca3af' : '#374151', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: '500', transition: 'all 0.2s', marginTop: 'auto' }}>
        {uploadingKey === settingKey ? 'Subiendo...' : 'Cambiar Imagen'}
        <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploadingKey === settingKey} onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleImageUpload(settingKey, e.target.files[0]);
        }} />
      </label>
    </div>
  );

  if (loading) return <div>Cargando configuración...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em' }}>Gestión de Landing Page</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>Actualiza las imágenes y el APK de la aplicación móvil.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#166534', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          <Save size={20} />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#374151', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ImageIcon size={22} color="#166534" /> Imágenes Principales
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          <ImageUploader label="Fondo del Hero" settingKey="hero_bg" icon={ImageIcon} />
          <ImageUploader label="Mockup del Celular" settingKey="mockup_img" icon={Smartphone} />
          <ImageUploader label="Deporte: Fútbol" settingKey="sport_soccer" icon={Activity} />
          <ImageUploader label="Deporte: Vóley" settingKey="sport_volley" icon={Activity} />
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#374151', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={22} color="#166534" /> Aplicación Móvil (APK)
        </h2>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>Archivo Instalador (.apk)</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px' }}>
              {settings['apk_file'] ? '✅ APK configurado actualmente. Puedes subir uno nuevo para reemplazarlo.' : '⚠️ Aún no se ha subido ningún APK.'}
            </p>
            {settings['apk_file'] && (
              <a href={settings['apk_file']} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '12px', color: '#166534', fontWeight: '500', fontSize: '0.875rem', textDecoration: 'none' }}>
                Descargar APK actual ↓
              </a>
            )}
          </div>

          <div style={{ width: '300px' }}>
            {uploadingKey === 'apk_file' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', color: '#4b5563', fontWeight: '500' }}>
                  <span>Subiendo...</span>
                  <span>{apkProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${apkProgress}%`, height: '100%', background: '#166534', transition: 'width 0.2s' }}></div>
                </div>
              </div>
            ) : (
              <label style={{ display: 'block', cursor: 'pointer', background: '#f0fdf4', color: '#166534', border: '1px dashed #86efac', padding: '16px', borderRadius: '10px', textAlign: 'center', fontWeight: '600', transition: 'all 0.2s' }}>
                Seleccionar archivo .apk
                <input type="file" accept=".apk" style={{ display: 'none' }} onChange={(e) => {
                  if (e.target.files && e.target.files[0]) handleApkUpload(e.target.files[0]);
                }} />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
