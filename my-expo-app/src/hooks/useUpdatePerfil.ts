
import { useState } from 'react';
import { Alert } from 'react-native';
import { updatePerfil } from '../api/perfiles';
import type { Perfil } from '../types';

export function useUpdatePerfil(cargarTodos: () => Promise<void>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [saving, setSaving] = useState(false);

  const comenzarEdicion = (perfil: Perfil) => {
    setEditingId(perfil.id);
    setEditingName(perfil.oficio);
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setEditingName('');
  };

  const guardarEdicion = async (perfil: Perfil) => {
    const nombre = editingName.trim();
    if (!nombre) {
      Alert.alert('Error', 'El nombre del oficio no puede estar vacío');
      return;
    }
    if (nombre.length > 100) {
      Alert.alert('Error', 'Máximo 100 caracteres');
      return;
    }
    setSaving(true);
    try {
      await updatePerfil(perfil.id, nombre);
      cancelarEdicion();
      await cargarTodos();
      Alert.alert('Listo', 'El oficio fue actualizado');
    } catch (error) {
      Alert.alert('No se pudo actualizar', (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return {
    editingId,
    editingName,
    setEditingName,
    saving,
    comenzarEdicion,
    cancelarEdicion,
    guardarEdicion,
  };
}
