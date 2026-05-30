import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { authService } from '../../src/services/api';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, Radius, Typography } from '../../src/theme';

export default function ResetPasswordScreen() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail]           = useState(emailParam ?? '');
  const [token, setToken]           = useState('');
  const [newPass, setNewPass]       = useState('');
  const [confirmPass, setConfirm]   = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);

  const handleReset = async () => {
    if (!email.trim() || !token.trim() || !newPass.trim()) {
      Alert.alert('Campos requeridos', 'Completa todos los campos.');
      return;
    }
    if (newPass.length < 6) {
      Alert.alert('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert('Las contraseñas no coinciden', 'Verifica que ambas contraseñas sean iguales.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(email.trim().toLowerCase(), token.trim().toUpperCase(), newPass);
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.mensaje ?? 'Código inválido o expirado. Solicita uno nuevo.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={Colors.gradientHero} style={StyleSheet.absoluteFillObject} />
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={72} color={Colors.accent} />
          </View>
          <Text style={styles.successTitle}>¡Contraseña actualizada!</Text>
          <Text style={styles.successDesc}>
            Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva clave.
          </Text>
          <Button
            title="IR AL INICIO DE SESIÓN"
            onPress={() => router.replace('/(auth)/login')}
            size="lg"
            variant="accent"
            style={{ marginTop: Spacing.xl }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientHero} style={StyleSheet.absoluteFillObject} />
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.iconWrap}>
            <Ionicons name="key-outline" size={40} color={Colors.accent} />
          </View>
          <Text style={styles.title}>Restablecer Contraseña</Text>
          <Text style={styles.subtitle}>Ingresa el código que recibiste en tu correo y tu nueva contraseña.</Text>

          <View style={styles.card}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@correo.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Token */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Código de recuperación</Text>
              <View style={[styles.inputContainer, styles.tokenContainer]}>
                <Ionicons name="shield-checkmark-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.tokenInput]}
                  value={token}
                  onChangeText={(v) => setToken(v.toUpperCase())}
                  placeholder="XXXXXXXX"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="characters"
                  maxLength={8}
                />
              </View>
              <Text style={styles.hint}>El código tiene 8 caracteres y fue enviado a tu correo.</Text>
            </View>

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
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={[styles.inputContainer, confirmPass && confirmPass !== newPass ? styles.inputError : {}]}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={confirmPass}
                  onChangeText={setConfirm}
                  placeholder="Repite la contraseña"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPass}
                />
              </View>
              {confirmPass && confirmPass !== newPass && (
                <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
              )}
            </View>

            <Button
              title="RESTABLECER CONTRASEÑA"
              onPress={handleReset}
              loading={loading}
              size="lg"
              variant="accent"
              style={{ marginTop: Spacing.sm }}
            />

            <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.backLinkText}>
                <Text style={{ color: Colors.accent }}>← </Text>
                Volver al inicio de sesión
              </Text>
            </TouchableOpacity>
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
  backBtn: { position: 'absolute', top: 0, left: 0, padding: Spacing.sm },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xl,
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
  tokenContainer: { borderColor: Colors.accent + '66' },
  tokenInput: { fontSize: 18, fontWeight: '700', letterSpacing: 4, color: Colors.accent },
  inputError: { borderColor: '#ef4444' },
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base },
  eyeBtn: { padding: 4 },
  hint: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  errorText: { fontSize: 11, color: '#ef4444', marginTop: 4 },
  backLink: { marginTop: Spacing.lg, alignItems: 'center' },
  backLinkText: { color: Colors.textSecondary, fontSize: Typography.size.sm },
  // Success state
  successWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: Spacing.xl,
  },
  successIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
