import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../../src/services/api';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Spacing, Radius, Typography } from '../../../src/theme';

export default function ChatScreen() {
  const { id: partidoId } = useLocalSearchParams<{ id: string }>();
  const usuario = useAuthStore((s) => s.usuario);
  const [mensaje, setMensaje] = useState('');
  const queryClient = useQueryClient();

  const { data: mensajes, isLoading } = useQuery({
    queryKey: ['chat', partidoId],
    queryFn: () => chatService.getMessages(partidoId!).then(r => r.data),
    refetchInterval: 3000, // Polling cada 3s para simular tiempo real
  });

  const mutation = useMutation({
    mutationFn: () => chatService.sendMessage(partidoId!, usuario!.id, mensaje),
    onSuccess: () => {
      setMensaje('');
      queryClient.invalidateQueries({ queryKey: ['chat', partidoId] });
    }
  });

  const handleSend = () => {
    if (mensaje.trim() === '' || mutation.isPending) return;
    mutation.mutate();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat de la Pichanga</Text>
      </View>

      <FlatList
        data={mensajes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isMe = item.usuarioId === usuario?.id;
          return (
            <View style={[styles.msgWrapper, isMe ? styles.myMsgWrapper : styles.otherMsgWrapper]}>
              {!isMe && <Text style={styles.senderName}>{item.usuarioNombre}</Text>}
              <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                <Text style={[styles.msgText, isMe && { color: '#fff' }]}>{item.contenido}</Text>
                <Text style={[styles.timeText, isMe && { color: '#ffffff88' }]}>
                  {new Date(item.fechaEnvio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={mensaje}
            onChangeText={setMensaje}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={Colors.textMuted}
            multiline
          />
          <TouchableOpacity 
            onPress={handleSend} 
            style={[styles.sendBtn, mensaje.trim() === '' && { opacity: 0.5 }]}
            disabled={mensaje.trim() === ''}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.surface
  },
  backBtn: { padding: 4, marginRight: 12 },
  headerTitle: { fontSize: Typography.size.md, fontWeight: Typography.weight.bold, color: Colors.textPrimary },
  list: { padding: Spacing.md, gap: 12 },
  msgWrapper: { maxWidth: '80%', marginBottom: 4 },
  myMsgWrapper: { alignSelf: 'flex-end' },
  otherMsgWrapper: { alignSelf: 'flex-start' },
  senderName: { fontSize: 10, color: Colors.textMuted, marginLeft: 8, marginBottom: 2 },
  bubble: { padding: 10, borderRadius: 16 },
  myBubble: { backgroundColor: Colors.accent, borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: Colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.border },
  msgText: { fontSize: 14, color: Colors.textPrimary },
  timeText: { fontSize: 9, color: Colors.textMuted, alignSelf: 'flex-end', marginTop: 4 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 12,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, gap: 8
  },
  input: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: Colors.background, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.border
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center'
  }
});
