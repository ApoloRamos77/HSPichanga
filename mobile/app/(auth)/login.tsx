import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authService } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, Radius, Typography } from '../../src/theme';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa tu email y contraseña.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.login({ email: email.trim(), password });
      await setAuth(data.token, data.usuario);
      router.replace('/(main)');
    } catch (err: any) {
      const msg = err.response?.data?.mensaje ?? 'Error de conexión. Verifica tu red.';
      Alert.alert('Error al iniciar sesión', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fondo degradado */}
      <LinearGradient
        colors={Colors.gradientHero}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Círculos decorativos */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Logo / Marca */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/icon.png')} 
                style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden' }}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.brandName}>ADHSOFT SPORT</Text>
            <Text style={styles.tagline}>Reserva tu cancha · Únete a la pichanga</Text>
          </View>

          {/* Card glassmorphism */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar Sesión</Text>

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
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPass}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPass ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="INGRESAR"
              onPress={handleLogin}
              loading={loading}
              size="lg"
              variant="accent"
              style={{ marginTop: Spacing.sm }}
            />

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => router.push('/(auth)/registro')}
            >
              <Text style={styles.registerText}>
                ¿No tienes cuenta?{' '}
                <Text style={{ color: Colors.accent, fontWeight: Typography.weight.bold }}>
                  Regístrate aquí
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>HSPichanga v1.0  ·  ADHSOFT SPORT © 2026</Text>
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
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: Colors.primaryLight,
    opacity: 0.15,
  },
  circle2: {
    position: 'absolute', bottom: -60, left: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.accent,
    opacity: 0.08,
  },
  logoSection: { alignItems: 'center', marginBottom: Spacing.xl },
  logoContainer: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  brandName: {
    fontSize: Typography.size.xl,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.black,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.surface + 'CC',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.bold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  inputGroup: { marginBottom: Spacing.md },
  label: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
  },
  eyeBtn: { padding: 4 },
  registerLink: { marginTop: Spacing.lg, alignItems: 'center' },
  registerText: { color: Colors.textSecondary, fontSize: Typography.size.sm },
  footer: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    marginTop: Spacing.xl,
  },
});
