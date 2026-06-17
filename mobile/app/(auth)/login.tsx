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
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    if (!identificador.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa tu correo o celular y contraseña.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.login({ identificador: identificador.trim(), password });
      await setAuth(data.token, data.usuario);

      // Si el admin reseteó la clave, redirigir a cambio obligatorio
      if (data.usuario.requiereCambioPassword) {
        router.replace('/(auth)/change-password');
      } else {
        router.replace('/(main)');
      }
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
            <Text style={styles.brandName}>ChapatuCancha</Text>
            <Text style={styles.tagline}>Fútbol · Vóley · Mixto  ·  Pichangas Deportivas</Text>
          </View>

          {/* Card glassmorphism */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar Sesión</Text>

            {/* Tabs para seleccionar método */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: Spacing.md }}>
              <TouchableOpacity
                onPress={() => { setLoginType('email'); setIdentificador(''); }}
                style={[
                  styles.tabBtn,
                  loginType === 'email' ? styles.tabBtnActive : {}
                ]}
              >
                <Text style={[styles.tabText, loginType === 'email' ? styles.tabTextActive : {}]}>Con Correo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setLoginType('phone'); setIdentificador('+51 '); }}
                style={[
                  styles.tabBtn,
                  loginType === 'phone' ? styles.tabBtnActive : {}
                ]}
              >
                <Text style={[styles.tabText, loginType === 'phone' ? styles.tabTextActive : {}]}>Con Celular</Text>
              </TouchableOpacity>
            </View>

            {/* Email o Celular */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{loginType === 'email' ? 'Correo Electrónico' : 'Teléfono Celular'}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name={loginType === 'email' ? 'mail-outline' : 'call-outline'} size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={identificador}
                  onChangeText={setIdentificador}
                  placeholder={loginType === 'email' ? "tu@correo.com" : "+51 999000000"}
                  placeholderTextColor={Colors.textMuted}
                  keyboardType={loginType === 'email' ? 'email-address' : 'phone-pad'}
                  autoCapitalize="none"
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

            {/* Olvidé contraseña */}
            <TouchableOpacity
              style={styles.forgotLink}
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

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

          <Text style={styles.footer}>ChapatuCancha v1.0  ·  ADHSOFT SPORT © 2026</Text>
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
  tabBtn: {
    flex: 1, paddingVertical: 10, borderRadius: Radius.md,
    backgroundColor: Colors.background, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  tabBtnActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.accent,
  },
  tabText: {
    fontSize: Typography.size.sm, color: Colors.textMuted, fontWeight: Typography.weight.medium,
  },
  tabTextActive: {
    color: Colors.accent, fontWeight: Typography.weight.bold,
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
  forgotLink: { alignItems: 'flex-end', marginTop: -4, marginBottom: Spacing.sm },
  forgotText: {
    fontSize: Typography.size.sm,
    color: Colors.accent,
    fontWeight: Typography.weight.medium,
  },
  registerLink: { marginTop: Spacing.lg, alignItems: 'center' },
  registerText: { color: Colors.textSecondary, fontSize: Typography.size.sm },
  footer: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    marginTop: Spacing.xl,
  },
});
