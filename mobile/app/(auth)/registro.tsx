import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authService } from '../../src/services/api';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, Radius, Typography } from '../../src/theme';

export default function RegistroScreen() {
  const [form, setForm] = useState({
    nombreCompleto: '', email: '', telefono: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleRegistro = async () => {
    if (!form.nombreCompleto || !form.email || !form.telefono || !form.password) {
      Alert.alert('Campos requeridos', 'Completa todos los campos.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await authService.registro({
        nombreCompleto: form.nombreCompleto,
        email: form.email,
        password: form.password,
        telefono: form.telefono,
      });
      Alert.alert(
        '¡Registro exitoso! 🎉',
        'Tu cuenta fue creada. Inicia sesión para continuar.',
        [{ text: 'Ingresar', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (err: any) {
      const msg = err.response?.data?.mensaje ?? 'Error al registrarse.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradientHero} style={StyleSheet.absoluteFillObject} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Ionicons name="person-add" size={40} color={Colors.accent} />
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Únete a la comunidad HSPichanga</Text>
          </View>

          <View style={styles.card}>
            {[
              { label: 'Nombre completo', field: 'nombreCompleto', icon: 'person-outline', placeholder: 'Juan Pérez', type: 'default' },
              { label: 'Correo electrónico', field: 'email', icon: 'mail-outline', placeholder: 'juan@correo.com', type: 'email-address' },
              { label: 'Teléfono', field: 'telefono', icon: 'call-outline', placeholder: '+51 999 000 000', type: 'phone-pad' },
              { label: 'Contraseña', field: 'password', icon: 'lock-closed-outline', placeholder: '••••••••', secure: true, type: 'default' },
              { label: 'Confirmar contraseña', field: 'confirmPassword', icon: 'shield-checkmark-outline', placeholder: '••••••••', secure: true, type: 'default' },
            ].map(({ label, field, icon, placeholder, secure, type }) => (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name={icon as any} size={18} color={Colors.textMuted} style={{ marginRight: Spacing.sm }} />
                  <TextInput
                    style={styles.input}
                    value={(form as any)[field]}
                    onChangeText={update(field as any)}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={secure}
                    keyboardType={type as any}
                    autoCapitalize={type === 'email-address' ? 'none' : 'words'}
                  />
                </View>
              </View>
            ))}

            <Button
              title="CREAR MI CUENTA"
              onPress={handleRegistro}
              loading={loading}
              size="lg"
              variant="accent"
              style={{ marginTop: Spacing.sm }}
            />
          </View>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={{ color: Colors.accent, fontWeight: Typography.weight.bold }}>
                Inicia sesión
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: Spacing.lg, paddingTop: Spacing.xxl },
  backBtn: { marginBottom: Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing.xl, gap: 8 },
  title: {
    fontSize: Typography.size.xl,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.black,
  },
  subtitle: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  card: {
    backgroundColor: Colors.surface + 'CC',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1, borderColor: Colors.border,
    gap: Spacing.sm,
  },
  inputGroup: { gap: 6 },
  label: { fontSize: Typography.size.sm, color: Colors.textSecondary, fontWeight: Typography.weight.medium },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, height: 52,
  },
  input: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base },
  loginLink: { marginTop: Spacing.lg, alignItems: 'center', paddingBottom: Spacing.xl },
  loginText: { color: Colors.textSecondary, fontSize: Typography.size.sm },
});
