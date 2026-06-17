import axios from 'axios';

const API_BASE_URL = 'https://softsport77-api-pichanga.scuiaw.easypanel.host/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  login: (data: { identificador: string; password: string }) =>
    api.post('/Auth/login', data),
  register: (data: {
    nombreCompleto: string;
    alias?: string;
    email?: string;
    password: string;
    telefono?: string;
  }) => api.post('/Auth/registro', data),
};

// ─── Canchas ──────────────────────────────────────────────────────────────────
export const canchasService = {
  getAll: () => api.get('/Canchas/admin'),
  create: (data: any) => api.post('/Canchas', data),
  update: (id: string, data: any) => api.put(`/Canchas/${id}`, data),
  changeStatus: (id: string, nuevoEstado: number) =>
    api.put(`/Canchas/${id}/estado`, { nuevoEstado }),
};

// ─── Partidos ─────────────────────────────────────────────────────────────────
export const partidosService = {
  // Público: partidos abiertos para jugadores
  getAbiertos: (filters?: {
    categoria?: string;
    modalidad?: string;
    userLatitude?: number;
    userLongitude?: number;
  }) => api.get('/Partidos', { params: filters }),

  // Admin
  getAllAdmin: () => api.get('/Partidos/admin'),
  cambiarEstado: (id: string, nuevoEstado: number) =>
    api.put(`/Partidos/${id}/estado`, { nuevoEstado }),
};

// ─── Reservas ─────────────────────────────────────────────────────────────────
export const reservasService = {
  // Jugador: crear reserva con pago
  crear: (data: {
    partidoId: string;
    jugadorId: string;
    metodoPago?: number | null;
    numeroOperacion?: string | null;
    evidenciaPagoUrl?: string | null;
  }) => api.post('/Reservas', data),

  // Jugador: mis reservas
  getMisReservas: (jugadorId: string) =>
    api.get(`/Reservas/jugador/${jugadorId}`),

  // Admin
  confirmarPago: (id: string) => api.put(`/Reservas/${id}/confirmar`),
  rechazarPago: (id: string) => api.put(`/Reservas/${id}/rechazar`),
};

// ─── Usuarios ─────────────────────────────────────────────────────────────────
export const usuariosService = {
  getAll: () => api.get('/Usuarios'),
  create: (data: {
    nombreCompleto: string;
    email?: string;
    telefono?: string;
    alias?: string;
    rol: number;
  }) => api.post('/Usuarios', data),
  update: (id: string, data: any) => api.put(`/Usuarios/${id}`, data),
  toggleActivo: (id: string) => api.patch(`/Usuarios/${id}/toggle-activo`),
  resetPasswordAdmin: (id: string, canal: 'Email' | 'WhatsApp' = 'Email') => api.post(`/usuarios/${id}/reset-password-admin?canal=${canal}`),
  changePassword: (newPassword: string) =>
    api.post('/Usuarios/change-password', { newPassword }),
};

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadService = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/Upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadApk: (
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/Upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
};

// ─── Landing Settings ─────────────────────────────────────────────────────────
export const landingSettingsService = {
  getAll: () => api.get('/LandingSettings'),
  update: (settings: Record<string, string | null>) =>
    api.post('/LandingSettings', settings),
};

export default api;
