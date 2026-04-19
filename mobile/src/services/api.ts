import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️ URL hacia el API de Producción en Easypanel
export const API_BASE_URL = 'https://softsport77-api-pichanga.scuiaw.easypanel.host/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: agrega JWT automáticamente
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: manejo de errores global
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('authToken');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// ─── Auth ─────────────────────────────────────────────────────────────────────
export type LoginRequest  = { email: string; password: string };
export type RegistroRequest = { nombreCompleto: string; email: string; password: string; telefono: string };
export type UsuarioDto = { id: string; nombreCompleto: string; email: string; rol: string; telefono: string; fotoUrl?: string };
export type LoginResponse  = { token: string; usuario: UsuarioDto };

export const authService = {
  login:   (data: LoginRequest)   => apiClient.post<LoginResponse>('/Auth/login', data),
  registro:(data: RegistroRequest)=> apiClient.post('/Auth/registro', data),
};

// ─── Canchas (público) ────────────────────────────────────────────────────────
export type CanchaDto = {
  id: string; nombre: string; descripcion: string;
  zonaNombre: string; ubicacionGoogleMaps: string | null;
  direccion: string; fotosUrls: string[];
  fotoUrl?: string; tieneLuz: boolean; tieneEstacionamiento: boolean;
  latitude?: number; longitude?: number; distance?: number;
  celularYape?: string; celularPlin?: string;
};

// ─── Canchas (admin) ─────────────────────────────────────────────────────────
export type CanchaAdminDto = {
  id: string; nombre: string; descripcion: string;
  zonaNombre: string; direccion: string;
  ubicacionGoogleMaps: string | null; fotosUrls: string[];
  fotoUrl?: string; tieneLuz: boolean; tieneEstacionamiento: boolean;
  activo: boolean;
  estadoCancha: 'Activa' | 'Inactiva' | 'Anulada';
  latitude?: number; longitude?: number;
  celularYape?: string; celularPlin?: string;
};

export const canchasService = {
  getAll: (zonaId?: string, userLat?: number, userLon?: number) =>
    apiClient.get<CanchaDto[]>('/Canchas', { params: { zonaId, userLatitude: userLat, userLongitude: userLon } }),
  getAllAdmin: () =>
    apiClient.get<CanchaAdminDto[]>('/Canchas/admin'),
  crearCancha: (data: any) =>
    apiClient.post('/Canchas', data),
  editarCancha: (id: string, data: {
    nombre: string; descripcion: string;
    direccion: string; ubicacionGoogleMaps: string | null; fotosUrls: string[];
    tieneLuz: boolean; tieneEstacionamiento: boolean;
  }) => apiClient.put(`/Canchas/${id}`, data),
  cambiarEstado: (id: string, nuevoEstado: 1 | 2 | 3) =>
    apiClient.put(`/Canchas/${id}/estado`, { nuevoEstado }),
};

// ─── Partidos (público) ───────────────────────────────────────────────────────
export type PartidoDto = {
  id: string; canchaId: string; canchaNombre: string; zonaNombre: string;
  fechaHora: string; tipoPartido: string; categoria: string; estado: string;
  cuotaIndividual: number; cuposDisponibles: number; cuposTotales: number;
  modalidad: string; notas?: string; organizadorNombre: string;
  distance?: number;
  celularYape?: string;
  celularPlin?: string;
  fotosUrls?: string[];
  latitude?: number;
  longitude?: number;
  direccion?: string;
  ubicacionGoogleMaps?: string;
};

// ─── Partidos (admin) ─────────────────────────────────────────────────────────
export type PartidoAdminDto = {
  id: string; canchaId: string; canchaNombre: string; zonaNombre: string;
  fechaHora: string; fechaReprogramada?: string;
  tipoPartido: string; categoria: string;
  estado: 'Abierto' | 'Completo' | 'Cancelado' | 'Finalizado' | 'Reprogramado';
  cuotaIndividual: number; cuposDisponibles: number; cuposTotales: number;
  modalidad: string; notas?: string; organizadorNombre: string;
  fechaCreacion: string;
  jugadores?: string[];
};

export const partidosService = {
  getAbiertos: (categoria?: string, zonaId?: string, modalidad?: string, userLat?: number, userLon?: number) =>
    apiClient.get<PartidoDto[]>('/Partidos', { params: { categoria, zonaId, modalidad, userLatitude: userLat, userLongitude: userLon } }),
  getAllAdmin: (tipoPartido?: number) =>
    apiClient.get<PartidoAdminDto[]>('/Partidos/admin', { params: { tipoPartido } }),
  crearPartido: (data: {
    canchaId: string; horarioId?: string; organizadorId: string;
    fechaHora: string; tipoPartido: number; categoria: number;
    modalidad: number; costoTotal: number;
    tarifaEquipoOverride?: number; notas?: string;
  }) => apiClient.post('/Partidos', data),
  editarPartido: (id: string, modalidad: number, costoTotal: number, nuevaFechaHora: string, notas?: string) =>
    apiClient.put(`/Partidos/${id}`, { modalidad, costoTotal, nuevaFechaHora, notas }),
  cambiarEstado: (id: string, nuevoEstado: number) =>
    apiClient.put(`/Partidos/${id}/estado`, { nuevoEstado }),
};

// ─── Reservas ─────────────────────────────────────────────────────────────────
export type CrearReservaResponse = {
  reservaId: string; codigoConfirmacion: string; montoPagado: number;
};

export type MisReservasDto = {
  reservaId: string; partidoId: string; canchaNombre: string;
  zonaNombre: string; fechaHora: string; estadoPartido: string;
  codigoConfirmacion: string; montoPagado: number; estadoPago: string;
};

export const reservasService = {
  crear: (partidoId: string, jugadorId: string, metodoPago?: number, numeroOperacion?: string) =>
    apiClient.post<CrearReservaResponse>('/Reservas', { partidoId, jugadorId, metodoPago, numeroOperacion }),
  getMisReservas: (jugadorId: string) =>
    apiClient.get<MisReservasDto[]>(`/Reservas/jugador/${jugadorId}`),
};

// ─── Usuarios (admin) ────────────────────────────────────────────────────────
export type UsuarioDto = {
  id: string; nombreCompleto: string; email: string;
  rol: string; telefono: string; fechaRegistro: string;
};

export const usuariosService = {
  getAll: () => apiClient.get<UsuarioDto[]>('/Usuarios'),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatService = {
  getMessages: (partidoId: string) => 
    apiClient.get(`/Chat/${partidoId}`),
  sendMessage: (partidoId: string, usuarioId: string, contenido: string) =>
    apiClient.post('/Chat', { partidoId, usuarioId, contenido }),
};

// ─── Calificaciones ──────────────────────────────────────────────────────────
export const ratingsService = {
  getByCancha: (canchaId: string) =>
    apiClient.get(`/Calificaciones/cancha/${canchaId}`),
  create: (canchaId: string, usuarioId: string, puntuacion: number, comentario?: string) =>
    apiClient.post('/Calificaciones', { canchaId, usuarioId, puntuacion, comentario }),
};
