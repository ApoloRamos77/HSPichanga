import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️ Cambia esta URL cuando despliegues el API
export const API_BASE_URL = 'http://localhost:5050/api';

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

// ─── Canchas ──────────────────────────────────────────────────────────────────
export type CanchaDto = {
  id: string; nombre: string; descripcion: string;
  zonaNombre: string; modalidad: string;
  jugadoresRequeridos: number; costoTotal: number;
  cuotaIndividualEstimada: number; direccion: string;
  fotoUrl?: string; tieneLuz: boolean; tieneEstacionamiento: boolean;
};

export const canchasService = {
  getAll: (zonaId?: string, modalidad?: string) =>
    apiClient.get<CanchaDto[]>('/Canchas', { params: { zonaId, modalidad } }),
};

// ─── Partidos ─────────────────────────────────────────────────────────────────
export type PartidoDto = {
  id: string; canchaId: string; canchaNombre: string; zonaNombre: string;
  fechaHora: string; tipoPartido: string; categoria: string; estado: string;
  cuotaIndividual: number; cuposDisponibles: number; cuposTotales: number;
  modalidad: string; notas?: string; organizadorNombre: string;
};

export const partidosService = {
  getAbiertos: (categoria?: string, zonaId?: string, modalidad?: string) =>
    apiClient.get<PartidoDto[]>('/Partidos', { params: { categoria, zonaId, modalidad } }),
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
