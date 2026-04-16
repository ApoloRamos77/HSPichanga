import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, TextInput, RefreshControl, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { partidosService, PartidoDto } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';
import { PartidoCard } from '../../src/components/PartidoCard';
import { Colors, Spacing, Radius, Typography } from '../../src/theme';

const CATEGORIAS = [
  { label: 'Todos', value: undefined },
  { label: '⚽ Adultos', value: 'AdultosLibre' },
  { label: '♀ Femenino', value: 'FutbolFemeninoLibre' },
  { label: '🏆 Máster', value: 'Master' },
  { label: '🌟 Sub-15', value: 'Sub15' },
  { label: '🌟 Sub-17', value: 'Sub17' },
  { label: '🏐 Vóley', value: 'VoleyLibre' },
];

export default function HomeScreen() {
  const usuario = useAuthStore((s) => s.usuario);
  const logout  = useAuthStore((s) => s.logout);
  const [catActiva, setCatActiva] = useState<string | undefined>(undefined);
  const [busqueda, setBusqueda]   = useState('');

  const { data: partidos, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['partidos', catActiva],
    queryFn: () => partidosService.getAbiertos(catActiva).then(r => r.data),
  });

  const filtrados = (partidos ?? []).filter((p) =>
    busqueda.trim() === '' ||
    p.canchaNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.zonaNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Hero Header */}
      <LinearGradient colors={Colors.gradientMain} style={styles.hero}>
        <View style={styles.heroContent}>
          <View>
            <Text style={styles.greeting}>
              ¡Hola, {usuario?.nombreCompleto?.split(' ')[0] ?? 'Jugador'}! 👋
            </Text>
            <Text style={styles.heroSubtitle}>¿A qué hora juegas hoy?</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => router.push('/(main)/mis-reservas')} style={styles.logoutBtn}>
              <Ionicons name="calendar-outline" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats rápidos */}
        <View style={styles.statsRow}>
          <StatChip icon="football-outline" value={`${filtrados.length}`} label="Pichangas" />
          <StatChip icon="location-outline" value="Lima" label="Ciudad" />
          <StatChip icon="people-outline" value={usuario?.rol ?? ''} label="Rol" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      >
        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar cancha o zona..."
            placeholderTextColor={Colors.textMuted}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros de categoría */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtros}
        >
          {CATEGORIAS.map((cat) => {
            const activo = catActiva === cat.value;
            return (
              <TouchableOpacity
                key={cat.label}
                onPress={() => setCatActiva(cat.value)}
                style={[styles.filtroBtn, activo && styles.filtroBtnActivo]}
              >
                <Text style={[styles.filtroText, activo && styles.filtroTextActivo]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sección Pichangas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Pichangas Abiertas
            <Text style={styles.sectionCount}> ({filtrados.length})</Text>
          </Text>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.accent} />
              <Text style={styles.loadingText}>Cargando pichangas...</Text>
            </View>
          ) : isError ? (
            <View style={styles.centered}>
              <Ionicons name="wifi-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.errorText}>No se pudo conectar al server.</Text>
              <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
                <Text style={{ color: Colors.accent }}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : filtrados.length === 0 ? (
            <View style={styles.centered}>
              <Ionicons name="football-outline" size={56} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No hay pichangas disponibles</Text>
              <Text style={styles.emptySubtext}>
                Cambia los filtros o vuelve más tarde
              </Text>
            </View>
          ) : (
            filtrados.map((partido) => (
              <PartidoCard
                key={partido.id}
                partido={partido}
                onPress={() => router.push(`/(main)/reservas/${partido.id}` as any)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatChip({ icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <View style={styles.statChip}>
      <Ionicons name={icon} size={16} color={Colors.accent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  greeting: { fontSize: Typography.size.lg, color: Colors.textPrimary, fontWeight: Typography.weight.bold },
  heroSubtitle: { fontSize: Typography.size.sm, color: Colors.textSecondary, marginTop: 2 },
  logoutBtn: {
    padding: 8, borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statChip: {
    flex: 1, alignItems: 'center', gap: 4,
    backgroundColor: Colors.surface + '99',
    borderRadius: Radius.md, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { fontSize: Typography.size.md, color: Colors.textPrimary, fontWeight: Typography.weight.bold },
  statLabel: { fontSize: Typography.size.xs, color: Colors.textSecondary },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base },
  filtros: { paddingVertical: Spacing.md, gap: Spacing.sm },
  filtroBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  filtroBtnActivo: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filtroText: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  filtroTextActivo: { color: Colors.textInverse, fontWeight: Typography.weight.bold },
  section: { paddingBottom: Spacing.xxl },
  sectionTitle: { fontSize: Typography.size.md, color: Colors.textPrimary, fontWeight: Typography.weight.bold, marginBottom: Spacing.md },
  sectionCount: { fontSize: Typography.size.sm, color: Colors.textSecondary, fontWeight: Typography.weight.regular },
  centered: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  loadingText: { color: Colors.textSecondary, fontSize: Typography.size.sm },
  errorText: { color: Colors.danger, fontSize: Typography.size.base, textAlign: 'center' },
  retryBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.accent },
  emptyText: { fontSize: Typography.size.md, color: Colors.textSecondary, fontWeight: Typography.weight.medium },
  emptySubtext: { fontSize: Typography.size.sm, color: Colors.textMuted, textAlign: 'center' },
});
