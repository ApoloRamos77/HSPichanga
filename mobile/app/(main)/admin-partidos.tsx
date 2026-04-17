import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../src/theme';
import { canchasService, partidosService, CanchaAdminDto, PartidoAdminDto } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';

export default function AdminPartidosScreen() {
  const usuario = useAuthStore((s) => s.usuario);
  const [tab, setTab] = useState<'PROGRAMAR' | 'AMISTOSOS'>('AMISTOSOS');
  
  // Tab Amistosos
  const [partidos, setPartidos] = useState<PartidoAdminDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPartido, setSelectedPartido] = useState<PartidoAdminDto | null>(null);
  const [modalReprogramarVisible, setModalReprogramarVisible] = useState(false);
  
  // Reprogramación state
  const [repDate, setRepDate] = useState(new Date());
  const [repTime, setRepTime] = useState(new Date());
  const [repNotas, setRepNotas] = useState('');
  const [repEstado, setRepEstado] = useState<number>(1);
  const [showRepDatePicker, setShowRepDatePicker] = useState(false);
  const [showRepTimePicker, setShowRepTimePicker] = useState(false);

  // Tab Programar
  const [canchas, setCanchas] = useState<CanchaAdminDto[]>([]);
  const [canchaId, setCanchaId] = useState('');
  
  const [newDate, setNewDate] = useState(new Date(new Date().getTime() + 86400000)); // Mañana
  const [newTime, setNewTime] = useState(new Date(new Date().setHours(20, 0, 0, 0))); // 20:00
  const [showNewDatePicker, setShowNewDatePicker] = useState(false);
  const [showNewTimePicker, setShowNewTimePicker] = useState(false);
  const [notas, setNotas] = useState('Amistoso oficial ADHSOFT SPORT');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const pRes = await partidosService.getAllAdmin(3); // 3 = Amistoso
      setPartidos(pRes.data);
      const cRes = await canchasService.getAllAdmin();
      const activas = cRes.data.filter(c => c.activo);
      setCanchas(activas);
      if (activas.length > 0 && !canchaId) setCanchaId(activas[0].id);
    } catch (e) {
      console.log('Error admin data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async () => {
    try {
      if (!canchaId) {
          Alert.alert("Aviso", "Aún no has registrado ninguna cancha maestra.");
          return;
      }
      
      const combinedDate = new Date(
        newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),
        newTime.getHours(), newTime.getMinutes(), 0
      );

      await partidosService.crearPartido({
        canchaId: canchaId,
        horarioId: null, // backend will accept null now
        organizadorId: usuario?.id as string,
        fechaHora: combinedDate.toISOString(),
        tipoPartido: 3, // Amistoso
        categoria: 1, // AdultosLibre
        notas: notas
      });

      Alert.alert('Éxito', '¡Amistoso programado y publicado!');
      setTab('AMISTOSOS');
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.mensaje || 'No se pudo programar el partido.');
    }
  };

  const getEstadoNumber = (estado: string) => {
    if(estado === 'Cancelado') return 3;
    if(estado === 'Finalizado') return 4;
    return 1; // Abierto por defecto
  };

  const openReprogramar = (p: PartidoAdminDto) => {
    setSelectedPartido(p);
    const existingDate = new Date(p.fechaReprogramada || p.fechaHora);
    setRepDate(existingDate);
    setRepTime(existingDate);
    setRepNotas(p.notas || '');
    setRepEstado(getEstadoNumber(p.estado));
    setModalReprogramarVisible(true);
  };

  const handleReprogramar = async () => {
    if (!selectedPartido) return;
    try {
      const combinedDate = new Date(
        repDate.getFullYear(), repDate.getMonth(), repDate.getDate(),
        repTime.getHours(), repTime.getMinutes(), 0
      );

      // Reprogramar fecha
      await partidosService.reprogramar(selectedPartido.id, combinedDate.toISOString(), repNotas);
      
      // Actualizar estado si fué modificado (o siempre)
      await partidosService.cambiarEstado(selectedPartido.id, repEstado);

      Alert.alert('Éxito', 'Partido actualizado correctamente');
      setModalReprogramarVisible(false);
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.mensaje || 'Error al actualizar');
    }
  };

  const handleCambiarEstado = async (id: string, nuevoEstado: number) => {
    try {
      await partidosService.cambiarEstado(id, nuevoEstado);
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.mensaje || 'Error al cambiar estado');
    }
  };

  const promptCambiarEstado = (p: PartidoAdminDto) => {
    Alert.alert(
      "Cambiar Estado",
      "Selecciona el nuevo estado para este partido:",
      [
        { text: "Abierto", onPress: () => handleCambiarEstado(p.id, 1) },
        { text: "Cancelado", onPress: () => handleCambiarEstado(p.id, 3), style: "destructive" },
        { text: "Finalizado", onPress: () => handleCambiarEstado(p.id, 4) },
        { text: "Cerrar", style: "cancel" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Gestión de Amistosos</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, tab === 'AMISTOSOS' && styles.tabActive]} 
          onPress={() => setTab('AMISTOSOS')}
        >
          <Text style={[styles.tabText, tab === 'AMISTOSOS' && styles.tabTextActive]}>Amistosos Prog.</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, tab === 'PROGRAMAR' && styles.tabActive]} 
          onPress={() => setTab('PROGRAMAR')}
        >
          <Text style={[styles.tabText, tab === 'PROGRAMAR' && styles.tabTextActive]}>Programar Nuevo</Text>
        </TouchableOpacity>
      </View>

      {tab === 'AMISTOSOS' ? (
        <FlatList
          data={partidos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={loadData}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.canchaNombre} - {item.zonaNombre}</Text>
                <View style={[styles.badge, { backgroundColor: Colors.estadoColors[item.estado] }]}>
                  <Text style={styles.badgeText}>{item.estado}</Text>
                </View>
              </View>
              <Text style={styles.cardDetail}>📅 {new Date(item.fechaReprogramada || item.fechaHora).toLocaleString()}</Text>
              {item.notas && <Text style={styles.cardDetail}>📝 {item.notas}</Text>}
              
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => openReprogramar(item)}>
                  <Ionicons name="calendar" size={16} color={Colors.textPrimary} />
                  <Text style={styles.actionText}> Reprogramar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { borderColor: Colors.borderLight }]} onPress={() => promptCambiarEstado(item)}>
                  <Ionicons name="analytics" size={16} color={Colors.textPrimary} />
                  <Text style={styles.actionText}> Estado</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{color: Colors.textMuted, textAlign: 'center', marginTop: 20}}>No hay amistosos programados.</Text>}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Seleccionar Cancha Base</Text>
          <ScrollView horizontal style={styles.canchaScroller} showsHorizontalScrollIndicator={false}>
              {canchas.map(c => (
                  <TouchableOpacity 
                      key={c.id} 
                      style={[styles.canchaChip, canchaId === c.id && styles.canchaChipSelect]}
                      onPress={() => setCanchaId(c.id)}>
                      <Text style={{color: canchaId === c.id ? '#FFF' : Colors.textSecondary}}>{c.nombre}</Text>
                  </TouchableOpacity>
              ))}
          </ScrollView>

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: Spacing.sm}}>
              <Text style={styles.label}>Fecha</Text>
              <TouchableOpacity style={styles.inputPicker} onPress={() => setShowNewDatePicker(true)}>
                <Text style={{color: Colors.textPrimary}}>{newDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showNewDatePicker && (
                <DateTimePicker
                  value={newDate}
                  mode="date"
                  onChange={(event, selectedDate) => {
                    setShowNewDatePicker(false);
                    if (selectedDate) setNewDate(selectedDate);
                  }}
                />
              )}
            </View>
            <View style={{flex: 1, marginLeft: Spacing.sm}}>
              <Text style={styles.label}>Hora</Text>
              <TouchableOpacity style={styles.inputPicker} onPress={() => setShowNewTimePicker(true)}>
                <Text style={{color: Colors.textPrimary}}>{newTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
              </TouchableOpacity>
              {showNewTimePicker && (
                <DateTimePicker
                  value={newTime}
                  mode="time"
                  onChange={(event, selectedDate) => {
                    setShowNewTimePicker(false);
                    if (selectedDate) setNewTime(selectedDate);
                  }}
                />
              )}
            </View>
          </View>

          <Text style={styles.label}>Notas adicionales</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Equipos con camiseta y canilleras..."
            placeholderTextColor={Colors.textMuted}
            multiline
            value={notas}
            onChangeText={setNotas}
          />

          <TouchableOpacity style={styles.btnCrear} onPress={handleCrear}>
            <Text style={styles.btnText}>PROGRAMAR AMISTOSO</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Modal Reprogramar */}
      <Modal visible={modalReprogramarVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reprogramar Partido</Text>
            
            <View style={styles.row}>
              <View style={{flex: 1, marginRight: Spacing.sm}}>
                <Text style={styles.label}>Nueva Fecha</Text>
                <TouchableOpacity style={styles.inputPicker} onPress={() => setShowRepDatePicker(true)}>
                  <Text style={{color: Colors.textPrimary}}>{repDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showRepDatePicker && (
                  <DateTimePicker
                    value={repDate}
                    mode="date"
                    onChange={(event, selectedDate) => {
                      setShowRepDatePicker(false);
                      if (selectedDate) setRepDate(selectedDate);
                    }}
                  />
                )}
              </View>
              <View style={{flex: 1, marginLeft: Spacing.sm}}>
                <Text style={styles.label}>Nueva Hora</Text>
                <TouchableOpacity style={styles.inputPicker} onPress={() => setShowRepTimePicker(true)}>
                  <Text style={{color: Colors.textPrimary}}>{repTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                </TouchableOpacity>
                {showRepTimePicker && (
                  <DateTimePicker
                    value={repTime}
                    mode="time"
                    onChange={(event, selectedDate) => {
                      setShowRepTimePicker(false);
                      if (selectedDate) setRepTime(selectedDate);
                    }}
                  />
                )}
              </View>
            </View>

            <Text style={styles.label}>Notas</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              multiline
              value={repNotas}
              onChangeText={setRepNotas}
            />

            <Text style={styles.label}>Estado del Partido</Text>
            <View style={styles.stateSelector}>
              {[
                { label: 'Abierto', value: 1 },
                { label: 'Cancelado', value: 3 },
                { label: 'Finalizado', value: 4 }
              ].map(state => (
                <TouchableOpacity 
                  key={state.value}
                  style={[styles.stateBtn, repEstado === state.value && styles.stateBtnActive]}
                  onPress={() => setRepEstado(state.value)}
                >
                  <Text style={[styles.stateText, repEstado === state.value && styles.stateTextActive]}>{state.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.row, {marginTop: Spacing.xl}]}>
              <TouchableOpacity style={[styles.modalBtn, {backgroundColor: Colors.surfaceHover}]} onPress={() => setModalReprogramarVisible(false)}>
                <Text style={{color: Colors.textPrimary}}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, {backgroundColor: Colors.accent}]} onPress={handleReprogramar}>
                <Text style={{color: '#FFF', fontWeight: 'bold'}}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { marginRight: Spacing.md },
  title: { fontSize: Typography.size.lg, color: Colors.textPrimary, fontWeight: Typography.weight.bold },
  
  tabsContainer: { flexDirection: 'row', backgroundColor: Colors.surface, paddingBottom: 0 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.primaryLight },
  tabText: { color: Colors.textSecondary, fontWeight: Typography.weight.medium },
  tabTextActive: { color: Colors.primaryLight, fontWeight: Typography.weight.bold },

  listContainer: { padding: Spacing.md },
  card: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadows.card },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  cardTitle: { fontSize: Typography.size.base, color: Colors.textPrimary, fontWeight: 'bold', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  badgeText: { color: '#FFF', fontSize: Typography.size.xs, fontWeight: 'bold' },
  cardDetail: { color: Colors.textSecondary, marginBottom: 4, fontSize: Typography.size.sm },
  cardActions: { flexDirection: 'row', marginTop: Spacing.md, gap: Spacing.sm },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm },
  actionText: { color: Colors.textPrimary, fontSize: Typography.size.xs, fontWeight: 'bold' },

  formContainer: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: Colors.textSecondary, marginBottom: Spacing.xs, fontWeight: Typography.weight.medium, marginTop: Spacing.sm },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputPicker: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center'
  },
  canchaScroller: { flexDirection: 'row', marginVertical: Spacing.sm },
  canchaChip: { padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, marginRight: Spacing.sm, backgroundColor: Colors.surface },
  canchaChipSelect: { backgroundColor: Colors.primary, borderColor: Colors.primaryLight },
  btnCrear: {
    backgroundColor: Colors.accent,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
    ...Shadows.button
  },
  btnText: { color: '#FFF', fontWeight: Typography.weight.bold, fontSize: Typography.size.md },

  stateSelector: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: 4, marginTop: Spacing.xs, marginBottom: Spacing.sm },
  stateBtn: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: Radius.sm },
  stateBtnActive: { backgroundColor: Colors.primaryLight },
  stateText: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontWeight: Typography.weight.medium },
  stateTextActive: { color: '#FFF', fontWeight: Typography.weight.bold },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: Spacing.lg },
  modalContent: { backgroundColor: Colors.background, borderRadius: Radius.lg, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.borderLight },
  modalTitle: { fontSize: Typography.size.lg, color: Colors.textPrimary, fontWeight: 'bold', marginBottom: Spacing.md },
  modalBtn: { flex: 1, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center', marginHorizontal: Spacing.xs }
});
