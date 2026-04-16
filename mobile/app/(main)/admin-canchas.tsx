import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, Typography } from '../../src/theme';
import { canchasService } from '../../src/services/api';

export default function AdminCanchasScreen() {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    modalidad: 1, // 1 = Futbol7, etc
    costoTotal: '0',
    direccion: '',
    zonaId: '11111111-1111-1111-1111-111111111111', // Miraflores por defecto
    tieneLuz: true,
    tieneEstacionamiento: true
  });

  const handleCrear = async () => {
    try {
      if (!form.nombre || !form.direccion) {
          Alert.alert("Error", "Falta el nombre de la cancha o la dirección");
          return;
      }

      await canchasService.crearCancha({
        ...form,
        costoTotal: parseFloat(form.costoTotal) || 0
      });
      Alert.alert('Éxito', 'La cancha ha sido registrada.');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.mensaje || 'No se pudo registrar la cancha');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Registrar Cancha Nueva</Text>
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Nombre de la Cancha / Complejo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: La 10 de Miraflores"
          placeholderTextColor={Colors.textMuted}
          value={form.nombre}
          onChangeText={(val) => setForm({ ...form, nombre: val })}
        />

        <Text style={styles.label}>Dirección Exacta</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Av. Ejército 400"
          placeholderTextColor={Colors.textMuted}
          value={form.direccion}
          onChangeText={(val) => setForm({ ...form, direccion: val })}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Grass sintético renovado..."
          placeholderTextColor={Colors.textMuted}
          multiline
          value={form.descripcion}
          onChangeText={(val) => setForm({ ...form, descripcion: val })}
        />

        <Text style={styles.label}>Costo por Hora (S/)</Text>
        <TextInput
          style={styles.input}
          placeholder="100.00"
          keyboardType="numeric"
          placeholderTextColor={Colors.textMuted}
          value={form.costoTotal}
          onChangeText={(val) => setForm({ ...form, costoTotal: val })}
        />

        <TouchableOpacity style={styles.btnCrear} onPress={handleCrear}>
          <Text style={styles.btnText}>GUARDAR CANCHA</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing.lg },
  title: { fontSize: Typography.size.xl, color: Colors.textPrimary, fontWeight: Typography.weight.bold, marginVertical: Spacing.md },
  scroll: { paddingBottom: Spacing.xxl },
  label: { color: Colors.textSecondary, marginBottom: Spacing.xs, fontWeight: Typography.weight.medium },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnCrear: {
    backgroundColor: Colors.accent,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  btnText: { color: '#FFF', fontWeight: Typography.weight.bold, fontSize: Typography.size.md }
});
