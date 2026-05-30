import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authService } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, Radius, Typography } from '../../src/theme';

export default function ChangePasswordScreen() {
  const [newPass, setNewPass]     = useState('');
  const [confirmPass, setConfirm] = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);

  const clearRequiereCambioPassword = useAuthStore((s) => s.clearRequiereCambioPassword);
  const usuario = useAuthStore((s) => s.usuario);

  const handleChange = async () => {
    if (!newPass.trim()) {
      Alert.alert('Campo requerido', 'Ingresa tu nueva contraseña.');
      return;
    }
    if (newPass.length < 6) {
      Alert.alert('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert('No coinciden', 'Las contraseñas no coinciden. Verifica e intenta nuevamente.');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(newPass);
      clearRequiereCambioPassword();
      Alert.alert(
        '✅ ¡Listo!',
        'Tu contraseña ha sido actualizada exitosamente.',
        [{ text: 'Continuar', onPress: () => router.replace('/(main)') }]
      );
    } catch (err: any) {
      const msg = err.response?.data?.mensaje ?? 'Error al cambiar la contraseña. Intenta nuevamente.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientHero} style={StyleSheet.absoluteFillObject} />
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Warning Banner */}
          <View style={styles.warningBanner}>
            <Ionicons name="warning-outline" size={20} color="#f59e0b" />
            <Text style={styles.warningText}>Por seguridad, debes cambiar tu contraseña antes de continuar.</Text>
          </View>

          {/* Icon */}
          <View style={styles.iconWrap}>
            <Ionicons name="shield-checkmark-outline" size={40} color={Colors.accent} />
          </View>

          <Text style={styles.title}>Actualiza tu contraseña</Text>
          <Text style={styles.subtitle}>
            {usuario?.nombreCompleto ? `Hola ${usuario.nombreCompleto.split(' ')[0]}, el` : 'El'} administrador ha restablecido tu clave.
            Crea una nueva contraseña para continuar.
          </Text>

          <View style={styles.card}>
            {/* New password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nueva contraseña</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={newPass}
                  onChangeText={setNewPass}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPass}
                  autoFocus
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Strength indicator */}
              {newPass.length > 0 && (
                <View style={styles.strengthRow}>
                  {[1, 2, 3, 4].map((i) => (
                    <View key={i} style={[
                      styles.strengthBar,
                      { backgroundColor: newPass.length >= i * 2 ? Colors.accent : Colors.border }
                    ]} />
                  ))}
                  <Text style={[styles.strengthLabel, { color: newPass.length >= 8 ? Colors.accent : Colors.textMuted }]}>
                    {newPass.length < 4 ? 'Débil' : newPass.length < 8 ? 'Regular' : 'Fuerte'}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={[
                styles.inputContainer,
                confirmPass.length > 0 && confirmPass !== newPass ? styles.inputError : {},
                confirmPass.length > 0 && confirmPass === newPass ? styles.inputSuccess : {},
              ]}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={confirmPass}
                  onChangeText={setConfirm}
                  placeholder="Repite la contraseña"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPass}
                />
                {confirmPass.length > 0 && (
                  <Ionicons
                    name={confirmPass === newPass ? 'checkmark-circle' : 'close-circle'}
                    size={18}
                    color={confirmPass === newPass ? Colors.accent : '#ef4444'}
                  />
                )}
              </View>
              {confirmPass.length > 0 && confirmPass !== newPass && (
                <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
              )}
            </View>

            <Button
              title="ACTUALIZAR CONTRASEÑA"
              onPress={handleChange}
              loading={loading}
              size="lg"
              variant="accent"
              style={{ marginTop: Spacing.md }}
            />

            {/* Requirements */}
            <View style={styles.requirementsBox}>
              <Text style={styles.requireTitle}>Requisitos de la contraseña:</Text>
              <Text style={[styles.requireItem, newPass.length >= 6 && styles.requireMet]}>
                {newPass.length >= 6 ? '✓' : '○'} Al menos 6 caracteres
              </Text>
              <Text style={[styles.requireItem, newPass === confirmPass && confirmPass.length > 0 && styles.requireMet]}>
                {newPass === confirmPass && confirmPass.length > 0 ? '✓' : '○'} Las contraseñas coinciden
              </Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg, paddingVertical: Spacing.xxl },
  circle1: {
    position: 'absolute', top: -80, right: -80,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: Colors.primaryLight, opacity: 0.12,
  },
  circle2: {
    position: 'absolute', bottom: -60, left: -60,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.accent, opacity: 0.08,
  },
  warningBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f59e0b22',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#f59e0b44',
  },
  warningText: {
    flex: 1, fontSize: Typography.size.sm,
    color: '#f59e0b', lineHeight: 18,
  },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.surface + 'CC',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md, height: 52,
  },
  inputError: { borderColor: '#ef4444' },
  inputSuccess: { borderColor: Colors.accent + '88' },
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base },
  eyeBtn: { padding: 4 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  strengthBar: { height: 4, flex: 1, borderRadius: 2 },
  strengthLabel: { fontSize: 11, marginLeft: 4 },
  errorText: { fontSize: 11, color: '#ef4444', marginTop: 4 },
  requirementsBox: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  requireTitle: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginBottom: 6,
    fontWeight: Typography.weight.medium,
  },
  requireItem: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginBottom: 3,
  },
  requireMet: { color: Colors.accent },
});
