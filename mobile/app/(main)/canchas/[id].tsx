import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { canchasService, CanchaDto } from '../../../src/services/api';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../../src/theme';
import { Button } from '../../../src/components/Button';
import { RatingModal } from '../../../src/components/RatingModal';

export default function CanchaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showRating, setShowRating] = React.useState(false);

  const { data: canchas, isLoading } = useQuery({
    queryKey: ['canchas'],
    queryFn: () => canchasService.getAll().then(r => r.data),
  });

  const cancha = canchas?.find(c => c.id === id);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!cancha) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Cancha no encontrada.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Usando placeholder por ahora */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: cancha.fotoUrl ?? 'https://via.placeholder.com/600x400/162236/8BA3BC?text=ADHSOFT+SPORT' }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <Text style={styles.titleOverlay}>{cancha.nombre}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.row}>
            <Ionicons name="location" size={18} color={Colors.textSecondary} />
            <Text style={styles.zonaText}>{cancha.zonaNombre}</Text>
          </View>
          <Text style={styles.direccionText}>{cancha.direccion}</Text>

          <Text style={styles.sectionTitle}>Amenidades</Text>
          <View style={styles.detailsGrid}>
            <DetailItem icon="bulb" label="Iluminación" value={cancha.tieneLuz ? 'Disponible' : 'No cuenta'} />
            <DetailItem icon="car" label="Estacionamiento" value={cancha.tieneEstacionamiento ? 'SÍ' : 'NO'} />
          </View>


          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descText}>{cancha.descripcion}</Text>

          <Button
            title="CALIFICAR ESTA CANCHA"
            onPress={() => setShowRating(true)}
            variant="outline"
            style={{ marginTop: Spacing.xl }}
            leftIcon={<Ionicons name="star-outline" size={20} color={Colors.accent} />}
          />
        </View>
      </ScrollView>

      <RatingModal 
        visible={showRating} 
        onClose={() => setShowRating(false)} 
        canchaId={id!} 
      />
    </SafeAreaView>
  );
}

function DetailItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={[styles.detailCard, Shadows.card]}>
      <Ionicons name={icon} size={24} color={Colors.accent} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function ServicioChip({ icon, label, active }: { icon: any; label: string; active: boolean }) {
  return (
    <View style={[styles.chip, active ? styles.chipActive : {}]}>
      <Ionicons name={icon} size={16} color={active ? Colors.accent : Colors.textMuted} />
      <Text style={[styles.chipText, active ? styles.chipTextActive : {}]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.danger, fontSize: Typography.size.base },
  imageContainer: { height: 250, position: 'relative' },
  image: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,27,42,0.4)' },
  titleOverlay: {
    position: 'absolute', bottom: Spacing.lg, left: Spacing.lg,
    fontSize: Typography.size.xl, color: Colors.textPrimary,
    fontWeight: Typography.weight.black,
  },
  body: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  zonaText: { fontSize: Typography.size.md, color: Colors.textSecondary, fontWeight: Typography.weight.semibold },
  direccionText: { fontSize: Typography.size.sm, color: Colors.textMuted, marginTop: 4, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: Typography.size.lg, color: Colors.textPrimary, fontWeight: Typography.weight.bold, marginTop: Spacing.md, marginBottom: Spacing.md },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  detailCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, gap: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  detailLabel: { fontSize: Typography.size.xs, color: Colors.textMuted },
  detailValue: { fontSize: Typography.size.sm, color: Colors.textPrimary, fontWeight: Typography.weight.semibold },
  serviciosRow: { flexDirection: 'row', gap: Spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { borderColor: Colors.accent, backgroundColor: Colors.accent + '11' },
  chipText: { fontSize: Typography.size.sm, color: Colors.textMuted },
  chipTextActive: { color: Colors.accent, fontWeight: Typography.weight.semibold },
  descText: { fontSize: Typography.size.base, color: Colors.textSecondary, lineHeight: 24 },
});
