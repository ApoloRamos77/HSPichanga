import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Platform, ActivityIndicator, Keyboard
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, API_BASE_URL } from '../../../src/services/api';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Spacing, Typography } from '../../../src/theme';
import * as signalR from '@microsoft/signalr';

// Altura fija del input bar (header del input)
const INPUT_BAR_HEIGHT = 62;

export default function ChatScreen() {
  const { id: partidoId } = useLocalSearchParams<{ id: string }>();
  const usuario = useAuthStore((s) => s.usuario);
  const [mensaje, setMensaje] = useState('');
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  // ─── Seguimiento del teclado ─────────────────────────────────────────────
  // Usamos keyboardDidShow/Hide para Android y keyboardWillShow/Hide para iOS
  // Esto posiciona el input exactamente sobre el teclado (estilo WhatsApp)
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      // En Android Edge-to-Edge, el endCoordinates.height es la altura total del teclado
      // incluyendo la barra de sugerencias. Añadimos el inset.bottom para compensar
      // la barra de navegación del sistema que no se incluye en el reporte del teclado.
      const kbHeight = e.endCoordinates.height + (Platform.OS === 'android' ? insets.bottom : 0);
      setKeyboardOffset(kbHeight);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom]);

  // ─── SignalR ──────────────────────────────────────────────────────────────
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
      .catch(err => console.error('SignalR error:', err));

    connection.on('ReceiveMessage', (newMessage) => {
      queryClient.setQueryData(['chat', partidoId], (old: any) => {
        if (!old) return [newMessage];
        if (old.some((m: any) => m.id === newMessage.id)) return old;
        return [...old, newMessage];
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
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  // El input flota sobre el teclado con posición absoluta.
  // bottom = keyboardOffset cuando el teclado está abierto, o insets.bottom cuando está cerrado.
  const inputBottom = keyboardOffset > 0 ? keyboardOffset : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat de la Pichanga</Text>
      </View>

      {/* Lista de mensajes — tiene paddingBottom para no quedar tapada por el input */}
      <FlatList
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: INPUT_BAR_HEIGHT + inputBottom + 8 },
        ]}
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

      {/* Input — posición ABSOLUTA sobre el teclado, igual que WhatsApp/Telegram */}
      <View style={[styles.inputContainer, { bottom: inputBottom }]}>
        <TextInput
          style={styles.input}
          value={mensaje}
          onChangeText={setMensaje}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={() => {
            if (mensaje.trim() === '' || mutation.isPending) return;
            mutation.mutate();
          }}
          style={[styles.sendBtn, mensaje.trim() === '' && { opacity: 0.4 }]}
          disabled={mensaje.trim() === ''}
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backBtn: { padding: 4, marginRight: 12 },
  headerTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },

  list: { padding: 12, gap: 10 },

  msgWrapper: { maxWidth: '82%', marginBottom: 2 },
  myMsgWrapper: { alignSelf: 'flex-end' },
  otherMsgWrapper: { alignSelf: 'flex-start' },
  senderName: { fontSize: 10, color: Colors.textMuted, marginLeft: 10, marginBottom: 2 },

  bubble: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
  myBubble: { backgroundColor: Colors.accent, borderBottomRightRadius: 4 },
  otherBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  msgText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  timeText: { fontSize: 9, color: Colors.textMuted, alignSelf: 'flex-end', marginTop: 3 },

  // ── Input flotante (posición absoluta) ────────────────────────────────────
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
    minHeight: INPUT_BAR_HEIGHT,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: Colors.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 14,
    lineHeight: 20,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});
