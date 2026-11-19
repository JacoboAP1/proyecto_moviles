
import { useState } from 'react';
import { updateRole, type Role } from '../api/roles';
import { useAlerta } from '../session/alerta';

export function useUpdateRole(
  cargarTodos: () => Promise<void>,
  normalizarNombre: (value: string) => string,
  nombreVisual: (name: string) => string,
) {
  const { avisar } = useAlerta();
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
      avisar({ tipo: 'error', titulo: 'Falta el nombre', mensaje: 'El nombre del rol no puede estar vacío' });
      return;
    }

    if (nombre.length > 50) {
      avisar({ tipo: 'error', titulo: 'Nombre muy largo', mensaje: 'El nombre del rol es demasiado largo' });
      return;
    }

    setSaving(true);

    try {
      await updateRole(role.id, nombre);
      cancelarEdicion();
      await cargarTodos();
      avisar({ tipo: 'exito', titulo: 'Listo', mensaje: 'El rol fue actualizado' });
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
