import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { UsuarioDto } from '../services/api';

// Web polyfill: expo-secure-store no funciona en browser
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    await SecureStore.setItemAsync(key, value);
  },
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
    await SecureStore.deleteItemAsync(key);
  },
};

interface AuthState {
  token: string | null;
  usuario: UsuarioDto | null;
  isAuthenticated: boolean;
  setAuth: (token: string, usuario: UsuarioDto) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  usuario: null,
  isAuthenticated: false,

  setAuth: async (token, usuario) => {
    await storage.setItem('authToken', token);
    await storage.setItem('authUser', JSON.stringify(usuario));
    set({ token, usuario, isAuthenticated: true });
  },

  logout: async () => {
    await storage.removeItem('authToken');
    await storage.removeItem('authUser');
    set({ token: null, usuario: null, isAuthenticated: false });
  },

  loadFromStorage: async () => {
    const token = await storage.getItem('authToken');
    const userStr = await storage.getItem('authUser');
    if (token && userStr) {
      set({ token, usuario: JSON.parse(userStr), isAuthenticated: true });
    }
  },
}));
