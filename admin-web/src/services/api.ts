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

export const authService = {
  login: (data: any) => api.post('/Auth/login', data),
};

export const canchasService = {
  getAll: () => api.get('/Canchas/admin'),
  create: (data: any) => api.post('/Canchas', data),
  update: (id: string, data: any) => api.put(`/Canchas/${id}`, data),
  changeStatus: (id: string, nuevoEstado: number) => api.put(`/Canchas/${id}/estado`, { nuevoEstado }),
};

export const uploadService = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/Upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
