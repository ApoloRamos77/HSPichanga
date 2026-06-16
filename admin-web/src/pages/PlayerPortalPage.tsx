import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, MapPin, Clock, Users, Trophy, ChevronRight,
  Upload, X, RefreshCw, Mail, Phone, User, Shield
} from 'lucide-react';
import { partidosService, reservasService, uploadService } from '../services/api';
import './PlayerPortalPage.css';

/* ─── Tipos ─────────────────────────────────────────────────────────────────── */
interface PartidoDto {
  id: string;
  canchaId: string;
  canchaNombre: string;
  zonaNombre: string;
  fechaHora: string;
  tipoPartido: string;
  categoria: string;
  estado: string;
  cuotaIndividual: number;
  cuposDisponibles: number;
  cuposTotales: number;
  modalidad: string;
  notas?: string;
  organizadorNombre: string;
  distance?: number;
  fotosUrls?: string[];
  celularYape?: string;
  yapeQrUrl?: string;
  celularPlin?: string;
  plinQrUrl?: string;
  direccion?: string;
}

interface ReservaDto {
  reservaId: string;
  partidoId: string;
  canchaNombre: string;
  zonaNombre: string;
  fechaHora: string;
  estadoPartido: string;
  codigoConfirmacion: string;
  montoPagado: number;
  estadoPago: string;
}

interface Usuario {
  id: string;
  nombreCompleto: string;
  email?: string;
  telefono?: string;
  alias?: string;
  rol: string;
}

type Tab = 'partidos' | 'reservas' | 'perfil';

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const formatFecha = (fechaHora: string) => {
  const d = new Date(fechaHora);
  return d.toLocaleString('es-PE', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  });
};

const getMetodoPagoNum = (metodo: 'yape' | 'plin') => metodo === 'yape' ? 1 : 2;

const EstadoBadge: React.FC<{ estado: string }> = ({ estado }) => {
  const lower = estado.toLowerCase();
  const map: Record<string, { cls: string; icon: string; label: string }> = {
    pendiente: { cls: 'pendiente', icon: '🟡', label: 'En Validación' },
    confirmado: { cls: 'confirmado', icon: '✅', label: 'Confirmado' },
    rechazado:  { cls: 'rechazado',  icon: '❌', label: 'Rechazado' },
  };
  const info = map[lower] ?? { cls: 'pendiente', icon: '⏳', label: estado };
  return <span className={`estado-badge ${info.cls}`}>{info.icon} {info.label}</span>;
};

const EstadoDescripcion: React.FC<{ estado: string }> = ({ estado }) => {
  const lower = estado.toLowerCase();
  const desc: Record<string, string> = {
    pendiente: 'Tu pago está en proceso de validación por el administrador.',
    confirmado: '¡Pago confirmado! Ya estás inscrito en este partido.',
    rechazado: 'Pago rechazado. Contacta al administrador para más información.',
  };
  return (
    <p className="reserva-estado-info">
      ℹ️ {desc[lower] ?? 'Estado desconocido'}
    </p>
  );
};

/* ─── Modal de Reserva / Pago ─────────────────────────────────────────────── */
interface ReservaModalProps {
  partido: PartidoDto;
  jugadorId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ReservaModal: React.FC<ReservaModalProps> = ({ partido, jugadorId, onClose, onSuccess }) => {
  const [metodoPago, setMetodoPago] = useState<'yape' | 'plin' | null>(null);
  const [numeroOp, setNumeroOp] = useState('');
  const [evidenciaFile, setEvidenciaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [codigoConfirmacion, setCodigoConfirmacion] = useState('');

  const hasYape = !!partido.celularYape;
  const hasPlin = !!partido.celularPlin;
  const requiresPago = hasYape || hasPlin;

  const handleEvidencia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setEvidenciaFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresPago && !metodoPago) {
      setError('Selecciona un método de pago.');
      return;
    }
    if (requiresPago && !numeroOp.trim()) {
      setError('Ingresa el número de operación del pago.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let evidenciaUrl: string | null = null;
      if (evidenciaFile) {
        const { data } = await uploadService.upload(evidenciaFile);
        evidenciaUrl = data.url ?? data.fileUrl ?? null;
      }
      const { data } = await reservasService.crear({
        partidoId: partido.id,
        jugadorId,
        metodoPago: metodoPago ? getMetodoPagoNum(metodoPago) : null,
        numeroOperacion: numeroOp.trim() || null,
        evidenciaPagoUrl: evidenciaUrl,
      });
      setCodigoConfirmacion(data.codigoConfirmacion);
      setSuccess('¡Reserva enviada!');
    } catch (err: any) {
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.Mensaje ||
        err.response?.data?.codigo === 'RESERVA_DUPLICADA'
          ? 'Ya tienes una reserva activa para este partido.'
          : 'Error al crear la reserva. Intenta nuevamente.';
      setError(typeof msg === 'string' ? msg : 'Error al crear la reserva.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlay = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="reserva-overlay" onClick={handleOverlay}>
      <div className="reserva-modal" role="dialog" aria-modal="true">
        <div className="reserva-modal-header">
          <div>
            <h3>Reservar cupo</h3>
            <p>{partido.canchaNombre} · {partido.zonaNombre}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        {success ? (
          /* ── Vista de éxito ── */
          <div className="reserva-exitosa">
            <div className="success-icon">🎉</div>
            <h3>¡Reserva enviada!</h3>
            <p>Tu código de confirmación es:</p>
            <div className="codigo">{codigoConfirmacion}</div>
            <div className="info-pendiente">
              🟡 <strong>Estado: En Validación</strong><br />
              Tu reserva está pendiente de confirmación por el administrador.
              Una vez que valide tu pago, el estado cambiará a <strong>Confirmado</strong>.
              Puedes revisar el estado en la pestaña <em>"Mis Reservas"</em>.
            </div>
            <br />
            <button
              className="btn-confirmar-reserva"
              onClick={() => { onClose(); onSuccess(); }}
            >
              Ver mis reservas
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Resumen del partido */}
            <div className="partido-resumen">
              <div className="resumen-item">
                <div className="label">📅 Fecha</div>
                <div className="value">{formatFecha(partido.fechaHora)}</div>
              </div>
              <div className="resumen-item">
                <div className="label">⚽ Modalidad</div>
                <div className="value">{partido.modalidad}</div>
              </div>
              <div className="resumen-item">
                <div className="label">👥 Cupos restantes</div>
                <div className="value">{partido.cuposDisponibles}</div>
              </div>
              <div className="resumen-item">
                <div className="label">💰 Cuota</div>
                <div className="value costo">S/ {partido.cuotaIndividual.toFixed(2)}</div>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(220,38,38,0.18)', border: '1px solid rgba(248,113,113,0.4)',
                borderRadius: '10px', padding: '11px 14px', color: '#fca5a5',
                fontSize: '0.85rem', marginBottom: '16px',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Método de pago */}
            {requiresPago && (
              <>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>
                  Selecciona tu método de pago:
                </p>
                <div className="pago-metodos">
                  {hasYape && (
                    <button
                      type="button"
                      className={`pago-metodo-btn ${metodoPago === 'yape' ? 'selected' : ''}`}
                      onClick={() => setMetodoPago('yape')}
                    >
                      <span className="metodo-emoji">💜</span>
                      Yape
                    </button>
                  )}
                  {hasPlin && (
                    <button
                      type="button"
                      className={`pago-metodo-btn ${metodoPago === 'plin' ? 'selected' : ''}`}
                      onClick={() => setMetodoPago('plin')}
                    >
                      <span className="metodo-emoji">💚</span>
                      Plin
                    </button>
                  )}
                </div>

                {/* Info del método seleccionado */}
                {metodoPago === 'yape' && (
                  <div className="pago-info-box">
                    <div className="numero-pago">📱 {partido.celularYape}</div>
                    {partido.yapeQrUrl && (
                      <img src={partido.yapeQrUrl} alt="QR Yape" className="pago-qr-img" />
                    )}
                    <div className="instruccion">
                      Yapea S/ {partido.cuotaIndividual.toFixed(2)} al número indicado,<br />
                      luego ingresa el número de operación.
                    </div>
                  </div>
                )}
                {metodoPago === 'plin' && (
                  <div className="pago-info-box">
                    <div className="numero-pago">📱 {partido.celularPlin}</div>
                    {partido.plinQrUrl && (
                      <img src={partido.plinQrUrl} alt="QR Plin" className="pago-qr-img" />
                    )}
                    <div className="instruccion">
                      Plínea S/ {partido.cuotaIndividual.toFixed(2)} al número indicado,<br />
                      luego ingresa el número de operación.
                    </div>
                  </div>
                )}

                {/* Número de operación */}
                <div className="pago-field">
                  <label htmlFor="num-operacion">Número de operación *</label>
                  <input
                    id="num-operacion"
                    type="text"
                    className="pago-input"
                    placeholder="Ej: 123456789"
                    value={numeroOp}
                    onChange={e => setNumeroOp(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                {/* Evidencia */}
                <div className="pago-field">
                  <label>Captura del comprobante <span style={{ opacity: 0.5, fontWeight: 400 }}>(Opcional)</span></label>
                  <label className="evidencia-upload-area" htmlFor="evidencia-input">
                    <input
                      id="evidencia-input"
                      type="file"
                      accept="image/*"
                      onChange={handleEvidencia}
                    />
                    {evidenciaFile ? (
                      <div className="evidencia-preview">
                        📎 {evidenciaFile.name}
                      </div>
                    ) : (
                      <><Upload size={20} style={{ margin: '0 auto 6px' }} /><br />Toca para subir captura</>
                    )}
                  </label>
                </div>
              </>
            )}

            {!requiresPago && (
              <div style={{
                background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: '12px', padding: '14px 16px', marginBottom: '16px',
                fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.55',
              }}>
                ℹ️ Este partido no tiene método de pago configurado. Tu reserva se enviará directamente al administrador para validación.
              </div>
            )}

            <button
              id="btn-confirmar-reserva"
              type="submit"
              className="btn-confirmar-reserva"
              disabled={loading}
            >
              {loading ? (
                <><div className="register-spinner" style={{ width: '18px', height: '18px' }} /> Enviando…</>
              ) : 'CONFIRMAR RESERVA'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* ─── Componente Principal ────────────────────────────────────────────────── */
export const PlayerPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('partidos');
  const [partidos, setPartidos] = useState<PartidoDto[]>([]);
  const [reservas, setReservas] = useState<ReservaDto[]>([]);
  const [loadingPartidos, setLoadingPartidos] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [errorPartidos, setErrorPartidos] = useState('');
  const [errorReservas, setErrorReservas] = useState('');
  const [selectedPartido, setSelectedPartido] = useState<PartidoDto | null>(null);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterModalidad, setFilterModalidad] = useState('');
  const [toast, setToast] = useState<{ msg: string; type?: 'error' } | null>(null);
  const [pendienteCount, setPendienteCount] = useState(0);

  const user: Usuario | null = (() => {
    try { return JSON.parse(localStorage.getItem('user') ?? ''); } catch { return null; }
  })();

  const initials = user?.nombreCompleto
    ? user.nombreCompleto.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()
    : '?';

  /* ── Toast helper ── */
  const showToast = (msg: string, type?: 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  /* ── Cargar partidos ── */
  const fetchPartidos = useCallback(async () => {
    setLoadingPartidos(true);
    setErrorPartidos('');
    try {
      const params: Record<string, string> = {};
      if (filterCategoria) params.categoria = filterCategoria;
      if (filterModalidad) params.modalidad = filterModalidad;
      const { data } = await partidosService.getAbiertos(params);
      setPartidos(Array.isArray(data) ? data : []);
    } catch {
      setErrorPartidos('No se pudieron cargar los partidos. Intenta nuevamente.');
    } finally {
      setLoadingPartidos(false);
    }
  }, [filterCategoria, filterModalidad]);

  /* ── Cargar reservas ── */
  const fetchReservas = useCallback(async () => {
    if (!user?.id) return;
    setLoadingReservas(true);
    setErrorReservas('');
    try {
      const { data } = await reservasService.getMisReservas(user.id);
      const list: ReservaDto[] = Array.isArray(data) ? data : [];
      setReservas(list);
      setPendienteCount(list.filter(r => r.estadoPago.toLowerCase() === 'pendiente').length);
    } catch {
      setErrorReservas('No se pudieron cargar tus reservas.');
    } finally {
      setLoadingReservas(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchPartidos(); }, [fetchPartidos]);

  useEffect(() => {
    if (activeTab === 'reservas') fetchReservas();
  }, [activeTab, fetchReservas]);

  /* ── Filtros partidos ── */
  const partidosFiltrados = partidos.filter(p => {
    if (filterCategoria && p.categoria !== filterCategoria) return false;
    if (filterModalidad && p.modalidad !== filterModalidad) return false;
    return true;
  });

  const categorias = [...new Set(partidos.map(p => p.categoria))];
  const modalidades = [...new Set(partidos.map(p => p.modalidad))];

  /* ── Tab: Partidos ── */
  const renderPartidos = () => (
    <>
      <div className="portal-section-header">
        <div>
          <h2>🏟️ Partidos Disponibles</h2>
          <p>{partidos.length} partido{partidos.length !== 1 ? 's' : ''} abierto{partidos.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
          onClick={fetchPartidos}
        >
          <RefreshCw size={15} /> Actualizar
        </button>
      </div>

      <div className="portal-filters">
        <select
          id="filter-categoria"
          className="portal-filter-select"
          value={filterCategoria}
          onChange={e => setFilterCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          id="filter-modalidad"
          className="portal-filter-select"
          value={filterModalidad}
          onChange={e => setFilterModalidad(e.target.value)}
        >
          <option value="">Todas las modalidades</option>
          {modalidades.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {errorPartidos && (
        <div className="portal-error">⚠️ {errorPartidos}</div>
      )}

      {loadingPartidos ? (
        <div className="portal-loading">
          {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      ) : partidosFiltrados.length === 0 ? (
        <div className="portal-empty">
          <div className="portal-empty-icon">⚽</div>
          <h3>Sin partidos disponibles</h3>
          <p>No hay pichangas abiertas en este momento. ¡Vuelve a revisar pronto!</p>
        </div>
      ) : (
        <div className="partidos-grid">
          {partidosFiltrados.map(p => (
            <div key={p.id} className="partido-card">
              <div className="partido-card-banner" />
              <div className="partido-card-body">
                <div className="partido-card-top">
                  <span className="partido-card-sport">
                    ⚽ {p.tipoPartido}
                  </span>
                  <span className={`partido-cupos ${p.cuposDisponibles <= 3 ? 'scarce' : ''}`}>
                    {p.cuposDisponibles}/{p.cuposTotales} cupos
                  </span>
                </div>

                <h3>{p.canchaNombre}</h3>
                <p className="partido-card-zone">
                  <MapPin size={13} /> {p.zonaNombre}
                  {p.distance != null && ` · ${p.distance.toFixed(1)} km`}
                </p>

                <div className="partido-card-info">
                  <div className="partido-info-item">
                    <div className="label"><Clock size={11} style={{ display: 'inline' }} /> Fecha</div>
                    <div className="value">{formatFecha(p.fechaHora)}</div>
                  </div>
                  <div className="partido-info-item">
                    <div className="label"><Users size={11} style={{ display: 'inline' }} /> Modalidad</div>
                    <div className="value highlight">{p.modalidad}</div>
                  </div>
                  <div className="partido-info-item">
                    <div className="label"><Trophy size={11} style={{ display: 'inline' }} /> Categoría</div>
                    <div className="value">{p.categoria}</div>
                  </div>
                  <div className="partido-info-item">
                    <div className="label">🏅 Organizador</div>
                    <div className="value">{p.organizadorNombre || '—'}</div>
                  </div>
                </div>

                {p.notas && (
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', lineHeight: 1.5 }}>
                    📝 {p.notas}
                  </p>
                )}

                <div className="partido-card-footer">
                  <div className="partido-costo">
                    S/ {p.cuotaIndividual.toFixed(2)}
                    <small>cuota individual</small>
                  </div>
                  <button
                    id={`btn-reservar-${p.id}`}
                    className="btn-reservar"
                    disabled={p.cuposDisponibles === 0}
                    onClick={() => {
                      if (!user) { navigate('/login'); return; }
                      setSelectedPartido(p);
                    }}
                  >
                    {p.cuposDisponibles === 0 ? 'Sin cupos' : <>Reservar <ChevronRight size={15} /></>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  /* ── Tab: Mis Reservas ── */
  const renderReservas = () => (
    <>
      <div className="portal-section-header">
        <div>
          <h2>📋 Mis Reservas</h2>
          <p>{reservas.length} reserva{reservas.length !== 1 ? 's' : ''} registrada{reservas.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
          onClick={fetchReservas}
        >
          <RefreshCw size={15} /> Actualizar
        </button>
      </div>

      {errorReservas && <div className="portal-error">⚠️ {errorReservas}</div>}

      {loadingReservas ? (
        <div className="portal-loading">
          {[1,2].map(i => <div key={i} className="skeleton-card" style={{ height: '130px' }} />)}
        </div>
      ) : reservas.length === 0 ? (
        <div className="portal-empty">
          <div className="portal-empty-icon">📋</div>
          <h3>Sin reservas aún</h3>
          <p>Aún no tienes reservas. Encuentra un partido en la pestaña "Partidos" e inscríbete.</p>
        </div>
      ) : (
        <div className="reservas-list">
          {reservas.map(r => (
            <div key={r.reservaId} className="reserva-card">
              <div className="reserva-card-left">
                <div className="reserva-card-top">
                  <h3>{r.canchaNombre}</h3>
                  <EstadoBadge estado={r.estadoPago} />
                </div>
                <div className="reserva-card-meta">
                  <span><MapPin size={12} style={{ display: 'inline' }} /> {r.zonaNombre}</span>
                  <span>·</span>
                  <span><Clock size={12} style={{ display: 'inline' }} /> {formatFecha(r.fechaHora)}</span>
                </div>
                <div className="reserva-card-code">🎫 {r.codigoConfirmacion}</div>
                <EstadoDescripcion estado={r.estadoPago} />
              </div>
              <div className="reserva-card-right">
                <div className="reserva-monto">S/ {r.montoPagado.toFixed(2)}</div>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                  Partido: {r.estadoPartido}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  /* ── Tab: Perfil ── */
  const renderPerfil = () => (
    <div className="perfil-card">
      <div className="perfil-avatar-section">
        <div className="perfil-avatar-big">{initials}</div>
        <div className="perfil-name">{user?.nombreCompleto ?? '—'}</div>
        {user?.alias && <div className="perfil-alias">@{user.alias}</div>}
        <div className="perfil-jugador-badge">⚽ Jugador</div>
      </div>

      <div className="perfil-datos">
        {user?.email && (
          <div className="perfil-dato-item">
            <div className="perfil-dato-icon"><Mail size={18} /></div>
            <div className="perfil-dato-info">
              <div className="label">Correo electrónico</div>
              <div className="value">{user.email}</div>
            </div>
          </div>
        )}
        {user?.telefono && (
          <div className="perfil-dato-item">
            <div className="perfil-dato-icon"><Phone size={18} /></div>
            <div className="perfil-dato-info">
              <div className="label">Teléfono / Celular</div>
              <div className="value">{user.telefono}</div>
            </div>
          </div>
        )}
        <div className="perfil-dato-item">
          <div className="perfil-dato-icon"><User size={18} /></div>
          <div className="perfil-dato-info">
            <div className="label">Alias / Apodo</div>
            <div className={`value ${user?.alias ? '' : 'empty'}`}>
              {user?.alias || 'No configurado'}
            </div>
          </div>
        </div>
        <div className="perfil-dato-item">
          <div className="perfil-dato-icon"><Shield size={18} /></div>
          <div className="perfil-dato-info">
            <div className="label">Rol</div>
            <div className="value">Jugador</div>
          </div>
        </div>
      </div>

      <div className="perfil-actions">
        <button
          id="btn-logout-perfil"
          className="btn-perfil-action danger"
          onClick={handleLogout}
        >
          <LogOut size={17} /> Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="player-portal">
      {/* Header */}
      <header className="portal-header">
        <div className="portal-header-logo">
          <img src="/logo.png" alt="ChapatuCancha" />
          <div className="portal-header-logo-text">
            <strong>ChapatuCancha</strong>
            <span>Pichangas Deportivas</span>
          </div>
        </div>
        <div className="portal-header-user">
          <div className="portal-user-greeting">
            <strong>{user?.nombreCompleto?.split(' ')[0] ?? 'Jugador'}</strong>
            <span>Jugador</span>
          </div>
          <div className="portal-avatar" aria-hidden="true">{initials}</div>
          <button
            id="btn-logout-header"
            className="portal-logout-btn"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <LogOut size={15} /> Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="portal-tabs" role="tablist">
        {([
          { id: 'partidos',  label: '🏟️ Partidos' },
          { id: 'reservas',  label: '📋 Mis Reservas', badge: pendienteCount },
          { id: 'perfil',    label: '👤 Mi Perfil' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`portal-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {('badge' in tab) && tab.badge > 0 && (
              <span className="tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <main className="portal-content" role="tabpanel">
        {activeTab === 'partidos' && renderPartidos()}
        {activeTab === 'reservas' && renderReservas()}
        {activeTab === 'perfil'   && renderPerfil()}
      </main>

      {/* Modal de reserva */}
      {selectedPartido && user && (
        <ReservaModal
          partido={selectedPartido}
          jugadorId={user.id}
          onClose={() => setSelectedPartido(null)}
          onSuccess={() => {
            setSelectedPartido(null);
            setActiveTab('reservas');
            fetchReservas();
            showToast('✅ Reserva enviada. Pendiente de validación por el admin.');
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`portal-toast ${toast.type ?? ''}`} role="status">
          {toast.msg}
        </div>
      )}
    </div>
  );
};
