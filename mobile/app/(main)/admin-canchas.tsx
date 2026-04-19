import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal, FlatList, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../src/theme';
import { canchasService, CanchaAdminDto } from '../../src/services/api';

// Forced UI refresh for domain fields
export default function AdminCanchasScreen() {
  const [tab, setTab] = useState<'CANCHAS' | 'NUEVA'>('CANCHAS');
  
  // Tab Canchas
  const [canchas, setCanchas] = useState<CanchaAdminDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCancha, setSelectedCancha] = useState<CanchaAdminDto | null>(null);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  
  // Edit Form State
  const [editForm, setEditForm] = useState({
    nombre: '',
    descripcion: '',
    ubicacionGoogleMaps: '',
    fotosUrlStr: '',
    direccion: '',
    tieneLuz: false,
    tieneEstacionamiento: false,
    estadoCancha: 'Activa',
    celularYape: '',
    celularPlin: ''
  });

  // Tab Nueva Cancha
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    ubicacionGoogleMaps: '',
    fotosUrlStr: '',
    direccion: '',
    zonaId: '11111111-1111-1111-1111-111111111111', // Miraflores por defecto
    tieneLuz: true,
    tieneEstacionamiento: true,
    celularYape: '',
    celularPlin: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await canchasService.getAllAdmin();
      setCanchas(res.data);
    } catch (e) {
      console.log('Error admin canchas', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async () => {
    try {
      if (!form.nombre || !form.direccion) {
          Alert.alert("Error", "Falta el nombre de la cancha o la dirección");
          return;
      }
      await canchasService.crearCancha({
        ...form,
        ubicacionGoogleMaps: form.ubicacionGoogleMaps || null,
        fotosUrls: form.fotosUrlStr ? form.fotosUrlStr.split(',').map(s=>s.trim()).filter(s=>s.length>0) : []
      });
      Alert.alert('Éxito', 'La cancha ha sido registrada.');
      setForm({ ...form, nombre: '', descripcion: '', direccion: '', ubicacionGoogleMaps: '', fotosUrlStr: '', celularYape: '', celularPlin: '' });
      setTab('CANCHAS');
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.mensaje || 'No se pudo registrar la cancha');
    }
  };

  const openEditar = (c: CanchaAdminDto) => {
    setSelectedCancha(c);
    let stString = 'Activa';
    // Mapeo inverso si llegara como int (1,2,3) o ya viniera como string.
    if(c.estadoCancha == 1 || c.estadoCancha === 'Activa') stString = 'Activa';
    if(c.estadoCancha == 2 || c.estadoCancha === 'Inactiva') stString = 'Inactiva';
    if(c.estadoCancha == 3 || c.estadoCancha === 'Anulada') stString = 'Anulada';

    setEditForm({
      nombre: c.nombre,
      descripcion: c.descripcion || '',
      ubicacionGoogleMaps: c.ubicacionGoogleMaps || '',
      fotosUrlStr: c.fotosUrls ? c.fotosUrls.join(', ') : '',
      direccion: c.direccion,
      tieneLuz: c.tieneLuz,
      tieneEstacionamiento: c.tieneEstacionamiento,
      estadoCancha: stString,
      celularYape: c.celularYape || '',
      celularPlin: c.celularPlin || ''
    });
    setModalEditVisible(true);
  };

  const mapEstadoToInt = (st: string) => {
      if(st === 'Activa') return 1;
      if(st === 'Inactiva') return 2;
      return 3; // Anulada
  };

  const handleEditar = async () => {
    if (!selectedCancha) return;
    try {
      // 1. Update details
      await canchasService.editarCancha(selectedCancha.id, {
        nombre: editForm.nombre,
        descripcion: editForm.descripcion,
        direccion: editForm.direccion,
        ubicacionGoogleMaps: editForm.ubicacionGoogleMaps || null,
        fotosUrls: editForm.fotosUrlStr ? editForm.fotosUrlStr.split(',').map(s=>s.trim()).filter(s=>s.length>0) : [],
        tieneLuz: editForm.tieneLuz,
        tieneEstacionamiento: editForm.tieneEstacionamiento,
        celularYape: editForm.celularYape,
        celularPlin: editForm.celularPlin
      });
      
      // 2. Update status if changed or just update it anyway
      await canchasService.cambiarEstado(selectedCancha.id, mapEstadoToInt(editForm.estadoCancha) as 1|2|3);

      Alert.alert('Éxito', 'Cancha actualizada correctamente');
      setModalEditVisible(false);
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.mensaje || 'Error al actualizar');
    }
  };

  const handleCambiarEstado = async (id: string, nuevoEstado: 1 | 2 | 3) => {
    try {
      await canchasService.cambiarEstado(id, nuevoEstado);
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.mensaje || 'Error al cambiar estado');
    }
  };

  const promptEstado = (c: CanchaAdminDto) => {
    Alert.alert(
      "Opciones de Cancha",
       `¿Qué deseas hacer con ${c.nombre}?`,
      [
        { text: "Activar", onPress: () => handleCambiarEstado(c.id, 1) },
        { text: "Desactivar", onPress: () => handleCambiarEstado(c.id, 2) },
        { text: "Anular (Eliminar)", onPress: () => handleCambiarEstado(c.id, 3), style: "destructive" },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Gestión de Canchas</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, tab === 'CANCHAS' && styles.tabActive]} 
          onPress={() => setTab('CANCHAS')}
        >
          <Text style={[styles.tabText, tab === 'CANCHAS' && styles.tabTextActive]}>Mis Canchas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, tab === 'NUEVA' && styles.tabActive]} 
          onPress={() => setTab('NUEVA')}
        >
          <Text style={[styles.tabText, tab === 'NUEVA' && styles.tabTextActive]}>Crear Nueva</Text>
        </TouchableOpacity>
      </View>

      {tab === 'CANCHAS' ? (
        <FlatList
          data={canchas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={loadData}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{flex: 1}}>
                  <Text style={styles.cardTitle}>{item.nombre}</Text>
                  <Text style={styles.cardDetail}>{item.zonaNombre}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: Colors.estadoCanchaColors[item.estadoCancha] }]}>
                  <Text style={styles.badgeText}>{item.estadoCancha}</Text>
                </View>
              </View>
              <Text style={styles.cardDetail}>📍 {item.direccion}</Text>
              {item.ubicacionGoogleMaps ? <Text style={styles.cardDetail}>🌐 Mapa: {item.ubicacionGoogleMaps}</Text> : null}
              {item.fotosUrls?.length > 0 ? <Text style={styles.cardDetail}>📷 {item.fotosUrls.length} Foto(s)</Text> : null}
              
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => openEditar(item)}>
                  <Ionicons name="pencil" size={16} color={Colors.textPrimary} />
                  <Text style={styles.actionText}> Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { borderColor: Colors.borderLight }]} onPress={() => promptEstado(item)}>
                  <Ionicons name="settings-outline" size={16} color={Colors.textPrimary} />
                  <Text style={styles.actionText}> Opciones</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{color: Colors.textMuted, textAlign: 'center', marginTop: 20}}>No hay canchas registradas.</Text>}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Nombre de la Cancha / Complejo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: La 10 de Miraflores"
            placeholderTextColor={Colors.textMuted}
            value={form.nombre}
            onChangeText={(val) => setForm({ ...form, nombre: val })}
          />

          <Text style={styles.label}>Dirección Exacta</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Av. Ejército 400"
            placeholderTextColor={Colors.textMuted}
            value={form.direccion}
            onChangeText={(val) => setForm({ ...form, direccion: val })}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Grass sintético renovado..."
            placeholderTextColor={Colors.textMuted}
            multiline
            value={form.descripcion}
            onChangeText={(val) => setForm({ ...form, descripcion: val })}
          />

          <Text style={styles.label}>Ubicación Google Maps (URL)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://maps.google.com/..."
            placeholderTextColor={Colors.textMuted}
            value={form.ubicacionGoogleMaps}
            onChangeText={(val) => setForm({ ...form, ubicacionGoogleMaps: val })}
          />

          <Text style={styles.label}>Fotos (URLs separadas por coma)</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="https://imagen1.jpg, https://imagen2.jpg"
            placeholderTextColor={Colors.textMuted}
            multiline
            value={form.fotosUrlStr}
            onChangeText={(val) => setForm({ ...form, fotosUrlStr: val })}
          />

          <Text style={styles.label}>Celular Yape (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="999000111"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            value={form.celularYape}
            onChangeText={(val) => setForm({ ...form, celularYape: val })}
          />

          <Text style={styles.label}>Celular Plin (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="999000111"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            value={form.celularPlin}
            onChangeText={(val) => setForm({ ...form, celularPlin: val })}
          />

          <View style={styles.switchRow}>
             <Text style={styles.label}>Tiene Luz</Text>
             <Switch 
                value={form.tieneLuz} 
                onValueChange={(val) => setForm({...form, tieneLuz: val})} 
                trackColor={{true: Colors.accent}} 
             />
          </View>
          <View style={styles.switchRow}>
             <Text style={styles.label}>Tiene Estacionamiento</Text>
             <Switch 
                value={form.tieneEstacionamiento} 
                onValueChange={(val) => setForm({...form, tieneEstacionamiento: val})} 
                trackColor={{true: Colors.accent}} 
             />
          </View>

          <TouchableOpacity style={styles.btnCrear} onPress={handleCrear}>
            <Text style={styles.btnText}>GUARDAR CANCHA</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Modal Editar */}
      <Modal visible={modalEditVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Cancha</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={editForm.nombre}
                onChangeText={(val) => setEditForm({ ...editForm, nombre: val })}
              />
              
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={styles.input}
                value={editForm.direccion}
                onChangeText={(val) => setEditForm({ ...editForm, direccion: val })}
              />

              <Text style={styles.label}>Ubicación Google Maps (URL)</Text>
              <TextInput
                style={styles.input}
                value={editForm.ubicacionGoogleMaps}
                onChangeText={(val) => setEditForm({ ...editForm, ubicacionGoogleMaps: val })}
              />
              
              <Text style={styles.label}>Fotos (URLs separadas por coma)</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                multiline
                value={editForm.fotosUrlStr}
                onChangeText={(val) => setEditForm({ ...editForm, fotosUrlStr: val })}
              />

              <Text style={styles.label}>Celular Yape</Text>
              <TextInput
                style={styles.input}
                value={editForm.celularYape}
                keyboardType="numeric"
                onChangeText={(val) => setEditForm({ ...editForm, celularYape: val })}
              />

              <Text style={styles.label}>Celular Plin</Text>
              <TextInput
                style={styles.input}
                value={editForm.celularPlin}
                keyboardType="numeric"
                onChangeText={(val) => setEditForm({ ...editForm, celularPlin: val })}
              />
              
              <View style={styles.switchRow}>
                <Text style={styles.label}>Tiene Luz</Text>
                <Switch 
                    value={editForm.tieneLuz} 
                    onValueChange={(val) => setEditForm({...editForm, tieneLuz: val})} 
                    trackColor={{true: Colors.accent}} 
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.label}>Tiene Est.</Text>
                <Switch 
                    value={editForm.tieneEstacionamiento} 
                    onValueChange={(val) => setEditForm({...editForm, tieneEstacionamiento: val})} 
                    trackColor={{true: Colors.accent}} 
                />
              </View>

              <Text style={styles.label}>Estado de la Cancha</Text>
              <View style={styles.stateSelector}>
                {[
                  { label: 'Activa', value: 'Activa' },
                  { label: 'Inactiva', value: 'Inactiva' },
                  { label: 'Anulada', value: 'Anulada' }
                ].map(state => (
                  <TouchableOpacity 
                    key={state.value}
                    style={[styles.stateBtn, editForm.estadoCancha === state.value && styles.stateBtnActive]}
                    onPress={() => setEditForm({...editForm, estadoCancha: state.value})}
                  >
                    <Text style={[styles.stateText, editForm.estadoCancha === state.value && styles.stateTextActive]}>{state.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.row, {marginTop: Spacing.xl}]}>
                <TouchableOpacity style={[styles.modalBtn, {backgroundColor: Colors.surfaceHover}]} onPress={() => setModalEditVisible(false)}>
                  <Text style={{color: Colors.textPrimary}}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, {backgroundColor: Colors.accent}]} onPress={handleEditar}>
                  <Text style={{color: '#FFF', fontWeight: 'bold'}}>Actualizar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  cardTitle: { fontSize: Typography.size.md, color: Colors.textPrimary, fontWeight: 'bold' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  badgeText: { color: '#FFF', fontSize: Typography.size.xs, fontWeight: 'bold' },
  cardDetail: { color: Colors.textSecondary, marginBottom: 4, fontSize: Typography.size.sm },
  cardActions: { flexDirection: 'row', marginTop: Spacing.md, gap: Spacing.sm },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm },
  actionText: { color: Colors.textPrimary, fontSize: Typography.size.xs, fontWeight: 'bold' },

  formContainer: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md, backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
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
  modalContent: { backgroundColor: Colors.background, borderRadius: Radius.lg, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.borderLight, maxHeight: '80%' },
  modalTitle: { fontSize: Typography.size.lg, color: Colors.textPrimary, fontWeight: 'bold', marginBottom: Spacing.md },
  modalBtn: { flex: 1, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center', marginHorizontal: Spacing.xs }
});
