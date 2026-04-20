import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { reservasService, MisReservasDto } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../src/theme';

export default function MisReservasScreen() {
  const usuario = useAuthStore((s: any) => s.usuario);

  const { data: reservas, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['misReservas', usuario?.id],
    queryFn: () => reservasService.getMisReservas(usuario!.id).then((r: any) => r.data),
    enabled: !!usuario?.id,
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Reservas</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      >
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.accent} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
            <Text style={styles.errorText}>Error al cargar reservas.</Text>
          </View>
        ) : !reservas || reservas.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="calendar-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No tienes reservas aún</Text>
            <Text style={styles.emptySubtext}>Apúntate a una pichanga para verla aquí</Text>
          </View>
        ) : (
          reservas.map((r: MisReservasDto) => (
            <View key={r.reservaId} style={[styles.card, Shadows.card]}>
              <View style={styles.cardHeader}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{r.estadoPartido}</Text>
                </View>
                <Text style={styles.fechaText}>
                  {new Date(r.fechaHora).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                </Text>
              </View>

              <Text style={styles.canchaNombre}>{r.canchaNombre}</Text>
              <Text style={styles.zonaText}>
                <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                {' '}{r.zonaNombre}
              </Text>

              <View style={styles.infoRow}>
                <View>
                  <Text style={styles.label}>Hora</Text>
                  <Text style={styles.value}>
                    {new Date(r.fechaHora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View>
                  <Text style={styles.label}>Pagado</Text>
                  <Text style={styles.value}>S/. {r.montoPagado.toFixed(2)}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Código</Text>
                  <Text style={styles.codeText}>{r.codigoConfirmacion}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backBtn: { padding: 8, marginRight: 8 },
  title: { fontSize: Typography.size.lg, color: Colors.textPrimary, fontWeight: Typography.weight.bold },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  centered: { padding: Spacing.xxl, alignItems: 'center', gap: Spacing.md },
  emptyText: { fontSize: Typography.size.md, color: Colors.textSecondary, fontWeight: Typography.weight.medium },
  emptySubtext: { fontSize: Typography.size.sm, color: Colors.textMuted },
  errorText: { color: Colors.danger, fontSize: Typography.size.base },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.lg, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  statusBadge: { backgroundColor: Colors.accent + '22', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  statusText: { color: Colors.accent, fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold },
  fechaText: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  canchaNombre: { fontSize: Typography.size.lg, color: Colors.textPrimary, fontWeight: Typography.weight.bold },
  zonaText: { fontSize: Typography.size.sm, color: Colors.textSecondary, marginBottom: Spacing.md, marginTop: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.md },
  label: { fontSize: Typography.size.xs, color: Colors.textMuted, marginBottom: 2 },
  value: { fontSize: Typography.size.sm, color: Colors.textPrimary, fontWeight: Typography.weight.semibold },
  codeText: { fontSize: Typography.size.sm, color: Colors.success, fontWeight: Typography.weight.bold, letterSpacing: 1 },
});
