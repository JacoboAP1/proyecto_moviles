import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
  type Role,
} from '../api/roles';

export default function TabRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [nuevoRol, setNuevoRol] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [saving, setSaving] = useState(false);

  const cargarTodos = async () => {
    try {
      setRoles(await getRoles());
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodos();
  }, []);

  const normalizarNombre = (value: string) => {
    const nombre = value
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_');

    if (!nombre) {
      return '';
    }

    return nombre.startsWith('ROLE_')
      ? nombre
      : `ROLE_${nombre}`;
  };

  const nombreVisual = (name: string) => {
    return name
      .replace(/^ROLE_/, '')
      .replace(/_/g, ' ');
  };

  const handleCrear = async () => {
    const nombre = normalizarNombre(nuevoRol);

    if (!nombre) {
      Alert.alert('Error', 'Escribe el nombre del rol');
      return;
    }

    if (nombre.length > 50) {
      Alert.alert('Error', 'El nombre del rol es demasiado largo');
      return;
    }

    setSubmitting(true);

    try {
      await createRole(nombre);

      setNuevoRol('');
      await cargarTodos();

      Alert.alert(
        'Listo',
        `"${nombreVisual(nombre)}" fue agregado`,
      );
    } catch (error) {
      Alert.alert(
        'Error al crear',
        (error as Error).message,
      );
    } finally {
      setSubmitting(false);
    }
  };

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
      Alert.alert(
        'Error',
        'El nombre del rol no puede estar vacío',
      );
      return;
    }

    if (nombre.length > 50) {
      Alert.alert(
        'Error',
        'El nombre del rol es demasiado largo',
      );
      return;
    }

    setSaving(true);

    try {
      await updateRole(role.id, nombre);

      cancelarEdicion();
      await cargarTodos();

      Alert.alert(
        'Listo',
        'El rol fue actualizado',
      );
    } catch (error) {
      Alert.alert(
        'No se pudo actualizar',
        (error as Error).message,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = (role: Role) => {
    Alert.alert(
      'Eliminar rol',
      `¿Seguro que quieres eliminar "${nombreVisual(role.name)}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRole(role.id);

              await cargarTodos();

              Alert.alert(
                'Listo',
                `"${nombreVisual(role.name)}" fue eliminado`,
              );
            } catch (error) {
              Alert.alert(
                'No se pudo eliminar',
                (error as Error).message,
              );
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#3D80B7" />
      </View>
    );
  }

  return (
    <View className="flex-1">

      {/* Crear rol */}
      <View className="flex-row gap-2 border-b border-neutral-200 bg-white px-4 py-3">
        <TextInput
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
          placeholder="Nuevo rol (ej: Supervisor)"
          placeholderTextColor="#a3a3a3"
          value={nuevoRol}
          onChangeText={setNuevoRol}
          maxLength={50}
          editable={!submitting}
          returnKeyType="done"
          onSubmitEditing={handleCrear}
        />

        <Pressable
          onPress={handleCrear}
          disabled={submitting}
          className="items-center justify-center rounded-lg bg-oficiar-blue-btn px-4 active:opacity-80 disabled:opacity-50"
        >
          <Text className="font-semibold text-white">
            {submitting ? '...' : 'Agregar'}
          </Text>
        </Pressable>
      </View>

      {/* Lista de roles */}
      <FlatList
        data={roles}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="px-4 py-3 gap-2"
        ListEmptyComponent={
          <Text className="py-8 text-center text-neutral-400">
            No hay roles registrados
          </Text>
        }
        renderItem={({ item }) => {
          const editando = editingId === item.id;

          return (
            <View className="rounded-xl bg-white px-4 py-3">

              {editando ? (
                <>
                  <TextInput
                    className="rounded-lg border border-neutral-300 px-3 py-2"
                    placeholder="Nombre del rol"
                    placeholderTextColor="#a3a3a3"
                    value={editingName}
                    onChangeText={setEditingName}
                    maxLength={50}
                    editable={!saving}
                    autoFocus
                  />

                  <View className="mt-3 flex-row gap-2">
                    <Pressable
                      onPress={cancelarEdicion}
                      disabled={saving}
                      className="flex-1 items-center justify-center rounded-lg border border-neutral-300 px-3 py-2 active:opacity-80 disabled:opacity-50"
                    >
                      <Text className="text-sm font-semibold text-neutral-600">
                        Cancelar
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => guardarEdicion(item)}
                      disabled={saving}
                      className="flex-1 items-center justify-center rounded-lg bg-oficiar-blue-btn px-3 py-2 active:opacity-80 disabled:opacity-50"
                    >
                      <Text className="text-sm font-semibold text-white">
                        {saving ? '...' : 'Guardar'}
                      </Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <View className="flex-row items-center justify-between gap-3">

                  <View className="flex-1">
                    <Text className="font-semibold text-oficiar-very-dark">
                      {nombreVisual(item.name)}
                    </Text>

                    <Text className="text-xs text-neutral-400">
                      {item.name}
                    </Text>
                  </View>

                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => comenzarEdicion(item)}
                      className="rounded-lg bg-blue-50 px-3 py-2 active:opacity-80"
                    >
                      <Text className="text-sm font-semibold text-oficiar-blue">
                        Editar
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleEliminar(item)}
                      className="rounded-lg bg-red-50 px-3 py-2 active:opacity-80"
                    >
                      <Text className="text-sm font-semibold text-red-600">
                        Eliminar
                      </Text>
                    </Pressable>
                  </View>

                </View>
              )}

            </View>
          );
        }}
      />
    </View>
  );
}