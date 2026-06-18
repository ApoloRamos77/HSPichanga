import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { api } from './api';

// ─── Configuración del comportamiento de notificaciones ─────────────────────
// Muestra la notificación incluso si la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicita permisos y registra el Expo Push Token en el backend.
 * Debe llamarse al iniciar sesión.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Las notificaciones push solo funcionan en dispositivos físicos
  if (!Device.isDevice) {
    console.log('[Push] Solo funciona en dispositivos físicos');
    return null;
  }

  // Crear canal de Android para mensajes de chat
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('chat-messages', {
      name: 'Mensajes del Chat',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2DD881',
      sound: 'default',
    });
  }

  // Solicitar permiso
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[Push] Permiso denegado');
    return null;
  }

  // Obtener el Expo Push Token
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: 'fe270916-493a-4681-8ae3-a08748f9dab2', // EAS projectId de app.json
  });

  const token = tokenData.data;
  console.log('[Push] Token obtenido:', token);

  // Enviar el token al backend para guardarlo
  try {
    await api.post('/Usuarios/push-token', { token });
    console.log('[Push] Token registrado en el backend');
  } catch (err) {
    console.warn('[Push] No se pudo registrar el token en el backend', err);
  }

  return token;
}

/**
 * Configura el listener que se ejecuta cuando el usuario TOCA una notificación.
 * Navega automáticamente al chat correspondiente.
 * Devuelve una función de limpieza para usar en useEffect.
 */
export function setupNotificationTapListener() {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as any;
    if (data?.screen === 'chat' && data?.partidoId) {
      router.push(`/(main)/reservas/chat?id=${data.partidoId}` as any);
    }
  });

  return () => subscription.remove();
}
