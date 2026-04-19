import React, { useRef, useEffect } from 'react';
import { PanResponder, View, StyleSheet } from 'react-native';
import { useAuthStore } from '../stores/authStore';

const INACTIVITY_TIMEOUT = 60000; // 60 segundos

export const InactivityTracker = ({ children }: { children: React.ReactNode }) => {
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const timer = useRef<any>(null);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    
    // Solo activamos el temporizador si el usuario está autenticado
    if (isAuthenticated) {
      timer.current = setTimeout(() => {
        console.log('Inactividad detectada: Cerrando sesión');
        logout();
      }, INACTIVITY_TIMEOUT);
    }
  };

  // Reiniciar el temporizador cuando cambia el estado de autenticación
  useEffect(() => {
    if (isAuthenticated) {
      resetTimer();
    } else {
      if (timer.current) clearTimeout(timer.current);
    }
    
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isAuthenticated]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => {
        resetTimer();
        return false;
      },
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
