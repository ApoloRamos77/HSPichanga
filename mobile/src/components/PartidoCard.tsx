import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ViewStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography, Shadows } from '../theme';
import type { PartidoDto } from '../services/api';

interface Props {
  partido: PartidoDto;
  onPress: () => void;
  style?: ViewStyle;
}

export function PartidoCard({ partido, onPress, style }: Props) {
  const estadoColor = Colors.estadoColors[partido.estado] ?? Colors.textSecondary;
  const catColor    = Colors.categoryColors[partido.categoria] ?? Colors.accent;
  const fecha       = new Date(partido.fechaHora);
  const cuposPct    = partido.cuposDisponibles / partido.cuposTotales;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[styles.container, Shadows.card, style]}
    >
      {/* Fondo con gradiente sutil */}
      <LinearGradient
        colors={Colors.gradientCard}
        style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.lg }]}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.dot, { backgroundColor: estadoColor }]} />
          <Text style={styles.estado}>{partido.estado.toUpperCase()}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: catColor + '22', borderColor: catColor }]}>
          <Text style={[styles.badgeText, { color: catColor }]}>
            {formatCategoria(partido.categoria)}
          </Text>
        </View>
      </View>

      {/* Nombre cancha */}
      <Text style={styles.canchaNombre}>{partido.canchaNombre}</Text>
      <Text style={styles.zona}>
        <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
        {' '}{partido.zonaNombre}
        {partido.distance !== undefined && partido.distance !== null && (
          <Text style={styles.distanceText}>
            {'  •  '}{partido.distance.toFixed(1)} km cerca
          </Text>
        )}
      </Text>

      {/* Info fila */}
      <View style={styles.infoRow}>
        <InfoChip icon="calendar-outline" label={formatFecha(fecha)} />
        <InfoChip icon="time-outline" label={formatHora(fecha)} />
        <InfoChip icon="football-outline" label={partido.modalidad} />
      </View>

      {/* Barra de cupos */}
      <View style={styles.cuposSection}>
        <View style={styles.cuposLabels}>
          <Text style={styles.cuposText}>
            {partido.cuposDisponibles} cupos disponibles
          </Text>
          <Text style={styles.cuotaText}>
            S/. {partido.cuotaIndividual.toFixed(2)}
          </Text>
        </View>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${cuposPct * 100}%`,
                backgroundColor: cuposPct > 0.3 ? Colors.success : Colors.danger
              }
            ]}
          />
        </View>
        <Text style={styles.cuposTotal}>
          {partido.cuposTotales - partido.cuposDisponibles}/{partido.cuposTotales} ocupados
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function InfoChip({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={12} color={Colors.accent} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function formatFecha(d: Date) {
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

function formatHora(d: Date) {
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

function formatCategoria(cat: string) {
  const map: Record<string, string> = {
    FutbolFemeninoLibre: '⚽ Femenino',
    AdultosLibre: '⚽ Adultos',
    Master: '🏆 Máster',
    Sub15: '🌟 Sub-15',
    Sub17: '🌟 Sub-17',
    VoleyLibre: '🏐 Vóley',
  };
  return map[cat] ?? cat;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  estado: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  badgeText: { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold },
  canchaNombre: {
    fontSize: Typography.size.md,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.bold,
    marginBottom: 2,
  },
  zona: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: Typography.size.xs,
    color: Colors.accent,
    fontWeight: Typography.weight.bold,
  },
  infoRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  chipText: { fontSize: Typography.size.xs, color: Colors.textSecondary },
  cuposSection: { gap: 6 },
  cuposLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  cuposText: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  cuotaText: {
    fontSize: Typography.size.md,
    color: Colors.accent,
    fontWeight: Typography.weight.bold,
  },
  progressBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: Radius.full },
  cuposTotal: { fontSize: Typography.size.xs, color: Colors.textMuted, textAlign: 'right' },
});
