import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity, TextInput,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { partidosService, reservasService } from '../../../src/services/api';
import { useAuthStore } from '../../../src/stores/authStore';
import { Button } from '../../../src/components/Button';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../../src/theme';

export default function ReservaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const usuario = useAuthStore((s) => s.usuario);
  const [metodoPago, setMetodoPago] = useState<number>(2); // 2: Yape, 3: Plin
  const [numeroOperacion, setNumeroOperacion] = useState('');

  const { data: partidos, isLoading } = useQuery({
    queryKey: ['partidos'],
    queryFn: () => partidosService.getAbiertos().then(r => r.data),
  });

  const partido = partidos?.find(p => p.id === id);

  const mutation = useMutation({
    mutationFn: () => reservasService.crear(id!, usuario!.id, metodoPago, numeroOperacion),
    onSuccess: (data) => {
      Alert.alert(
        '¡Cupo Reservado! 🎉',
        `Tu código de confirmación es:\n\n${data.data.codigoConfirmacion}\n\nMonto: S/. ${data.data.montoPagado.toFixed(2)}`,
        [{ text: 'Entendido', onPress: () => router.back() }]
      );
    },
    onError: (err: any) => {
      const msg = err.response?.data?.mensaje ?? 'Error al reservar. Intenta nuevamente.';
      Alert.alert('Error', msg);
    },
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!partido) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Partido no encontrado</Text>
      </View>
    );
  }

  const fecha = new Date(partido.fechaHora);
  const pctLleno = partido.cuposDisponibles / partido.cuposTotales;
  const estadoColor = Colors.estadoColors[partido.estado] ?? Colors.textSecondary;
  const catColor = Colors.categoryColors[partido.categoria] ?? Colors.accent;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero de la reserva */}
        <LinearGradient colors={Colors.gradientMain} style={styles.hero}>
          <View style={styles.heroCenter}>
            <Ionicons name="football" size={52} color={Colors.accent} />
            <Text style={styles.canchaNombre}>{partido.canchaNombre}</Text>
            <Text style={styles.zona}>
              <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
              {' '}{partido.zonaNombre}
            </Text>
          </View>

          {/* Precio destacado */}
          <View style={styles.precioBox}>
            <Text style={styles.precioLabel}>Tu cuota</Text>
            <Text style={styles.precio}>S/. {partido.cuotaIndividual.toFixed(2)}</Text>
            <Text style={styles.precioNote}>por jugador</Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Info cards */}
          <View style={styles.infoGrid}>
            <InfoCard icon="calendar-outline" label="Fecha" value={fecha.toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long' })} />
            <InfoCard icon="time-outline" label="Hora" value={fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} />
            <InfoCard icon="football-outline" label="Modalidad" value={partido.modalidad} />
            <InfoCard icon="trophy-outline" label="Categoría" value={formatCat(partido.categoria)} color={catColor} />
          </View>

          {/* Cupos */}
          <View style={[styles.card, Shadows.card]}>
            <Text style={styles.cardTitle}>Disponibilidad</Text>
            <View style={styles.cuposRow}>
              <View style={styles.cuposStat}>
                <Text style={styles.cuposNum}>{partido.cuposDisponibles}</Text>
                <Text style={styles.cuposLabel}>Disponibles</Text>
              </View>
              <View style={styles.cuposDivider} />
              <View style={styles.cuposStat}>
                <Text style={styles.cuposNum}>{partido.cuposTotales - partido.cuposDisponibles}</Text>
                <Text style={styles.cuposLabel}>Ocupados</Text>
              </View>
              <View style={styles.cuposDivider} />
              <View style={styles.cuposStat}>
                <Text style={styles.cuposNum}>{partido.cuposTotales}</Text>
                <Text style={styles.cuposLabel}>Total</Text>
              </View>
            </View>
            <View style={styles.progressBg}>
              <View style={[
                styles.progressFill,
                { width: `${(1 - pctLleno) * 100}%`, backgroundColor: pctLleno > 0.3 ? Colors.success : Colors.danger }
              ]} />
            </View>
            <View style={[styles.estadoBadge, { backgroundColor: estadoColor + '22' }]}>
              <View style={[styles.estadoDot, { backgroundColor: estadoColor }]} />
              <Text style={[styles.estadoText, { color: estadoColor }]}>
                {partido.estado}
              </Text>
            </View>
          </View>

          {partido.notas && (
            <View style={styles.notasCard}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.accent} />
              <Text style={styles.notasText}>{partido.notas}</Text>
            </View>
          )}

          {/* Pagos Billetera Digital */}
          {partido.estado === 'Abierto' && partido.cuposDisponibles > 0 ? (
            <View style={styles.paymentSection}>
              <Text style={styles.sectionTitle}>Método de Pago</Text>
              <View style={styles.walletTabs}>
                <TouchableOpacity 
                  style={[styles.walletTab, metodoPago === 2 && styles.walletTabActiveYape]} 
                  onPress={() => setMetodoPago(2)}
                >
                  <Text style={[styles.walletTabText, metodoPago === 2 && { color: '#fff' }]}>YAPE</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.walletTab, metodoPago === 3 && styles.walletTabActivePlin]} 
                  onPress={() => setMetodoPago(3)}
                >
                  <Text style={[styles.walletTabText, metodoPago === 3 && { color: '#fff' }]}>PLIN</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.walletInfoBox, metodoPago === 2 ? { borderColor: '#742284' } : { borderColor: '#00D6D6' }]}>
                <Ionicons name="qr-code-outline" size={48} color={metodoPago === 2 ? '#742284' : '#00D6D6'} />
                <Text style={styles.walletPhone}>999 000 111</Text>
                <Text style={styles.walletName}>Canchas ADHSOFT (Admin)</Text>
                <Text style={styles.walletInstructions}>
                  Transfiere S/. {partido.cuotaIndividual.toFixed(2)} al número o lee el QR en tu app.
                </Text>
                
                <TextInput
                  style={styles.inputStyle}
                  placeholder="N° de Operación (Opcional)"
                  placeholderTextColor={Colors.textMuted}
                  value={numeroOperacion}
                  onChangeText={setNumeroOperacion}
                  keyboardType="numeric"
                />
              </View>

              <Button
                title={`NOTIFICAR PAGO Y RESERVAR`}
                onPress={() => mutation.mutate()}
                loading={mutation.isPending}
                variant="accent"
                size="lg"
                style={{ marginTop: Spacing.md }}
              />
              <Text style={styles.disclaimer}>
                * La reserva quedará en Verificación hasta comprobar la transferencia.
              </Text>
            </View>
          ) : (
            <View style={styles.sinCupos}>
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
              <Text style={styles.sinCuposText}>
                {partido.estado !== 'Abierto' ? 'Este partido ya no acepta reservas' : 'No quedan cupos disponibles'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCard({ icon, label, value, color }: { icon: any; label: string; value: string; color?: string }) {
  return (
    <View style={styles.infoCard}>
      <Ionicons name={icon} size={20} color={color ?? Colors.accent} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, color ? { color } : {}]}>{value}</Text>
    </View>
  );
}

function formatCat(cat: string) {
  const map: Record<string, string> = {
    FutbolFemeninoLibre: 'Femenino',
    AdultosLibre: 'Adultos',
    Master: 'Máster',
    Sub15: 'Sub-15',
    Sub17: 'Sub-17',
    VoleyLibre: 'Vóley',
  };
  return map[cat] ?? cat;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText: { color: Colors.danger, fontSize: Typography.size.base },
  hero: { padding: Spacing.xl, alignItems: 'center', paddingBottom: Spacing.xxl },
  heroCenter: { alignItems: 'center', gap: 8, marginBottom: Spacing.lg },
  canchaNombre: { fontSize: Typography.size.xl, color: Colors.textPrimary, fontWeight: Typography.weight.bold, textAlign: 'center' },
  zona: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  precioBox: {
    backgroundColor: Colors.accent + '22',
    borderRadius: Radius.xl, padding: Spacing.lg,
    alignItems: 'center', borderWidth: 2, borderColor: Colors.accent,
    minWidth: 160,
  },
  precioLabel: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  precio: { fontSize: Typography.size.xxl, color: Colors.accent, fontWeight: Typography.weight.black },
  precioNote: { fontSize: Typography.size.xs, color: Colors.textMuted },
  body: { padding: Spacing.lg, gap: Spacing.md },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  infoCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    gap: 4, alignItems: 'flex-start',
  },
  infoLabel: { fontSize: Typography.size.xs, color: Colors.textMuted },
  infoValue: { fontSize: Typography.size.sm, color: Colors.textPrimary, fontWeight: Typography.weight.semibold },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, gap: Spacing.md,
  },
  cardTitle: { fontSize: Typography.size.md, color: Colors.textPrimary, fontWeight: Typography.weight.bold },
  cuposRow: { flexDirection: 'row', justifyContent: 'space-around' },
  cuposStat: { alignItems: 'center', gap: 4 },
  cuposNum: { fontSize: Typography.size.xl, color: Colors.textPrimary, fontWeight: Typography.weight.black },
  cuposLabel: { fontSize: Typography.size.xs, color: Colors.textMuted },
  cuposDivider: { width: 1, backgroundColor: Colors.border, height: '100%' },
  progressBg: { height: 6, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: Radius.full },
  estadoBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: Spacing.sm, borderRadius: Radius.sm },
  estadoDot: { width: 10, height: 10, borderRadius: 5 },
  estadoText: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold },
  notasCard: {
    flexDirection: 'row', gap: Spacing.sm,
    backgroundColor: Colors.accent + '11',
    borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.accent + '44',
  },
  notasText: { flex: 1, fontSize: Typography.size.sm, color: Colors.textSecondary },
  sinCupos: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'center',
    justifyContent: 'center', padding: Spacing.md,
    backgroundColor: Colors.danger + '15',
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.danger + '44',
    marginTop: Spacing.md,
  },
  sinCuposText: { color: Colors.danger, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  disclaimer: { fontSize: Typography.size.xs, color: Colors.textSecondary, textAlign: 'center', marginVertical: Spacing.sm },
  paymentSection: { marginTop: Spacing.md, gap: Spacing.sm },
  sectionTitle: { fontSize: Typography.size.md, color: Colors.textPrimary, fontWeight: Typography.weight.bold },
  walletTabs: { flexDirection: 'row', gap: Spacing.sm },
  walletTab: { flex: 1, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  walletTabActiveYape: { backgroundColor: '#742284', borderColor: '#742284' },
  walletTabActivePlin: { backgroundColor: '#00D6D6', borderColor: '#00D6D6' },
  walletTabText: { fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, color: Colors.textPrimary },
  walletInfoBox: { alignItems: 'center', backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 2, gap: 8, marginTop: Spacing.sm },
  walletPhone: { fontSize: Typography.size.xl, fontWeight: Typography.weight.black, color: Colors.textPrimary, marginTop: 4 },
  walletName: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  walletInstructions: { fontSize: Typography.size.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: 4, marginBottom: Spacing.md },
  inputStyle: { width: '100%', backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md, color: Colors.textPrimary, fontSize: Typography.size.sm }
});
