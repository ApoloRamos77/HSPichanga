import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity, TextInput,
  ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingsService } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Button } from './Button';

interface Props {
  visible: boolean;
  onClose: () => void;
  canchaId: string;
}

export const RatingModal = ({ visible, onClose, canchaId }: Props) => {
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const usuario = useAuthStore((s) => s.usuario);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => ratingsService.create(canchaId, usuario!.id, puntuacion, comentario),
    onSuccess: () => {
      Alert.alert('¡Gracias!', 'Tu valoración ha sido registrada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['ratings', canchaId] });
      onClose();
      setPuntuacion(5);
      setComentario('');
    },
    onError: () => {
      Alert.alert('Error', 'No se pudo registrar la valoración.');
    }
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Calificar Cancha</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>¿Qué tal te pareció esta sede?</Text>
          
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setPuntuacion(star)}>
                <Ionicons 
                  name={star <= puntuacion ? 'star' : 'star-outline'} 
                  size={42} 
                  color={star <= puntuacion ? Colors.accent : Colors.textMuted} 
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Déjanos un comentario (opcional)..."
            placeholderTextColor={Colors.textMuted}
            value={comentario}
            onChangeText={setComentario}
          />

          <Button
            title="ENVIAR VALORACIÓN"
            onPress={() => mutation.mutate()}
            loading={mutation.isPending}
            variant="accent"
            size="lg"
            style={{ width: '100%' }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  content: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.xl, gap: Spacing.lg
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: Typography.size.lg, fontWeight: Typography.weight.bold, color: Colors.textPrimary },
  label: { fontSize: Typography.size.md, color: Colors.textSecondary, textAlign: 'center' },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: Spacing.md },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md, padding: Spacing.md,
    color: Colors.textPrimary, textAlignVertical: 'top',
    borderWidth: 1, borderColor: Colors.border,
    minHeight: 100
  }
});
