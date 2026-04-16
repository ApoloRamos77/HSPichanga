import { Stack } from 'expo-router';
import { Colors } from '../../src/theme';

export default function MainLayout() {
  return (
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
    </Stack>
  );
}
