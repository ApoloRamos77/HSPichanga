import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authService } from '../../src/services/api';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, Radius, Typography } from '../../src/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Campo requerido', 'Ingresa tu correo electrónico.');
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch {
      // Por seguridad siempre mostramos el mismo mensaje
      setSent(true);
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

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="lock-open-outline" size={48} color={Colors.accent} />
          </View>

          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.
          </Text>

          <View style={styles.card}>
            {!sent ? (
              <>
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
                      autoComplete="email"
                    />
                  </View>
                </View>

                <Button
                  title="ENVIAR CÓDIGO"
                  onPress={handleSend}
                  loading={loading}
                  size="lg"
                  variant="accent"
                  style={{ marginTop: Spacing.sm }}
                />
              </>
            ) : (
              /* Estado: email enviado */
              <View style={styles.sentContainer}>
                <View style={styles.sentIconWrap}>
                  <Ionicons name="checkmark-circle" size={56} color={Colors.accent} />
                </View>
                <Text style={styles.sentTitle}>¡Código enviado!</Text>
                <Text style={styles.sentDesc}>
                  Si tu correo está registrado, recibirás un mensaje con el código de recuperación.
                  Revisa también la carpeta de spam.
                </Text>
                <Button
                  title="INGRESAR CÓDIGO"
                  onPress={() => router.push({ pathname: '/(auth)/reset-password', params: { email } })}
                  size="lg"
                  variant="accent"
                  style={{ marginTop: Spacing.lg }}
                />
              </View>
            )}

            <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
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
  backBtn: {
    position: 'absolute', top: 0, left: 0,
    padding: Spacing.sm,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignSelf: 'center',
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
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base },
  sentContainer: { alignItems: 'center' },
  sentIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.accent + '22',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  sentTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sentDesc: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  backLink: { marginTop: Spacing.lg, alignItems: 'center' },
  backLinkText: { color: Colors.textSecondary, fontSize: Typography.size.sm },
});
