import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, API_BASE_URL } from '../../../src/services/api';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Spacing, Radius, Typography } from '../../../src/theme';
import * as signalR from '@microsoft/signalr';

export default function ChatScreen() {
  const { id: partidoId } = useLocalSearchParams<{ id: string }>();
  const usuario = useAuthStore((s) => s.usuario);
  const [mensaje, setMensaje] = useState('');
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const { data: mensajes, isLoading } = useQuery({
    queryKey: ['chat', partidoId],
    queryFn: () => chatService.getMessages(partidoId!).then(r => r.data),
  });

  useEffect(() => {
    if (!partidoId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(API_BASE_URL.replace('/api', '/chathub'))
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => connection.invoke('JoinMatchGroup', partidoId))
      .catch(err => console.error('SignalR start error:', err));

    connection.on('ReceiveMessage', (newMessage) => {
      queryClient.setQueryData(['chat', partidoId], (oldData: any) => {
        if (!oldData) return [newMessage];
        if (oldData.some((m: any) => m.id === newMessage.id)) return oldData;
        return [...oldData, newMessage];
      });
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke('LeaveMatchGroup', partidoId).catch(console.error);
        connection.stop();
      }
    };
  }, [partidoId]);

  const mutation = useMutation({
    mutationFn: () => chatService.sendMessage(partidoId!, usuario!.id, mensaje),
    onSuccess: () => {
      setMensaje('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  });

  const handleSend = () => {
    if (mensaje.trim() === '' || mutation.isPending) return;
    mutation.mutate();
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    // Usamos un View en lugar de SafeAreaView para manejar insets manualmente
    // Esto es necesario porque edgeToEdgeEnabled en Android requiere control preciso
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat de la Pichanga</Text>
      </View>

      {/* Área principal: lista + input. KeyboardAvoidingView empuja el input hacia arriba */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={mensajes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
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

        {/* Caja de entrada con paddingBottom según insets del sistema (barra de navegación) */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backBtn: { padding: 4, marginRight: 12 },
  headerTitle: { fontSize: Typography.size.md, fontWeight: Typography.weight.bold, color: Colors.textPrimary },
  list: { padding: Spacing.md, gap: 12, flexGrow: 1, justifyContent: 'flex-end' },
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
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 12, paddingTop: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border, gap: 8,
  },
  input: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: Colors.background, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8,
    color: Colors.textPrimary, borderWidth: 1,
    borderColor: Colors.border, fontSize: 14,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center',
  },
});
