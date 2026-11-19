
import { useState } from 'react';
import { updatePerfil } from '../api/perfiles';
import { useAlerta } from '../session/alerta';
import type { Perfil } from '../types';

export function useUpdatePerfil(cargarTodos: () => Promise<void>) {
  const { avisar } = useAlerta();
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
      avisar({ tipo: 'error', titulo: 'Falta el nombre', mensaje: 'El nombre del oficio no puede estar vacío' });
      return;
    }
    if (nombre.length > 100) {
      avisar({ tipo: 'error', titulo: 'Nombre muy largo', mensaje: 'Máximo 100 caracteres' });
      return;
    }
    setSaving(true);
    try {
      await updatePerfil(perfil.id, nombre);
      cancelarEdicion();
      await cargarTodos();
      avisar({ tipo: 'exito', titulo: 'Listo', mensaje: 'El oficio fue actualizado' });
    } catch (error) {
      avisar({ tipo: 'error', titulo: 'No se pudo actualizar', mensaje: (error as Error).message });
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
