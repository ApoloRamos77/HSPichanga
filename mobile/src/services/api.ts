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
  zonaNombre: string; modalidad: string;
  jugadoresRequeridos: number; costoTotal: number;
  cuotaIndividualEstimada: number; direccion: string;
  fotoUrl?: string; tieneLuz: boolean; tieneEstacionamiento: boolean;
};

// ─── Canchas (admin) ─────────────────────────────────────────────────────────
export type CanchaAdminDto = {
  id: string; nombre: string; descripcion: string;
  zonaNombre: string; modalidad: string;
  jugadoresRequeridos: number; costoTotal: number; direccion: string;
  fotoUrl?: string; tieneLuz: boolean; tieneEstacionamiento: boolean;
  activo: boolean;
  estadoCancha: 'Activa' | 'Inactiva' | 'Anulada';
};

export const canchasService = {
  getAll: (zonaId?: string, modalidad?: string) =>
    apiClient.get<CanchaDto[]>('/Canchas', { params: { zonaId, modalidad } }),
  getAllAdmin: () =>
    apiClient.get<CanchaAdminDto[]>('/Canchas/admin'),
  crearCancha: (data: any) =>
    apiClient.post('/Canchas', data),
  editarCancha: (id: string, data: {
    nombre: string; descripcion: string; costoTotal: number;
    direccion: string; tieneLuz: boolean; tieneEstacionamiento: boolean;
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
};

export const partidosService = {
  getAbiertos: (categoria?: string, zonaId?: string, modalidad?: string) =>
    apiClient.get<PartidoDto[]>('/Partidos', { params: { categoria, zonaId, modalidad } }),
  getAllAdmin: (tipoPartido?: number) =>
    apiClient.get<PartidoAdminDto[]>('/Partidos/admin', { params: { tipoPartido } }),
  crearPartido: (data: {
    canchaId: string; horarioId?: string; organizadorId: string;
    fechaHora: string; tipoPartido: number; categoria: number;
    tarifaEquipoOverride?: number; notas?: string;
  }) => apiClient.post('/Partidos', data),
  reprogramar: (id: string, nuevaFechaHora: string, notas?: string) =>
    apiClient.put(`/Partidos/${id}/reprogramar`, { nuevaFechaHora, notas }),
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
