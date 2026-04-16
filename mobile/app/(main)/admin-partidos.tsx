import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, Typography } from '../../src/theme';
import { canchasService, partidosService, CanchaDto } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';

export default function AdminPartidosScreen() {
  const usuario = useAuthStore((s) => s.usuario);
  const [canchas, setCanchas] = useState<CanchaDto[]>([]);
  const [canchaId, setCanchaId] = useState('');
  
  const [form, setForm] = useState({
    fechaHora: new Date(new Date().getTime() + 86400000).toISOString().split('T')[0] + 'T20:00:00Z', // Mañana a las 20:00 default
    tipoPartido: 1, // 1 = Publico
    categoria: 1, // 1 = AdultosLibre
    notas: 'Amistoso oficial ADHSOFT SPORT',
  });

  useEffect(() => {
    canchasService.getAll().then(res => {
      setCanchas(res.data);
      if (res.data.length > 0) setCanchaId(res.data[0].id);
    }).catch(e => console.log("Canchas err", e));
  }, []);

  const handleCrear = async () => {
    try {
      if (!canchaId) {
          Alert.alert("Aviso", "Aún no has registrado ninguna cancha maestra.");
          return;
      }
      
      // En un escenario real seleccionaríamos el HorarioId preciso de la cancha, aquí usaremos uno genérico (Guid Empty)
      // para esquivar la estricta relación CQRS o un ID provisto por la BBDD.
      await partidosService.crearPartido({
        CanchaId: canchaId,
        HorarioId: '00000000-0000-0000-0000-000000000000', // El backend genera el slot
        OrganizadorId: usuario?.id,
        FechaHora: form.fechaHora,
        TipoPartido: form.tipoPartido,
        Categoria: form.categoria,
        Notas: form.notas
      });

      Alert.alert('Éxito', '¡Partido programado y publicado a todos los usuarios!');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.mensaje || 'No se pudo programar el partido.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Programar Amistoso</Text>
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Seleccionar Cancha Base</Text>
        <ScrollView horizontal style={styles.canchaScroller} showsHorizontalScrollIndicator={false}>
            {canchas.map(c => (
                <TouchableOpacity 
                    key={c.id} 
                    style={[styles.canchaChip, canchaId === c.id && styles.canchaChipSelect]}
                    onPress={() => setCanchaId(c.id)}>
                    <Text style={{color: canchaId === c.id ? '#FFF' : Colors.textSecondary}}>{c.nombre}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
        {canchas.length === 0 && <Text style={{color: Colors.accent}}>Crea una cancha primero en la pantalla anterior.</Text>}

        <Text style={styles.label}>Fecha y Hora (ISO 8601 UTC)</Text>
        <TextInput
          style={styles.input}
          placeholder="2026-05-10T20:00:00Z"
          placeholderTextColor={Colors.textMuted}
          value={form.fechaHora}
          onChangeText={(val) => setForm({ ...form, fechaHora: val })}
        />

        <Text style={styles.label}>Notas adicionales</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Equipos con camiseta y canilleras..."
          placeholderTextColor={Colors.textMuted}
          multiline
          value={form.notas}
          onChangeText={(val) => setForm({ ...form, notas: val })}
        />

        <TouchableOpacity style={styles.btnCrear} onPress={handleCrear}>
          <Text style={styles.btnText}>PROGRAMAR Y PUBLICAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing.lg },
  title: { fontSize: Typography.size.xl, color: Colors.textPrimary, fontWeight: Typography.weight.bold, marginVertical: Spacing.md },
  scroll: { paddingBottom: Spacing.xxl },
  label: { color: Colors.textSecondary, marginBottom: Spacing.xs, fontWeight: Typography.weight.medium, marginTop: Spacing.md },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  canchaScroller: { flexDirection: 'row', marginVertical: Spacing.sm },
  canchaChip: { padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, marginRight: Spacing.sm },
  canchaChipSelect: { backgroundColor: Colors.primary, borderColor: Colors.primaryLight },
  btnCrear: {
    backgroundColor: Colors.accent,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  btnText: { color: '#FFF', fontWeight: Typography.weight.bold, fontSize: Typography.size.md }
});
