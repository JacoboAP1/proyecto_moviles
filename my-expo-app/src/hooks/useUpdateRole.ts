
import { useState } from 'react';
import { Alert } from 'react-native';
import { updateRole, type Role } from '../api/roles';

export function useUpdateRole(
  cargarTodos: () => Promise<void>,
  normalizarNombre: (value: string) => string,
  nombreVisual: (name: string) => string,
) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [saving, setSaving] = useState(false);

  const comenzarEdicion = (role: Role) => {
    setEditingId(role.id);
    setEditingName(nombreVisual(role.name));
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setEditingName('');
  };

  const guardarEdicion = async (role: Role) => {
    const nombre = normalizarNombre(editingName);

    if (!nombre) {
      Alert.alert('Error', 'El nombre del rol no puede estar vacío');
      return;
    }

    if (nombre.length > 50) {
      Alert.alert('Error', 'El nombre del rol es demasiado largo');
      return;
    }

    setSaving(true);

    try {
      await updateRole(role.id, nombre);
      cancelarEdicion();
      await cargarTodos();
      Alert.alert('Listo', 'El rol fue actualizado');
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
