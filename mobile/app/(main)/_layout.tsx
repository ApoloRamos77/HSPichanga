import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { Colors } from '../../src/theme';
import { InactivityTracker } from '../../src/components/InactivityTracker';
import { useAuthStore } from '../../src/stores/authStore';

export default function MainLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  return (
    <InactivityTracker>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="canchas/[id]"
          options={{ title: 'Detalle de Cancha', headerBackTitle: 'Atrás' }}
        />
        <Stack.Screen
          name="reservas/[id]"
          options={{ title: 'Detalle de Reserva', headerBackTitle: 'Atrás' }}
        />
        <Stack.Screen
          name="admin-canchas"
          options={{ title: 'Backoffice: Canchas', headerBackTitle: 'Atrás' }}
        />
        <Stack.Screen
          name="admin-partidos"
          options={{ title: 'Backoffice: Amistosos', headerBackTitle: 'Atrás' }}
        />
      </Stack>
    </InactivityTracker>
  );
}
