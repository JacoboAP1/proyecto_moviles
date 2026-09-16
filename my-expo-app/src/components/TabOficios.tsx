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
import { createPerfil, deletePerfil, getPerfiles, searchPerfiles } from '../api/perfiles';
import type { Perfil } from '../types';

export default function TabOficios() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoOficio, setNuevoOficio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [texto, setTexto] = useState('');
  const [buscando, setBuscando] = useState(false);

  const cargarTodos = async () => {
    try {
      setPerfiles(await getPerfiles());
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const buscar = async () => {
    const q = texto.trim();
    if (!q) {
      cargarTodos();
      return;
    }
    setBuscando(true);
    try {
      setPerfiles(await searchPerfiles(q));
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => { cargarTodos(); }, []);

  const handleCrear = async () => {
    const nombre = nuevoOficio.trim();
    if (!nombre) {
      Alert.alert('Error', 'Escribe el nombre del oficio');
      return;
    }
    if (nombre.length > 100) {
      Alert.alert('Error', 'Maximo 100 caracteres');
      return;
    }
    setSubmitting(true);
    try {
      await createPerfil(nombre);
      setNuevoOficio('');
      await cargarTodos();
      Alert.alert('Listo', `"${nombre}" fue agregado`);
    } catch (error) {
      Alert.alert('Error al crear', (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = (perfil: Perfil) => {
    Alert.alert(
      'Eliminar oficio',
      `¿Seguro que quieres eliminar "${perfil.oficio}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePerfil(perfil.id);
              await cargarTodos();
              Alert.alert('Listo', `"${perfil.oficio}" fue eliminado`);
            } catch (error) {
              Alert.alert('No se pudo eliminar', (error as Error).message);
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
      <View className="gap-2 border-b border-neutral-200 bg-white px-4 py-3">
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
            placeholder="Nuevo oficio (ej: Soldador)"
            placeholderTextColor="#a3a3a3"
            value={nuevoOficio}
            onChangeText={setNuevoOficio}
            maxLength={100}
            editable={!submitting}
          />
          <Pressable
            onPress={handleCrear}
            disabled={submitting}
            className="items-center justify-center rounded-lg bg-oficiar-blue-btn px-4 active:opacity-80 disabled:opacity-50">
            <Text className="font-semibold text-white">
              {submitting ? '...' : 'Agregar'}
            </Text>
          </Pressable>
        </View>
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
            placeholder="Buscar oficio..."
            placeholderTextColor="#a3a3a3"
            value={texto}
            onChangeText={setTexto}
            returnKeyType="search"
            onSubmitEditing={buscar}
          />
          <Pressable
            onPress={buscar}
            disabled={buscando}
            className="items-center justify-center rounded-lg bg-oficiar-blue-btn px-4 active:opacity-80 disabled:opacity-50">
            <Text className="font-semibold text-white">
              {buscando ? '...' : 'Buscar'}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={perfiles}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="px-4 py-3 gap-2"
        ListEmptyComponent={
          <Text className="py-8 text-center text-neutral-400">
            {texto.trim() ? 'No hay oficios que coincidan' : 'No hay oficios registrados'}
          </Text>
        }
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
            <Text className="flex-1 font-semibold text-oficiar-very-dark">{item.oficio}</Text>
            <Pressable
              onPress={() => handleEliminar(item)}
              className="rounded-lg bg-red-50 px-3 py-2 active:opacity-80">
              <Text className="text-sm font-semibold text-red-600">Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
